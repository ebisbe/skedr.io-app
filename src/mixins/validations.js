export default {
  data: function() {
    return {
      rules: {
        required: value => !!value || this.$i18n.t('validation.required'),
        email: value => {
          const pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/
          return pattern.test(value.toUpperCase()) || this.$i18n.t('validation.invalid_email')
        },
        lowerCaseLetters: value => /[a-z]+/.test(value) || this.$i18n.t('validation.message'),
        upperCaseLetters: value => /[A-Z]+/.test(value) || this.$i18n.t('validation.message'),
        numbers: value => /[0-9]+/.test(value) || this.$i18n.t('validation.message'),
        numeric: value => /^[0-9]+$/.test(value) || this.$i18n.t('validation.use_numbers'),
        specialCharacters: value =>
          /[!@#$%^&*()_+={}[\]\\;:.,|]+/.test(value) || this.$i18n.t('validation.message'),
        length: value => value.length >= 8 || this.$i18n.t('validation.message'),
        flickrId: value =>
          /[0-9]+@N[0-9]{2}/.test(value) || this.$i18n.t('validation.incorrect_flickr_id')
      }
    }
  }
}
