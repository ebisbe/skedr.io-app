<template>
  <v-content>
    <v-container
      v-if="Object.keys(groupedGroups).length"
      fluid
      grid-list-lg>
      <v-btn @click="showAllGroups = !showAllGroups"><span v-if="showAllGroups">Grouped Mode</span><span v-else>Full List</span></v-btn>
      <v-flex v-if="!showAllGroups">
        Total groups: {{ groups.length }}
        <v-btn
          :loading="$apolloData.loading === 1"
          :disabled="$apolloData.loading === 1"
          @click="showMore">Load more groups</v-btn>

        <v-flex>
          <v-chip
            v-for="letter in letters"
            :key="`selector-${letter}`"
            :disabled="groupedGroups[letter] === undefined"
            :color="groupedGroups[letter] ? 'accent' : 'grey'"
            label
            outline
            @click="selLetter = groupedGroups[letter] ? letter : selLetter">
            {{ letter }}
          </v-chip>
        </v-flex>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12>
          <v-list
            two-line
            style="background-color: transparent;"
            dense>
            <v-subheader
              style="background-color: transparent;"
              v-html="selLetter"/>
            <v-card>
              <group-list
                v-for="(group, i) in groupsList"
                :group="group"
                :last-item="groups.length - 1 === i"
                :key="group.title"
                @share="share"/>
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
import GroupList from '@/components/group/GroupList'
import QEmpty from '@/components/ui/QEmpty'
import QPush from '@/components/ui/QPush'

import _sortBy from 'lodash/sortBy'
import _groupBy from 'lodash/groupBy'

import { mapGetters, mapState } from 'vuex'
import GROUPS_QUERY from '@/graphql/groupsLastPhoto.gql'
import Group from '@/classes/Group'

const itemsPerPage = 300
export default {
  components: { GroupList, QEmpty, QPush },
  data() {
    return {
      groups: [],
      letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
      selLetter: 'A',
      savedLegend: '',
      payload: null,
      dialog: false,
      error: false,
      offset: itemsPerPage,
      showAllGroups: true
    }
  },

  computed: {
    ...mapGetters({ userId: 'user/userId', poolLength: 'pool/length' }),
    ...mapState(['search']),
    filteredGroups() {
      return this.groups.filter(group => group.search(this.search))
    },
    groupedGroups() {
      return _groupBy(this.filteredGroups, 'legend')
    },
    listableGroups() {
      return this.groupedGroups[this.selLetter]
    },
    groupsList() {
      return this.showAllGroups ? this.filteredGroups : this.listableGroups
    },
    title() {
      return `Sharing Pool (${this.poolLength} elements)`
    }
  },
  watch: {
    groupedGroups(value) {
      if (!value[this.selLetter]) {
        this.selLetter = Object.keys(value)[0]
      }
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
      this.$store.dispatch('message/add', 'Loading more groups...')
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
      result() {
        //this.showMore()
      },
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
