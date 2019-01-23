<template>
  <v-content>
    <ApolloQuery
      :query="require('@/graphql/groupTagsList.gql')"
      fetch-policy="cache-and-network"
      tag=""
    >
      <template slot-scope="{ result: { error, data, loading }, query}">
        <!-- Loading -->
        <q-empty
          v-if="loading"
          :loading="true"/>

        <!-- Error -->
        <q-empty
          v-else-if="error"
          :error="true"
          icon="photo"/>

        <!-- Result -->
        <v-container
          v-else-if="data"
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
import GroupList from '@/components/group/GroupList'
import QEmpty from '@/components/ui/QEmpty'
import { mapState, mapGetters } from 'vuex'

export default {
  components: { GroupList, QEmpty },
  computed: {
    ...mapState({ search: state => state.search }),
    ...mapState('tagsFilter', {
      tagsFilter: state => state.items
    }),
    ...mapGetters({ isEmpty: 'tagsFilter/isEmpty' }),
    filteredTags() {
      return Object.entries(this.tagsFilter)
        .filter(object => object[1])
        .map(object => object[0])
    }
  }
}
</script>
