<template>
    <div class="container">
        <pool></pool>
        <h1>Group List</h1>
        <div class="my-1 row">
            <div class="col-md-6">
                <b-form-fieldset horizontal label="Filter" :label-cols="3">
                    <b-form-input v-model="filter" placeholder="Type to Search"/>
                </b-form-fieldset>
            </div>
        </div>
        <b-table striped hover show-empty
                 :items="myProvider"
                 :fields="fields"
                 :current-page="currentPage"
                 :per-page="perPage"
                 :filter="filter"
                 :sort-by.sync="sortBy"
                 :sort-desc.sync="sortDesc"
                 no-provider-sorting
                 no-provider-paging
                 no-provider-filtering
                 responsive
                 @filtered="onFiltered"
        >
            <template slot="logo" scope="row">
                <img :src="urlGroup(row.item)" alt="" class="rounded">
            </template>
            <template slot="name" scope="row">
                <router-link :to="'/groups/'+ row.item.nsid">{{ row.value }}</router-link>
            </template>
            <template slot="mode" scope="row">{{ row.item.throttle.mode }}</template>
            <template slot="throttle" scope="row">{{row.value.remaining}} / {{ row.value.count }}</template>
            <template slot="actions" scope="row">
                <b-btn @click.stop="addToPool(row.item,row.index,$event.target)" size="sm">Add Pool</b-btn>
            </template>
        </b-table>
        <div class="col-sm-8">
            <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage"/>
        </div>
    </div>
</template>
<script>
  import { url } from '../mixins/urlPhoto.js'
  import _ from 'lodash'
  import Pool from '../components/Pool.vue'

  export default {
    name: 'Group',
    components: {Pool},
    mixins: [url],
    data () {
      return {
        currentPage: 1,
        perPage: 10,
        sortBy: null,
        totalRows: 0,
        sortDesc: false,
        filter: '',
        fields: {
          logo: {label: 'Logo', sortable: false, class: 'd-md-table-cell d-none'},
          name: {label: 'Name', sortable: true},
          members: {label: 'Members', sortable: true, class: 'text-center d-none d-md-table-cell'},
          pool_count: {label: 'Photos', sortable: true, class: 'text-center d-none d-md-table-cell'},
          throttle: {label: 'Remaining', sortable: false, class: 'text-center'},
          mode: {label: 'Mode', sortable: false, class: 'text-center'},
          actions: {label: 'Actions'}
        }
      }
    },
    watch: {
      // call again the method if the route changes
      '$route': 'fetchData'
    },
    methods: {
      myProvider: function (ctx, callback) {
        this.axios.get('groups')
          .then((response) => {
            this.totalRows = response.data.length
            callback(response.data)
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      addToPool (item, index, button) {
        let axios = this.axios
        _.each(this.$store.state.pool, function (photo) {
          axios.post('pool', {
            groupId: item.nsid,
            photoId: photo.id
          }).then((response) => {
            console.log(response)
          })
        })
      },
      onFiltered (filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length
        this.currentPage = 1
      }
    }
  }
</script>
<style>
    .container {
        margin-top: 2rem;
    }
</style>
