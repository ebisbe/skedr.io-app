import throttleText from '../throttleText'
describe('Mixin throttle text', () => {
  it('there is no data -> return empty', () => {
    const group = {}
    const response = throttleText.methods.throttleText(group)
    expect(response).toBe('')
  })
  it('is member -> 5/10 day', () => {
    const group = {
      isMember: 1,
      throttleMode: 'day',
      throttleCount: 10,
      throttleRemaining: 5
    }
    const response = throttleText.methods.throttleText(group)
    expect(response).toBe('5/10&nbsp;<strong>day</strong>')
  })
  it('is member -> -- disabled', () => {
    const group = {
      isMember: 1,
      throttleMode: 'disabled',
      throttleCount: 0,
      throttleRemaining: 0
    }
    const response = throttleText.methods.throttleText(group)
    expect(response).toBe('&mdash;&nbsp;<strong>disabled</strong>')
  })
  it('is member -> No limit', () => {
    const group = {
      isMember: 1,
      throttleMode: 'none',
      throttleCount: null,
      throttleRemaining: null
    }
    const response = throttleText.methods.throttleText(group)
    expect(response).toBe('∞&nbsp;<strong>No limit</strong>')
  })
  it('is not member -> 10 day', () => {
    const group = {
      isMember: 0,
      throttleCount: 10,
      throttleMode: 'day',
      throttleRemaining: null
    }
    const response = throttleText.methods.throttleText(group)
    expect(response).toBe('10&nbsp;<strong>day</strong>')
  })
  it('is not member -> -- disabled', () => {
    const group = {
      isMember: 0,
      throttleMode: 'disabled',
      throttleCount: 0,
      throttleRemaining: 0
    }
    const response = throttleText.methods.throttleText(group)
    expect(response).toBe('&mdash;&nbsp;<strong>disabled</strong>')
  })
  it('is not member -> No limit', () => {
    const group = {
      isMember: 0,
      throttleMode: 'none',
      throttleCount: null,
      throttleRemaining: null
    }
    const response = throttleText.methods.throttleText(group)
    expect(response).toBe('∞&nbsp;<strong>No limit</strong>')
  })
})
