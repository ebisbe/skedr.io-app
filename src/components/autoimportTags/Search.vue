<template>
  <v-content>
    <v-container pb-0>
      <v-switch
        v-model="joinedGroups"
        color="primary"
        label="Show joined groups only"
        hide-details
      />
    </v-container>
    <ApolloQuery
      :query="require('@/graphql/searchGroups.gql')"
      :variables="{
        text: search,
        page: 1,
        perPage,
        userId: joinedGroups ? userId : undefined,
        photoId: ''
      }"
      tag=""
    >
      <template slot-scope="{ result: { error, data, loading }, query }">
        <!-- Loading -->
        <q-empty
          v-if="loading && data === undefined"
          :loading="true"/>

        <!-- Error -->
        <q-empty
          v-else-if="error"
          :error="true"
          icon="photo"/>

        <!-- Result -->
        <v-container v-else-if="data && data.searchGroups.groups.length">
          <v-card >
            <v-card-text class="pa-0">
              <v-list two-line class="py-0">
                <group-list
                  v-for="(group, index) in data.searchGroups.groups"
                  :key="group.groupId"
                  :group="group"
                  :use-divider="index!==0"
                  :tags="group.groupTag !== null ? group.groupTag.tags : []">
                  <ApolloMutation
                    v-if="!group.isMember"
                    slot="action"
                    :mutation="require('@/graphql/mutations/joinGroup.gql')"
                    :variables="{
                      groupId: group.groupId,
                      acceptRules: true
                    }"
                    tag=""
                  >
                    <template slot-scope="{ mutate, loading, error }">
                      <v-btn
                        v-if="group.rules === ''"
                        :disabled="loading"
                        ripple
                        color="grey lighten-3"
                        icon
                        @click="mutate()">
                        <v-tooltip top lazy>
                          <v-progress-circular
                            v-if="loading"
                            slot="activator"
                            :width="2"
                            :size="28"
                            color="accent"
                            indeterminate
                          />
                          <v-icon
                            v-else
                            slot="activator"
                            color="accent">create_new_folder</v-icon>
                          <span>Join Flickr group</span>
                        </v-tooltip>
                      </v-btn>

                      <confirm-dialog
                        v-else
                        :rules="group.rules"
                        :loading="loading"
                        @mutate="mutate()" />
                      <p v-if="error">An error occured: {{ error }}</p>
                    </template>
                  </ApolloMutation>

                </group-list>
              </v-list>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-btn
                :disabled="!showMoreEnabled || loading === 1"
                flat
                block
                @click="fetchMore(query)">
                <v-progress-circular
                  v-if="loading"
                  indeterminate
                  color="grey"/>
                <span v-else>
                  &nbsp;Load more groups
                </span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-container>

        <!-- No result -->
        <v-container v-else>
          <q-empty
            v-if="joinedGroups"
            :description="`You don't belong to any group named <strong>'${search}'</strong>.<br>Try searching groups you are not joined.`"
            icon="search"/>
          <q-empty
            v-else
            :description="`There are no results for <strong>'${search}'</strong>`"
            icon="search"/>
        </v-container>
      </template>
    </ApolloQuery>


  </v-content>
</template>

<script>
import GroupList from '@/components/group/GroupList'
import ConfirmDialog from '@/components/autoimportTags/ConfirmDialog'
import QEmpty from '@/components/ui/QEmpty'
import { mapState, mapGetters } from 'vuex'

export default {
  components: { GroupList, QEmpty, ConfirmDialog },
  data: () => ({
    joinedGroups: true,
    page: 1,
    perPage: 10,
    showMoreEnabled: true
  }),
  computed: {
    ...mapState({
      userId: state => state.user.username,
      search: state => state.search
    })
  },
  methods: {
    fetchMore(query) {
      query.fetchMore({
        variables: {
          page: ++this.page,
          perPage: this.perPage,
          text: this.search,
          userId: this.joinedGroups ? this.userId : undefined
        },
        // Transform the previous result with new data
        updateQuery: ({ searchGroups: { groups: prev } }, { fetchMoreResult: { searchGroups } }) => {
          this.showMoreEnabled = searchGroups.page !== searchGroups.pages
          searchGroups.groups = [...prev, ...searchGroups.groups]
          return {
            __typename: searchGroups.__typename,
            searchGroups
          }
        }
      })
    }
  }
}
</script>
