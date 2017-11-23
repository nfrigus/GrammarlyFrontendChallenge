import React from 'react'
import MatrixInput from './MatrixInput'
import { transpose } from '../lib/matrix'
import { solve } from '../solver'


export default class App extends React.Component {
  go = e => {
    e.preventDefault()

    const path = this.getLiftPath()

    if (path.error) {
      return alert(path.error)
    }

    console.table(path)

    this.setState({ liftPosition: path.pop() })
  }
  state = {
    liftPosition: {
      floor: 0,
      room: 0,
    },
    liftDestination: {
      floor: 0,
      room: 0,
    },
    times: this.props.times,
  }

  getTimes() {
    return this.refs.matrix.getRows()
  }
  getLiftPath() {
    const {
      liftPosition,
      liftDestination,
    } = this.state

    if (
      liftPosition.floor === liftDestination.floor
      &&
      liftPosition.room === liftDestination.room
    ) return { error: 'Already there!' }

    console.table(this.getTimes())

    const path = solve(
      this.getTimes(),
      liftPosition,
      liftDestination,
    )

    if (!path.length) return { error: 'Destination is unreachable!' }

    return path
  }

  onCellActive = (coords, rows) => this.setState({
    liftDestination: toggleFloorCoords(coords, rows),
    times: rows,
  })
  updateDestination(type, event) {
    const { liftDestination } = this.state
    liftDestination[type] = +event.target.value
    this.setState({ liftDestination })
  }

  render() {
    const {
      liftPosition,
      liftDestination,
      times,
    } = this.state

    return (
      <form onSubmit={this.go}>
        <table>
          <thead>
          <tr>
            <td></td>
            <td>Floor</td>
            <td>Room</td>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>Current position</td>
            <td>
              <Input
                readOnly
                value={liftPosition.floor}
              />
            </td>
            <td>
              <Input
                readOnly
                value={liftPosition.room}
              />
            </td>
          </tr>
          <tr>
            <td>
              Destination {" "}
              <button type="submit">Go</button>
            </td>
            <td>
              <Input
                value={liftDestination.floor}
                onChange={e => this.updateDestination('floor', e)}
              />
            </td>
            <td>
              <Input
                value={liftDestination.room}
                onChange={e => this.updateDestination('room', e)}
              />
            </td>
          </tr>
          </tbody>
        </table>
        <MatrixInput
          ref="matrix"
          columns={transpose(times)}
          liftPosition={toggleFloorCoords(liftPosition, times)}
          liftDestination={toggleFloorCoords(liftDestination, times)}
          onCellActive={this.onCellActive}
        />
      </form>
    )
  }
}

function Input(attr) {
  return <input
    style={{ width: '3em' }}
    type="number"
    min="0"
    max="99"
    {...attr}
  />
}

/**
 * Converts { floor: x, room: y } to [x, y] and vise versa
 * @param input
 */
function toggleFloorCoords(coords, matrix) {
  const h = matrix.length - 1
  if (Array.isArray(coords)) {
    const [x, y] = coords
    return {
      floor: h - y,
      room: x,
    }
  } else {
    return [coords.room, h - coords.floor]
  }
}
