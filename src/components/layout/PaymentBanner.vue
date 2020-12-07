<template>
  <check-subscription v-slot:default="{ data: { loading, hasSubscription, configuredGroups } }">
    <v-banner v-if="!loading && !hasSubscription" single-line>
      <template v-if="configuredGroups > 9">
        You reached your maximum configured groups for the free tier.
      </template>
      <template v-else>
        You are using {{ configuredGroups }} of the 10 group configurations under the free tier.
      </template>
      <template v-slot:actions>
        <v-btn :to="{ name: 'Profile' }" text color="deep-purple accent-4">
          Support skedr
        </v-btn>
      </template>
    </v-banner>
  </check-subscription>
</template>
<script>
  import CheckSubscription from '@/components/common/CheckSubscription'

  export default {
    components: { CheckSubscription }
  }
</script>
