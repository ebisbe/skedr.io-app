<template>
  <v-content>
    <v-container>
      <user-profile />
      <v-card class="mb-6">
        <ApolloQuery :query="require('@/graphql/plans.gql')" tag="">
          <template slot-scope="{ result: { error, data, loading } }">
            <v-container v-if="error">
              {{ error }}
            </v-container>
            <v-container v-else>
              <h1 v-t="'Profile.title'" />
              <div v-if="data && data.userSubscription && data.userSubscription.status">
                <p v-t="'Profile.subscribed'" />
                <div v-if="data.userSubscription.planId">
                  <h2 v-t="'Profile.subtitle'" />
                  <v-list>
                    <template
                      v-for="plan in data.plans.filter(
                        ({ id }) => id === data.userSubscription.planId
                      )"
                    >
                      <v-list-tile :key="plan.id">
                        <v-list-tile-content>
                          <v-list-tile-title>
                            {{ plan.nickname }}: {{ parseInt(plan.amount) / 100 }}&euro;
                          </v-list-tile-title>
                          <v-list-tile-sub-title>
                            {{
                              $tc('Profile.plan_info', plan.interval, {
                                period: plan.interval,
                                count: plan.interval_count,
                                trialDays: plan.trial_period_days
                              })
                            }}
                          </v-list-tile-sub-title>
                        </v-list-tile-content>

                        <v-list-tile-action>
                          <v-btn icon>
                            <v-icon color="green">
                              check
                            </v-icon>
                          </v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                    </template>
                  </v-list>
                </div>
              </div>
              <div v-else>
                <p v-t="'Profile.not_subscribed'" />
              </div>
              <div v-if="data && data.plans">
                <h2 v-t="'Profile.subtitle'" />
                <v-list>
                  <v-list-item
                    v-for="plan in data.plans"
                    :key="plan.id"
                    ripple
                    @click="selectedPlan = plan.id"
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ plan.nickname }}: {{ parseInt(plan.amount) / 100 }}&euro;
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{
                          $tc('Profile.plan_info', plan.interval, {
                            period: plan.interval,
                            count: plan.interval_count,
                            trialDays: plan.trial_period_days
                          })
                        }}
                      </v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-btn icon @click="selectedPlan = plan.id">
                        <v-icon v-if="selectedPlan === plan.id" color="green">
                          check_circle
                        </v-icon>
                        <v-icon v-else>check_circle</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </div>
              <div v-if="data && data.userSubscription.status === false">
                <v-form>
                  <h2 v-t="'Profile.payment_details'" />
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
                    <v-flex xs12 sm3 offset-sm1>
                      <v-btn
                        v-t="'btn.submit_payment'"
                        :disabled="!complete || !selectedPlan"
                        :loading="loading"
                        block
                        color="primary"
                        @click="pay"
                      />
                    </v-flex>
                    <v-flex xs12 sm2 offset-sm10>
                      <img src="/img/powered_by_stripe.png" class="right" alt="Powered by stripe" />
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
      selectedPlan: null,
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
          this.$store.dispatch('message/add', this.$i18n.t('Profile.verify_email'))
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
            source: data.token.id,
            planId: this.selectedPlan
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
