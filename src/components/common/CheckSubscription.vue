<template>
  <ApolloQuery
    v-slot="{ result: { loading, data } }"
    :query="require('@/graphql/paymentBanner.gql')"
  >
    <slot
      :data="{
        loading,
        hasSubscription: data && data.userSubscription ? data.userSubscription.planId !== '' : null,
        configuredGroups: data && data.groupTagsList ? configuredGroups(data.groupTagsList) : null,
        hasAccess:
          data && data.userSubscription && data.groupTagsList
            ? data.userSubscription.planId !== '' || configuredGroups(data.groupTagsList) < 10
            : false
      }"
    />
  </ApolloQuery>
</template>
<script>
  export default {
    methods: {
      configuredGroups(groupTagsList) {
        if (groupTagsList === undefined) {
          return undefined
        }
        return groupTagsList.groupTags.filter(({ hasTags }) => hasTags > 0).length
      }
    }
  }
</script>
