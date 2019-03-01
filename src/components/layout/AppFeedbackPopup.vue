<template>
  <v-dialog
    v-model="dialog"
    lazy
    persistent
    max-width="500px">
    <v-card>
      <v-toolbar
        dark
        color="blue-grey">
        <v-btn
          icon
          dark
          @click.native="dialog = false">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>Write your feedback</v-toolbar-title>
        <v-spacer/>
      </v-toolbar>
      <v-container grid-list-xl>
        <v-layout wrap>
          <v-flex
            xs12
            sm6>
            <v-text-field
              v-model="feedback.name"
              :rules="[rules.required]"
              label="Name"
              name="name"
              required />
          </v-flex>
          <v-flex
            xs12
            sm6>
            <v-text-field
              v-model="feedback.email"
              :rules="[rules.required, rules.email]"
              label="Email"
              name="email"
              required/>
          </v-flex>
          <v-flex>
            <v-textarea
              v-model="feedback.text"
              :rules="[rules.required]"
              name="feedback"
              label="Feedback"
              required
            />
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions>
        <v-spacer/>
        <v-btn
          :disabled="protectedUI || disabled"
          color="primary"
          @click.native="send"
        >
          <span v-if="status === 0">send</span>
          <v-progress-circular
            v-else-if="status === 1"
            indeterminate
            color="amber"/>
          <v-icon
            v-else-if="status === 2"
            color="green">check_circle</v-icon>
        </v-btn>
        <v-btn
          flat
          @click.native="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { validations } from '@/mixins'
import { API } from 'aws-amplify'

export default {
  name: 'FeedbackDialog',
  mixins: [validations],
  props: {
    feedbackDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: false,
      disabled: false,
      status: 0,
      feedback: {
        name: '',
        email: '',
        text: ''
      }
    }
  },
  computed: {
    protectedUI() {
      return this.feedback.name === '' || this.feedback.email === '' || this.feedback.text === ''
    }
  },
  watch: {
    dialog(value) {
      if (value === false) {
        this.$emit('close')
        this.feedback = {
          name: '',
          email: '',
          text: ''
        }
        this.status = 0
        this.disabled = false
      }
    },
    feedbackDialog(value) {
      this.dialog = value
    }
  },
  methods: {
    send() {
      this.status = 1
      API.post(process.env.VUE_APP_API_NAME, '/feedback', {
        body: this.feedback
      })
        .then(() => {
          this.status = 2
          this.disabled = true
          this.$store.dispatch('message/add', 'Messsage sent. Thanks for your feedback!')
          this.$emit('close')
        })
        .catch(({ response: { data: { error = 'Some error happened!' } } }) => {
          this.$store.dispatch('message/add', error)
          this.disabled = false
          this.status = 0
        })
    }
  }
}
</script>
