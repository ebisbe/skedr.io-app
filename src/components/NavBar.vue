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

                <b-nav-item v-b-toggle.pool >Pool <span class="badge badge-secondary">{{ poolLength }}</span></b-nav-item>

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
  export default {
    name: 'NavBar',
    data () {
      return {
        text: '',
        photosResult: []
      }
    },
    methods: {
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
      addToPool (photo, selected) {
        this.$store.commit('addToPool', {photo: photo, add: selected})
      }
    },
    computed: {
      poolLength () {
        return this.$store.state.pool.length
      }
    }
  }
</script>
