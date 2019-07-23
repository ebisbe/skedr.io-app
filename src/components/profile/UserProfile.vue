<template>
  <v-card class="mb-4">
    <v-form >
      <v-container>
        <h1 v-t="'UserProfile.title'"/>
        <v-text-field
          v-model="name"
          :label="$t('label.first_name')"
        />

        <v-text-field
          v-model="family_name"
          :label="$t('label.family_name')"
        />

        <v-text-field
          v-model="email"
          :error-messages="email_verified ? '' : $t('UserProfile.error_verify_email')"
          :label="$t('label.email')"
        />
        <v-card-actions class="px-4">
          <v-spacer/>
          <v-btn
            v-t="'UserProfile.verify_email'"
            v-if="user.email_verified === false"
            color="primary"
            @click="closeDialog = false"/>
          <v-btn
            v-t="'btn.update'"
            :disabled="disableUploadBtn"
            :loading="loadingBtn"
            color="primary"
            @click="updateUser"/>
        </v-card-actions>
      </v-container>
      <v-dialog
        v-model="openDialog"
        persistent
        max-width="500">
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title v-t="'UserProfile.verify_email'"/>
          </v-toolbar>
          <v-card-text class="px-4 pb-4 pt-3">
            {{ $t('UserProfile.code_sent') }}
            <v-text-field
              v-model="code"
              :label="$t('UserProfile.confirmation_code')"
              counter="6"
            />

            <v-card-actions class="px-4">
              <v-spacer/>
              <v-btn
                v-t="'btn.change_email'"
                flat
                @click="closeDialog = true"/>
              <v-btn
                v-t="'btn.confirm'"
                :loading="loadingBtn"
                :disabled="!isCodeValid"
                color="primary"
                @click="confirmEmail"/>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-form>
  </v-card>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { isNumber } from 'util'
export default {
  data: () => ({
    code: '',
    closeDialog: false,
    loadingBtn: false,
    disableUploadBtn: true
  }),
  computed: {
    ...mapState({
      user: state => state.user.user.attributes,
      email_verified: state => state.user.user.attributes.email_verified
    }),
    name: {
      set(name) {
        this.disableUploadBtn = false
        this.$store.commit('user/setUserAttributes', { name })
      },
      get() {
        return this.user.name
      }
    },
    family_name: {
      set(family_name) {
        this.disableUploadBtn = false
        this.$store.commit('user/setUserAttributes', { family_name })
      },
      get() {
        return this.user.family_name
      }
    },
    email: {
      set(email) {
        this.disableUploadBtn = false
        this.$store.commit('user/setUserAttributes', { email })
      },
      get() {
        return this.user.email
      }
    },
    openDialog() {
      return !this.email_verified && this.closeDialog === false
    },
    isCodeValid() {
      return this.code.length === 6 && typeof Number.parseInt(this.code, 2) === 'number'
    }
  },
  methods: {
    ...mapActions({
      updateUserAttributes: 'user/updateUserAttributes',
      confirmEmailCode: 'user/confirmEmailCode'
    }),
    updateUser: async function() {
      this.loadingBtn = true
      await this.updateUserAttributes()
      this.disableUploadBtn = true
      this.code = ''
      this.loadingBtn = this.closeDialog = false
    },
    confirmEmail: async function() {
      this.loadingBtn = true
      try {
        await this.confirmEmailCode(this.code)
      } catch (err) {
        this.$store.dispatch('message/add', err.message)
      }
      this.loadingBtn = this.closeDialog = false
    }
  }
}
</script>

