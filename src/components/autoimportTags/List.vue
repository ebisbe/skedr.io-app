<template>
  <v-main>
    <payment-banner />

    <ApolloQuery
      v-slot="{ result: { error, data, loading } }"
      :query="require('@/graphql/groupTags.gql')"
      :variables="{
        count: count,
        nextToken,
        tags: filteredTags.length ? filteredTags : null
      }"
      tag=""
      :update="data => data.groupTagsList"
    >
      <template>
        <q-empty v-if="loading" :loading="true" />
        <q-empty v-else-if="error" :description="error" :error="true" icon="photo" />
        <v-container v-else>
          <v-card>
            <v-list
              :three-line="$vuetify.breakpoint.name === 'xs'"
              :two-line="$vuetify.breakpoint.name !== 'xs'"
              class="py-0"
            >
              <group-tag-list
                v-for="(groupTag, index) in data.groupTags"
                :key="groupTag.groupId"
                :group-tag="groupTag"
                :group="groupTag.group"
                :use-divider="index !== 0"
              />
            </v-list>
          </v-card>

          <v-flex class="px-0 mt-3">
            <v-btn
              v-if="pageTokens.length > 1"
              color="accent"
              :disabled="disablePreviousPage"
              class="relative items-center"
              @click="pageTokens.pop()"
            >
              <span> &nbsp;{{ $t('btn.previous') }} </span>
            </v-btn>

            <ApolloQuery
              v-if="data.nextToken"
              v-slot="{ result: { data: checkNext, loading: prefetchingData } }"
              :query="require('@/graphql/groupTags.gql')"
              :update="data => data.groupTagsList"
              tag=""
              :variables="{
                count,
                nextToken: data.nextToken === null ? '' : data.nextToken,
                tags: filteredTags.length ? filteredTags : null
              }"
            >
              <v-btn
                color="accent"
                :disabled="
                  prefetchingData === true || checkNext === null || !checkNext.groupTags.length
                "
                class="ml-3 relative items-center"
                @click="pageTokens.push(data.nextToken)"
              >
                <span> &nbsp;{{ $t('btn.next') }} </span>
              </v-btn>
            </ApolloQuery>
          </v-flex>
        </v-container>
      </template>
    </ApolloQuery>
  </v-main>
</template>

<script>
  import GroupTagList from '@/components/groupTag/GroupTagList'
  import QEmpty from '@/components/ui/QEmpty'
  import AppObserver from '@/components/common/AppObserver'
  import PaymentBanner from '@/components/layout/PaymentBanner'
  import _sortBy from 'lodash/sortBy'
  import { mapState, mapGetters } from 'vuex'
  import { filters } from '@/mixins'

  export default {
    components: { GroupTagList, QEmpty, PaymentBanner },
    mixins: [filters],
    data: () => ({
      count: 10,
      pageTokens: [null]
    }),
    computed: {
      nextToken() {
        return this.pageTokens[this.pageTokens.length - 1]
      },
      ...mapState({ tagsFilter: state => state.tagsFilter.items }),
      ...mapGetters({ isEmpty: 'tagsFilter/isEmpty' }),
      filteredTags() {
        return Object.entries(this.tagsFilter)
          .filter(object => object[1])
          .map(object => object[0])
      }
    }
  }
</script>
