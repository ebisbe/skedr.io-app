<template>

    <form class="form-signin" @submit.prevent="handle">
        <h2 class="form-signin-heading">Please sign in</h2>

        <label for="inputEmail" class="sr-only">Email address</label>
        <input type="email" v-model="username"
               id="inputEmail"
               class="form-control"
               placeholder="Email address"
               required autofocus>

        <label for="inputPassword" class="sr-only">Password</label>
        <input type="password" v-model="password"
               id="inputPassword" class="form-control" placeholder="Password" required>

        <div class="checkbox">
            <label>
                <input type="checkbox" value="remember-me"> Remember me
            </label>
        </div>
        <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
    </form>
</template>
<script>
  import {
    CognitoUserPool,
    AuthenticationDetails,
    CognitoUser
  } from 'amazon-cognito-identity-js'
  import config from '../config.js'

  export default {
    name: 'Login',
    data () {
      return {
        username: '',
        password: '',
        error: ''
      }
    },
    destroyed () {
      localStorage.setItem('token', this.$store.state.token)
    },
    methods: {
      login () {
        const userPool = new CognitoUserPool({
          UserPoolId: config.cognito.USER_POOL_ID,
          ClientId: config.cognito.APP_CLIENT_ID
        })
        const authenticationData = {
          Username: this.username,
          Password: this.password
        }

        const user = new CognitoUser({Username: this.username, Pool: userPool})
        const authenticationDetails = new AuthenticationDetails(authenticationData)

        return new Promise((resolve, reject) => (
          user.authenticateUser(authenticationDetails, {
            onSuccess: (result) => resolve(result.getIdToken().getJwtToken()),
            onFailure: (err) => reject(err)
          })
        ))
      },
      async handle () {
        try {
          this.$store.state.token = await this.login()
          this.$router.push({name: 'Group'})
        } catch (e) {
          console.log(e)
        }
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