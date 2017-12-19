import AWS from 'aws-sdk'
import cognitoConfig from '../store/cognito'
import aws41 from 'aws41'

export async function authUser (userToken) {
  if (
    AWS.config.credentials &&
    Date.now() < AWS.config.credentials.expireTime - 60000
  ) {
    return true
  }

  await AwsCredentials(userToken)

  return true
}

export function AwsCredentials (userToken) {
  const authenticator = `cognito-idp.${cognitoConfig.Region}.amazonaws.com/${cognitoConfig.UserPoolId}`

  AWS.config.update({region: cognitoConfig.Region})

  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: cognitoConfig.IdentityPoolId,
    Logins: {
      [authenticator]: userToken
    }
  })

  return AWS.config.credentials.getPromise()
}

export function signReq (url, params, data, method) {
  const path = url.replace('@', '%40')
  let request = {
    host: process.env.API_HOST,
    method: method.toUpperCase(),
    url: process.env.API_URL + path,
    path: process.env.API_BASE_URL + path,
    params: params,
    data: data,
    body: JSON.stringify(data)
  }

  if (method === 'post') {
    request.headers = {
      'content-type': 'application/json'
    }
  }

  let signedRequest = aws41.sign(request,
    {
      secretAccessKey: AWS.config.credentials.secretAccessKey,
      accessKeyId: AWS.config.credentials.accessKeyId,
      sessionToken: AWS.config.credentials.sessionToken
    })
  delete signedRequest.headers['Host']
  delete signedRequest.headers['Content-Length']

  return signedRequest
}
