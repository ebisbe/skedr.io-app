export default {
  methods: {
    throttleText({ throttleMode, throttleCount, throttleRemaining, isMember = true }) {
      var text = ''
      var mode = ''
      if (throttleRemaining === null && throttleCount === null) {
        text = '∞'
        mode = 'No limit'
      } else if (throttleCount === 0) {
        text = '&mdash;'
        mode = throttleMode
      } else {
        if (isMember) {
          text = `${throttleRemaining}/${throttleCount}`
          mode = throttleMode
        } else if (throttleCount !== null) {
          text = throttleCount
          mode = throttleMode
        }
      }
      return `${text}&nbsp;<strong>${mode}</strong>`
    }
  }
}
