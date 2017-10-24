<template>
    <div>
        <v-card-title>
            Groups
            <v-spacer></v-spacer>
            <v-text-field
                    append-icon="search"
                    label="Search"
                    single-line
                    hide-details
                    v-model="search"
            ></v-text-field>
        </v-card-title>

        <v-data-table
                v-bind:headers="headers"
                v-bind:items="data"
                v-bind:search="search"
                v-model="selected"
                selected-key="name"
                select-all
                :rows-per-page-items="[12]"
                class="elevation-1"
        >
            <template slot="items" scope="props">
                <td>
                    <v-checkbox
                            primary
                            hide-details
                            v-model="props.selected"
                    ></v-checkbox>
                </td>
                <td>
                    <v-avatar size="36px" slot="activator">
                        <img :src="urlGroup(props.item)">
                    </v-avatar>
                </td>
                <td>{{ props.item.name }}</td>
                <td class="text-xs-right">{{ props.item.members}}</td>
                <td class="text-xs-right">{{ props.item.pool_count}}</td>
                <td class="text-xs-right">{{ props.item.throttle.remaining }} / {{ props.item.throttle.count
                    }}
                </td>
                <td class="text-xs-right">{{ props.item.throttle.mode }}</td>
            </template>
        </v-data-table>
    </div>
</template>
<script>
  import { url } from '../mixins/urlPhoto.js'
  import _ from 'lodash'
  import { getSignedRequest, postSignedRequest } from '../libs/awsLib'

  export default {
    name: 'Group',
    mixins: [url],
    data () {
      return {
        filter: '',
        data: [],
        search: '',
        selected: [],
        headers: [
          {text: 'Image', value: 'name', sortable: false},
          {
            text: 'Name',
            align: 'left',
            value: 'name'
          },
          {text: 'Members', value: 'members'},
          {text: 'Photos', value: 'pool_count'},
          {text: 'Remaining', value: 'throttle.remaining'},
          {text: 'Mode', value: 'throttle.mode'}
        ]
      }
    },
    watch: {
      // call again the method if the route changes
      '$route': 'myProvider',
      filter: function (filter) {
        localStorage.setItem('groupFilter', filter)
      }
    },
    mounted () {
      this.filter = localStorage.getItem('groupFilter')
      this.myProvider()
    },
    methods: {
      async myProvider (ctx, callback) {
        this.axios(await getSignedRequest('groups'))
          .then((response) => {
            this.data = response.data
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      addToPool (item, index, button) {
        let axios = this.axios
        let notify = this.$notify
        let that = this
        _.each(this.$store.state.pool, async function (photo) {
          axios(
            await postSignedRequest('pool', {
              groupId: item.nsid,
              photoId: photo.id,
              secret: photo.secret
            })
          ).then((response) => {
            console.log(response)
            let message = that.processResponse(response)
            notify(message)
          })
        })
      },
      onFiltered (filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },
      processResponse (response) {
        let message = {
          group: 'notifications'
        }
        if (response.data.status) {
          message.title = 'Success!'
          message.text = 'Photo added to the group'
          message.type = 'success'
        } else if (response.data.code <= 4) {
          message.title = 'Error!'
          message.text = response.data.message
          message.type = 'error'
        } else {
          message.title = 'Photo scheduled!'
          message.text = response.data.message
          message.type = 'warning'
        }
        return message
      }
    }
  }
</script>
<style>
    .container {
        margin-top: 2rem;
    }
</style>
