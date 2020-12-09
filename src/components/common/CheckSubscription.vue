<template>
  <ApolloQuery
    v-slot="{ result: { loading, data } }"
    :query="require('@/graphql/paymentBanner.gql')"
  >
    <slot
      :data="{
        loading,
        hasSubscription: hasSubscription(data),
        configuredGroups: data && data.groupTagsList ? configuredGroups(data.groupTagsList) : null,
        noAccess:
          data &&
          data.userSubscription &&
          data.groupTagsList &&
          !hasSubscription(data) &&
          configuredGroups(data.groupTagsList) > 9
      }"
    />
  </ApolloQuery>
</template>
<script>
  export default {
    methods: {
      hasSubscription(data) {
        return (
          data &&
          data.userSubscription &&
          ['active', 'trialing'].includes(data.userSubscription.planStatus)
        )
      },
      configuredGroups(groupTagsList) {
        if (groupTagsList === undefined) {
          return undefined
        }
        return groupTagsList.groupTags.filter(({ hasTags }) => hasTags > 0).length
      }
    }
  }
</script>
