<template>
  <v-banner
    v-if="!$apollo.queries.groupTagsList.loading && !$apollo.queries.userSubscription.loading"
  >
    You will pay
    <pre>{{ configuredGroups }}</pre>
    <pre>{{ isSubscribed }}</pre>
    <template v-slot:actions>
      <v-btn text color="deep-purple accent-4">
        Support skedr
      </v-btn>
    </template>
  </v-banner>
</template>
<script>
  export default {
    data: () => ({ groupTagsList: undefined, userSubscription: undefined }),
    apollo: {
      groupTagsList: {
        query: require('@/graphql/paymentBanner.gql')
      },
      userSubscription: {
        query: require('@/graphql/paymentBanner.gql')
      }
    },
    computed: {
      isSubscribed() {
        return this.userSubscription.planId != ''
      },
      configuredGroups() {
        if (this.groupTagsList === undefined) {
          return undefined
        }
        return this.groupTagsList.groupTags
          .map(({ tags }) => tags.length)
          .filter(total => total > 0).length
      }
    }
  }
</script>
