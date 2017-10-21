<template>
    <div>
        <v-layout align-center row spacer @click="fetchGroupPhotos()" v-show="hide">
            <v-flex xs3 sm2 md1 @click.stop="" @mouseover="mouseOver()" @mouseleave="mouseLeave()">
                <v-avatar size="40px" slot="activator" :class="{hidden: avatarHidden}">
                    <img :src="urlGroup(group)" :alt="group.name">
                </v-avatar>
                <v-checkbox v-model="checked" hide-details @click="checkBoxClick()"
                            :class="{hidden: !avatarHidden, 'pa-1':true}"></v-checkbox>
            </v-flex>
            <v-flex no-wrap ellipsis>
                <strong>{{ group.name }}</strong>
            </v-flex>
            <v-flex md2 text-sm-right hidden-xs-only>
                {{ group.pool_count }}
                <v-icon>photo</v-icon>
            </v-flex>
            <v-flex md2 text-sm-right hidden-xs-only>
                {{ group.members }}
                <v-icon>face</v-icon>
            </v-flex>
            <v-flex xs4 sm2 class="grey--text" text-xs-right>
                <span v-html="throttleText"></span>
                <strong>{{ group.throttle.mode }}</strong>
            </v-flex>
        </v-layout>
    </div>
</template>
<script>
  import { url } from '../mixins/urlPhoto'

  export default {
    name: 'ExpansionPanel',
    mixins: [url],
    props: {
      group: {required: true}
    },
    data () {
      return {
        preventHidden: false,
        avatarHidden: false,
        checked: false
      }
    },
    computed: {
      throttleText () {
        if (this.group.throttle.remaining === undefined) {
          return '∞'
        }
        if (this.group.throttle.count === 0) {
          return '&mdash;'
        }
        return this.group.throttle.remaining + '/' + this.group.throttle.count
      },
      hide () {
        return this.group.name.toLowerCase().search(this.$store.state.groupFilter) >= 0
      }
    },
    methods: {
      mouseOver () {
        this.avatarHidden = true
      },
      mouseLeave () {
        if (!this.checked && !this.preventHidden) {
          this.avatarHidden = false
        }
      },
      checkBoxClick () {
        this.checked = !this.checked
        if (this.checked) {
          this.$store.state.selectedGroups++
          this.preventHidden = true
          this.$store.state.groups.forEach(function (group) {
            group.avatarHidden = true
          })
        } else {
          this.$store.state.selectedGroups--
          if (this.$store.state.selectedGroups === 0) {
            this.preventHidden = false
            this.$store.state.groups.forEach(function (group) {
              group.avatarHidden = false
            })
            this.avatarHidden = true
          }
        }
      },
      fetchGroupPhotos () {
        if (!this.group.hasOwnProperty('photos')) {
          this.axios.get('/groups/pool/' + this.group.nsid)
            .then((response) => {
              this.$set(this.group, 'photos', response.data.photo)
            })
        }
      }
    }
  }
</script>