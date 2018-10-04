<template>
  <div>
    <v-toolbar dark color="primary">
      <v-toolbar-title>Reset password</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-text-field
        v-model="form.username"
        :disabled="protectedUI || firstPart"
        :rules="[rules.required, rules.email]"
        label="Enter your email"
        autocomplete="username"
        class="data-hj-whitelist"
        required
        @update:error="hasError('Username', $event)"
      />
      <transition name="fade">
        <div v-show="firstPart">
          <p>We have sent you an email with a validation code. Please paste the code here to change your password. If you haven't received in a few minutes check your spam folder.</p>
          <v-text-field
            v-model="form.code"
            :disabled="protectedUI"
            :rules="[rules.required, rules.numeric]"
            label="Enter your code"
            autocomplete="code"
            counter="6"
            class="data-hj-whitelist"
            required
            @update:error="hasError('Code', $event)"
          />
          <v-text-field
            v-model="form.password"
            :disabled="protectedUI"
            :rules="[rules.lowerCaseLetters, rules.upperCaseLetters, rules.numbers, rules.specialCharacters, rules.length]"
            :append-icon="passVisibility ? 'visibility' : 'visibility_off'"
            :type="passVisibility ? 'password' : 'text'"
            autocomplete="password"
            label="Enter your new password"
            required
            @click:append="() => (passVisibility = !passVisibility)"
            @update:error="hasError('Password', $event)"
          />
        </div>
      </transition>
    </v-card-text>
    <v-card-actions>
      <v-spacer/>
      <v-btn :to="{name:'Login'}">cancel</v-btn>
      <v-btn
        :disabled="!formIsValid || protectedUI"
        text-xs-right
        color="primary"
        @click="submit">
        Reset
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify'
import { validations } from '@/mixins/validation'

export default {
  mixins: [validations],
  data: () => {
    const defaultForm = Object.freeze({
      username: '',
      validUsername: false,
      password: '',
      validPassword: false,
      code: '',
      validCode: false
    })

    return {
      form: Object.assign({}, defaultForm),
      protectedUI: false,
      firstPart: false,
      passVisibility: true
    }
  },
  computed: {
    formIsValid() {
      return (
        (!this.firstPart && this.form.validUsername) ||
        (this.firstPart && this.form.validPassword && this.form.validCode)
      )
    }
  },
  methods: {
    submit() {
      if (this.firstPart) {
        this.changePassword()
      } else {
        this.resetCode()
      }
    },
    resetCode: async function() {
      let message
      try {
        await Auth.forgotPassword(this.form.username)
        message = 'Code sent to your email'
        this.firstPart = true
      } catch (err) {
        message = err.message
      }
      this.$store.dispatch('message/add', message)
    },
    changePassword: async function() {
      let message
      try {
        await Auth.forgotPasswordSubmit(this.form.username, this.form.code, this.form.password)
        message = 'Password updated successfuly'
        this.$router.push({ name: 'Login' })
      } catch (err) {
        message = err.message
        if (err.code === 'ExpiredCodeException') {
          this.firstPart = false
        }
      }
      this.$store.dispatch('message/add', message)
    },
    hasError(param, hasError) {
      this.form[`valid${param}`] = !hasError
    }
  }
}
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
