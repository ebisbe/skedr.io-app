<template>
  <v-content>
    <v-container pb-0>
      <v-switch
        v-model="joinedGroups"
        :label="$t('AutoimportTags.joined_groups')"
        color="primary"
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
        <q-empty v-if="loading && data === undefined" :loading="true" />

        <!-- Error -->
        <q-empty v-else-if="error" :error="true" icon="photo" />

        <!-- Result -->
        <v-container v-else-if="data && data.searchGroups.groups.length">
          <v-card>
            <v-card-text class="pa-0">
              <v-list
                :three-line="$vuetify.breakpoint.name === 'xs'"
                :two-line="$vuetify.breakpoint.name !== 'xs'"
                class="py-0"
              >
                <group-tag-list
                  v-for="(group, index) in data.searchGroups.groups"
                  :key="group.groupId"
                  :group="group"
                  :use-divider="index !== 0"
                  :tags="group.groupTag !== null ? group.groupTag.tags : []"
                >
                  <ApolloMutation
                    v-if="!group.isMember"
                    slot="action"
                    :mutation="require('@/graphql/mutations/joinGroup.gql')"
                    :variables="{
                      groupId: group.id,
                      acceptRules: true
                    }"
                    tag=""
                  >
                    <template slot-scope="{ mutate, loading: isLoading, error: err }">
                      <v-btn
                        v-if="group.rules === ''"
                        :disabled="isLoading"
                        :loading="isLoading"
                        ripple
                        icon
                        @click="mutate()"
                      >
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-icon color="accent" v-on="on">
                              create_new_folder
                            </v-icon>
                          </template>
                          <span v-t="'AutoimportTags.title'" />
                        </v-tooltip>
                      </v-btn>

                      <confirm-dialog
                        v-else
                        :rules="group.rules"
                        :loading="isLoading === 1"
                        @mutate="mutate()"
                      />
                      <p v-if="err">An error occured: {{ err }}</p>
                    </template>
                  </ApolloMutation>
                </group-tag-list>
              </v-list>
            </v-card-text>
          </v-card>
          <v-flex class="px-0">
            <v-btn
              :disabled="!showMoreEnabled || loading"
              block
              color="accent"
              @click="fetchMore(query)"
            >
              <app-observer @intersect="fetchMore(query)" />
              <v-progress-circular v-if="loading" indeterminate color="grey" />
              <span v-else> &nbsp;{{ $t('btn.load_more_groups') }} </span>
            </v-btn>
          </v-flex>
        </v-container>

        <!-- No result -->
        <v-container v-else>
          <q-empty
            v-if="joinedGroups"
            :description="$t('AutoimportTags.belonged_groups_not_found', { search })"
            icon="search"
          />
          <q-empty v-else :description="$t('groups_not_found', { search })" icon="search" />
        </v-container>
      </template>
    </ApolloQuery>
  </v-content>
</template>

<script>
  import GroupTagList from '@/components/groupTag/GroupTagList'
  import ConfirmDialog from '@/components/autoimportTags/ConfirmDialog'
  import QEmpty from '@/components/ui/QEmpty'
  import { mapState, mapGetters } from 'vuex'
  import AppObserver from '@/components/common/AppObserver.vue'

  export default {
    components: { GroupTagList, QEmpty, ConfirmDialog, AppObserver },
    data: () => ({
      joinedGroups: true,
      page: 1,
      perPage: 15,
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
          updateQuery: (
            { searchGroups: { groups: prev } },
            { fetchMoreResult: { searchGroups } }
          ) => {
            this.showMoreEnabled =
              searchGroups.pages !== null && searchGroups.page >= searchGroups.pages
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
