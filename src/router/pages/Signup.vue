<template>
  <v-content>
    <v-container
      fluid
      grid-list-xl>
      <v-layout>
        <v-flex
          xs12
          sm6
          offset-sm3>
          <v-progress-linear
            height="3"
            class="my-0"
            :indeterminate="true"
            v-show="protectedUI"/>
          <v-stepper
            v-model="step"
            vertical>
            <v-alert
              :color="alert.color"
              class="mt-0"
              v-show="alert.message"
              :icon="alert.icon"
              value="true">
              {{ alert.message }}
            </v-alert>
            <v-stepper-step
              step="1"
              :complete="step > 1">
              Sign up with Flickr

            </v-stepper-step>
            <v-stepper-content step="1">
              <small>First we need to connect to you flickr account. Upon pressing Connect button you will
              be redirected to your flickr account to grant us access.
              </small>
              <br>
              <v-btn
                color="primary"
                @click="handleSubmit"
                :disabled="protectedUI">{{ button }}
              </v-btn>
            </v-stepper-content>
            <v-stepper-step
              step="2"
              :complete="step > 2">Create your account
            </v-stepper-step>
            <v-stepper-content step="2">
              <v-form @submit.stop.prevent="signupUser">
                <v-text-field
                  label="Email"
                  v-model="email"
                  min="1"
                  :disabled="disableAllInputs"
                  :rules="[rules.required, rules.email]"
                  required
                />
                <v-text-field
                  label="Password"
                  v-model="password"
                  :disabled="disableAllInputs"
                  :append-icon="passVisibility ? 'visibility' : 'visibility_off'"
                  :append-icon-cb="() => (passVisibility = !passVisibility)"
                  :type="passVisibility ? 'password' : 'text'"
                  :rules="[rules.lowerCaseLetters, rules.upperCaseLetters, rules.numbers, rules.specialCharacters, rules.length]"
                />
                <v-btn
                  type="submit"
                  color="primary"
                  :disabled="protectedUI || disableAllInputs">
                  Signup
                </v-btn>
              </v-form>
            </v-stepper-content>
            <v-stepper-step
              step="3"
              :complete="step > 3">Validate your email
            </v-stepper-step>
            <v-stepper-content step="3">
              <v-form @submit.stop.prevent="validateCode">
                <v-text-field
                  label="Code"
                  v-model="code"
                  :disabled="disableAllInputs"
                  :rules="[rules.numbers]"
                  counter="6"
                />
                <div
                  class="form-group"
                  v-show="showResendButton">
                  <button
                    class="btn btn-sm btn-info"
                    @click.stop.prevent="resendCode">Resend
                    confirmation code
                  </button>
                </div>
                <v-btn
                  type="submit"
                  color="primary"
                  :disabled="protectedUI || disableAllInputs">
                  Confirm code
                </v-btn>
                <v-btn flat>Cancel</v-btn>
              </v-form>
            </v-stepper-content>
          </v-stepper>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import { signReq, AwsCredentials } from '../../libs/aws-lib'
import { validations } from '../../mixins/validation'

export default {
  name: 'SignUp',
  mixins: [validations],
  data: () => {
    return {
      step: 1,
      userId: '',
      email: '',
      firstName: '',
      lastName: '',
      code: '',
      alert: {
        color: '',
        icon: '',
        message: ''
      },
      passVisibility: true,
      password: '',
      protectedUI: false,
      queryString: {},
      button: 'Connect',
      disableAllInputs: false,
      showResendButton: false
    }
  },
  computed: {
    user() {
      return encodeURIComponent(this.userId)
    }
  },
  watch: {
    queryString(queryString) {
      if (queryString.oauth_verifier === undefined && queryString.oauth_token === undefined) {
        return
      }
      this.protectedUI = true
      this.button = 'Validating account'
      this.axios
        .post('/oauth/callback', {
          userId: this.userId,
          oauthToken: queryString.oauth_token,
          oauthVerifier: queryString.oauth_verifier
        })
        .then(({ data }) => {
          this.protectedUI = false
          this.userId = data.userId
          this.firstName = data.firstName
          this.lastName = data.lastName
          this.email = data.email
          localStorage.setItem('userId', '')
          this.step = 2
        })
        .catch(err => {
          this.error(err.message)
          this.protectedUI = false
          this.step = 1
          this.button = 'Connect'
        })
    }
  },
  created() {
    this.queryString = this.$route.query
    this.userId = localStorage.getItemDef('userId', '')
  },
  methods: {
    handleSubmit() {
      this.protectedUI = true
      this.reset()
      this.axios
        .get('/oauth')
        .then(({ data }) => {
          this.userId = data.userId
          localStorage.setItem('userId', this.userId)
          window.location.href = data.redirectUrl
        })
        .catch(err => {
          this.protectedUI = false
          this.error(err.message)
        })
    },
    signupUser() {
      this.reset()
      this.protectedUI = true
      this.$store
        .dispatch('signUp', {
          username: this.user,
          password: this.password,
          attributes: {
            email: this.email,
            name: this.firstName,
            family_name: this.lastName
          }
        })
        .then(() => {
          this.disableAllInputs = false
          this.protectedUI = false
          this.step = 3
          this.success('Successfuly signed up')
        })
        .catch(err => {
          this.error(err.message)
          this.protectedUI = false
        })
    },
    validateCode() {
      // Remove alert boxes and resend confirmation parts first
      this.reset()
      this.showResendButton = false
      // Protect UI from being used
      this.protectedUI = true
      this.$store
        .dispatch('confirmRegistration', {
          username: this.user,
          code: this.code
        })
        .then(() => {
          this.$store
            .dispatch('authenticateUser', {
              username: this.email,
              password: this.password
            })
            .then(async () => {
              this.disableAllInputs = true
              this.success('Successfuly signed in')
              this.protectedUI = false

              await AwsCredentials(this.$store.state.cognito.user.tokens.IdToken)
                .catch(() => console.log('Not logged. Redirect to Login page'))
                .then(() => {
                  this.axios(
                    signReq(
                      '/oauth/user',
                      {},
                      {
                        userId: this.userId
                      },
                      'post'
                    )
                  ).then(response => this.$router.push({ name: 'Photostream' }))
                })
            })
            .catch(err => {
              this.error(err.message)
              this.protectedUI = false
            })
        })
        .catch(err => {
          this.error(err.message)
          this.protectedUI = false
          // TODO: should it be checked for `CodeMismatchException`?
          if (err.code === 'ExpiredCodeException') {
            this.showResendButton = true
          }
        })
    },
    resendCode() {
      // Remove alert boxes first
      this.reset()
      this.$store
        .dispatch('resendConfirmationCode', {
          username: this.user
        })
        .then(() => {
          this.showResendButton = false
          this.success('Confirmation code has been successfuly sent')
          // Hide success message after 5 seconds
          setTimeout(() => {
            this.reset()
          }, 5000)
        })
        .catch(err => {
          this.error(err.message)
        })
    },
    success(text) {
      this.alert.icon = 'check_circle'
      this.alert.message = text
      this.alert.color = 'success'
    },
    error(text) {
      this.alert.icon = 'warning'
      this.alert.message = text
      this.alert.color = 'error'
    },
    reset() {
      this.alert.message = null
    }
  }
}
</script>
