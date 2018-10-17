<template>
  <div>
    <v-toolbar dark color="primary">
      <v-toolbar-title>Confirm email</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <p v-show="!firstPart">To confirm your email we need your Flickr ID. You can go to <a href="https://www.flickr.com/services/api/explore/flickr.people.getInfo" target="_blank">https://www.flickr.com/services/api/explore/flickr.people.getInfo</a> and copy the value under 'Your user ID:'. <br>If you have any issue send us and email at <a href="mailto:info@skedr.io">info@skedr.io</a></p>
      <v-text-field
        v-model="form.username"
        :disabled="protectedUI || firstPart"
        :rules="[rules.required, rules.flickrId]"
        label="Enter your flickr ID"
        autocomplete="username"
        class="data-hj-whitelist"
        required
        @update:error="hasError('Username', $event)"
      />
      <transition name="fade">
        <div v-show="firstPart">
          <p>We have sent you an email with a validation code. Please paste the code here to confirm your account. If you haven't received in a few minutes check your spam folder.</p>
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
        </div>
      </transition>
    </v-card-text>
    <v-card-actions>
      <v-spacer/>
      <v-btn :to="{name:'Signup'}">cancel</v-btn>
      <v-btn
        :disabled="!formIsValid || protectedUI"
        text-xs-right
        color="primary"
        @click="submit">
        <span v-if="!firstPart">Send</span>
        <span v-else>Confirm</span>
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
      return (!this.firstPart && this.form.validUsername) || (this.firstPart && this.form.validCode)
    },
    username() {
      return encodeURIComponent(this.form.username)
    }
  },
  methods: {
    submit() {
      if (this.firstPart) {
        this.confirmAccount()
      } else {
        this.confirmEmail()
      }
    },
    confirmEmail: async function() {
      let message
      try {
        await Auth.resendSignUp(this.username)
        message = 'Code sent to your email'
        this.firstPart = true
      } catch (err) {
        message = err.message
      }
      this.$store.dispatch('message/add', message)
    },
    confirmAccount: async function() {
      let message
      try {
        await Auth.confirmSignUp(this.username, this.form.code.trim())
        message = 'Account has been confirmed'
        this.$router.push({ name: 'Login' })
      } catch (err) {
        message = err.message
      }
      this.$store.dispatch('message/add', message)
    },
    hasError(param, hasError) {
      this.form[`valid${param}`] = !hasError
    }
  }
}
</script>
