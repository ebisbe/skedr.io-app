import Tag from '@/classes/Tag'

describe('Tag.js', () => {
  it('has default values', () => {
    const tag = new Tag('name')
    expect(tag.name).toBe('name')
    expect(tag.value).toBe('name')
    expect(tag.selected).toBe(false)
    expect(tag.total).toBe(0)
    expect(tag.count).toBe(0)
    expect(tag.percentage()).toBe(0)
  })

  it('returns 100% percentage', () => {
    const tag = new Tag('name', 1, 1)
    expect(tag.percentage()).toBe(100)
  })

  it('returns 33% percentage', () => {
    const tag = new Tag('name', 1, 3)
    expect(tag.percentage()).toBe(33)
  })
})
