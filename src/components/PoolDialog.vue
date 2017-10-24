<template>
    <v-dialog v-model="dialog" persistent width="50%">
        <v-btn fixed dark fab bottom right class="red" slot="activator">
            <v-icon>add</v-icon>
        </v-btn>
        <v-card>
            <v-card-title>
                <span class="headline">Create a photo pool</span>
            </v-card-title>
            <v-card-text>
                <v-container grid-list-md>
                    <v-layout wrap>
                        <v-flex >
                            <form @submit.stop.prevent="handleSubmit">
                                <v-text-field label="Search photos..." v-model="text" required></v-text-field>
                            </form>
                        </v-flex>
                        <v-flex>
                                <photo v-if="photosResult"
                                        v-for="photo in photosResult.photo"
                                        :photo="photo"
                                        size="n"
                                        :key="photo.id"
                                        selectable
                                        @selected="addToPool"
                                ></photo>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="blue--text darken-1" flat @click.native="dialog = false">Close</v-btn>
                <v-btn class="blue--text darken-1" flat @click.native="dialog = false">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
  import { postSignedRequest } from '../libs/awsLib'
  import AWS from 'aws-sdk'

  export default {
    name: 'PoolDialog',
    data () {
      return {
        text: '',
        dialog: false,
        photosResult: []
      }
    },
    methods: {
      async handleSubmit () {
        this.axios(await postSignedRequest('search', {text: this.text}))
          .then((response) => {
            this.photosResult = response.data
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      logout () {
        this.$store.state.token = null
        localStorage.setItem('token', null)
        this.$router.push({name: 'Login'})
        if (AWS.config.credentials) {
          AWS.config.credentials.clearCachedId()
          AWS.config.credentials = new AWS.CognitoIdentityCredentials({})
        }
      },
      addToPool (photo, selected) {
        this.$store.commit('addToPool', {photo: photo, add: selected})
      }
    },
    computed: {
      poolLength () {
        return this.$store.state.pool.length
      },
      isLogged () {
        return this.$store.state.token !== '' && this.$store.state.token !== null
      }
    }
  }
</script>
