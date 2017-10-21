
const DEFAULT_STATE = {
  currency: 'USD',
  projection: {
    type: 'month',
    count: 6
  }
}

const settings = (state = DEFAULT_STATE, action) => {
  return state
}

export default settings
