jest.dontMock('./solver')

const Entity = require('./solver').solve


describe('solver', function () {
  function pos(floor, room) {
    return { floor, room }
  }
  function path(str) {
    return str
      .replace(/\s+/g, '')
      .split(';')
      .map(i => pos(...i.split(',').map(i => +i)))
  }

  const house = [
    [100, 210, 200],
    [300, 0, 40],
    [91, 50, 20],
  ]


  it('is a function that returns path', () => {
    expect(typeof Entity).toBe('function')

    const path = Entity(house, pos(0, 0), pos(2, 0))
    expect(Array.isArray(path)).toBeTruthy()
    path.forEach(pos => {
      expect(pos).toHaveProperty('floor')
      expect(pos).toHaveProperty('room')
    })
  })

  it('can find path', () => {
    [{
      house: [[1, 1, 1]],
      liftStart: pos(0, 0),
      liftDestination: pos(0, 2),
      resultPath: path('0,1;0,2'),
    }, {
      house: [
        [1],
        [1],
        [1],
      ],
      liftStart: pos(0, 0),
      liftDestination: pos(2, 0),
      resultPath: path('1,0;2,0'),
    }, {
      house: [
        [1, 1],
        [1, 1],
      ],
      liftStart: pos(1, 1),
      liftDestination: pos(0, 0),
      resultPath: path('0,1;0,0'),
    }, {
      house: [
        [1, 1, 1],
        [0, 0, 1],
        [1, 1, 1],
      ],
      liftStart: pos(0, 0),
      liftDestination: pos(2, 0),
      resultPath: path('0,1;0,2;1,2;2,2;2,1;2,0'),
    }, {
      house: [
        [1, 1, 1],
        [0, 0, 0],
        [1, 1, 1],
      ],
      liftStart: pos(0, 0),
      liftDestination: pos(2, 0),
      resultPath: [],
    }, {
      /**
       * Current lift position: 0, 0 (value 91)
       * Input: Move lift to floor 2 flat 1 (value 210)
       * Expected lift movement:
       * [[0, 1], [0, 2], [1, 2], [2, 2], [2, 1]], total time 520 (=50+20+40+200+210)
       */
      house: [
        [100, 210, 200],
        [300, 0, 40],
        [91, 50, 20],
      ],
      liftStart: pos(0, 0),
      liftDestination: pos(2, 1),
      resultPath: path('0,1;0,2;1,2;2,2;2,1'),
    }].forEach(data => {
      expect(Entity(data.house, data.liftStart, data.liftDestination)).toEqual(data.resultPath)
    })
  })
})
