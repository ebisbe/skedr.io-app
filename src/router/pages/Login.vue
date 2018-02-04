<template>
    <v-content>
        <v-container fluid grid-list-xl>
            <v-layout>
                <v-flex xs12 sm6 offset-sm3>

                    <v-card>
                        <v-progress-linear height="3" class="my-0" v-bind:indeterminate="true"
                                           v-show="protectedUI"></v-progress-linear>
                        <v-alert color="success" v-show="successMessage" icon="check_circle" value="true">
                            {{ successMessage }}
                        </v-alert>
                        <v-alert color="error" v-show="errorMessage" icon="warning" value="true">
                            {{ errorMessage }}
                        </v-alert>
                        <v-card-text>
                            <v-form @submit.stop.prevent="handleSubmit">
                                <h3 class="headline mb-0">Log in</h3>

                                <v-text-field
                                        label="Name"
                                        v-model="username"
                                        min="1"
                                        :disabled="disableAllInputs"
                                        required
                                ></v-text-field>

                                <v-text-field label="Password" type="password"
                                              v-model="password"
                                              :disabled="disableAllInputs"
                                              pattern="[\S]+"
                                              :append-icon="passVisibility ? 'visibility' : 'visibility_off'"
                                              :append-icon-cb="() => (passVisibility = !passVisibility)"
                                              :type="passVisibility ? 'password' : 'text'"
                                              min="6"
                                              required></v-text-field>
                                <v-btn type="submit" color="primary" :disabled="protectedUI || !formIsValid || disableAllInputs">
                                    submit
                                </v-btn>
                                <v-btn @click="clear" flat>clear</v-btn>
                            </v-form>
                        </v-card-text>
                    </v-card>
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
    methods: {
      handleSubmit () {
        this.successMessage = null
        this.errorMessage = null

        this.protectedUI = true
        this.$store.dispatch('authenticateUser', {
          username: this.username,
          password: this.password
        }).then(async () => {
          this.disableAllInputs = true
          this.password = this.errorMessage = ''
          this.successMessage = 'Successfuly signed in'
          this.protectedUI = false

          await AwsCredentials(this.$store.state.cognito.user.tokens.IdToken)
            .then(() => this.$router.push({name: 'Photostream'}))
        }).catch((err) => {
          this.errorMessage = err.message
          this.protectedUI = false
        })
      },
      clear () {
        this.successMessage = this.errorMessage = this.username = this.password = ''
      }
    },
    computed: {
      formIsValid () {
        return /[\S]+/.test(this.username)
      }
    }
  }
</script>
