export const Auth = {
  signIn(email, password) {
    return Promise.resolve({ user: `User-${email}`, password })
  },
  verifiedContact(user) {
    return Promise.resolve({ verified: { email: `Verified-${user.user}` } })
  }
}

export const JS = {
  isEmpty() {
    return false
  }
}
