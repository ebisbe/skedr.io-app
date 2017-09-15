import AWS from 'aws-sdk'
import config from '../config.js'
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'

export function login (username, password) {
  const userPool = new CognitoUserPool({
    UserPoolId: config.cognito.USER_POOL_ID,
    ClientId: config.cognito.APP_CLIENT_ID
  })
  const authenticationData = {
    Username: username,
    Password: password
  }

  const user = new CognitoUser({Username: username, Pool: userPool})
  const authenticationDetails = new AuthenticationDetails(authenticationData)

  authUser()
  return new Promise((resolve, reject) => (
    user.authenticateUser(authenticationDetails, {
      onSuccess: (result) => resolve(result.getIdToken().getJwtToken()),
      onFailure: (err) => reject(err)
    })
  ))
}

export async function authUser () {
  if (
    AWS.config.credentials &&
    Date.now() < AWS.config.credentials.expireTime - 60000
  ) {
    return true
  }

  const currentUser = getCurrentUser()

  if (currentUser === null) {
    return false
  }

  const userToken = await getUserToken(currentUser)

  await getAwsCredentials(userToken)

  return true
}

function getUserToken (currentUser) {
  return new Promise((resolve, reject) => {
    currentUser.getSession(function (err, session) {
      if (err) {
        reject(err)
        return
      }
      resolve(session.getIdToken().getJwtToken())
    })
  })
}

function getCurrentUser () {
  const userPool = new CognitoUserPool({
    UserPoolId: config.cognito.USER_POOL_ID,
    ClientId: config.cognito.APP_CLIENT_ID
  })
  return userPool.getCurrentUser()
}

function getAwsCredentials (userToken) {
  const authenticator = `cognito-idp.${config.cognito.REGION}.amazonaws.com/${config.cognito.USER_POOL_ID}`

  AWS.config.update({region: config.cognito.REGION})

  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: config.cognito.IDENTITY_POOL_ID,
    Logins: {
      [authenticator]: userToken
    }
  })

  return AWS.config.credentials.getPromise()
}

