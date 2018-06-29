import Group from '@/classes/Group'

describe('Group.js', () => {
  let object
  beforeEach(() => {
    object = { title: 'group', groupId: '123456@N00', members: 123, poolCount: 1234, icon: 'www.flickr.com' }
  })

  it('has default values', () => {
    const group = new Group(object)

    expect(group.title).toBe('group')
    expect(group.selected).toBe(false)
    expect(group.alreadyInGroup).toBe(false)
    expect(group.legend).toBe('G')
    expect(group.members).toBe(123)
    expect(group.poolCount).toBe(1234)
    expect(group.link).toBe('https://www.flickr.com/groups/123456@N00')
    expect(group.icon).toBe('www.flickr.com')
    expect(group.dateAdded).toBe('-')
  })

  it('has search()', () => {
    const group = new Group(object)

    expect(group.search('gro')).toBe(true)
    expect(group.search('@N00')).toBe(true)
  })

  it('has throttleText() with "∞"', () => {
    const object = { throttleRemaining: undefined }
    const group = new Group(object)

    expect(group.throttleText()).toBe('∞')
  })

  it("has throttleText() with '&mdash;'", () => {
    const object = { throttleRemaining: 1, throttleCount: 0 }
    const group = new Group(object)

    expect(group.throttleText()).toBe('&mdash;')
  })

  it("has throttleText() with '1/2'", () => {
    const object = { throttleRemaining: 1, throttleCount: 2 }
    const group = new Group(object)

    expect(group.throttleText()).toBe('1/2')
  })

  it('has isDisabled() with true when throttleMode ', () => {
    const object = { throttleMode: 'disabled' }
    const group = new Group(object)

    expect(group.isDisabled()).toBe(true)
  })

  it('has isDisabled() with true when is alreadyInGroup', () => {
    const object = { alreadyInGroup: true }
    const group = new Group(object)

    expect(group.isDisabled()).toBe(true)
  })

  it('can be selected() if not disabled', () => {
    const group = new Group({})

    expect(group.selected).toBe(false)
    group.select()
    expect(group.selected).toBe(true)
    group.select()
    expect(group.selected).toBe(false)
  })

  it("can't be selected if disabled", () => {
    const object = { alreadyInGroup: true }
    const group = new Group(object)

    expect(group.selected).toBe(false)
    group.select()
    expect(group.selected).toBe(false)
  })

  it('last photo added was 1s ago', () => {
    const object = { photos: [{ rawDateAdded: Date.now() }] }
    const group = new Group(object)

    expect(group.dateAdded).toBe('1s')
  })
})
