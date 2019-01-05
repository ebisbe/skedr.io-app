export default {
  filters: {
    parseNumber(value) {
      if (parseInt(value) < 1000) return value
      else {
        return parseInt(value / 1000) + 'K'
      }
    }
  }
}
