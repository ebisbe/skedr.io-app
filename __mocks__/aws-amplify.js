export const Auth = {
  error: true,
  signIn(email, password) {
    return Promise.resolve({ user: `User-${email}`, password })
  },
  verifiedContact(user) {
    return Promise.resolve({ verified: { email: `Verified-${user.user}` } })
  },
  currentAuthenticatedUser() {
    if (this.error) throw new Error('Not authenticated')
    else return Promise.resolve({ user: 'enric' })
  },
  currentCredentials() {
    return Promise.resolve({ indentityId: '12345' })
  }
}

export const JS = {
  isEmpty() {
    return false
  }
}
