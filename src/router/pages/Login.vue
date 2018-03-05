<template>
  <v-content style="background-image: url(/static/img/login.jpg); background-size: cover;">
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex
          xs12
          sm8
          md4>
          <v-card class="elevation-8">
            <v-progress-linear
              height="3"
              class="my-0"
              :indeterminate="true"
              v-show="protectedUI"/>
            <v-toolbar dark color="primary">
              <v-toolbar-title>Login</v-toolbar-title>
            </v-toolbar>
            <v-alert
              color="success"
              v-show="successMessage"
              icon="check_circle"
              class="mt-0"
              value="true">
              {{ successMessage }}
            </v-alert>
            <v-alert
              color="error"
              class="mt-0"
              v-show="errorMessage"
              icon="warning"
              value="true">
              {{ errorMessage }}
            </v-alert>
            <v-card-text>
              <v-form @submit.stop.prevent="handleSubmit" method="post">

                <v-text-field
                  label="Name"
                  v-model="username"
                  prepend-icon="person"
                  min="1"
                  :disabled="disableAllInputs"
                  required
                />

                <v-text-field
                  label="Password"
                  prepend-icon="lock"
                  v-model="password"
                  :disabled="disableAllInputs"
                  pattern="[\S]+"
                  :append-icon="passVisibility ? 'visibility' : 'visibility_off'"
                  :append-icon-cb="() => (passVisibility = !passVisibility)"
                  :type="passVisibility ? 'password' : 'text'"
                  min="6"
                  required/>
                <v-btn
                  type="submit"
                  color="primary"
                  :disabled="protectedUI || !formIsValid || disableAllInputs">
                  submit
                </v-btn>
                <v-btn
                  @click="clear"
                  flat>clear</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
          <strong>Photo by Ricardo Gomez Angel on Unsplash</strong>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import { AwsCredentials } from '../../libs/aws-lib'

export default {
  name: 'Login',
  data: () => ({
    errorMessage: null,
    successMessage: null,
    disableAllInputs: false,
    protectedUI: false,
    username: '',
    password: '',
    passVisibility: true
  }),
  computed: {
    formIsValid() {
      return /[\S]+/.test(this.username)
    }
  },
  methods: {
    handleSubmit() {
      this.successMessage = null
      this.errorMessage = null

      this.protectedUI = true
      this.$store
        .dispatch('authenticateUser', {
          username: this.username,
          password: this.password
        })
        .then(async () => {
          this.disableAllInputs = true
          this.password = this.errorMessage = ''
          this.successMessage = 'Successfuly signed in'
          this.protectedUI = false

          await AwsCredentials(this.$store.state.cognito.user.tokens.IdToken).then(() =>
            this.$router.push({ name: 'Photostream' })
          )
        })
        .catch(err => {
          this.errorMessage = err.message
          this.protectedUI = false
        })
    },
    clear() {
      this.successMessage = this.errorMessage = this.username = this.password = ''
    }
  }
}
</script>
