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
      v-else-if="groupTagsList && groupTagsList.length"
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
        <li>You don't have any tag linked to a group. To start linking tags search through your groups or find new groups with the <v-icon>search</v-icon>Search.</li>
        <li>Add tags with the <v-icon>settings</v-icon> icon of any group. For example:
          <ul>
            <li><a href="https://www.flickr.com/groups/flickr10photowalks/">Flickr Worldwide Photowalks</a> use the <group-tag-dialog-chip tag="photowalk"/> tag.</li>
            <li><a href="https://www.flickr.com/groups/peopleandpersons/">People and Persons</a> use the <group-tag-dialog-chip tag="people"/>, <group-tag-dialog-chip tag="person"/>, <group-tag-dialog-chip tag="woman"/> and/or <group-tag-dialog-chip tag="man"/> tag.</li>
            <li><a href="https://www.flickr.com/groups/catchy/">!Catchy Colors</a> use the <group-tag-dialog-chip tag="color"/> or <group-tag-dialog-chip tag="colour"/> tag.</li>
            <li><a href="https://www.flickr.com/groups/minimally_less_is_more/">Less Is More...</a> use the <group-tag-dialog-chip tag="minimalism"/> tag.</li>
            <li><a href="https://www.flickr.com/groups/blackandwhite/">Black and White</a> use the <group-tag-dialog-chip tag="b&w"/> tag.</li>
          </ul>
        </li>
        <li>Once the tag/s has been linked to the group all your previous photos with that tag will be shared to that group automatically. New photos you upload will be added too.</li>
      </ol>
    </v-container>

  </v-content>
</template>

<script>
import GroupList from '@/components/group/GroupList'
import QEmpty from '@/components/ui/QEmpty'
import GroupTagDialogChip from '@/components/group/GroupTagDialogChip'
import _sortBy from 'lodash/sortBy'
import { mapState, mapGetters } from 'vuex'
import { filters } from '@/mixins'

export default {
  components: { GroupList, QEmpty, GroupTagDialogChip },
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
