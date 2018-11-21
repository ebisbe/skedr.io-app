<template>
  <q-popup
    :data="userGroups.groups"
    :toolbar-title="title"
    :loading="$apolloData.loading === 1"
    :dialog="dialog"
    list-title="Groups"
    no-data-text="No groups"
    filter-placeholder="Filter groups"
    @close="clearSharedPool">
    <share-dialog-list
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
import QPopup from '../ui/QPopup'
import QPush from '../ui/QPush'
import ShareDialogList from './ShareDialogList'
import { mapState, mapGetters, mapActions } from 'vuex'
import { groupsPayload } from '@/mixins'
import GROUPS_QUERY from '@/graphql/groups.gql'
import _sortBy from 'lodash/sortBy'
import Group from '@/classes/Group'

export default {
  components: { QPopup, QPush, ShareDialogList },
  mixins: [groupsPayload],
  data() {
    return {
      userGroups: { groups: [] }
    }
  },
  computed: {
    ...mapGetters({
      dialog: 'sharedPool/hasItems'
    }),
    ...mapState('sharedPool', {
      pool: state => state.photos,
      selectedGroups: state => state.selectedGroups
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
        this.setAlreadyInGroup()
      }
    },
    groups() {
      this.setAlreadyInGroup()
    }
  },
  apollo: {
    userGroups: {
      query: GROUPS_QUERY,
      skip() {
        return !this.dialog
      },
      variables() {
        return {
          page: 1,
          perPage: 200
        }
      },
      update: data => _sortBy(data.userGroups.groups.map(group => new Group(group)), ['legend'])
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
    },
    setAlreadyInGroup() {
      this.userGroups.groups.forEach(group => {
        if (this.selectedGroups.indexOf(group.name) !== -1) {
          group.alreadyInGroup = true
        }
      })
    }
  }
}
</script>
