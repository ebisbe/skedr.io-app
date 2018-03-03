<template>
  <q-popup
    :data="groups"
    :toolbar-title="title"
    list-title="Groups"
    no-data-text="No groups"
    filter-placeholder="Filter groups"
    :dialog="dialog"
    @close="dialog = false">
    <q-share-dialog-list
      slot="list"
      slot-scope="props"
      :key="props.item.groupId"
      :group="props.item"/>
    <q-push
      slot="save"
      slot-scope="props"
      :requests="constructPayload(props.selectedData)"
      @loaded="dialog = false"
    />
  </q-popup>
</template>

<script>
import QPopup from './QPopup'
import QPush from './QPush'
import QShareDialogList from './QShareDialogList'
import { mapGetters } from 'vuex'
import groupsPayload from '../mixins/groupsPayload'
import GROUPS_QUERY from '../graphql/groups.gql'
import _sortBy from 'lodash/sortby'

export default {
  name: 'ShareDialog',
  components: { QPopup, QPush, QShareDialogList },
  mixins: [groupsPayload],
  props: {
    pool: {
      type: Array,
      required: true
    },
    selectedGroups: {
      type: Array,
      required: false,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      groups: [],
      dialog: false
    }
  },
  computed: {
    ...mapGetters(['userId']),
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
        this.dialog = true
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
      variables() {
        return {
          userId: this.userId
        }
      },
      update: data =>
        _sortBy(
          data.userGroups.map(group =>
            Object.assign({ expanded: false, selected: false, alreadyInGroup: false }, group)
          ),
          ['title']
        ),
      fetchPolicy: 'cache-and-network',
      loadingKey: 'loading'
    }
  },
  mounted() {
    this.saveImages = false
    const groups = localStorage.getObject('groups')
    if (groups !== null) {
      this.groups = groups
    }
  },
  /* created() {
    document.addEventListener('keyup', this.cancel)
  },
  destroyed() {
    document.removeEventListener('keyup', this.cancel)
  },*/
  methods: {
    cancel(event) {
      if (event.keyCode === 27 || event.key === 'Escape') {
        this.dialog = false
      }
    }
  }
}
</script>
