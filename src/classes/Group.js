import _upperCase from 'lodash/upperCase'
import Moment from 'moment'

Moment.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: '1s',
    ss: '%ds',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1mo',
    MM: '%dmo',
    y: '1yr',
    yy: '%dyr'
  }
})

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
    photos,
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
    this.photos = photos

    this.legend = _upperCase(title).substring(0, 1)
    this.selected = selected
    this.alreadyInGroup = alreadyInGroup
    this.link = `https://www.flickr.com/groups/${groupId}`
    this.dateAdded = this.getLastMoment()
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

  getLastMoment = () => {
    if (
      this.photos === undefined ||
      this.photos === null ||
      this.photos.length === 0 ||
      this.photos[0].rawDateAdded === undefined
    ) {
      return '-'
    } else {
      return Moment(this.photos[0].rawDateAdded).fromNow(true)
    }
  }
}
