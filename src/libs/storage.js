Storage.prototype.setObject = function (key, value) {
  this.setItem(key, JSON.stringify(value))
}

Storage.prototype.getObject = function (key) {
  let value = this.getItem(key)
  return value && JSON.parse(value)
}

Storage.prototype.getItemDef = function (key, def) {
  return this.getItem(key) ? this.getItem(key) : def
}
