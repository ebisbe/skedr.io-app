/* eslint-disable vue/html-indent */
<template>
  <div>
    <v-toolbar color="primary" dark>
      <v-toolbar-title>Confirm account</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <p v-show="!firstPart">
        {{ $t('ConfirmAccount.step1') }}
      </p>
      <v-text-field
        v-model="form.username"
        :disabled="protectedUI || firstPart"
        :rules="[rules.required, rules.flickrId]"
        :label="$t('ConfirmAccount.label1')"
        autocomplete="username"
        required
        @update:error="hasError('Username', $event)"
      />
      <transition name="fade">
        <div v-show="firstPart">
          <p v-t="'ConfirmAccount.step2'" />
          <v-text-field
            v-model="form.code"
            :disabled="protectedUI"
            :rules="[rules.required, rules.numeric]"
            :label="$t('ConfirmAccount.label2')"
            autocomplete="code"
            counter="6"
            required
            @update:error="hasError('Code', $event)"
          />
        </div>
      </transition>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn v-t="'btn.cancel'" :to="{ name: 'Signup' }" text />
      <v-btn :disabled="!formIsValid || protectedUI" text-right color="primary" @click="submit">
        <span v-if="!firstPart" v-t="'btn.send'" />
        <span v-else v-t="'btn.confirm'" />
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
  import Auth from '@aws-amplify/auth'
  import { validations } from '@/mixins'

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
        return (
          (!this.firstPart && this.form.validUsername) || (this.firstPart && this.form.validCode)
        )
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
