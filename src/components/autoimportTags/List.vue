<template>
  <v-content>

    <!-- Loading -->
    <q-empty
      v-if="$apollo.queries.groupTagsList.loading && groupTagsList === undefined"
      :loading="true"/>

    <!-- Error -->
    <q-empty
      v-else-if="error"
      :error="true"
      icon="photo"/>

    <!-- Result -->
    <v-container
      v-else-if="groupTagsList"
    >
      <v-card>
        <v-list two-line class="py-0">
          <group-list
            v-for="( {group, tags, groupId}, index ) in orderByTitle"
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
        <li>You don't have binded group with tags. To do so search through your groups or find new groups with the Search bar</li>
        <li>Add tags ( preferably just one tag ) that matches the group essence. ( add examples )</li>
        <li>Once the tag/s has binded to the group all your photos with that tag will be shared to that group automatically. New photos you upload will be added too.</li>
      </ol>
    </v-container>

  </v-content>
</template>

<script>
import GroupList from '@/components/group/GroupList'
import QEmpty from '@/components/ui/QEmpty'
import _sortBy from 'lodash/sortBy'
import { mapState, mapGetters } from 'vuex'
import { filters } from '@/mixins'

export default {
  components: { GroupList, QEmpty },
  mixins: [filters],
  data: () => ({ groupTagsList: undefined, error: null }),
  computed: {
    ...mapState({ tagsFilter: state => state.tagsFilter.items }),
    ...mapGetters({ isEmpty: 'tagsFilter/isEmpty' }),
    filteredTags() {
      return Object.entries(this.tagsFilter)
        .filter(object => object[1])
        .map(object => object[0])
    },
    orderByTitle() {
      return _sortBy(this.groupTagsList, ({ group }) => this.sanitize(group.title))
    }
  },
  apollo: {
    groupTagsList: {
      query: require('@/graphql/groupTagsList.gql'),
      error(error) {
        this.error = error
      }
    }
  }
}
</script>
