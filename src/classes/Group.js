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

    const result = /([A-Z])/gi.exec(this.decodeHtmlEntity(title))
    this.legend = result ? result[0].toUpperCase() : 'A'
    this.selected = selected
    this.alreadyInGroup = alreadyInGroup
    this.link = `https://www.flickr.com/groups/${groupId}`
    this.dateAdded = this.getLastMoment()
    this.membersPunc = this.membersLadder()
    this.timePunc = this.timeLadder()
    this.punctuation = this.membersPunc + this.timePunc
  }

  search = word => {
    if (word.length < 3) return true
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
      const date = Moment(this.photos[0].rawDateAdded)
      return date.fromNow(true)
    }
  }

  decodeHtmlEntity = encodedStr => {
    var parser = new DOMParser()
    var dom = parser.parseFromString('<!doctype html><body>' + encodedStr, 'text/html')
    return dom.body.textContent
  }

  membersLadder = () => {
    if (this.members === undefined) return 0
    if (this.members <= 500) return 0
    if (this.members <= 1000) return 1
    if (this.members <= 2000) return 2
    if (this.members <= 5000) return 4
    if (this.members <= 10000) return 6
    if (this.members <= 50000) return 10

    return 15
  }

  timeLadder = () => {
    if (this.throttleMode == 'disabled') return -30
    if (this.dateAdded === '-') return 0
    const diff = Moment().diff(Moment(this.photos[0].rawDateAdded))
    if (diff <= 6 * 216001) return 15
    if (diff <= 24 * 216001) return 10
    if (diff <= 3 * 24 * 216001) return 6
    if (diff <= 14 * 24 * 216001) return 4

    return 0
  }
}
