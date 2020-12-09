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
      v-slot="{ result: { error, data, loading } }"
      :query="require('@/graphql/searchGroups.gql')"
      :variables="{
        text: search,
        page,
        perPage,
        userId: joinedGroups ? userId : undefined,
        photoId: ''
      }"
      tag=""
    >
      <template>
        <!-- Loading -->
        <q-empty v-if="loading" :loading="true" />

        <!-- Error -->
        <q-empty v-else-if="error" :description="error" :error="true" icon="photo" />

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
                  :group-tag="group.groupTag !== null ? group.groupTag : undefined"
                  :use-divider="index !== 0"
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
          <v-flex v-if="data.searchGroups.pages" class="mt-3">
            <v-pagination
              v-model="page"
              class="mx-auto"
              :length="data.searchGroups.pages"
              total-visible="11"
            ></v-pagination>
          </v-flex>
          <v-flex v-else class="mt-3">
            <v-btn
              color="accent"
              :disabled="page - 1 < 1"
              class="relative items-center"
              @click="page--"
            >
              <span> &nbsp;{{ $t('btn.previous') }} </span>
            </v-btn>

            <ApolloQuery
              v-slot="{ result: { data: checkNext, loading: prefetchingData } }"
              :query="require('@/graphql/searchGroups.gql')"
              tag=""
              :variables="{
                text: search,
                page: page + 1,
                perPage,
                userId: joinedGroups ? userId : undefined,
                photoId: ''
              }"
            >
              <v-btn
                color="accent"
                :disabled="
                  prefetchingData === true ||
                    checkNext === null ||
                    !checkNext.searchGroups.groups.length
                "
                class="ml-3 relative items-center"
                @click="page++"
              >
                <span> &nbsp;{{ $t('btn.next') }} </span>
              </v-btn>
            </ApolloQuery>
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

  export default {
    components: { GroupTagList, QEmpty, ConfirmDialog },
    data: () => ({
      joinedGroups: true,
      page: 1,
      perPage: 10
    }),
    computed: {
      ...mapState({
        userId: state => state.user.username,
        search: state => state.search
      })
    },
    watch: {
      search() {
        this.page = 1
      },
      joinedGroups() {
        this.page = 1
      }
    }
  }
</script>
