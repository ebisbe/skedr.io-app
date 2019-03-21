export default {
  methods: {
    sanitize: tag => tag.toLowerCase().replace(/[\W_]/g, '')
  },
  filters: {
    parseNumber(value) {
      const int = parseInt(value)
      if (int < 1000) return value
      else if (int > 999999) {
        return parseInt(int / 1000000) + 'M'
      } else {
        return parseInt(int / 1000) + 'K'
      }
    }
    // sanitize(tag) {
    //   return this.sanitize(tag)
    // }
  }
}
