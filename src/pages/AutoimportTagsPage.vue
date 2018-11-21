<template>
  <v-content>
    <v-container v-if="searchGroups.length">
      <v-switch
        v-model="joinedGroups"
        color="primary"
        label="Joined Groups Only"
      />
      <v-expansion-panel >
        <v-expansion-panel-content v-for="group in searchGroups" :key="'search'+group.groupId">
          <v-layout
            slot="header"
            align-center
            row
            spacer
          >
            <v-avatar
              slot="activator"
              size="40"
            >
              <a
                :href="`https://www.flickr.com/groups/${group.groupId}`"
                target="_blank"
                style="height:40px;">
                <img :src="group.icon" :alt="group.title">
              </a>
            </v-avatar>
            &nbsp;
            &nbsp;
            <v-flex
              no-wrap
              ellipsis
              xs4
              sm4>
              <v-tooltip v-if="group.photoLimitOptOut" top>
                <v-icon slot="activator" color="green">check</v-icon>
                <span>This group doesn't care how many other groups a photo is in</span>
              </v-tooltip>
              <v-tooltip v-else top>
                <v-icon slot="activator" color="red">clear</v-icon>
                <span>This group will count toward the photo's limit <br>(60 for Pro members, 30 for free members)</span>
              </v-tooltip>
              &nbsp;
              <strong v-html="group.title"/>
            </v-flex>
            <v-flex xs2><v-icon>photo</v-icon>{{ group.poolCount | parseNumber }}</v-flex>
            <v-flex xs2><v-icon>group</v-icon> {{ group.members | parseNumber }}</v-flex>
            <v-flex xs2 v-html="throttleText(group)"/>
            <v-flex >
              <v-btn
                v-if="group.groupTag !== null"
                color="primary"
                small>
                <v-icon small>add</v-icon>Add ({{ group.groupTag.tags.length }})
              </v-btn>
              <v-btn
                v-else-if="group.isMember"
                color="primary"
                small
                @click.stop="updateGroupTagsList({groupId: group.groupId, tags: [], group})">
                <v-icon small>extension</v-icon>Configure
              </v-btn>
              <v-btn
                v-else
                :href="`https://www.flickr.com/groups/${group.groupId}`"
                color="accent"
                small
                target="_blank"><v-icon small>add</v-icon>Join</v-btn>
            </v-flex>

          </v-layout>
          <v-card>
            <v-card-text>
              photos from the group
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-container>
    <v-container v-else-if="groupTagsList.length" grid-list-md>
      <v-switch
        v-model="showTags"
        color="primary"
        label="Show tags"
      />

      <v-card>
        <v-list two-line>
          <template v-for="({group, tags}, index) in groupTagsList">
            <!-- <v-subheader
            v-if="item.header"
            :key="item.header"
          >
            {{ item.header }}
          </v-subheader> -->

            <v-divider
              v-if="index > 0"
              :key="index"
              inset
            />

            <v-list-tile
              :key="group.groupId"
              avatar
            >
              <v-list-tile-avatar>
                <a
                  :href="`https://www.flickr.com/groups/${group.groupId}`"
                  target="_blank">
                  <img :src="group.icon" :alt="group.title">
                </a>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title >
                  <strong v-html="group.title"/>
                </v-list-tile-title>
                <v-list-tile-sub-title>
                  <v-layout>
                    <v-flex class="text-xs-left" xs2><v-icon>photo</v-icon>{{ group.poolCount | parseNumber }}</v-flex>
                    <v-flex class="text-xs-left" xs2><v-icon>group</v-icon> {{ group.members | parseNumber }}</v-flex>
                    <v-flex
                      class="text-xs-left pt-2"
                      xs2
                      v-html="throttleText(group)"/>
                    <v-flex class="text-xs-right">
                      <v-chip
                        v-for="tag in tags"
                        :key="tag"
                        small
                        label>{{ tag }}</v-chip>
                    </v-flex>
                  </v-layout>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action class="pr-3">
                <v-tooltip v-if="group.photoLimitOptOut" top>
                  <v-icon slot="activator" color="green">check</v-icon>
                  <span>This group doesn't care how many other groups a photo is in</span>
                </v-tooltip>
                <v-tooltip v-else top>
                  <v-icon slot="activator" color="red">clear</v-icon>
                  <span>This group will count toward the photo's limit <br>(60 for Pro members, 30 for free members)</span>
                </v-tooltip>
              </v-list-tile-action>
              <v-list-tile-action>
                <v-btn
                  ripple
                  color="primary"
                  small>
                  <v-icon>add</v-icon>Add ({{ tags.length }})
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </template>
      </v-list></v-card>
      <v-expansion-panel class="mt-5">
        <v-expansion-panel-content v-for="{group, tags} in groupTagsList" :key="group.groupId">
          <v-layout
            slot="header"
            align-center
            row
            spacer
          >
            <v-avatar
              slot="activator"
              size="40"
            >
              <a
                :href="`https://www.flickr.com/groups/${group.groupId}`"
                target="_blank"
                style="height:40px;">
                <img :src="group.icon" :alt="group.title">
              </a>
            </v-avatar>
            &nbsp;
            &nbsp;
            <v-flex
              no-wrap
              ellipsis
              xs4
              sm4>
              <v-tooltip v-if="group.photoLimitOptOut" top>
                <v-icon slot="activator" color="green">check</v-icon>
                <span>This group doesn't care how many other groups a photo is in</span>
              </v-tooltip>
              <v-tooltip v-else top>
                <v-icon slot="activator" color="red">clear</v-icon>
                <span>This group will count toward the photo's limit <br>(60 for Pro members, 30 for free members)</span>
              </v-tooltip>
              &nbsp;
              <strong v-html="group.title"/>
            </v-flex>
            <template v-if="showTags">
              <v-flex xs6>
                <v-chip
                  v-for="tag in tags"
                  :key="tag"
                  small
                  label>{{ tag }}</v-chip>
              </v-flex>
            </template>
            <template v-else>
              <v-flex xs2><v-icon>photo</v-icon>{{ group.poolCount | parseNumber }}</v-flex>
              <v-flex xs2><v-icon>group</v-icon> {{ group.members | parseNumber }}</v-flex>
              <v-flex xs2 v-html="throttleText(group)"/>
            </template>
            <v-flex >
              <v-btn
                v-if="group.groupTag !== null"
                color="primary"
                small>
                <v-icon small>add</v-icon>Add ({{ tags.length }})
              </v-btn>
              <v-btn
                v-else-if="group.isMember"
                color="primary"
                small
                @click.stop="updateGroupTagsList({groupId: group.groupId, tags: [], group})">
                <v-icon small>extension</v-icon>Configure
              </v-btn>
              <v-btn
                v-else
                :href="`https://www.flickr.com/groups/${group.groupId}`"
                color="accent"
                small
                target="_blank"><v-icon small>add</v-icon>Join</v-btn>
            </v-flex>

          </v-layout>
          <!-- <v-card>
            <v-divider/>
            <v-card-text>
              <v-combobox
                v-model="tags"
                label="Add a tag"
                clearable
                multiple
                @change="updateGroupTagsList(list)"
                @click.stop
              >
                <template slot="selection" slot-scope="data">
                  <v-chip
                    :selected="data.selected"
                    close
                    @input="updateGroupTagsList(list, data.item)"
                  >
                    <strong>{{ data.item }}</strong>
                  </v-chip>
                </template>
              </v-combobox>
              <v-btn><v-icon>delete</v-icon>Delete</v-btn>
            </v-card-text>
          </v-card> -->
        </v-expansion-panel-content>
      </v-expansion-panel>
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
import SEARCH_GROUPS from '@/graphql/searchGroups.gql'
import { mapState } from 'vuex'
import { throttleText, loadingGraphql } from '@/mixins'
import _keyBy from 'lodash/keyBy'

export default {
  filters: {
    parseNumber(value) {
      if (parseInt(value) < 1000) return value
      else {
        return parseInt(value / 1000) + 'K'
      }
    }
  },
  mixins: [throttleText, loadingGraphql],
  data: () => ({
    joinedGroups: true,
    showTags: false,
    groupTagsList: [],
    searchGroups: []
  }),
  computed: {
    ...mapState({ search: state => state.search }),
    ...mapState('user', ['userId'])
  },
  watch: {
    search(newValue) {
      if (newValue === '') this.searchGroups = []
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
      update: ({ searchGroups }) => searchGroups.groups,
      variables() {
        return {
          text: this.search,
          page: 1,
          perPage: 15,
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
            const data = store.readQuery({ query: GROUP_TAGS_LIST })
            const groupedByGroupId = _keyBy(data.groupTagsList, 'groupId')
            groupedByGroupId[updateGroupTagsList.groupId] = updateGroupTagsList
            store.writeQuery({ query: GROUP_TAGS_LIST, data: { groupTagsList: Object.values(groupedByGroupId) } })
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
      } catch (error) {
        // Error
        console.error('error', error)
        // We restore the initial user input
        //this.newTag = newTag
      }
    }
  }
}
</script>
