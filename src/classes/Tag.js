export default class Tag {
  constructor(name, count = 0, total = 0, selected = false) {
    this.name = name
    // add backwards compatibility
    this.value = name
    this.count = count
    this.total = total
    this.selected = selected
  }

  percentage = () => {
    if (this.total === 0) return 0
    return Math.round((this.count / this.total) * 100)
  }

  add = () => {
    this.count += 1
  }
}
