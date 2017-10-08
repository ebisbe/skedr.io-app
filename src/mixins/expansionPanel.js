export const expansionPanel = {
  data () {
    return {
      preventHidden: false,
      filter: ''
    }
  },
  watch: {
    filter: function (filter) {
      localStorage.setItem('groupFilter', filter)
      this.filterGroups()
    }
  },
  created () {
    this.filter = localStorage.getItem('groupFilter')
  },
  methods: {
    fetchGroupData () {
      this.axios.get('/groups')
        .then((response) => {
          response.data.forEach(function (group) {
            group.avatarHidden = false
            group.checked = false
            group.hidden = false
          })
          this.$store.state.groups = response.data
          this.filterGroups()
        })
    },
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
    filterGroups () {
      this.$store.state.groups.forEach((group) => {
        group.hidden = !(group.name.toLowerCase().search(this.filter.toLowerCase()) >= 0)
      })
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
