<template>
  <v-content >
    <v-container
      :class="{'pa-0': $vuetify.breakpoint.xs}"
      fluid
      grid-list-md>
      <v-layout
        justify-center>
        <v-dialog
          v-model="dialog"
          :fullscreen="$vuetify.breakpoint.xs"
          persistent
          max-width="500"
          hide-overlay>
          <v-card class="elevation-12">
            <v-progress-linear
              v-show="protectedUI"
              :indeterminate="true"
              height="3"
              class="my-0 topFloat"/>
            <v-toolbar dark color="primary">
              <v-toolbar-title>Create a Skedr.io account</v-toolbar-title>
            </v-toolbar>
            <div :class="{'pa-0': $vuetify.breakpoint.xs, 'px-5 pt-3': $vuetify.breakpoint.smAndUp}">
              <v-stepper
                v-model="step"
                class="elevation-0"
                vertical>
                <v-stepper-step
                  :complete="step > 1"
                  step="1">
                  Sign up with Flickr
                </v-stepper-step>
                <v-stepper-content step="1">
                  <small>First we need to connect to you flickr account. Upon pressing Connect button you will
                  be redirected to your flickr account to grant us access.
                  </small>
                  <br>
                  <v-btn
                    :disabled="protectedUI"
                    color="primary"
                    @click="handleSubmit">{{ button }}
                  </v-btn>
                </v-stepper-content>
                <v-stepper-step
                  :complete="step > 2"
                  step="2">Create your account
                </v-stepper-step>
                <v-stepper-content step="2">
                  <v-form method="post" @submit.stop.prevent="signupUser">
                    <v-text-field
                      ref="email"
                      v-model="form.email"
                      :disabled="disableAllInputs"
                      :rules="[rules.required, rules.email]"
                      label="Email"
                      autocomplete="username"
                      prepend-icon="person"
                      min="1"
                      required
                    />
                    <v-text-field
                      ref="password"
                      v-model="form.password"
                      :disabled="disableAllInputs"
                      :append-icon="passVisibility ? 'visibility' : 'visibility_off'"
                      :type="passVisibility ? 'password' : 'text'"
                      :rules="[rules.lowerCaseLetters, rules.upperCaseLetters, rules.numbers, rules.specialCharacters, rules.length]"
                      label="Password"
                      autocomplete="new-password"
                      prepend-icon="lock"
                      @click:append="() => (passVisibility = !passVisibility)"
                    />
                    <v-btn
                      :disabled="protectedUI || disableAllInputs"
                      type="submit"
                      color="primary">
                      Signup
                    </v-btn>
                  </v-form>
                </v-stepper-content>
                <v-stepper-step
                  :complete="step > 3"
                  step="3">Validate your email
                </v-stepper-step>
                <v-stepper-content step="3">
                  <small>We have sent you an email with a validation code. Please paste the code here to validate your email. If you haven't received in a few minutes check your spam folder.</small>
                  <br>
                  <v-form @submit.stop.prevent="validateCode">
                    <v-text-field
                      v-model="code"
                      :disabled="disableAllInputs"
                      :rules="[rules.numbers]"
                      label="Code"
                      counter="6"
                    />
                    <div
                      v-show="showResendButton"
                      class="form-group">
                      <button
                        class="btn btn-sm btn-info"
                        @click.stop.prevent="resendCode">Resend
                        confirmation code
                      </button>
                    </div>
                    <v-btn
                      :disabled="protectedUI || disableAllInputs"
                      type="submit"
                      color="primary">
                      Confirm code
                    </v-btn>
                    <v-btn flat>Cancel</v-btn>
                  </v-form>
                </v-stepper-content>
              </v-stepper>
            </div>
            <p class="text-xs-center mb-0 grey--text subheading pb-2">Already have an account? <router-link :to="{name: 'Login'}">Log in</router-link></p>
          </v-card>
        </v-dialog>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import { API } from 'aws-amplify'
import { validations } from '../mixins/validation'

