<template>
    <v-content>
        <v-container fluid grid-list-xl>
            <v-layout>
                <v-flex xs12 sm6 offset-sm3>
                    <v-progress-linear height="3" class="my-0" v-bind:indeterminate="true"
                                       v-show="waiting"></v-progress-linear>
                    <v-card>
                        <v-card-text>
                            <v-form @submit.stop.prevent="handleSubmit">
                                <h3 class="headline mb-0">Signup with flickr</h3>
                                <v-text-field
                                        label="Name"
                                        v-model="name"
                                        :rules="nameRules"
                                        :counter="10"
                                        required
                                ></v-text-field>
                                <v-text-field
                                        label="Name"
                                        v-model="username"
                                        min="1"
                                        :disabled="disableAllInputs"
                                        required
                                ></v-text-field>

                                <!-- Value at 'username' failed to satisfy constraint: Member must satisfy regular expression pattern: [\p{L}\p{M}\p{S}\p{N}\p{P}]+ -->
                                <v-text-field placeholder="testusername"
                                              v-model="username"
                                              required min="1" :disabled="disableAllInputs"></v-text-field>

                                <v-text-field placeholder="yourmail@example.com" type="email" v-model="email" required
                                              :disabled="disableAllInputs"></v-text-field>
                                <v-text-field placeholder="John Doe" v-model="name"
                                              :disabled="disableAllInputs"></v-text-field>
                                <v-text-field placeholder="+155512345" v-model="phone_number" required
                                              :disabled="disableAllInputs"></v-text-field>
                                <v-text-field placeholder="Password" type="password" v-model="password" required min="6"
                                              pattern="[\S]+" :disabled="disableAllInputs"></v-text-field>
                                <v-text-field placeholder="Password confirmation" type="password"
                                              v-model="passwordConfirmation" required min="6" pattern="[\S]+"
                                              :disabled="disableAllInputs"></v-text-field>
                                <input class="btn btn-lg btn-success btn-block" type="submit" value="Sign Up"
                                       :disabled="protectedUI || !formIsValid || disableAllInputs">

                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </v-content>
</template>

<script>
  export default {
    name: 'SignUp',
    data: () => ({
      errorMessage: null,
      successMessage: null,
      disableAllInputs: false,
      protectedUI: false,
      username: '',
      email: '',
      name: '',
      phone_number: '',
      password: '',
      passwordConfirmation: ''
    }),
    methods: {
      handleSubmit () {
        // Remove alert boxes
        this.successMessage = null
        this.errorMessage = null

        this.protectedUI = true
        this.$store.dispatch('signUp', {
          username: this.username,
          password: this.password,
          attributes: {
            email: this.email,
            name: this.name,
            phone_number: this.phone_number
          }
        }).then(() => {
          this.disableAllInputs = true
          this.successMessage = 'Successfuly signed up'
        }).catch((err) => {
          this.errorMessage = err.message
          this.protectedUI = false
        })
      }
    },
    computed: {
      formIsValid () {
        return /[\S]+/.test(this.username) &&
          this.email.indexOf('@') > 1 &&
          this.name.length > 0 &&
          /[+-\S]+/.test(this.phone_number) &&
          /[a-z]+/.test(this.password) &&
          /[A-Z]+/.test(this.password) &&
          /[0-9]+/.test(this.password) &&
          /[!@#$%^&*()_+={}[\]\\;:.,|]+/.test(this.password) &&
          this.password.length >= 6 &&
          this.password === this.passwordConfirmation
      }
    }
  }
</script>

<style>
    input:invalid {
        border-color: red;
    }

    input[type=text]:valid,
    input[type=email]:valid,
    input[type=password]:valid {
        border-color: green;
    }
</style>
