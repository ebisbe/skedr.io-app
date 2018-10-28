import Group from '@/classes/Group'

describe('Group.js', () => {
  let object
  beforeEach(() => {
    object = { title: 'group', groupId: '123456@N00', members: 1230000, poolCount: 1234, icon: 'www.flickr.com' }
  })

  it('has default values', () => {
    const group = new Group(object)

    expect(group.title).toBe('group')
    expect(group.selected).toBe(false)
    expect(group.alreadyInGroup).toBe(false)
    expect(group.members).toBe(1230000)
    expect(group.poolCount).toBe(1234)
    expect(group.link).toBe('https://www.flickr.com/groups/123456@N00')
    expect(group.icon).toBe('www.flickr.com')
    expect(group.dateAdded).toBe('-')
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

  describe('Calculates Group value', () => {
    it('calculates members', () => {
      expect(new Group({}).membersLadder()).toBe(0)
      expect(new Group({ members: 500 }).membersLadder()).toBe(1)
      expect(new Group({ members: 1000 }).membersLadder()).toBe(2)
      expect(new Group({ members: 2000 }).membersLadder()).toBe(4)
      expect(new Group({ members: 5000 }).membersLadder()).toBe(6)
      expect(new Group({ members: 10000 }).membersLadder()).toBe(10)
      expect(new Group({ members: 50000 }).membersLadder()).toBe(12)
      expect(new Group({ members: 50001 }).membersLadder()).toBe(15)
    })

    it('calculates lastTime photo', () => {
      expect(new Group({ throttleMode: 'disabled' }).timeLadder()).toBe(-30)
      expect(new Group({ photos: [{ rawDateAdded: Date.now() - 6 * 216000 }] }).timeLadder()).toBe(15)
      expect(new Group({ photos: [{ rawDateAdded: Date.now() - 24 * 216000 }] }).timeLadder()).toBe(10)
      expect(new Group({ photos: [{ rawDateAdded: Date.now() - 3 * 24 * 216000 }] }).timeLadder()).toBe(6)
      expect(new Group({ photos: [{ rawDateAdded: Date.now() - 14 * 24 * 216000 }] }).timeLadder()).toBe(4)
      expect(new Group({ photos: [{ rawDateAdded: Date.now() - 14 * 24 * 216002 }] }).timeLadder()).toBe(-5)
      expect(new Group({ photos: [{ rawDateAdded: Date.now() - 30 * 24 * 216002 }] }).timeLadder()).toBe(-10)
      expect(new Group({ photos: [{ rawDateAdded: Date.now() - 45 * 24 * 216002 }] }).timeLadder()).toBe(-15)
    })

    it('calculates final punctuation', () => {
      expect(new Group({ members: 50001, photos: [{ rawDateAdded: Date.now() - 6 * 216000 }] }).punctuation).toBe(30)
    })
  })
})
