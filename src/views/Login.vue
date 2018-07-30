<template>
  <v-content>
    <v-snackbar
      v-model="errorLogin"
      :timeout="5000"
      top>
      {{ errorMessage }}
      <v-btn
        dark
        color="orange"
        flat
        @click="errorLogin = false"
      >
        Close
      </v-btn>
    </v-snackbar>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex
          xs12
          sm6
          md5
          lg4>
          <v-form method="post" @submit.stop.prevent="handleSubmit">
            <v-card class="elevation-12">
              <v-progress-linear
                v-if="protectedUI"
                :indeterminate="true"
                height="3"
                class="my-0 topFloat"/>
              <v-toolbar dark color="primary">
                <v-toolbar-title>Log in to Skedr.io</v-toolbar-title>
              </v-toolbar>
              <div class="px-5 pb-5 pt-3">
                <v-card-text>
                  <v-text-field
                    v-model="form.username"
                    :disabled="protectedUI"
                    :rules="[rules.required, rules.email]"
                    label="Enter your email "
                    autocomplete="username"
                    required
                    @update:error="username"
                  />

                  <v-text-field
                    v-model="form.password"
                    :append-icon="passVisibility ? 'visibility' : 'visibility_off'"
                    :type="passVisibility ? 'password' : 'text'"
                    :disabled="protectedUI"
                    :rules="[rules.required, rules.lowerCaseLetters, rules.upperCaseLetters, rules.numbers, rules.specialCharacters, rules.length]"
                    required
                    autocomplete="current-password"
                    label="Enter your password "
                    @click:append="() => (passVisibility = !passVisibility)"
                    @update:error="password"/>

                </v-card-text>
                <v-card-actions class="px-0">
                  <v-spacer/>
                  <v-btn
                    :disabled="!formIsValid || protectedUI"
                    text-xs-right
                    type="submit"
                    color="primary">
                    continue
                  </v-btn>
                </v-card-actions>
              </div>
            </v-card>
          </v-form>
          <p class="text-xs-center mb-0 white--text subheading">Don’t have an account yet? <router-link :to="{name: 'Signup'}">Sign up</router-link></p>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import { Auth, Logger, JS } from 'aws-amplify'
import AmplifyStore from '../amplify/AmplifyStore'
import { validations } from '../mixins/validation'
const logger = new Logger('SignInComp')

export default {
  name: 'Login',
  mixins: [validations],
  data: () => {
    const defaultForm = Object.freeze({
      username: '',
      validUsername: false,
      password: '',
      validPassword: false
    })

    return {
      form: Object.assign({}, defaultForm),
      protectedUI: false,
      passVisibility: true,
      errorMessage: '',
      errorLogin: false
    }
  },
  computed: {
    formIsValid() {
      return this.form.validUsername && this.form.validPassword
    }
  },
  methods: {
    handleSubmit: async function() {
      this.protectedUI = true
      try {
        const user = await Auth.signIn(this.form.username.toLowerCase(), this.form.password)
        logger.debug('sign in success', user)
        AmplifyStore.commit('setUser', user)

        const data = await Auth.verifiedContact(user)
        logger.debug('verify result', data)
        AmplifyStore.commit('setUserVerification', data)

        if (!JS.isEmpty(data.verified)) {
          this.$router.push('/')
        } else {
          this.$router.push('/auth/verifyContact')
        }
      } catch (err) {
        this.errorLogin = true
        this.errorMessage = err.message
        this.protectedUI = false
      }
    },
    username(hasError) {
      this.form.validUsername = !hasError
    },
    password(hasError) {
      this.form.validPassword = !hasError
    }
  }
}
</script>
