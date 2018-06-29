import _upperCase from 'lodash/upperCase'

export default class Group {
  constructor({
    title = '',
    groupId,
    members,
    icon,
    poolCount,
    throttleRemaining,
    throttleCount,
    throttleMode,
    selected = false,
    alreadyInGroup = false
  }) {
    this.title = title
    this.groupId = groupId
    this.members = members
    this.icon = icon
    this.poolCount = poolCount
    this.throttleRemaining = throttleRemaining
    this.throttleCount = throttleCount
    this.throttleMode = throttleMode

    this.legend = _upperCase(title).substring(0, 1)
    this.selected = selected
    this.alreadyInGroup = alreadyInGroup
    this.link = `https://www.flickr.com/groups/${groupId}`
  }

  search = word => {
    const lowerWord = word.toLowerCase()
    return this.title.toLowerCase().search(lowerWord) >= 0 || this.groupId.toLowerCase().search(lowerWord) >= 0
  }

  throttleText = () => {
    if (this.throttleRemaining === undefined) {
      return '∞'
    }
    if (this.throttleCount === 0) {
      return '&mdash;'
    }
    return this.throttleRemaining + '/' + this.throttleCount
  }

  isDisabled = () => {
    return this.throttleMode === 'disabled' || this.alreadyInGroup === true
  }

  select = () => {
    if (!this.isDisabled()) this.selected = !this.selected
  }
}
