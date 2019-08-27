export default {
  methods: {
    sanitize: tag => tag.toLowerCase().replace(/[^a-zA-Z0-9À-ÿ]/g, '')
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
    },
    ucFirst(text) {
      return text[0].toUpperCase() + text.substring(1)
    }
  }
}
