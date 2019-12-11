<template>
  <v-navigation-drawer v-model="rightDrawer" clipped fixed app right>
    <v-container fluid grid-list-md>
      <v-layout pa-0 fluid>
        <v-flex class="py-0">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                :disabled="isEmpty"
                block
                color="error"
                small
                outlined
                v-on="on"
                @click="$store.commit('tagsFilter/clear')"
              >
                <v-icon>delete</v-icon>&nbsp;{{ $t('btn.clear') }}
              </v-btn>
            </template>
            <span v-t="'Layout.clear_filter'" />
          </v-tooltip>
        </v-flex>
      </v-layout>
      <v-chip-group multiple column active-class="primary--text">
        <v-chip
          v-for="(groups, tag) in tagsName"
          :key="tag"
          :input-value="tagsFilter[tag]"
          label
          @click="$store.commit('tagsFilter/upsert', tag)"
        >
          <v-icon :color="tagsFilter[tag] ? 'accent' : undefined" small left class="mr-1">
            label
          </v-icon>
          {{ tag }}&nbsp;[{{ groups.length }}]
        </v-chip>
      </v-chip-group>
    </v-container>
  </v-navigation-drawer>
</template>
<script>
  import GROUP_TAGS_LIST from '@/graphql/groupTagsList.gql'
  import { mapState, mapGetters } from 'vuex'
  import { rightDrawer } from '@/mixins'

  export default {
    mixins: [rightDrawer],
    data: () => ({
      groupTagsList: []
    }),
    apollo: {
      groupTagsList: {
        query: GROUP_TAGS_LIST,
        update: ({ groupTagsList }) => groupTagsList.groupTags
      }
    },
    computed: {
      ...mapState('tagsFilter', {
        tagsFilter: state => state.items
      }),
      ...mapGetters({ isEmpty: 'tagsFilter/isEmpty' }),
      tagsName() {
        const tags = {}
        this.groupTagsList.forEach(groupTag =>
          [...groupTag.tags].forEach(tag => {
            if (!tags.hasOwnProperty(tag)) {
              tags[tag] = []
            }
            tags[tag].push(groupTag.groupId)
            tags[tag].sort()
          })
        )
        const sortedKeys = Object.keys(tags).sort()
        const sortedTags = {}
        sortedKeys.forEach(key => (sortedTags[key] = tags[key]))
        return sortedTags
      }
    }
  }
</script>
