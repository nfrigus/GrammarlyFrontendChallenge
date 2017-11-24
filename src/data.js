import storage from './lib/localStorage'


const sampleTimes = [
  [100, 210, 200],
  [300, 0, 40],
  [91, 50, 20],
]

export const times = window.times || storage.get('times') || sampleTimes
