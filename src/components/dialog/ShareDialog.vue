<template>
  <v-tooltip
    :top="tooltipPosition === 'top'"
    :bottom="tooltipPosition === 'bottom'"
    lazy>
    <v-btn
      slot="activator"
      v-bind="$attrs"
      @click.stop="sharePhoto = true">
      <v-icon>share</v-icon><span v-html="buttonText"/>
    </v-btn>
    <span>{{ tooltipText }}</span>
    <v-dialog
      v-model="sharePhoto"
      :fullscreen="$vuetify.breakpoint.xsOnly"
      lazy
      width="500"
      scrollable
    >
      <v-card max-width="500">
        <v-toolbar dark color="primary">
          <v-btn icon @click.native="sharePhoto = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title v-html="toolbarTitle"/>
          <v-spacer/>
          <v-flex
            slot="extension"
            class="pa-1">
            <q-filter
              placeholder="Search group..."
              @enter="val => {
                search = val.toLowerCase()
                showMoreEnabled = true
                page= 1 }"
              @clear="search = ''"/>
          </v-flex>
        </v-toolbar>
        <v-card-text
          v-if="search !== ''"
          class="pa-0"
          style="min-height:400px;">
          <ApolloQuery
            :query="require('@/graphql/searchGroups.gql')"
            :variables="{
              text: search,
              page: 1,
              perPage,
              userId: username
            }"
            tag=""
          >
            <template slot-scope="{ result: { loading, error, data }, isLoading, query }">
              <!-- Loading -->
              <q-empty
                v-if="isLoading === 1 && !fetchingMore"
                class="py-5 my-5"
                loading/>

              <!-- Error -->
              <q-empty
                v-else-if="error"
                description="No results found..."
                icon="search"/>

              <!-- Result -->
              <v-list
                v-else-if="data"
                :style="style"
                two-line>
                <transition-group name="whatsapp">
                  <div
                    v-for="(group, index) in data.searchGroups.groups"
                    :key="group.id">
                    <v-divider v-if="index !== 0"/>
                    <share-dialog-list
                      :group="group"
                      :selected="groups[group.id] !== undefined"
                      @select="add(group)"
                      @remove="remove(group.id)"/>
                  </div>
                </transition-group>
                <v-flex class="px-2">
                  <app-observer v-if="showMoreEnabled" @intersect="showMore(query)"/>
                  <v-btn
                    :disabled="!showMoreEnabled || isLoading === 1"
                    block
                    color="accent"
                    @click="showMore(query)">
                    <v-progress-circular
                      v-if="isLoading"
                      indeterminate
                      color="grey"/>
                    <span v-else>
                      &nbsp;Load more groups
                    </span>
                  </v-btn>
                </v-flex>
              </v-list>

              <!-- No result -->
              <q-empty
                v-else
                description="No results found..."
                icon="search"/>
            </template>
          </ApolloQuery>
        </v-card-text>

        <v-card-text
          v-else
          class="pa-0"
          style="min-height:400px;">
          <v-list
            v-if="Object.keys(groups).length"
            subheader
            two-line>
            <v-subheader>Selected groups</v-subheader>
            <div
              v-for="(group, index) in Object.values(groups)"
              :key="group.id">
              <v-divider v-if="index !== 0"/>
              <share-dialog-list
                :group="group"
                :group-pool="groups"
                allow-remove-action
                @remove="remove(group.id)"
              />
            </div>
          </v-list>
          <ApolloQuery
            :query="require('@/graphql/photoGroups.gql')"
            :variables="{
              photoId: photos[0],
            }"
            tag=""
          >
            <template slot-scope="{ result: { loading, error, data }, isLoading, query }">
              <!-- Loading -->
              <q-empty
                v-if="isLoading === 1 && !fetchingMore"
                class="py-5 my-5"
                loading/>

              <!-- Error -->
              <q-empty
                v-else-if="error"
                description="No results found..."
                icon="search"/>

              <!-- Result -->
              <v-list
                v-else-if="data"
                :style="style"
                two-line>
                <v-subheader>Shared groups</v-subheader>
                <div
                  v-for="(group, index) in data.photoGroups"
                  :key="group.id">
                  <v-divider v-if="index !== 0"/>
                  <share-dialog-list
                    :group="group"
                    @remove="remove(group.id)"/>
                </div>
              </v-list>

              <!-- No result -->
              <q-empty
                v-else
                description="No results found..."
                icon="search"/>
            </template>
          </ApolloQuery>
        </v-card-text>

        <v-toolbar
          v-if="hasItemsSelected"
          dark
          color="primary"
          style="position: absolute; bottom:0">
          <div
            style="overflow: hidden;"
            class="ellipsis mx-3"
            v-html="groupList"/>
          <v-fab-transition>
            <ApolloMutation
              :mutation="require('@/graphql/mutations/publishPhoto.gql')"
              :variables="{ input: publishPhoto() }"
              tag=""
              @done="sharePhoto = false"
            >
              <template slot-scope="{ mutate, loading, error }">
                <v-btn
                  v-show="hasItemsSelected"
                  :disabled="loading"
                  :loading="loading"
                  dark
                  absolute
                  top
                  right
                  fab
                  color="primary lighten-2"
                  @click="mutate()">
                  <v-icon>send</v-icon>
                </v-btn>
                <p v-if="error">An error occured: {{ error }}</p>
              </template>
            </ApolloMutation>

          </v-fab-transition>
        </v-toolbar>
      </v-card>

    </v-dialog>

  </v-tooltip>

