<template>
  <v-content style="background-image: url(/static/img/login.jpg); background-size: cover;">
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex
          xs12
          sm6
          md5
          lg3>
          <v-form method="post" @submit.stop.prevent="handleSubmit">

            <v-card class="elevation-12 pa-5">
              <v-progress-linear
                v-if="protectedUI"
                :indeterminate="true"
                height="3"
                class="my-0 topFloat"/>
              <v-alert
                :value="errorMessage !== ''"
                type="error"
                transition="slide-y-transition"
                class="mt-0 fullWidth topFloat"
                v-html="errorMessage"/>
              <v-card-text class="px-0">
                <h1 class="display-1 mb-4">Log in</h1>

                <v-text-field
                  v-model="form.username"
                  :disabled="protectedUI"
                  :rules="[rules.required, rules.email]"
                  label="Enter your email "
                  required
                  @update:error="username"
                />

                <v-text-field
                  v-model="form.password"
                  :append-icon="passVisibility ? 'visibility' : 'visibility_off'"
                  :append-icon-cb="() => (passVisibility = !passVisibility)"
                  :type="passVisibility ? 'password' : 'text'"
                  :disabled="protectedUI"
                  :rules="[rules.required, rules.lowerCaseLetters, rules.upperCaseLetters, rules.numbers, rules.specialCharacters, rules.length]"
                  required
                  label="Enter your password "
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
            </v-card>
          </v-form>

          <strong>Photo by Ricardo Gomez Angel on Unsplash</strong>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import { AwsCredentials } from '../../libs/aws-lib'
import { validations } from '../../mixins/validation'

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
      errorMessage: ''
    }
  },
  computed: {
    formIsValid() {
      return this.form.validUsername && this.form.validPassword
    }
  },
  methods: {
    handleSubmit() {
      this.protectedUI = true
      this.$store
        .dispatch('authenticateUser', {
          username: this.form.username.toLowerCase(),
          password: this.form.password
        })
        .then(async () => {
          await AwsCredentials(this.$store.state.cognito.user.tokens.IdToken).then(() => {
            this.protectedUI = false
            this.$router.push({ name: 'Photostream' })
          })
        })
        .catch(err => {
          this.errorMessage = err.message
          setTimeout(() => {
            this.errorMessage = ''
          }, 5000)
          this.protectedUI = false
        })
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