import { Auth } from 'aws-amplify'

export default {
  name: 'SignUp',
  mixins: [validations],
  data: () => {
    return {
      step: 1,
      userId: '',
      form: {
        email: '',
        password: ''
      },
      firstName: '',
      lastName: '',
      code: '',
      passVisibility: true,
      protectedUI: false,
      queryString: {},
      button: 'Connect',
      disableAllInputs: false,
      showResendButton: false,
      dialog: true
    }
  },
  computed: {
    user() {
      return encodeURIComponent(this.userId)
    }
  },
  watch: {
    queryString: async function({ oauth_verifier, oauth_token }) {
      if (oauth_verifier === undefined || oauth_token === undefined) {
        return
      }
      this.protectedUI = true
      this.button = 'Validating account'
      const myInit = {
        body: {
          userId: this.userId,
          oauthToken: oauth_token,
          oauthVerifier: oauth_verifier
        }
      }
      try {
        const { userId, firstName, lastName, email } = await API.post(
          process.env.VUE_APP_API_NAME,
          '/oauth/callback',
          myInit
        )
        this.userId = userId
        this.firstName = firstName
        this.lastName = lastName
        this.form.email = email
        this.step = 2
      } catch (err) {
        this.$store.dispatch('message/add', err.message)
        this.step = 1
        this.button = 'Connect'
      }
      this.protectedUI = false
    }
  },
  created() {
    this.queryString = this.$route.query
    this.userId = localStorage.getItemDef('userId', '')
  },
  methods: {
    handleSubmit: async function() {
      this.protectedUI = true
      try {
        const { userId, redirectUrl } = await API.get(process.env.VUE_APP_API_NAME, '/oauth')
        this.userId = userId
        localStorage.setItem('userId', userId)
        window.location.href = redirectUrl
      } catch (err) {
        this.protectedUI = false
        this.$store.dispatch('message/add', err.message)
      }
    },
    signupUser: async function() {
      Object.keys(this.form).forEach(f => {
        if (!this.form[f]) this.formHasErrors = true

        this.$refs[f].validate(true)
      })

      if (this.formHasErrors) {
        this.formHasErrors = false
        return
      }
      this.protectedUI = true
      try {
        await Auth.signUp({
          username: this.user,
          password: this.form.password,
          attributes: {
            email: this.form.email.toLowerCase(),
            name: this.firstName,
            family_name: this.lastName
          }
        })

        this.disableAllInputs = false
        this.step = 3
        this.$store.dispatch('message/add', 'Account created successfully')
      } catch (err) {
        this.$store.dispatch('message/add', err.message)
      }
      this.protectedUI = false
    },
    validateCode: async function() {
      this.showResendButton = false
      this.protectedUI = true
      try {
        await Auth.confirmSignUp(this.user, this.code)
        await Auth.signIn(this.user, this.form.password)
        const payload = {
          body: { userId: this.userId, email: this.form.email.toLowerCase() }
        }
        await API.post(process.env.VUE_APP_API_NAME, '/oauth/user', payload)
        this.$store.dispatch('message/add', 'Code validated')
        this.$router.push({ name: 'Photostream' })
      } catch (err) {
        this.$store.dispatch('message/add', err.message)
        this.protectedUI = false
        // TODO: should it be checked for `CodeMismatchException`?
        if (err.code === 'ExpiredCodeException') {
          this.showResendButton = true
        }
      }
    },
    resendCode: async function() {
      try {
        await Auth.resendSignUp(this.username)
        this.showResendButton = false
        this.$store.dispatch('message/add', 'Confirmation code has been successfuly sent')
      } catch (err) {
        this.$store.dispatch('message/add', err.message)
      }
    }
  }
}
</script>
<style lang="css">
.explanation {
  background: rgba(255, 255, 255, 0.534);
}
.explanation .block {
  display: flex;
}

.informatin .icon {
  float: left;
  align-content: flex-start;
}
.explanation .text {
  float: right;
}
</style>