</template>

<script>
import { mapState } from 'vuex'
import QFilter from '@/components/ui/QFilter'
import QEmpty from '@/components/ui/QEmpty'
import ShareDialogList from '@/components/dialog/ShareDialogList'
import AppObserver from '@/components/common/AppObserver'

export default {
  components: { QFilter, ShareDialogList, QEmpty, AppObserver },
  props: {
    photos: {
      type: Array,
      required: true
    },
    buttonText: {
      type: String,
      default: ''
    },
    tooltipText: {
      type: String,
      default: 'Sked'
    },
    tooltipPosition: {
      type: String,
      default: 'top'
    }
  },
  data: () => ({
    toolbarTitle: 'Share images',
    search: '',
    sharePhoto: false,
    page: 1,
    perPage: 10,
    showList: true,
    showMoreEnabled: true,
    fetchingMore: false,
    groups: {}
  }),
  computed: {
    ...mapState('user', ['username']),
    hasItemsSelected() {
      return Object.keys(this.groups).length > 0
    },
    groupList() {
      return Object.values(this.groups)
        .map(({ title }) => title)
        .join(', ')
    },
    style() {
      return { width: '100%', 'padding-bottom': this.hasItemsSelected ? '73px' : '0px' }
    }
  },
  methods: {
    add(group) {
      this.$set(this.groups, group.id, group)
    },
    remove(id) {
      this.$delete(this.groups, id)
    },
    publishPhoto() {
      const payload = []
      this.photos.forEach(photoId => {
        Object.keys(this.groups).forEach(groupId => payload.push({ photoId, groupId }))
      })
      return payload
    },
    showMore(query) {
      //Fetch more data and transform the original result
      this.fetchingMore = true
      query.fetchMore({
        variables: {
          text: this.search,
          page: ++this.page,
          perPage: this.perPage,
          userId: this.username
        },
        updateQuery: ({ searchGroups: { groups: prev } }, { fetchMoreResult: { searchGroups } }) => {
          this.fetchingMore = false
          if (searchGroups.groups.length === 0) {
            this.showMoreEnabled = false
          }
          this.searchGroups = searchGroups.page !== searchGroups.pages
          searchGroups.groups = [...prev, ...searchGroups.groups]
          return {
            __typename: searchGroups.__typename,
            searchGroups
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
