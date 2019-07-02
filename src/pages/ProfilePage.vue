<template>
  <v-content>
    <v-container>
      <user-profile />
      <v-card class="mb-4">
        <ApolloQuery
          :query="require('@/graphql/plans.gql')"
          tag=""
        >
          <template slot-scope="{ result: { error, data, loading }, query }">
            <v-container v-if="error">{{ error }}</v-container>
            <v-container v-else>
              <h1>Subscription</h1>
              <div v-if="data && data.userSubscription && data.userSubscription.status">
                <p>Thanks for subscribing! Your support means a lot.</p>
              </div>
              <div v-else>
                <p>You are not subscribed to Skedr.io. Please consider supporting the project. We are offering a special discount for all early adopters. Benefit from a 50% discount on a monthly payment.</p>
              </div>
              <div v-if="data && data.plans">
                <h2>Plan</h2>
                <v-list>
                  <v-list-tile
                    v-for="plan in data.plans"
                    :key="plan.id">
                    <v-list-tile-content>
                      <v-list-tile-title>{{ plan.nickname }}: {{ parseInt(plan.amount) / 100 }}&euro; </v-list-tile-title>
                      <v-list-tile-sub-title>Payment every {{ plan.interval_count === 1 ? '' : plan.interval_count }} {{ plan.interval }} ( {{ plan.trial_period_days }} days trial period )</v-list-tile-sub-title>
                    </v-list-tile-content>

                    <v-list-tile-action>
                      <v-icon color="green">check</v-icon>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
              </div>
              <div v-if="data && data.userSubscription.status === false">
                <v-form>
                  <h2>Payment details:</h2>
                  <v-layout row wrap>
                    <v-flex xs12 sm8>
                      <card
                        :class="{ complete }"
                        :options="stripeOptions"
                        :stripe="stripe"
                        class="stripe-card"
                        @change="complete = $event.complete"
                      />
                    </v-flex>
                    <v-flex
                      xs12
                      sm3
                      offset-sm1>
                      <v-btn
                        :disabled="!complete"
                        :loading="loading"
                        block
                        color="primary"
                        @click="pay">
                        Submit payment
                      </v-btn>
                    </v-flex>
                    <v-flex
                      xs12
                      sm2
                      offset-sm10>
                      <img
                        src="/img/powered_by_stripe.png"
                        class="right"
                        alt="Powered by stripe">
                    </v-flex>
                  </v-layout>
                </v-form>
              </div>
            </v-container>
          </template>
        </ApolloQuery>
      </v-card>
    </v-container>
  </v-content>
</template>

<script>
import { Card, createToken } from 'vue-stripe-elements-plus'
import UserProfile from '@/components/profile/UserProfile'
import { mapState } from 'vuex'

export default {
  components: { Card, UserProfile },
  filters: {
    currency: function(value) {
      if (value === 'eur') return '&euro;'
    }
  },
  data: () => ({
    stripe: process.env.VUE_APP_STRIPE_KEY,
    complete: false,
    loading: false,
    stripeOptions: {
      base: {
        color: '#303238',
        fontSize: '16px',
        color: '#32325d',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: '#ccc'
        }
      },
      invalid: {
        color: '#e5424d',
        ':focus': {
          color: '#303238'
        }
      }
    }
  }),
  computed: {
    ...mapState({
      user: state => state.user.user.attributes
    })
  },
  methods: {
    pay: async function() {
      if (this.user.email_verified === false) {
        this.$store.dispatch('message/add', 'Verify your email before submiting the payment.')
        return false
      }

      this.complete = false
      this.loading = true
      // createToken returns a Promise which resolves in a result object with
      // either a token or an error key.
      // See https://stripe.com/docs/api#tokens for the token object.
      // See https://stripe.com/docs/api#errors for the error object.
      // More general https://stripe.com/docs/stripe.js#stripe-create-token.
      const data = await createToken()

      const {
        data: { payService }
      } = await this.$apollo.mutate({
        mutation: require('@/graphql/mutations/payService.gql'),
        variables: {
          name: `${this.user.name} ${this.user.family_name}`,
          email: this.user.email,
          source: data.token.id
        }
      })

      if (payService.status === false) {
        this.$store.dispatch('message/add', payService.error)
        this.complete = true
      }

      this.loading = false
    }
  }
}
</script>
<style>
.StripeElement {
  box-sizing: border-box;

  height: 40px;

  padding: 10px 12px;

  border: 1px solid transparent;
  border-radius: 4px;
  background-color: white;

  box-shadow: 0 1px 3px 0 #e6ebf1;
  -webkit-transition: box-shadow 150ms ease;
  transition: box-shadow 150ms ease;
}

.StripeElement--focus {
  box-shadow: 0 1px 3px 0 #cfd7df;
}

.StripeElement--invalid {
  border-color: #fa755a;
}

.StripeElement--webkit-autofill {
  background-color: #fefde5 !important;
}
</style>


