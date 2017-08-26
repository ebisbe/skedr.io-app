<template>
    <b-navbar toggleable="md" type="dark" variant="dark" fixed="top">

        <b-nav-toggle target="nav_collapse"></b-nav-toggle>

        <b-navbar-brand href="#">PhotoPool</b-navbar-brand>

        <b-collapse is-nav id="nav_collapse">

            <b-nav is-nav-bar>
                <b-nav-item href="#">Link</b-nav-item>
                <b-nav-item href="#" disabled>Disabled</b-nav-item>
            </b-nav>

            <!-- Right aligned nav items -->
            <b-nav is-nav-bar class="ml-auto">

                <b-nav-item-dropdown :text="txtPool" v-if="pool.length" right>
                    <b-dropdown-item
                            disabled
                            v-for="photo in pool"
                            v-html="thumbnail(photo)"
                            :key="photo.id"
                    ></b-dropdown-item>
                    <b-dropdown-divider></b-dropdown-divider>
                    <b-dropdown-item-button
                            size="sm"
                            variant="danger"
                            @click="clearPool">Clear pool
                    </b-dropdown-item-button>
                </b-nav-item-dropdown>
                <b-nav-item-dropdown :text="txtPool" right v-else>
                    <b-dropdown-item>Empty pool</b-dropdown-item>
                </b-nav-item-dropdown>

                <b-nav-item-dropdown right>
                    <!-- Using button-content slot -->
                    <template slot="button-content">
                        <em>User</em>
                    </template>
                    <b-dropdown-item href="#">Profile</b-dropdown-item>
                    <b-dropdown-item href="#">Signout</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-nav>
            <b-nav-form>
                <b-btn v-b-modal.addToPool size="sm" variant="primary">Add photos to pool</b-btn>
            </b-nav-form>
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
                            :key="photo.nsid"
                            selectable
                            @selected="addToPool"
                    ></photo>
                </b-card-group>
                <div v-if="pool.length">
                    <hr>
                    <h2>Selected photos</h2>
                    <b-card-group columns>
                        <photo
                                v-for="photo in pool"
                                :photo="photo"
                                size="n"
                                :key="photo.nsid"
                        ></photo>
                    </b-card-group>
                </div>
            </form>
        </b-modal>
    </b-navbar>
</template>
<script>
  let _ = require('lodash')
  import { urlPhoto } from '../mixins/urlPhoto.js'

  export default {
    name: 'NavBar',
    mixins: [urlPhoto],
    data () {
      return {
        text: '',
        pool: [],
        photosResult: [],
        size: 's'
      }
    },
    created () {
      let photos = localStorage.getObject('pool.photos')
      if (photos !== null) {
        this.pool = photos
      }
    },
    methods: {
      addToPool (photo, add) {
        if (add) {
          this.pool.push(photo)
          this.pool = _.uniq(this.pool)
        } else {
          this.pool = _.filter(this.pool, function (o) { return o.id !== photo.id })
        }
        localStorage.setObject('pool.photos', this.pool)
      },
      clearPool () {
        this.pool = []
        localStorage.setObject('pool.photos', [])
      },
      handleSubmit () {
        this.axios
          .post('my-photos', {text: this.text})
          .then((response) => {
            this.photosResult = response.data
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      thumbnail (photo) {
        return '<img src="' + this.urlPhoto(photo) + '" alt=' + photo.title + '">'
      }
    },
    computed: {
      txtPool () {
        return 'Pool (' + this.pool.length + ')'
      }
    }
  }
</script>
