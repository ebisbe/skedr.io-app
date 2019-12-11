<template>
  <v-dialog
    v-model="showDialog"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    persistent
    width="500"
    scrollable
  >
    <v-card max-width="500">
      <v-toolbar color="accent" extension-height="60">
        <v-btn icon color="white" @click.native="closeDialog(false)">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title class="white--text">
          {{ toolbarTitle } }
        </v-toolbar-title>
        <v-spacer />
        <template #extension>
          <q-filter
            v-if="showDialog"
            :placeholder="$t('ShareDialog.placeholder')"
            dense
            @enter="
              val => {
                search = val.toLowerCase()
                showMoreEnabled = true
                page = 1
              }
            "
            @clear="search = ''"
          />
        </template>
      </v-toolbar>
      <v-card-text v-if="search !== ''" class="pa-0" style="min-height:400px;">
        <ApolloQuery
          :query="require('@/graphql/searchGroups.gql')"
          :variables="{
            text: search,
            page: 1,
            perPage,
            userId,
            photoId: sharesOneImage ? photos[0] : ''
          }"
          tag=""
        >
          <template slot-scope="{ result: { loading, error, data }, isLoading, query }">
            <!-- Loading -->
            <q-empty v-if="isLoading === 1 && !fetchingMore" class="py-12 my-12" loading />

            <!-- Error -->
            <q-empty v-else-if="error" :description="$t('ShareDialog.no_results')" icon="search" />

            <!-- Result -->
            <v-list v-else-if="data && data.searchGroups.groups.length > 0" :style="style" two-line>
              <transition-group name="whatsapp">
                <div v-for="(group, index) in data.searchGroups.groups" :key="group.id">
                  <v-divider v-if="index !== 0" />
                  <share-dialog-list
                    :group="group"
                    :already-in-group="data.photoGroups.findIndex(({ id }) => group.id === id) > -1"
                    :selected="inPool(group.id)"
                    @select="add({ id: group.id, item: group })"
                    @remove="remove(group.id)"
                  />
                </div>
              </transition-group>
              <v-flex
                v-if="showMoreEnabled && data.searchGroups.groups.length >= perPage"
                class="px-2"
              >
                <app-observer @intersect="showMore(query)" />
                <v-btn :disabled="isLoading === 1" block color="accent" @click="showMore(query)">
                  <v-progress-circular v-if="isLoading" indeterminate color="grey" />
                  <span v-else> &nbsp;{{ $t('btn.load_more_groups') }} </span>
                </v-btn>
              </v-flex>
            </v-list>

            <!-- No result -->
            <q-empty v-else :description="$t('groups_not_found', { search })" icon="search" />
          </template>
        </ApolloQuery>
      </v-card-text>

      <v-card-text v-else class="pa-0" style="min-height:400px;">
        <v-list v-if="totalSelectedGroups" subheader two-line>
          <v-subheader>
            {{
              $tc('ShareDialog.selected_groups', totalSelectedGroups, {
                count: totalSelectedGroups
              })
            }}
          </v-subheader>
          <div v-for="(group, index) in orderedSelectedGroups" :key="group.id">
            <v-divider v-if="index !== 0" />
            <share-dialog-list :group="group" allow-remove-action @remove="remove(group.id)" />
          </div>
        </v-list>
        <ApolloQuery
          v-else-if="sharesOneImage"
          :query="require('@/graphql/photoGroups.gql')"
          :variables="{
            photoId: photos[0]
          }"
          tag=""
        >
          <template slot-scope="{ result: { loading, error, data }, isLoading }">
            <!-- Loading -->
            <q-empty v-if="isLoading === 1 && !fetchingMore" class="py-12 my-12" loading />

            <!-- Error -->
            <q-empty v-else-if="error" :description="$t('ShareDialog.no_results')" icon="search" />

            <!-- Result -->
            <v-list v-else-if="data" :style="style" two-line>
              <v-subheader>
                {{
                  $tc('ShareDialog.selected_groups', data.photoGroups.length, {
                    count: data.photoGroups.length
                  })
                }}
              </v-subheader>
              <div v-for="(group, index) in data.photoGroups" :key="group.id">
                <v-divider v-if="index !== 0" />
                <share-dialog-list :group="group" :selectable="false" @remove="remove(group.id)" />
              </div>
            </v-list>

            <!-- No result -->
            <q-empty v-else :description="$t('ShareDialog.no_results')" icon="search" />
          </template>
        </ApolloQuery>
        <q-empty v-else :description="$t('ShareDialog.search_groups')" icon="search" />
      </v-card-text>

      <v-toolbar
        v-if="hasItemsSelected"
        color="accent"
        style="position: absolute; bottom:0; width:100%;"
      >
        <div style="overflow: hidden;" class="text-truncate mx-4">
          {{ groupTagList }}
        </div>
        <v-fab-transition>
          <ApolloMutation
            :mutation="require('@/graphql/mutations/publishPhoto.gql')"
            :variables="{ input: publishPhoto }"
            :update="updateAfterMutation"
            tag=""
            @done="closeDialog(true)"
          >
            <template slot-scope="{ mutate, loading, error }">
              <v-btn
                v-show="hasItemsSelected"
                :disabled="loading"
                :loading="loading"
                absolute
                top
                right
                fab
                color="accent lighten-2"
                @click="mutate()"
              >
                <v-icon>send</v-icon>
              </v-btn>
              <p v-if="error">An error occured: {{ error }}</p>
            </template>
          </ApolloMutation>
        </v-fab-transition>
      </v-toolbar>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
  import QFilter from '@/components/ui/QFilter.vue'
  import QEmpty from '@/components/ui/QEmpty.vue'
  import ShareDialogList from '@/components/dialog/ShareDialogList.vue'
  import AppObserver from '@/components/common/AppObserver.vue'

  export default {
    components: { QFilter, ShareDialogList, QEmpty, AppObserver },
    props: {
      showDialog: {
        type: Boolean,
        required: true
      }
    },
    data: () => ({
      search: '',
      page: 1,
      perPage: 12,
      showList: true,
      showMoreEnabled: true,
      fetchingMore: false
    }),
    computed: {
      ...mapState({
        userId: state => state.user.username
      }),
      ...mapGetters({
        photos: 'pool/ids',
        photoList: 'pool/items',
        totalSelectedGroups: 'groupsPool/total',
        orderedSelectedGroups: 'groupsPool/orderByTitle',
        hasItemsSelected: 'groupsPool/hasItems',
        groupTagList: 'groupsPool/list',
        inPool: 'groupsPool/inPool'
      }),
      style() {
        return {
          width: '100%',
          'padding-bottom': this.hasItemsSelected ? '73px' : '0px'
        }
      },
      groupString() {
        return this.totalSelectedGroups > 1 ? 'groups' : 'group'
      },
      sharesOneImage() {
        return this.photos.length === 1
      },
      toolbarTitle() {
        return !this.sharesOneImage ? 'Share images' : `Sharing: '${this.photoList[0].title}'`
      },
      publishPhoto() {
        const payload = []
        this.photos.forEach(photoId => {
          Object.values(this.orderedSelectedGroups).forEach(({ id: groupId }) =>
            payload.push({ photoId, groupId })
          )
        })
        return payload
      }
    },
    methods: {
      ...mapMutations({
        add: 'groupsPool/add',
        remove: 'groupsPool/remove',
        clearSharedPool: 'pool/clear',
        clearGroupPool: 'groupsPool/clear'
      }),
      updateAfterMutation(store, { data: { publishPhoto } }) {
        // Read the data from our cache for this query.
        const query = {
          query: require('@/graphql/notifications.gql'),
          variables: { count: 15 }
        }
        const data = store.readQuery(query)
        // Add our tag from the mutation to the end
        data.notifications.notifications.unshift(...publishPhoto)
        query.data = data
        // Write our data back to the cache.
        store.writeQuery(query)
      },
      closeDialog(clearPool = false) {
        if (clearPool) {
          this.clearSharedPool()
          this.clearGroupPool()
        }
        this.search = ''
        this.$emit('close')
      },
      showMore(query) {
        // Fetch more data and transform the original result
        this.fetchingMore = true
        query.fetchMore({
          variables: {
            text: this.search,
            page: ++this.page,
            perPage: this.perPage,
            userId: this.userId
          },
          updateQuery: (
            { searchGroups: { groups: prev } },
            { fetchMoreResult: { searchGroups, photoGroups } }
          ) => {
            this.fetchingMore = false
            if (searchGroups.groups.length < this.perPage) {
              this.showMoreEnabled = false
            }
            this.searchGroups = searchGroups.page !== searchGroups.pages
            searchGroups.groups = [...prev, ...searchGroups.groups]
            return {
              __typename: searchGroups.__typename,
              searchGroups,
              photoGroups
            }
          }
        })
      }
    }
  }
</script>

<style lang="css">
  .whatsapp-enter-active {
    transition: all 0.2s;
  }

  .whatsapp-leave-active {
    transition: all 0.2s;
  }

  .whatsapp-enter {
    opacity: 0;
    transform: translateY(-30px);
  }

  .whatsapp-leave-to {
    opacity: 0;
  }
</style>
