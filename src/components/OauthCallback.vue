<template>

</template>
<script>
  import { postSignedRequest } from '../libs/awsLib'

  export default {
    name: 'OauthCallback',
    async created () {
      console.log(this.$route)
      this.axios(
        await postSignedRequest('oauth/callback',
          {
            oauthToken: this.$route.query.oauth_token,
            oauthVerifier: this.$route.query.oauth_verifier
          })
      ).then(response => this.$router.push({name: 'Group'}))
        .catch(error => console.log(error))
    }
  }
</script>