export const expansionPanel = {
  data () {
    return {
      preventHidden: false
    }
  },
  watch: {
    groupFilter: function (filter) {
      localStorage.setItem('groupFilter', filter)
    }
  },
  created () {
    this.groupFilter = localStorage.getItem('groupFilter')
  },
  methods: {
    fetchGroupPhotos (group) {
      if (!group.hasOwnProperty('photos')) {
        this.axios.get('/groups/pool/' + group.nsid)
          .then((response) => {
            this.$set(group, 'photos', response.data.photo)
          })
      }
    },
    mouseOver (group) {
      group.avatarHidden = true
    },
    mouseLeave (group) {
      if (!group.checked && !this.preventHidden) {
        group.avatarHidden = false
      }
    },
    checkBoxClick (group) {
      group.checked = !group.checked
      if (group.checked) {
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
          group.avatarHidden = true
        }
      }
    },
    hide (group) {
      return group.name.toLowerCase().search(this.groupFilter) >= 0
    },
    throttle (throttle) {
      if (throttle.remaining === undefined) {
        return '∞'
      }
      if (throttle.count === 0) {
        return '&mdash;'
      }
      return throttle.remaining + '/' + throttle.count
    }
  }
}
