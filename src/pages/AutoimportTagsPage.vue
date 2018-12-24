<template>
  <v-content>
    <v-container v-if="searchGroups.groups.length">
      <v-switch
        v-model="joinedGroups"
        color="primary"
        label="Joined Groups Only"
      />
      <v-card>
        <v-list two-line class="py-0">
          <group-list
            v-for="(group, index) in searchGroups.groups"
            :key="group.groupId"
            :group="group"
            :use-divider="index!==0"
            :tags="group.groupTag !== null ? group.groupTag.tags : []"
            @update="updateGroupTagsList({groupId: group.groupId, tags: $event, group})"
          >
            <v-btn
              v-if="!group.isMember"
              slot="action"
              :disabled="joiningGroup === group.groupId"
              ripple
              color="grey lighten-3"
              icon
              @click="bindGroup(group)">
              <v-tooltip top lazy>
                <v-progress-circular
                  v-if="joiningGroup === group.groupId"
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

              <v-dialog
                v-model="acceptGroupRulesDialog"
                lazy
                width="500"
              >
                <v-card>
                  <v-toolbar dark color="primary">
                    <v-toolbar-title>
                      Accept group rules ?
                    </v-toolbar-title>
                    <v-spacer/>
                  </v-toolbar>
                  <v-card-text style="white-space: pre-line;" v-html="rules"/>
                  <v-divider/>

                  <v-card-actions>
                    <v-spacer/>
                    <v-btn
                      color="primary"
                      flat
                      @click="acceptGroupRulesDialog = false"
                    >
                      do not accept
                    </v-btn>
                    <v-btn
                      color="primary"
                      @click="bindGroup(group, true)"
                    >
                      accept
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-btn>
            <v-btn
              v-else-if="group.isMember && group.groupTag === null"
              slot="action"
              ripple
              icon
              color="grey lighten-3"
              @click.stop="updateGroupTagsList({groupId: group.groupId, tags: [], group})">
              <v-tooltip top lazy>
                <v-icon slot="activator" color="secondary">add</v-icon>
                <span>Add tags</span>
              </v-tooltip>
            </v-btn>
          </group-list>
        </v-list>
      </v-card>
    </v-container>
    <v-container v-else-if="groupTagsList.length">
      <v-card>
        <v-list two-line class="py-0">
          <group-list
            v-for="( {group, tags}, index ) in groupTagsList"
            :key="group.groupId"
            :group="group"
            :use-divider="index!==0"
            :tags="tags"
            @update="updateGroupTagsList({groupId: group.groupId, tags: $event, group})"/>
        </v-list>
      </v-card>
    </v-container>
    <v-container v-else>
      <ol>
        <li>You don't have binded any group with tags. To do so search through your groups or find new groups with the Search bar</li>
        <li>Add tags ( preferably just one tag ) that matches the group essence. ( add examples )</li>
        <li>Once the tag/s has binded to the group all your photos with that tag will be shared to that group automatically. New photos you upload will be added too.</li>
      </ol>
    </v-container>
  </v-content>
</template>

<script>
import GROUP_TAGS_LIST from '@/graphql/groupTagsList.gql'
import UPDATE_GROUP_TAGS_LIST from '@/graphql/mutations/updateGroupTagsList.gql'
import JOIN_GROUP from '@/graphql/mutations/joinGroup.gql'
import SEARCH_GROUPS from '@/graphql/searchGroups.gql'
import GroupList from '@/components/group/GroupList'
import { mapState } from 'vuex'
import { throttleText, loadingGraphql, filters } from '@/mixins'
import _keyBy from 'lodash/keyBy'

