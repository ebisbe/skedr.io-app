<template>
  <div>
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
              class="data-hj-whitelist"
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
              :rules="[rules.numeric]"
              label="Code"
              counter="6"
              class="data-hj-whitelist"
            />
            <v-btn
              :disabled="protectedUI || disableAllInputs"
              type="submit"
              color="primary">
              Confirm
            </v-btn>
            <v-btn color="primary" @click.stop.prevent="resendCode">Resend</v-btn>
          </v-form>
        </v-stepper-content>
      </v-stepper>
    </div>
    <p v-show="step === 1" class="text-xs-center mb-0 grey--text subheading pb-2"><router-link :to="{name: 'ConfirmEmail'}">Confirm Email</router-link> | Try our <router-link :to="{name:'Login', params: {demo: true}}">Demo Account</router-link></p>
    <p v-show="step === 1" class="text-xs-center mb-0 grey--text subheading">Already have an account? <router-link :to="{name: 'Login'}">Log in</router-link></p>
  </div>

</template>

<script>
import { API } from 'aws-amplify'
import { validations } from '@/mixins/validation'

import { Auth } from 'aws-amplify'

export default {
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
      this.protectedUI = true
      try {
        await Auth.confirmSignUp(this.user, this.code.trim())
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
      }
    },
    resendCode: async function() {
      let message
      try {
        await Auth.resendSignUp(this.user)
        message = 'Confirmation code has been successfuly sent'
      } catch (err) {
        message = err
      }
      this.$store.dispatch('message/add', message)
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
