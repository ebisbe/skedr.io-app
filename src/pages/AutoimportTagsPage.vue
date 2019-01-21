<template>
  <v-content>
    <ApolloQuery
      :query="require('@/graphql/groupTagsList.gql')"
      tag=""
    >
      <template slot-scope="{ result: { error, data } , isLoading, query}">
        <!-- Loading -->
        <q-empty
          v-if="isLoading && data === null"
          :loading="true"/>

        <!-- Error -->
        <q-empty
          v-else-if="error"
          :error="true"
          icon="photo"/>

        <!-- Result -->
        <v-container
          v-else-if="data.groupTagsList"
        >
          <v-card>
            <v-list two-line class="py-0">
              <group-list
                v-for="( {group, tags, groupId}, index ) in data.groupTagsList"
                v-show="filteredTags.some(tag => tags.indexOf(tag) > -1) || isEmpty"
                :key="groupId"
                :group="group"
                :use-divider="index!==0"
                :tags="tags"/>
            </v-list>
          </v-card>
        </v-container>

        <!-- No result -->
        <v-container v-else>
          <ol>
            <li>You don't have binded any group with tags. To do so search through your groups or find new groups with the Search bar</li>
            <li>Add tags ( preferably just one tag ) that matches the group essence. ( add examples )</li>
            <li>Once the tag/s has binded to the group all your photos with that tag will be shared to that group automatically. New photos you upload will be added too.</li>
          </ol>
        </v-container>
      </template>
    </ApolloQuery>

  </v-content>
</template>

<script>
import GROUP_TAGS_LIST from '@/graphql/groupTagsList.gql'
import UPDATE_GROUP_TAGS_LIST from '@/graphql/mutations/updateGroupTagsList.gql'
import JOIN_GROUP from '@/graphql/mutations/joinGroup.gql'
import SEARCH_GROUPS from '@/graphql/searchGroups.gql'
import GroupList from '@/components/group/GroupList'
import { mapState, mapGetters } from 'vuex'
import { throttleText, loadingGraphql, filters } from '@/mixins'
import _keyBy from 'lodash/keyBy'

import QEmpty from '@/components/ui/QEmpty'

export default {
  components: { GroupList, QEmpty },
  mixins: [throttleText, loadingGraphql, filters],
  data: () => ({
    joinedGroups: true,
    groupTagsList: [],
    filterTags: '',
    searchGroups: { groups: [] },
    joiningGroup: '',
    acceptGroupRulesDialog: false,
    rules: ''
  }),
  computed: {
    ...mapState({ search: state => state.search }),
    ...mapState('user', ['userId']),
    ...mapState('tagsFilter', {
      tagsFilter: state => state.items
    }),
    ...mapGetters({ isEmpty: 'tagsFilter/isEmpty' }),
    filteredTags() {
      return Object.entries(this.tagsFilter)
        .filter(object => object[1])
        .map(object => object[0])
    }
  },
  watch: {
    search(newValue) {
      if (newValue === '') this.searchGroups = { groups: [] }
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
