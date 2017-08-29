<template>
    <div>
        <form class="form-signin" @submit.prevent="handleSubmit" v-if="!insertCode">
            <h2 class="form-signin-heading">Please sign up</h2>

            <label for="inputEmail">Email address</label>
            <input type="email" v-model="username"
                   id="inputEmail"
                   class="form-control"
                   placeholder="Email address"
                   required autofocus>

            <label for="inputPassword">Password</label>
            <input type="password" v-model="password"
                   id="inputPassword" class="form-control" placeholder="Password" required>

            <label for="inputPassword">Confirm Password</label>
            <input type="password" v-model="confPassword"
                   id="inputConfirmPassword" class="form-control" placeholder="Confirm Password" required>

            <div class="checkbox">
                <label>
                    <input type="checkbox" value="remember-me"> Remember me
                </label>
            </div>
            <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
        </form>

        <form class="form-signin" @submit.prevent="handleConfirmationSubmit" v-else>
            <h2 class="form-signin-heading">Please sign up</h2>

            <label for="inputEmail">Confirmation Code</label>
            <input type="text" v-model="confirmationCode"
                   id="confirmationCode"
                   class="form-control"
                   placeholder="Confirmation Code"
                   required autofocus>

            <div class="checkbox">
               Once logged you will be redirected to Flickr page to grant permissions.
            </div>
            <button class="btn btn-lg btn-primary btn-block" type="submit">Confirm Code</button>
        </form>
    </div>
</template>
<script>
  import {
    AuthenticationDetails,
    CognitoUserPool,
    CognitoUserAttribute
  } from 'amazon-cognito-identity-js'
  import config from '../config.js'

  export default {
    name: 'Signup',
    data () {
      return {
        username: '',
        password: '',
        confPassword: '',
        newUser: {},
        confirmationCode: '',
        insertCode: false
      }
    },
    methods: {
      async handleSubmit () {
        try {
          this.newUser = await this.signup(this.username, this.password)
          this.insertCode = true
        } catch (e) {
          alert(e)
        }
      },

      async handleConfirmationSubmit () {
        try {
          await this.confirm(this.newUser, this.confirmationCode)
          const userToken = await this.authenticate(
            this.newUser,
            this.username,
            this.password
          )

          this.$store.state.token = userToken
          localStorage.setItem('token', userToken)
          this.$router.push({name: 'Group'})
        } catch (e) {
          alert(e)
        }
      },

      signup (username, password) {
        const userPool = new CognitoUserPool({
          UserPoolId: config.cognito.USER_POOL_ID,
          ClientId: config.cognito.APP_CLIENT_ID
        })
        const attributeEmail = new CognitoUserAttribute({Name: 'email', Value: username})

        return new Promise((resolve, reject) => (
          userPool.signUp(username, password, [attributeEmail], null, (err, result) => {
            if (err) {
              reject(err)
              return
            }

            resolve(result.user)
          })
        ))
      },

      confirm (user, confirmationCode) {
        return new Promise((resolve, reject) => (
          user.confirmRegistration(confirmationCode, true, function (err, result) {
            if (err) {
              reject(err)
              return
            }
            resolve(result)
          })
        ))
      },

      authenticate (user, username, password) {
        const authenticationData = {
          Username: username,
          Password: password
        }
        const authenticationDetails = new AuthenticationDetails(authenticationData)

        return new Promise((resolve, reject) => (
          user.authenticateUser(authenticationDetails, {
            onSuccess: (result) => resolve(result.getIdToken().getJwtToken()),
            onFailure: (err) => reject(err)
          })
        ))
      }

    }
  }
</script>
<style>
    .form-signin {
        max-width: 330px;
        padding: 15px;
        margin: 0 auto;
    }
</style>