export const validations = {
  data: () => {
    const message =
      'Use at least 8 characters. Include both lower and upper case letters, a number and a special character.'

    return {
      rules: {
        required: value => !!value || 'Required.',
        email: value => {
          const pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/
          return pattern.test(value.toUpperCase()) || 'Invalid e-mail.'
        },
        lowerCaseLetters: value => {
          return /[a-z]+/.test(value) || message
        },
        upperCaseLetters: value => {
          return /[A-Z]+/.test(value) || message
        },
        numbers: value => {
          return /[0-9]+/.test(value) || message
        },
        numeric: value => {
          return /^[0-9]+$/.test(value) || 'Use only numbers.'
        },
        specialCharacters: value => {
          return /[!@#$%^&*()_+={}[\]\\;:.,|]+/.test(value) || message
        },
        length: value => {
          return value.length >= 8 || message
        }
      }
    }
  }
}
