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
  constructor(group) {
    const defaultProps = { title: '', selected: false, alreadyInGroup: false }
    Object.assign(this, defaultProps, group)

    const result = /([A-Z])/gi.exec(this.decodeHtmlEntity(this.title))
    this.legend = result ? result[0].toUpperCase() : 'A'
    this.link = `https://www.flickr.com/groups/${this.groupId}`
    this.dateAdded = this.getLastMoment()
    this.membersPunc = this.membersLadder()
    this.timePunc = this.timeLadder()
    this.punctuation = this.membersPunc + this.timePunc
  }

  search = word => {
    switch (word) {
      case ':+2':
        return this.punctuation >= 25
      case ':+1':
        return this.punctuation >= 18 && this.punctuation < 25
      case ':0':
        return this.punctuation >= 7 && this.punctuation < 18
      case ':-1':
        return this.punctuation > 0 && this.punctuation < 7
      case ':-2':
        return this.punctuation <= 0
    }

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
    if (this.members <= 500) return 1
    if (this.members <= 1000) return 2
    if (this.members <= 2000) return 4
    if (this.members <= 5000) return 6
    if (this.members <= 10000) return 10
    if (this.members <= 50000) return 12

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
    if (diff <= 30 * 24 * 216001) return -5
    if (diff <= 45 * 24 * 216001) return -10

    return -15
  }
}
