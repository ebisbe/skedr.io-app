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
    <q-push-photos
      slot="save"
      slot-scope="props"
      :pool="pool"
      :groups="props.selectedData"
      @loaded="dialog = false"
    />
  </q-popup>
</template>

<script>
import QPopup from './QPopup'
import QPushPhotos from './QPushPhotos'
import QShareDialogList from './QShareDialogList'
import { mapGetters } from 'vuex'

export default {
  name: 'ShareDialog',
  components: { QPopup, QPushPhotos, QShareDialogList },
  props: {
    pool: {
      type: Array,
      required: true
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
      }
    }
  },
  mounted() {
    this.saveImages = false
    const groups = localStorage.getObject('groups')
    if (groups !== null) {
      this.groups = groups
    }
  },
  created() {
    // document.addEventListener('keyup', this.cancel)
  },
  destroyed() {
    // document.removeEventListener('keyup', this.cancel)
  },
  methods: {
    cancel(event) {
      if (event.keyCode === 27 || event.key === 'Escape') {
        this.dialog = false
      }
    }
  }
}
</script>
