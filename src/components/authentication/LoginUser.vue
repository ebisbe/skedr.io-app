
<template>
  <div>
    <v-progress-linear
      v-if="protectedUI"
      :indeterminate="true"
      color="accent"
      height="3"
      class="my-0 topFloat"
    />
    <v-toolbar dark color="primary">
      <v-toolbar-title>Log in to Skedr.io</v-toolbar-title>
    </v-toolbar>
    <v-card-text class="px-4 pb-4 pt-3">
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
        @update:error="password"
      />
    </v-card-text>
    <v-card-actions class="px-4">
      <v-spacer />
      <v-btn
        :disabled="!formIsValid || protectedUI"
        text-xs-right
        color="primary"
        @click="handleSubmit"
      >continue</v-btn>
    </v-card-actions>
    <p class="text-xs-center mb-0 grey--text subheading pb-2">
      <router-link :to="{name: 'ResetPassword'}">Reset Password</router-link>| Try our
      <a href="#" @click.prevent="setDemoAccount()">Demo Account</a>
    </p>
    <p class="text-xs-center mb-0 grey--text subheading">
      Don’t have an account yet?
      <router-link :to="{name: 'Signup'}">Sign up</router-link>
    </p>
  </div>
</template>

<script>
import { validations } from '@/mixins'
import { mapActions } from 'vuex'

export default {
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
      passVisibility: true
    }
  },
  computed: {
    formIsValid() {
      return this.form.validUsername && this.form.validPassword
    }
  },
  mounted() {
    const { demo = false } = this.$route.params
    if (demo === true) {
      this.setDemoAccount()
    }
  },
  methods: {
    ...mapActions({
      loginUser: 'user/loginUser'
    }),
    handleSubmit: async function() {
      this.protectedUI = true
      try {
        this.$store.dispatch('message/add', 'You have been logged in')
        let path = (await this.loginUser(this.form)) ? '/' : '/verify'
        if (this.$route.query.redirect !== '') {
          path = this.$route.query.redirect
        }
        console.log(path)
        this.$router.push(path)
      } catch (err) {
        this.$store.dispatch('message/add', err.message)
        this.protectedUI = false
      }
    },
    username(hasError) {
      this.form.validUsername = !hasError
    },
    password(hasError) {
      this.form.validPassword = !hasError
    },
    setDemoAccount() {
      this.form.username = 'info@skedr.io'
      this.form.password = 'Passw0rd!'
    }
  }
}
</script>
