<template>
    <b-navbar toggleable="md" type="dark" variant="dark" fixed="top">

        <b-nav-toggle target="nav_collapse"></b-nav-toggle>

        <b-navbar-brand to="/">PhotoPool</b-navbar-brand>

        <b-collapse is-nav id="nav_collapse" v-if="isLogged">
            <b-nav is-nav-bar>
                <b-nav-item @click.stop.prevent="logout">Logout</b-nav-item>
            </b-nav>

            <!-- Right aligned nav items -->
            <b-nav is-nav-bar class="ml-auto">
                <b-nav-item to="/groups">Your Groups</b-nav-item>
                <b-nav-item v-b-toggle.pool>Pool <span class="badge badge-secondary">{{ poolLength }}</span>
                </b-nav-item>
            </b-nav>
            <b-nav-form>
                <b-btn v-b-modal.addToPool size="sm" variant="primary">Add photos to pool</b-btn>
            </b-nav-form>
        </b-collapse>
        <b-collapse is-nav id="nav_collapse" v-else>
            <b-nav is-nav-bar class="ml-auto">
                <b-nav-item to="/signup">Signup</b-nav-item>
                <b-nav-item to="/login">Login</b-nav-item>
            </b-nav>

        </b-collapse>

        <b-modal id="addToPool"
                 ref="modal1"
                 size="lg"
                 title="Search photos">
            <form @submit.stop.prevent="handleSubmit">
                <div class="form-group">
                    <b-form-input type="text"
                                  placeholder="Search a photo"
                                  v-model="text"></b-form-input>
                </div>
                <hr>
                <b-card-group columns v-if="photosResult">
                    <photo
                            v-for="photo in photosResult.photo"
                            :photo="photo"
                            size="n"
                            :key="photo.id"
                            selectable
                            @selected="addToPool"
                    ></photo>
                </b-card-group>
            </form>
        </b-modal>
    </b-navbar>
</template>
<script>
  import { postSignedRequest } from '../libs/awsLib'
  import AWS from 'aws-sdk'

  export default {
    name: 'NavBar',
    data () {
      return {
        text: '',
        photosResult: []
      }
    },
    methods: {
      async handleSubmit () {
        this.axios(await postSignedRequest('my-photos', {text: this.text}))
          .then((response) => {
            this.photosResult = response.data
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      logout () {
        this.$store.state.token = ''
        localStorage.setItem('token', '')
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
