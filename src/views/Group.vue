<template>
  <v-content>
    <v-container
      v-if="Object.keys(filteredGroups).length"
      fluid
      grid-list-lg>
      <v-layout row wrap>
        <v-flex xs12>
          <v-list
            two-line
            style="background-color: transparent;"
            dense>
            <template
              v-for="(groups, legend) in filteredGroups">
              <v-subheader
                :key="legend"
                style="background-color: transparent;"
                v-html="legend"/>
              <v-card :key="`${legend}-card`">
                <q-group-list
                  v-for="(group, i) in groups"
                  :group="group"
                  :last-item="groups.length - 1 === i"
                  :key="group.title"
                  @share="share"/>
              </v-card>
            </template>
          </v-list>
        </v-flex>
      </v-layout>
    </v-container>
    <empty
      v-else
      :loading="$apolloData.loading === 1"
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
import QGroupList from '../components/QGroupList'
import Photo from '../components/Photo'
import Empty from '../components/Empty'
import QPoolBtn from '../components/QPoolBtn'
import QPush from '../components/QPush'

import _sortBy from 'lodash/sortBy'
import _groupBy from 'lodash/groupBy'
import _upperCase from 'lodash/upperCase'

import { mapGetters, mapState } from 'vuex'
import GROUPS_QUERY from '../graphql/groupsLastPhoto.gql'

export default {
  name: 'Group',
  components: { QGroupList, Photo, QPoolBtn, Empty, QPush },
  data() {
    return {
      groups: [],
      payload: null,
      dialog: false,
      error: ''
    }
  },

  computed: {
    ...mapGetters(['userId']),
    ...mapGetters({
      poolLength: 'pool/length'
    }),
    ...mapState(['search']),
    filteredGroups() {
      const groupsFiltered = this.groups.filter(
        group =>
          group.title.toLowerCase().search(this.search) >= 0 || group.groupId.toLowerCase().search(this.search) >= 0
      )
      return _groupBy(groupsFiltered, 'legend')
    },
    title() {
      return `Sharing Pool (${this.poolLength} elements)`
    },
    description() {
      if (this.error === '') {
        return "You don't have any photo yet"
      }
      return this.error
    }
  },
  watch: {
    groups() {
      //localStorage.setObject('groups', groups)
    }
  },
  created() {
    const groups = localStorage.getObject('groups')
    if (groups !== null) {
      this.groups = groups
    }
  },
  methods: {
    share({ payload }) {
      this.payload = payload
      this.dialog = true
    },
    closePopUp() {
      this.dialog = false
    }
  },
  apollo: {
    groups: {
      query: GROUPS_QUERY,
      variables() {
        return {
          userId: this.userId
        }
      },
      update: ({ userGroups }) =>
        _sortBy(
          userGroups.map(group =>
            Object.assign(
              {
                selected: false,
                alreadyInGroup: false,
                legend: _upperCase(group.title).substring(0, 1)
              },
              group
            )
          ),
          ['legend']
        ),
      error() {
        this.error = 'Ups! Some error happened fetching your data...'
      },
      fetchPolicy: 'network',
      pollInterval: 300000
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
