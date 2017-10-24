import AWS from 'aws-sdk'
import cognitoConfig from './cognito'

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
