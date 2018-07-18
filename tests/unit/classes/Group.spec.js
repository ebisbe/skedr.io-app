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
    expect(group.legend).toBe('G')
    expect(group.members).toBe(1230000)
    expect(group.poolCount).toBe(1234)
    expect(group.link).toBe('https://www.flickr.com/groups/123456@N00')
    expect(group.icon).toBe('www.flickr.com')
    expect(group.dateAdded).toBe('-')
  })

  describe('search options and filters', () => {
    it('has search()', () => {
      const group = new Group(object)

      expect(group.search('')).toBe(true)
      expect(group.search('a')).toBe(true)
      expect(group.search('ab')).toBe(true)
      expect(group.search('gro')).toBe(true)
      expect(group.search('@N00')).toBe(true)
    })

    it('search :-2', () => {
      object.throttleMode = 'disabled'
      const group = new Group(object)

      expect(group.search(':-2')).toBe(true)
      expect(group.search(':-1')).toBe(false)
      expect(group.search(':0')).toBe(false)
      expect(group.search(':+1')).toBe(false)
      expect(group.search(':+2')).toBe(false)
    })

    it('search :-1', () => {
      object.members = 1001
      const group = new Group(object)

      expect(group.search(':-2')).toBe(false)
      expect(group.search(':-1')).toBe(true)
      expect(group.search(':0')).toBe(false)
      expect(group.search(':+1')).toBe(false)
      expect(group.search(':+2')).toBe(false)
    })

    it('search :0', () => {
      const group = new Group(object)

      expect(group.search(':-2')).toBe(false)
      expect(group.search(':-1')).toBe(false)
      expect(group.search(':0')).toBe(true)
      expect(group.search(':+1')).toBe(false)
      expect(group.search(':+2')).toBe(false)
    })

    it('search :+1', () => {
      object.members = 10000
      object.photos = [{ rawDateAdded: Date.now() - 24 * 216000 }]
      const group = new Group(object)

      expect(group.search(':-2')).toBe(false)
      expect(group.search(':-1')).toBe(false)
      expect(group.search(':0')).toBe(false)
      expect(group.search(':+1')).toBe(true)
      expect(group.search(':+2')).toBe(false)
    })

    it('search :+2', () => {
      object.members = 100000
      object.photos = [{ rawDateAdded: Date.now() - 24 * 216000 }]
      const group = new Group(object)

      expect(group.search(':-2')).toBe(false)
      expect(group.search(':-1')).toBe(false)
      expect(group.search(':0')).toBe(false)
      expect(group.search(':+1')).toBe(false)
      expect(group.search(':+2')).toBe(true)
    })
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

  describe('Defines values in legend', () => {
    it('legend has a letter', () => {
      expect(new Group({ title: 'a' }).legend).toBe('A')
      expect(new Group({ title: 'b' }).legend).toBe('B')
      expect(new Group({ title: 'c' }).legend).toBe('C')
      expect(new Group({ title: 'd' }).legend).toBe('D')
      expect(new Group({ title: 'e' }).legend).toBe('E')
      expect(new Group({ title: 'f' }).legend).toBe('F')
      expect(new Group({ title: 'g' }).legend).toBe('G')
      expect(new Group({ title: 'h' }).legend).toBe('H')
      expect(new Group({ title: 'i' }).legend).toBe('I')
      expect(new Group({ title: 'j' }).legend).toBe('J')
      expect(new Group({ title: 'k' }).legend).toBe('K')
      expect(new Group({ title: 'l' }).legend).toBe('L')
      expect(new Group({ title: 'm' }).legend).toBe('M')
      expect(new Group({ title: 'n' }).legend).toBe('N')
      expect(new Group({ title: 'o' }).legend).toBe('O')
      expect(new Group({ title: 'p' }).legend).toBe('P')
      expect(new Group({ title: 'q' }).legend).toBe('Q')
      expect(new Group({ title: 'r' }).legend).toBe('R')
      expect(new Group({ title: 's' }).legend).toBe('S')
      expect(new Group({ title: 't' }).legend).toBe('T')
      expect(new Group({ title: 'u' }).legend).toBe('U')
      expect(new Group({ title: 'v' }).legend).toBe('V')
      expect(new Group({ title: 'w' }).legend).toBe('W')
      expect(new Group({ title: 'x' }).legend).toBe('X')
      expect(new Group({ title: 'y' }).legend).toBe('Y')
      expect(new Group({ title: 'z' }).legend).toBe('Z')
    })

    it('other starting parameters are ignored', () => {
      expect(new Group({ title: '!a' }).legend).toBe('A')
      expect(new Group({ title: '4a' }).legend).toBe('A')
      expect(new Group({ title: ':' }).legend).toBe('A')
      expect(new Group({ title: 'Ó' }).legend).toBe('A')
      expect(new Group({ title: '&quot;Black' }).legend).toBe('B')
    })
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