export default {
  components: { GroupList },
  mixins: [throttleText, loadingGraphql, filters],
  data: () => ({
    joinedGroups: true,
    groupTagsList: [],
    searchGroups: { groups: [] },
    joiningGroup: '',
    acceptGroupRulesDialog: false,
    rules: ''
  }),
  computed: {
    ...mapState({ search: state => state.search }),
    ...mapState('user', ['userId'])
  },
  watch: {
    search(newValue) {
      if (newValue === '') this.searchGroups = { groups: [] }
    }
  },
  apollo: {
    groupTagsList: {
      query: GROUP_TAGS_LIST,
      fetchPolicy: 'cache-and-network',
      update: ({ groupTagsList }) => groupTagsList
    },
    searchGroups: {
      query: SEARCH_GROUPS,
      fetchPolicy: 'cache-and-network',
      loadingKey: 'loadingGraphql',
      update: ({ searchGroups }) => searchGroups,
      variables() {
        return {
          text: this.search,
          page: 1,
          perPage: 10,
          userId: this.joinedGroups ? this.userId : undefined
        }
      },
      debounce: 500,
      skip() {
        return this.search === ''
      }
    }
  },
  methods: {
    updateGroupTagsList: async function(groupTagList, tagToRemove) {
      const newTags = groupTagList.tags.filter(tag => tag !== tagToRemove)
      try {
        await this.$apollo.mutate({
          mutation: UPDATE_GROUP_TAGS_LIST,
          variables: {
            groupId: groupTagList.groupId,
            tags: newTags
          },
          update: (store, { data: { updateGroupTagsList } }) => {
            //console.log(updateGroupTagsList)
            const data = store.readQuery({ query: GROUP_TAGS_LIST })
            const groupedByGroupId = _keyBy(data.groupTagsList, 'groupId')
            groupedByGroupId[updateGroupTagsList.groupId] = updateGroupTagsList
            store.writeQuery({ query: GROUP_TAGS_LIST, data: { groupTagsList: Object.values(groupedByGroupId) } })

            if (this.search !== '') {
              const query = {
                query: SEARCH_GROUPS,
                variables: {
                  text: this.search,
                  page: 1,
                  perPage: 10,
                  userId: this.joinedGroups ? this.userId : undefined
                }
              }
              const data2 = store.readQuery(query)
              const groupedByGroupId2 = _keyBy(data2.searchGroups.groups, 'groupId')
              groupedByGroupId2[updateGroupTagsList.groupId] = {
                __typename: 'Group',
                ...updateGroupTagsList.group,
                groupTag: {
                  __typename: 'GroupTag',
                  groupId: updateGroupTagsList.groupId,
                  tags: newTags
                }
              }
              data2.searchGroups.groups = Object.values(groupedByGroupId2)
              query.data = data2
              store.writeQuery(query)
            }
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateGroupTagsList: {
              __typename: 'GroupTag',
              groupId: groupTagList.groupId,
              tags: newTags,
              group: groupTagList.group
            }
          }
        })
        return true
      } catch (error) {
        // Error
        console.error('error', error)
        return false
        // We restore the initial user input
        //this.newTag = newTag
      }
    },
    bindGroup(group, acceptedRules = false) {
      if (group.rules !== '' && !acceptedRules) {
        this.acceptGroupRulesDialog = true
        this.rules = group.rules
      } else {
        this.acceptGroupRulesDialog = false
        this.mutationJoinGroup(group, this.searchGroups)
      }
    },
    mutationJoinGroup: async function(group) {
      try {
        this.joiningGroup = group.groupId
        await this.$apollo.mutate({
          mutation: JOIN_GROUP,
          variables: {
            groupId: group.groupId,
            acceptRules: true,
            message: ''
          },
          update: (store, { data: { joinGroup } }) => {
            const query = {
              query: SEARCH_GROUPS,
              variables: {
                text: this.search,
                page: 1,
                perPage: 10,
                userId: this.joinedGroups ? this.userId : undefined
              }
            }
            const data = store.readQuery(query)
            const groupedByGroupId = _keyBy(data.searchGroups.groups, 'groupId')
            groupedByGroupId[joinGroup.groupId] = joinGroup
            data.searchGroups.groups = Object.values(groupedByGroupId)
            query.data = data
            store.writeQuery(query)
          },
          optimisticResponse: {
            __typename: 'Mutation',
            joinGroup: {
              __typename: 'Group',
              ...group
            }
          }
        })
      } catch (error) {
        // Error
        console.error('error', error)
        // We restore the initial user input
        //this.newTag = newTag
      }
      this.joiningGroup = ''
    }
  }
}
</script>
