<template>
  <div>
    <v-list-tile
      avatar
      ripple>
      <v-list-tile-avatar v-if="$vuetify.breakpoint.smAndUp">
        <a :href="group.link" target="_blank">
          <img :src="group.icon" :alt="group.title">
        </a>
      </v-list-tile-avatar>
      <v-list-tile-content v-if="$vuetify.breakpoint.mdAndUp">
        <v-list-tile-title>
          <v-layout row wrap>
            <v-flex xs5 v-html="group.title"/>
            <v-flex xs1 class="text-xs-right"><v-icon v-html="punctuation"/>&nbsp;<v-icon>exposure</v-icon></v-flex>
            <v-flex xs2 class="text-xs-right">{{ group.poolCount }} <v-icon>photo</v-icon></v-flex>
            <v-flex xs2 class="text-xs-right">{{ group.members }} <v-icon>face</v-icon></v-flex>
            <v-flex xs2 class="grey--text text-xs-right">
              <span v-html="group.throttleText()"/>&nbsp;
              <strong>{{ group.throttleMode }}</strong>
            </v-flex>
          </v-layout>
        </v-list-tile-title>
      </v-list-tile-content>
      <v-list-tile-content v-if="$vuetify.breakpoint.smAndDown">
        <v-list-tile-title v-html="group.title"/>
        <v-list-tile-sub-title>
          <v-layout row wrap>
            <v-flex xs3 class="text-xs-right"><v-icon v-html="punctuation"/>&nbsp;<v-icon>exposure</v-icon></v-flex>
            <v-flex xs3 class="text-xs-right">{{ group.poolCount }} <v-icon>photo</v-icon></v-flex>
            <v-flex xs3 class="text-xs-right">{{ group.members }} <v-icon>face</v-icon></v-flex>
            <v-flex xs3 class="grey--text text-xs-right">
              <span v-html="group.throttleText()"/>&nbsp;
              <strong>{{ group.throttleMode }}</strong>
            </v-flex>
          </v-layout>
        </v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-list-tile-action-text v-html="group.dateAdded"/>
        <v-btn
          :disabled="disabled"
          icon
          ripple
          flat
          @click.stop="share">
          <v-icon color="grey lighten-1">share</v-icon>
        </v-btn>
      </v-list-tile-action>
      <v-list-tile-action>
        <v-btn
          icon
          ripple
          flat
          @click.stop="$router.push({name: 'Group View', params: { groupId: group.groupId, title: group.title} })">
          <v-icon color="grey lighten-1">arrow_forward</v-icon>
        </v-btn>
      </v-list-tile-action>
      <!--  -->
    </v-list-tile>
    <v-divider v-if="!lastItem" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import groupsPayload from '@/mixins/groupsPayload'
import Group from '@/classes/Group'

export default {
  mixins: [groupsPayload],
  props: {
    group: {
      type: Group,
      required: true
    },
    lastItem: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      poolLength: 'pool/length'
    }),
    disabled() {
      return this.poolLength === 0
    },
    punctuation() {
      if (this.group.punctuation >= 25) return 'exposure_plus_2'
      if (this.group.punctuation >= 18) return 'exposure_plus_1'
      if (this.group.punctuation >= 7) return 'exposure_zero'
      if (this.group.punctuation > 0) return 'exposure_neg_1'

      return 'exposure_neg_2'
    }
  },
  methods: {
    share() {
      this.$emit('share', { payload: this.constructPayload([this.group]) })
    }
  }
}
</script>
<style lang="css">
.break {
  word-break: break-all;
}
</style>
