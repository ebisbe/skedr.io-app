import { filters } from '@/mixins'

describe('Filters.js', () => {
  it('sanitizes the text', () => {
    expect(filters.methods.sanitize('ABC$#@% 123_-')).toBe('abc123')
  })
  it('parses a < 1000 number', () => {
    expect(filters.filters.parseNumber(999)).toBe(999)
  })
  it('parses a > 1M ', () => {
    expect(filters.filters.parseNumber(1000000)).toBe('1M')
  })
  it('parsers another number', () => {
    expect(filters.filters.parseNumber(1000)).toBe('1K')
  })
  it('ucFirst a word', () => {
    expect(filters.filters.ucFirst('hola')).toBe('Hola')
  })
})
