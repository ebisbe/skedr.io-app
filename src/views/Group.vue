<template>
  <v-content>
    <v-container
      v-if="filteredGroups.length"
      fluid
      grid-list-sm>
      <v-layout row wrap>
        <v-flex xs12>
          <v-list two-line>
            <expansion-panel
              v-for="group in filteredGroups"
              :key="group.title"
              :group="group"/>
          </v-list>
        </v-flex>
      </v-layout>
    </v-container>
    <empty
      v-else
      :loading="loading === 1"
      icon="view_day"
      description="You don't have any group yet"/>
  </v-content>
</template>

<script>
import ExpansionPanel from '../components/ExpansionPanel'
import Photo from '../components/Photo'
import Empty from '../components/Empty'
import _sortBy from 'lodash/sortBy'
import { mapGetters, mapState } from 'vuex'
import QPoolBtn from '../components/QPoolBtn'
import GROUPS_QUERY from '../graphql/groupsLastPhoto.gql'

export default {
  name: 'Group',
  components: { ExpansionPanel, Photo, QPoolBtn, Empty },
  data() {
    return {
      loading: false,
      groups: []
    }
  },

  computed: {
    ...mapGetters(['userId']),
    ...mapState(['search']),
    filteredGroups() {
      return this.groups.filter(
        group =>
          group.title.toLowerCase().search(this.search) >= 0 || group.groupId.toLowerCase().search(this.search) >= 0
      )
    }
  },
  watch: {
    groups(groups) {
      localStorage.setObject('groups', groups)
    }
  },
  created() {
    const groups = localStorage.getObject('groups')
    if (groups !== null) {
      this.groups = groups
    }
  },
  methods: {
    isLoading(loading) {
      this.loading = loading
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
          userGroups.map(group => Object.assign({ expanded: false, selected: false, alreadyInGroup: false }, group)),
          ['title']
        ),
      fetchPolicy: 'cache-and-network',
      loadingKey: 'loading',
      pollInterval: 300000
    }
  }
}
</script>
<style>
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
