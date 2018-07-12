<template>
  <v-content>
    <v-container
      v-if="Object.keys(filteredGroups).length"
      fluid
      grid-list-lg>
      Total groups: {{ groups.length }}
      <v-btn
        :loading="$apolloData.loading === 1"
        :disabled="$apolloData.loading === 1"
        @click="showMore">Load more groups</v-btn>

      <v-flex>
        <v-chip
          v-for="(group, legend) in filteredGroups"
          :key="`selector-${legend}`"
          @click="selectedLegend = legend">
          <v-avatar class="accent" v-html="legend"/>
          <span v-html="group.length"/>
        </v-chip>
      </v-flex>

      <v-layout row wrap>
        <v-flex xs12>
          <v-list
            two-line
            style="background-color: transparent;"
            dense>
            <template
              v-for="(groups, legend) in filteredGroups"
              v-if="legend === selectedLegend">
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
import QGroupList from '../components/QGroupList'
import Photo from '../components/Photo'
import Empty from '../components/Empty'
import QPoolBtn from '../components/QPoolBtn'
import QPush from '../components/QPush'

import _sortBy from 'lodash/sortBy'
import _groupBy from 'lodash/groupBy'

import { mapGetters, mapState } from 'vuex'
import GROUPS_QUERY from '../graphql/groupsLastPhoto.gql'
import Group from '@/classes/Group'

const itemsPerPage = 100
export default {
  name: 'Group',
  components: { QGroupList, Photo, QPoolBtn, Empty, QPush },
  data() {
    return {
      groups: [],
      selectedLegend: 'A',
      savedLegend: '',
      payload: null,
      dialog: false,
      error: false,
      offset: itemsPerPage
    }
  },

  computed: {
    ...mapGetters(['userId']),
    ...mapGetters({
      poolLength: 'pool/length'
    }),
    ...mapState(['search']),
    filteredGroups() {
      const groupsFiltered = this.groups.filter(group => group.search(this.search))
      return _groupBy(groupsFiltered, 'legend')
    },
    title() {
      return `Sharing Pool (${this.poolLength} elements)`
    }
  },
  watch: {
    groups() {
      //localStorage.setObject('groups', groups)
    },
    filteredGroups(value) {
      if (!value[this.selectedLegend]) {
        this.selectedLegend = Object.keys(value)[0]
      }
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
    },
    showMore() {
      this.offset += itemsPerPage
      // Fetch more data and transform the original result
      this.$apollo.queries.groups.fetchMore({
        // New variables
        variables: {
          userId: this.userId,
          offset: this.offset,
          count: itemsPerPage
        },
        // Transform the previous result with new data
        updateQuery: (previousResult, data) => {
          if (data.fetchMoreResult.userGroups.length !== 0) {
            this.showMore()
          }
          return {
            __typename: previousResult.userGroups.__typename,
            userGroups: [...previousResult.userGroups, ...data.fetchMoreResult.userGroups]
          }
        }
      })
    }
  },
  apollo: {
    groups: {
      query: GROUPS_QUERY,
      variables() {
        return {
          userId: this.userId,
          offset: itemsPerPage,
          count: itemsPerPage
        }
      },
      update: data =>
        data.hasOwnProperty('userGroups') ? _sortBy(data.userGroups.map(group => new Group(group)), ['legend']) : [],
      error() {
        this.error = true
      }
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
