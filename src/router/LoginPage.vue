<template>
    <div class="container">
        <v-layout>
            <v-flex xs12 sm6 offset-sm3>
                <v-progress-linear height="3" class="my-0" v-bind:indeterminate="true"
                                   v-show="waiting"></v-progress-linear>
                <v-card>
                    <v-card-title primary-title>
                        <v-form @submit.stop.prevent="handleSubmit">
                            <h3 class="headline mb-0">Log in</h3>
                            <v-alert color="success" v-show="successMessage" icon="check_circle" value="true">
                                {{ successMessage }}
                            </v-alert>
                            <v-alert color="error" v-show="errorMessage" icon="warning" value="true">
                                {{ errorMessage }}
                            </v-alert>
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
                                          min="6"
                                          required></v-text-field>
                            <p>Your password must be at least 6 characters long, contain letters and numbers
                                and special symbols, and must not contain spaces.</p>
                            <v-btn type="submit" :disabled="protectedUI || !formIsValid || disableAllInputs">
                                submit
                            </v-btn>
                            <v-btn @click="clear">clear</v-btn>
                        </v-form>
                    </v-card-title>
                </v-card>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
  import { AwsCredentials } from '../store/aws-lib'

  export default {
    name: 'Login',
    data: () => ({
      errorMessage: null,
      successMessage: null,
      disableAllInputs: false,
      protectedUI: false,
      username: '',
      password: '',
      waiting: false
    }),
    methods: {
      handleSubmit () {
        this.successMessage = null
        this.errorMessage = null

        this.protectedUI = this.waiting = true
        this.$store.dispatch('authenticateUser', {
          username: this.username,
          password: this.password
        }).then(async () => {
          this.disableAllInputs = true
          this.password = this.errorMessage = ''
          this.successMessage = 'Successfuly signed in'
          this.waiting = false

          await AwsCredentials(this.$store.state.cognito.user.tokens.IdToken)
            .then(() => this.$router.push({name: 'Group'}))
        }).catch((err) => {
          this.errorMessage = err.message
          this.protectedUI = this.waiting = false
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

<style>
</style>
