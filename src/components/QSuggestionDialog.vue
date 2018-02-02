<template>
    <v-dialog v-model="dialog" max-width="500px">
        <v-card>
            <v-toolbar dark color="primary">
                <v-btn icon @click.native="dialog = false" dark>
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Write your feedback</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            <v-container grid-list-xl>
                <v-layout wrap>
                    <v-flex xs12 sm6>
                        <v-text-field
                                label="Name"
                                name="name"
                                v-model="feedback.name"
                                required
                                :rules="[rules.required]">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6>
                        <v-text-field
                                label="Email"
                                name="email"
                                v-model="feedback.email"
                                :rules="[rules.required, rules.email]"
                                required>
                        </v-text-field>
                    </v-flex>
                    <v-flex>
                        <v-text-field
                                name="feedback"
                                label="Feedback"
                                multi-line
                                required
                                v-model="feedback.text"
                                :rules="[rules.required]"
                        ></v-text-field>
                    </v-flex>
                </v-layout>
            </v-container>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary"
                       :disabled="protectedUI || disabled"
                       @click.native="send"
                >
                    <span v-if="status === 0">send</span>
                    <v-progress-circular v-else-if="status === 1" indeterminate color="amber"></v-progress-circular>
                    <v-icon v-else-if="status === 2" color="green">check_circle</v-icon>
                </v-btn>
                <v-btn flat @click.native="dialog = false">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
  import { validations } from '../mixins/validation'
  import { signReq } from '../libs/aws-lib'

  export default {
    name: 'SuggestionDialog',
    mixins: [validations],
    props: {
      suggestionDialog: {
        type: Boolean,
        default: false
      }
    },
    data () {
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
    methods: {
      send () {
        this.status = 1
        this.axios(signReq('suggestion', {}, this.feedback, 'post'))
          .then(() => {
            this.status = 2
            this.disabled = true
          })
      }
    },
    computed: {
      protectedUI () {
        return this.feedback.name === '' || this.feedback.email === '' || this.feedback.text === ''
      }
    },
    watch: {
      dialog (value) {
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
      suggestionDialog (value) {
        this.dialog = value
      }
    }
  }
</script>