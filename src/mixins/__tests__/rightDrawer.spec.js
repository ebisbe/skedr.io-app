import mixins from '../rightDrawer'

describe('Mixins - Right drawer', () => {
  it('gets the computed value', () => {
    mixins.computed.rightDrawer['$store'] = { state: { rightDrawer: false } }
    expect(mixins.computed.rightDrawer.get()).toBe(false)
  })
  it('dispatches and event in the store', () => {
    const dispatch = jest.fn()
    mixins.computed.rightDrawer['$store'] = { dispatch }
    mixins.computed.rightDrawer.set(true)
    expect(dispatch).toHaveBeenCalledWith('updateRightDrawer', true)
  })
})
