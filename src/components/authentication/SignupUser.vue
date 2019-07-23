<template>
  <div>
    <v-progress-linear 
      v-show="protectedUI" 
      :indeterminate="true" 
      height="3" 
      class="my-0 topFloat" />
    <v-toolbar dark color="primary">
      <v-toolbar-title v-t="'SignupUser.title'"/>
      <v-spacer/>
      <language-selector/>
    </v-toolbar>
    <div :class="{'pa-0': $vuetify.breakpoint.xs, 'px-5 pt-3': $vuetify.breakpoint.smAndUp}">
      <v-stepper 
        v-model="step" 
        class="elevation-0" 
        vertical>
        <v-stepper-step
          :complete="step > 1"
          step="1">{{ $t('SignupUser.step1') }}</v-stepper-step>
        <v-stepper-content step="1">
          <small v-t="'SignupUser.step1_desc'"/>
          <br>
          <v-btn
            :disabled="protectedUI"
            color="primary"
            @click="handleSubmit">{{ this.$i18n.t(button) }}
          </v-btn>
        </v-stepper-content>
        <v-stepper-step
          :complete="step > 2"
          step="2">{{ $t('SignupUser.step2') }}</v-stepper-step>
        <v-stepper-content step="2">
          <v-form method="post" @submit.stop.prevent="signupUser">
            <v-text-field
              ref="email"
              v-model="form.email"
              :disabled="disableAllInputs"
              :rules="[rules.required, rules.email]"
              :label="$t('label.email')"
              autocomplete="username"
              prepend-icon="person"
              min="1"
              required
            />
            <v-text-field
              ref="password"
              v-model="form.password"
              :disabled="disableAllInputs"
              :append-icon="passVisibility ? 'visibility' : 'visibility_off'"
              :type="passVisibility ? 'password' : 'text'"
              :rules="[rules.lowerCaseLetters, rules.upperCaseLetters, rules.numbers, rules.specialCharacters, rules.length]"
              :label="$t('label.password')"
              autocomplete="new-password"
              prepend-icon="lock"
              @click:append="() => (passVisibility = !passVisibility)"
            />
            <v-btn
              v-t="'btn.signup'"
              :disabled="protectedUI || disableAllInputs"
              type="submit"
              color="primary"/>
          </v-form>
        </v-stepper-content>
        <v-stepper-step
          :complete="step > 3"
          step="3">{{ $t('SignupUser.step3') }}
        </v-stepper-step>
        <v-stepper-content step="3">
          <small v-t="'SignupUser.step3_desc'"/>
          <br>
          <v-form @submit.stop.prevent="validateCode">
            <v-text-field
              v-model="code"
              :disabled="disableAllInputs"
              :rules="[rules.numeric]"
              :label="$t('label.code')"
              counter="6"
            />
            <v-btn
              v-t="'btn.resend'"
              flat
              color="primary"
              @click.stop.prevent="resendCode"/>
            <v-btn
              v-t="'btn.confirm'"
              :disabled="protectedUI || disableAllInputs"
              type="submit"
              color="primary"/>
          </v-form>
        </v-stepper-content>
      </v-stepper>
    </div>
    <div v-if="step === 1">
      <i18n
        path="AuthenticationFooter.reset_or_try_demo"
        tag="p"
        class="text-xs-center mb-0 grey--text subheading pb-2">
        <router-link :to="{name: 'ResetPassword'}" place="reset_password">{{ $t('ResetPassword.title') }}</router-link>
        <router-link :to="{name:'Login', params: {demo: true}}" place="demo_account">Demo Account</router-link>
      </i18n>
      <p class="text-xs-center mb-0 grey--text subheading">
        {{ $t('AuthenticationFooter.already_account') }} <router-link :to="{name: 'Login'}">{{ $t('AuthenticationFooter.login') }}</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import API from '@aws-amplify/api'
import Auth from '@aws-amplify/auth'
import { validations } from '@/mixins'
import LanguageSelector from '@/components/layout/LanguageSelector'

export default {
  components: { LanguageSelector },
  mixins: [validations],
  data: function() {
    return {
      step: 1,
      userId: '',
      form: {
        email: '',
        password: ''
      },
      firstName: '',
      lastName: '',
      code: '',
      passVisibility: true,
      protectedUI: false,
      queryString: {},
      button: 'btn.connect',
      disableAllInputs: false,
      dialog: true
    }
  },
  computed: {
    user() {
      return encodeURIComponent(this.userId)
    }
  },
  watch: {
    queryString: async function({ oauth_verifier, oauth_token }) {
      if (oauth_verifier === undefined || oauth_token === undefined) {
        return
      }
      this.protectedUI = true
      this.button = 'btn.validating_account'
      const payload = {
        body: {
          userId: this.userId,
          oauthToken: oauth_token,
          oauthVerifier: oauth_verifier
        }
      }
      try {
        const { userId, firstName = '', lastName = '', email } = await API.post('skedr-api', '/oauth/callback', payload)
        this.userId = userId
        this.firstName = firstName
        this.lastName = lastName
        this.form.email = email
        this.step = 2
      } catch (err) {
        this.$store.dispatch('message/add', err.message)
        this.step = 1
        this.button = 'btn.connect'
      }
      this.protectedUI = false
    }
  },
  created() {
    this.queryString = this.$route.query
    this.userId = this.getItemDef('userId', '')
  },
  methods: {
    getItemDef(key, def) {
      return localStorage.getItem(key) ? localStorage.getItem(key) : def
    },
    handleSubmit: async function() {
      this.protectedUI = true
      try {
        const { userId, redirectUrl } = await API.get('skedr-api', '/oauth')
        this.userId = userId
        localStorage.setItem('userId', userId)
        window.location.href = redirectUrl
      } catch (err) {
        this.protectedUI = false
        this.$store.dispatch('message/add', err.message)
      }
    },
    signupUser: async function() {
      Object.keys(this.form).forEach(f => {
        if (!this.form[f]) this.formHasErrors = true

        this.$refs[f].validate(true)
      })

      if (this.formHasErrors) {
        this.formHasErrors = false
        return
      }
      this.protectedUI = true
      try {
        await Auth.signUp({
          username: this.user,
          password: this.form.password,
          attributes: {
            email: this.form.email.toLowerCase(),
            name: this.firstName,
            family_name: this.lastName
          }
        })

        this.disableAllInputs = false
        this.step = 3
        this.$store.dispatch('message/add', this.$i18n.t('SignupUser.account_created'))
      } catch (err) {
        this.$store.dispatch('message/add', err.message)
      }
      this.protectedUI = false
    },
    validateCode: async function() {
      this.protectedUI = true
      let message
      try {
        await Auth.confirmSignUp(this.user, this.code.trim())
        await Auth.signIn(this.user, this.form.password)
        const payload = {
          body: { userId: this.userId, email: this.form.email.toLowerCase() }
        }
        message = this.$i18n.t('SignupUser.code_validated')
        this.$router.push({ name: 'AutoimportTagsList' })
      } catch (err) {
        this.protectedUI = false
        message = err.message
      }
      this.$store.dispatch('message/add', message)
    },
    resendCode: async function() {
      let message
      try {
        await Auth.resendSignUp(this.user)
        message = this.$i18n.t('SignupUser.code_sent')
      } catch (err) {
        message = err.message
      }
      this.$store.dispatch('message/add', message)
    }
  }
}
</script>
<style lang="css">
.explanation {
  background: rgba(255, 255, 255, 0.534);
}
.explanation .block {
  display: flex;
}

.informatin .icon {
  float: left;
  align-content: flex-start;
}
.explanation .text {
  float: right;
}
</style>
