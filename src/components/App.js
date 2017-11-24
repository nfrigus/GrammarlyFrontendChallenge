import React from 'react'
import 'ion-sound'
import MatrixInput from './MatrixInput'
import { solve } from '../solver'
import storage from '../lib/localStorage'


const { sound } = window.ion

export default class App extends React.Component {
  go = e => {
    e.preventDefault()
    if (this.state.path.length) return;

    const path = this.getLiftPath()

    if (path.error) {
      return alert(path.error)
    }

    this.setState({ path }, () => this.move())
  }
  move() {
    const {
      path,
      times,
      speed,
      mute,
    } = this.state

    if (!path.length) return

    const liftPosition = path.shift()
    const [x, y] = toggleFloorCoords(liftPosition, times)
    const delay = times[y][x] * speed

    setTimeout(() => this.move(), delay)
    this.setState({
      liftPosition,
      path,
    }, () => mute || sound.play('bing'))
  }
  state = {
    liftDestination: {
      floor: 0,
      room: 0,
    },
    liftPosition: {
      floor: 0,
      room: 0,
    },
    mute: false,
    path: [],
    speed: 5,
    times: this.props.times,
  }

  componentDidMount() {
    sound({
      multiplay: true,
      path: "/",
      preload: true,
      sounds: [{ name: "bing" }],
    })
  }

  getTimes() {
    return this.refs.matrix.getRows().map(row => row.map(cell => +cell))
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

    const path = solve(
      this.getTimes(),
      liftPosition,
      liftDestination,
    )

    if (!path.length) return { error: 'Destination is unreachable!' }

    return path
  }

  onCellActive = (coords, rows) => {
    storage.set('times', rows)
    this.setState({
      liftDestination: toggleFloorCoords(coords, rows),
      times: rows,
    })
  }
  updateDestination(type, event) {
    const { liftDestination } = this.state
    liftDestination[type] = +event.target.value
    this.setState({ liftDestination })
  }
  randomizeRoomTimes = () => {
    const { matrix } = this.refs
    let columns = matrix.getColumns()
    columns = columns.map(col => col.map(cell => Math.round(Math.random() * 100)))
    matrix.setColumns(columns)
  }

  renderLegend() {
    return (
      <ul>
        <li>The matrix above represents the building with rooms-cell.</li>
        <li>The gray cell is the current position of the lift.</li>
        <li>The cell value is time lift requires passing the room.</li>
        <li>Zero or empty values are not passable.</li>
        <li>Click any cell to set lift destination.</li>
        <li>Use keyboard arrow keys to navigate cells or extend building size.</li>
        <li>Press enter or 'Go' button to trigger lift movement to a destination with a time-optimal route.</li>
        <li>Your changes to the building structure are saved to localStorage and will be loaded on next visit.</li>
        <li>Have fun.</li>
      </ul>
    )
  }
  render() {
    const {
      liftDestination,
      liftPosition,
      mute,
      path,
      speed,
      times,
    } = this.state

    return (
      <form onSubmit={this.go}>
        <table>
          <tbody>
          <tr>
            <td><label htmlFor="input-sound-mute">Mute sound</label></td>
            <td><input
              id="input-sound-mute" type="checkbox" checked={mute}
              onChange={e => this.setState({ mute: e.target.checked })}
            /></td>
          </tr>
          <tr>
            <td><label htmlFor="input-animation-speed">Tick duration, ms</label></td>
            <td><Input
              id="input-animation-speed" min="1" max="100" value={speed} required
              onChange={e => this.setState({ speed: +e.target.value || 0 })}
            /></td>
          </tr>
          <tr>
            <td colSpan="2">
              <button type="button" onClick={this.randomizeRoomTimes}>Randomize room times</button>
            </td>
          </tr>
          </tbody>
        </table>
        <br />
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
        <br />
        <MatrixInput
          ref="matrix"
          rows={times}
          liftPosition={toggleFloorCoords(liftPosition, times)}
          liftDestination={toggleFloorCoords(liftDestination, times)}
          onCellActive={this.onCellActive}
          readonly={!!path.length}
        />
        {this.renderLegend()}
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
