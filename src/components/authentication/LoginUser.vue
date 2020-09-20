<template>
  <div>
    <v-progress-linear
      v-if="protectedUI"
      :indeterminate="true"
      color="accent"
      height="3"
      class="my-0 topFloat"
    />
    <v-toolbar color="primary" dark>
      <v-toolbar-title v-t="'LoginUser.login'" />
      <v-spacer />
      <v-flex xs3>
        <language-selector />
      </v-flex>
    </v-toolbar>
    <v-card-text class="px-6 pb-6 pt-4">
      <form>
        <v-text-field
          v-model="form.username"
          :disabled="protectedUI"
          :rules="[rules.required, rules.email]"
          :label="$t('label.email')"
          autocomplete="username"
          class="data-hj-whitelist"
          required
          @update:error="username"
        />

        <v-text-field
          v-model="form.password"
          :append-icon="passVisibility ? 'visibility' : 'visibility_off'"
          :type="passVisibility ? 'password' : 'text'"
          :disabled="protectedUI"
          :rules="[
            rules.required,
            rules.lowerCaseLetters,
            rules.upperCaseLetters,
            rules.numbers,
            rules.specialCharacters,
            rules.length
          ]"
          :label="$t('label.password')"
          required
          autocomplete="current-password"
          @click:append="() => (passVisibility = !passVisibility)"
          @update:error="password"
        />
      </form>
    </v-card-text>
    <v-card-actions class="px-6">
      <v-spacer />
      <v-btn
        :disabled="!formIsValid || protectedUI"
        text-right
        color="primary"
        @click="handleSubmit"
      >
        {{ $t('btn.continue') }}
      </v-btn>
    </v-card-actions>

    <i18n
      path="AuthenticationFooter.reset"
      tag="p"
      class="text-center mb-0 grey--text subtitle-1 pb-2"
    >
      <router-link :to="{ name: 'ResetPassword' }" place="reset_password">
        {{ $t('ResetPassword.title') }}
      </router-link>
    </i18n>
    <p class="text-center mb-0 grey--text subtitle-1">
      {{ $t('AuthenticationFooter.not_account') }}
      <router-link :to="{ name: 'Signup' }">
        {{ $t('AuthenticationFooter.sign_up') }}
      </router-link>
    </p>
  </div>
</template>

<script>
  import { validations } from '@/mixins'
  import { mapActions } from 'vuex'
  import LanguageSelector from '@/components/layout/LanguageSelector'

  export default {
    components: { LanguageSelector },
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
    methods: {
      ...mapActions({
        loginUser: 'user/loginUser'
      }),
      handleSubmit: async function() {
        this.protectedUI = true
        try {
          let path = (await this.loginUser(this.form)) ? '/' : '/verify'
          const { redirect = '' } = this.$route.query
          if (redirect !== '') {
            path = redirect
          }
          this.$store.dispatch('message/add', this.$i18n.t('LoginUser.login_successful'))
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
      }
    }
  }
</script>
