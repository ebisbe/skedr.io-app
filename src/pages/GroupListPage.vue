<template>
  <v-content>
    <v-container
      v-if="userGroups.groups.length"
      fluid
      grid-list-lg>
      <v-layout row wrap>
        <v-flex xs12>
          <v-list
            two-line
            style="background-color: transparent;"
            dense>
            <v-card>
              <v-card-title>
                <v-btn
                  :loading="$apolloData.loading === 1"
                  :disabled="$apolloData.loading === 1"
                  @click="showMore">Load more groups</v-btn>
                <v-spacer/>
                <v-text-field
                  v-model="filterTable"
                  append-icon="search"
                  label="Search"
                  single-line
                  hide-details
                />
              </v-card-title>
              <v-data-table
                :headers="headers"
                :items="userGroups.groups"
                :search="filterTable"
                :loading="loadingTable"
              >
                <v-progress-linear
                  slot="progress"
                  color="blue"
                  height="2"
                  indeterminate/>
                <template slot="items" slot-scope="props">
                  <td>
                    <v-avatar size="30" >
                      <img :src="props.item.icon" :alt="props.item.title">
                    </v-avatar>
                    &nbsp;
                    <span v-html="props.item.title"/>
                  </td>
                  <td class="justify-center">
                    <v-icon
                      v-if="props.item.photoLimitOptOut"
                      color="green"
                      small>check</v-icon>
                    <v-icon
                      v-else
                      small
                      color="red">close</v-icon>
                  </td>
                  <td >{{ props.item.poolCount }}</td>
                  <td >{{ props.item.members }}</td>
                  <td>
                    <span v-html="props.item.throttleText()"/>&nbsp;
                    <strong>{{ props.item.throttleMode }}</strong>
                  </td>
                  <td >{{ props.item.dateAdded }}</td>
                  <td class="">
                    <v-icon
                      small
                      class="mr-2"
                      @click="share(props.item)"
                    >
                      share
                    </v-icon>
                    <v-icon
                      small
                      @click="$router.push({name: 'Group View', params: { groupId: props.item.groupId, title: props.item.title} })"
                    >
                      arrow_forward
                    </v-icon>
                  </td>
                </template>
                <v-alert
                  slot="no-results"
                  :value="true"
                  color="error"
                  icon="warning">
                  Your search for "{{ filterTable }}" found no results.
                </v-alert>
              </v-data-table>
            </v-card>
          </v-list>
        </v-flex>
      </v-layout>
    </v-container>
    <q-empty
      v-else
      :loading="$apolloData.loading === 1"
      :error="error"
      icon="view_day"
      description="You don't have any group yet"/>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title v-html="title"/>
        </v-toolbar>
        <q-push
          v-if="dialog"
          :requests="payload"
          @loaded="closePopUp"
        />
      </v-card>
    </v-dialog>
  </v-content>
</template>

<script>
import QEmpty from '@/components/ui/QEmpty'
import QPush from '@/components/ui/QPush'

import { mapGetters, mapState } from 'vuex'
import GROUPS_QUERY from '@/graphql/groupsLastPhoto.gql'
import Group from '@/classes/Group'
import { groupsPayload } from '@/mixins'

export default {
  components: { QEmpty, QPush },
  mixins: [groupsPayload],
  data() {
    return {
      userGroups: { groups: [] },
      payload: null,
      dialog: false,
      error: false,
      page: 1,
      perPage: 30,
      filterTable: '',
      loadingTable: false,
      headers: [
        {
          text: 'Title',
          value: 'title'
        },
        { text: 'OptOut', value: 'photoLimitText' },
        { text: 'Pool', value: 'poolCount' },
        { text: 'Members', value: 'members' },
        { text: 'Throttle', sortable: false },
        { text: 'Last Share', value: 'dateAddedValue', width: '10%' },
        { text: 'Actions', sortable: false }
      ]
    }
  },

  computed: {
    ...mapGetters({ poolLength: 'pool/length' }),
    ...mapState(['search']),
    title() {
      return `Sharing Pool (${this.poolLength} elements)`
    }
  },
  apollo: {
    userGroups: {
      query: GROUPS_QUERY,
      variables() {
        return {
          page: 1,
          perPage: this.perPage
        }
      },
      update: ({ userGroups }) => {
        userGroups.groups = userGroups.groups.map(group => new Group(group))
        return userGroups
      },
      result() {
        //this.showMore()
      },
      error() {
        this.error = true
      }
    }
  },
  methods: {
    share(group) {
      this.payload = this.constructPayload([group])
      this.dialog = true
    },
    closePopUp() {
      this.dialog = false
    },
    showMore() {
      this.loadingTable = true
      this.$apollo.queries.userGroups.fetchMore({
        variables: {
          page: ++this.page,
          perPage: this.perPage
        },
        updateQuery: ({ userGroups: { groups: prevGroups } }, { fetchMoreResult: { userGroups } }) => {
          this.loadingTable = false
          if (userGroups.page < userGroups.pages) {
            this.showMore()
          }
          userGroups.groups = [...prevGroups, ...userGroups.groups.map(group => new Group(group))]
          return {
            __typename: userGroups.__typename,
            userGroups
          }
        }
      })
    }
  }
}
</script>
<style lang="css">
.hidden {
  display: none !important;
}

.list-item {
  display: inline-block;
  margin-right: 10px;
}

.list-enter-active,
.list-leave-active {
  transition: all 1s;
}

.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
