<template>
  <v-content>
    <!-- Loading -->
    <q-empty
      v-if="$apollo.queries.groupTagsList.loading && groupTagsList === undefined"
      :loading="true"
    />

    <!-- Error -->
    <q-empty v-else-if="error" :error="true" icon="photo" />

    <!-- Result -->
    <v-container
      v-else-if="groupTagsList && groupTagsList.groupTags && groupTagsList.groupTags.length"
    >
      <v-card>
        <v-list
          :three-line="$vuetify.breakpoint.name === 'xs'"
          :two-line="$vuetify.breakpoint.name !== 'xs'"
          class="py-0"
        >
          <template v-for="(groupTag, index) in groupTagsList.groupTags">
            <group-tag-list
              :key="groupTag.groupId"
              :group-tag="groupTag"
              :group="groupTag.group"
              :use-divider="index !== 0"
            />
            <app-observer
              v-if="showMoreEnabled && groupTagsList.groupTags.length - 10 === index"
              :key="`observer-${groupTag.groupId}`"
              @intersect="fetchMore()"
            />
          </template>
        </v-list>
      </v-card>

      <v-flex v-if="showMoreEnabled" class="px-0">
        <v-btn
          :disabled="$apollo.queries.groupTagsList.loading"
          block
          color="accent"
          @click="fetchMore()"
        >
          <v-progress-circular
            v-if="$apollo.queries.groupTagsList.loading"
            indeterminate
            color="grey"
          />
          <span v-else> &nbsp;{{ $t('btn.load_more_groups') }} </span>
        </v-btn>
      </v-flex>
    </v-container>

    <!-- No result -->
    <v-container v-else>
      <ol>
        <li>
          You don't have any tag linked to a group. To start linking tags search through your groups
          or find new groups with the
          <v-icon>search</v-icon>Search.
        </li>
        <li>
          Add tags with the <v-icon>settings</v-icon> icon of any group. For example:
          <ul>
            <li>
              <a href="https://www.flickr.com/groups/flickr10photowalks/"
                >Flickr Worldwide Photowalks</a
              >
              use the <group-tag-dialog-chip tag="photowalk" /> tag.
            </li>
            <li>
              <a href="https://www.flickr.com/groups/peopleandpersons/">People and Persons</a>
              use the <group-tag-dialog-chip tag="people" />,
              <group-tag-dialog-chip tag="person" />, <group-tag-dialog-chip tag="woman" /> and/or
              <group-tag-dialog-chip tag="man" /> tag.
            </li>
            <li>
              <a href="https://www.flickr.com/groups/catchy/">!Catchy Colors</a>
              use the <group-tag-dialog-chip tag="color" /> or
              <group-tag-dialog-chip tag="colour" /> tag.
            </li>
            <li>
              <a href="https://www.flickr.com/groups/minimally_less_is_more/">Less Is More...</a>
              use the <group-tag-dialog-chip tag="minimalism" /> tag.
            </li>
            <li>
              <a href="https://www.flickr.com/groups/blackandwhite/">Black and White</a>
              use the <group-tag-dialog-chip tag="b&w" /> tag.
            </li>
          </ul>
        </li>
        <li>
          Once the tag/s has been linked to the group all your previous photos with that tag will be
          shared to that group automatically. New photos you upload will be added too.
        </li>
      </ol>
      <v-flex xs12 class="pt-12">
        <h3>How it works?</h3>
        <video src="/video/autoimport/Video MP4 (1180x808).mp4" width="640" controls />
      </v-flex>
    </v-container>
  </v-content>
</template>

<script>
  import GroupTagList from '@/components/groupTag/GroupTagList'
  import QEmpty from '@/components/ui/QEmpty'
  import AppObserver from '@/components/common/AppObserver'
  import GroupTagDialogChip from '@/components/groupTag/GroupTagDialogChip'
  import _sortBy from 'lodash/sortBy'
  import { mapState, mapGetters } from 'vuex'
  import { filters } from '@/mixins'

  export default {
    components: { GroupTagList, QEmpty, GroupTagDialogChip, AppObserver },
    mixins: [filters],
    data: () => ({
      groupTagsList: undefined,
      error: null,
      count: 25,
      showMoreEnabled: false
    }),
    computed: {
      ...mapState({ tagsFilter: state => state.tagsFilter.items }),
      ...mapGetters({ isEmpty: 'tagsFilter/isEmpty' }),
      filteredTags() {
        return Object.entries(this.tagsFilter)
          .filter(object => object[1])
          .map(object => object[0])
      }
    },
    apollo: {
      groupTagsList: {
        query: require('@/graphql/groupTags.gql'),
        variables() {
          if (this.filteredTags.length) {
            return { tags: this.filteredTags }
          } else {
            return {
              count: this.count
            }
          }
        },
        result(
          {
            data: { groupTagsList: { nextToken } } = {
              groupTagsList: { nextToken: null }
            }
          },
          key
        ) {
          if (nextToken === null) {
            this.showMoreEnabled = false
          } else {
            this.showMoreEnabled = true
          }
        },
        error(error) {
          this.error = error
        }
      }
    },
    methods: {
      fetchMore() {
        const nextToken = this.groupTagsList.nextToken
        this.$apollo.queries.groupTagsList.fetchMore({
          variables: {
            tags: this.filteredTags,
            count: this.count,
            nextToken
          },
          updateQuery: (
            { groupTagsList: { groupTags: prevNot } },
            { fetchMoreResult: { groupTagsList } }
          ) => {
            this.showMoreEnabled = groupTagsList.nextToken !== null
            groupTagsList.groupTags = [...prevNot, ...groupTagsList.groupTags]
            return {
              __typename: groupTagsList.__typename,
              groupTagsList
            }
          }
        })
      }
    }
  }
</script>
