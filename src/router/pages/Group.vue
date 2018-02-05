<template>
  <v-content>
    <v-progress-linear
      height="3"
      class="my-0"
      :indeterminate="true"
      v-if="loading"/>
    <v-container
      fluid
      grid-list-sm>
      <v-layout
        row
        wrap>
        <v-flex xs12>
          <v-layout
            align-center
            row
            spacer
            ml-3
            mr-5>
            <v-flex
              xs2
              sm1
              md1>&nbsp;</v-flex>
            <v-flex
              d-flex
              xs10
              sm11>
              <v-layout
                row
                wrap>
                <v-flex
                  d-flex
                  xs12
                  sm6
                  lg6><strong>Group name</strong></v-flex>
                <v-flex
                  d-flex
                  sm6
                  lg6>
                  <v-layout row>
                    <span>
                      <v-tooltip bottom>
                        <v-icon slot="activator">alarm</v-icon>
                        <span>Last addition</span>
                      </v-tooltip>
                    </span>
                    <v-spacer/>
                    <span>
                      <v-tooltip bottom>
                        <v-icon slot="activator">photo</v-icon>
                        <span>Pool count</span>
                      </v-tooltip>
                    </span>
                    <v-spacer/>
                    <span>
                      <v-tooltip bottom>
                        <v-icon slot="activator">face</v-icon>
                        <span>Members</span>
                      </v-tooltip>
                    </span>
                    <v-spacer/>
                    <span class="grey--text">
                      <strong>Throttle</strong>
                    </span>
                    <v-spacer/>
                    <span class="grey--text mr-2">
                      <strong>Sked pool</strong>
                    </span>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>

        <v-expansion-panel popout>
          <v-expansion-panel-content
            v-for="group in filteredGroups"
            :key="group.title"
            v-model="group.expanded">
            <expansion-panel
              slot="header"
              :group="group"/>
            <v-card>
              <v-card-text class="grey lighten-3">
                <group-view
                  v-if="group.expanded"
                  :group-id="group.groupId"
                  @isLoading="isLoading"
                />
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import ExpansionPanel from '../../components/ExpansionPanel.vue'
import Photo from '../../components/Photo.vue'
import GroupView from '../../components/GroupView.vue'
import sortBy from 'lodash/sortby'
import { mapGetters, mapState } from 'vuex'
import QPoolBtn from '../../components/QPoolBtn.vue'
import GROUPS_QUERY from '../../graphql/groups.gql'

export default {
  name: 'Group',
  something: '',
  components: { ExpansionPanel, Photo, GroupView, QPoolBtn },
  data() {
    return {
      loading: false,
      groups: [],
      somevar: ''
    }
  },

  computed: {
    ...mapGetters(['activeFab', 'addingPhotosToGroup', 'userId']),
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
      update: data =>
        sortBy(data.userGroups.map(group => Object.assign({ expanded: false, selected: false }, group)), ['title']),
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
