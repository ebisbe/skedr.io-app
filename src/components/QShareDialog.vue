<template>
  <q-popup
    :data="groups"
    :toolbar-title="title"
    :loading="$apolloData.loading === 1"
    :dialog="dialog"
    list-title="Groups"
    no-data-text="No groups"
    filter-placeholder="Filter groups"
    @close="clearSharedPool">
    <q-share-dialog-list
      slot="list"
      slot-scope="props"
      :group="props.item"
      :key="props.item.groupId"/>
    <q-push
      slot="save"
      slot-scope="props"
      :requests="constructPayload(props.selectedData)"
      style="margin-bottom: 56px"
      @loaded="clearSharedPool"
    />
  </q-popup>
</template>

<script>
import QPopup from './QPopup'
import QPush from './QPush'
import QShareDialogList from './QShareDialogList'
import { mapState, mapGetters, mapActions } from 'vuex'
import groupsPayload from '../mixins/groupsPayload'
import GROUPS_QUERY from '../graphql/groups.gql'
import _sortBy from 'lodash/sortBy'

export default {
  name: 'ShareDialog',
  components: { QPopup, QPush, QShareDialogList },
  mixins: [groupsPayload],
  data() {
    return {
      groups: []
    }
  },
  computed: {
    ...mapGetters(['userId']),
    ...mapGetters({
      dialog: 'sharedPool/hasItems'
    }),
    ...mapState('sharedPool', {
      pool: state => state.photos,
      selectedGroups: state => state.blockedGroups
    }),
    title() {
      if (this.pool.length === 1) {
        return `Sharing '${this.pool[0].title}'`
      }
      return `Sharing Pool (${this.pool.length} elements)`
    }
  },
  watch: {
    pool(data) {
      if (data.length > 0) {
        this.groups.forEach(group => {
          if (this.selectedGroups.indexOf(group.title) !== -1) {
            group.alreadyInGroup = true
          }
        })
      }
    }
  },
  apollo: {
    groups: {
      query: GROUPS_QUERY,
      skip() {
        return !this.dialog
      },
      variables() {
        return {
          userId: this.userId
        }
      },
      update: data =>
        _sortBy(
          data.userGroups.map(group =>
            Object.assign(
              {
                selected: false,
                alreadyInGroup: false
              },
              group
            )
          ),
          ['title']
        ),
      fetchPolicy: 'cache-and-network'
    }
  },
  mounted() {
    this.saveImages = false
    // const groups = localStorage.getObject('groups')
    // if (groups !== null) {
    //   this.groups = groups
    // }
  },
  /* created() {
    document.addEventListener('keyup', this.cancel)
  },
  destroyed() {
    document.removeEventListener('keyup', this.cancel)
  },*/
  methods: {
    ...mapActions({
      clearSharedPool: 'sharedPool/clear'
    }),
    cancel(event) {
      if (event.keyCode === 27 || event.key === 'Escape') {
        this.clearSharedPool()
      }
    }
  }
}
</script>
