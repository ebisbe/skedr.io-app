<template>
  <v-content style="background-image: url(/static/img/login.jpg); background-size: cover;">
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex
          xs12
          sm6
          md5>
          <v-form @submit.stop.prevent="handleSubmit" method="post">

            <v-card class="elevation-12 pa-5">
              <v-progress-linear
                height="3"
                class="my-0 topFloat"
                :indeterminate="true"
                v-if="protectedUI"/>
              <v-alert
                type="error"
                :value="errorMessage !== ''"
                class="mt-0 fullWidth topFloat"
                v-html="errorMessage"
                transition="scale-transition"/>
              <v-card-text class="px-0">
                <h1 class="display-1 mb-4">Log in</h1>

                <v-text-field
                  label="Enter your email "
                  v-model="form.username"
                  validate-on-blur
                  required
                  @update:error="username"
                  :disabled="protectedUI"
                  :rules="[rules.required, rules.email]"
                />

                <v-text-field
                  label="Enter your password "
                  v-model="form.password"
                  :append-icon="passVisibility ? 'visibility' : 'visibility_off'"
                  :append-icon-cb="() => (passVisibility = !passVisibility)"
                  :type="passVisibility ? 'password' : 'text'"
                  required
                  :disabled="protectedUI"
                  @update:error="password"
                  :rules="[rules.required, rules.lowerCaseLetters, rules.upperCaseLetters, rules.numbers, rules.specialCharacters, rules.length]"/>

              </v-card-text>
              <v-card-actions class="px-0">
                <v-spacer/>
                <v-btn
                  text-xs-right
                  type="submit"
                  color="primary"
                  :disabled="!formIsValid || protectedUI">
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
          username: this.form.username,
          password: this.form.password
        })
        .then(async () => {
          this.protectedUI = false

          await AwsCredentials(this.$store.state.cognito.user.tokens.IdToken).then(() =>
            this.$router.push({ name: 'Photostream' })
          )
        })
        .catch(err => {
          console.log(err.message)
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
<style>
.topFloat {
  position: absolute;
  top: 0;
  left: 0;
}
.fullWidth {
  width: 100%;
  width: -moz-available; /* WebKit-based browsers will ignore this. */
  width: -webkit-fill-available; /* Mozilla-based browsers will ignore this. */
  width: fill-available;
}
</style>
