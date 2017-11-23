import React from 'react'
import PropTypes from 'prop-types'
import MatrixCell from './MatrixInputCell'
import { transpose } from '../lib/matrix'


export class MatrixInput extends React.Component {
  static propTypes = {
    columns: PropTypes.arrayOf(Array),
    rows: PropTypes.arrayOf(Array),
    resize: PropTypes.oneOf(['both', 'vertical', 'horizontal', 'none']),
    readonly: PropTypes.bool,
  }
  static defaultProps = {
    rows: [[0]],
    resize: 'both',
    readonly: false,
  }
  style = {
    overflow: 'hidden',
    display: 'inline-block',
    borderLeft: '2px solid #333',
    borderRight: '2px solid #333',
    padding: '0 2px',
    borderRadius: '4px',
  }
  state = {
    activeCell: [-1, -1],
    caret: 0,
    columns: this.props.columns || transpose(this.props.rows),
  }

  isResizeableX() {
    return !this.props.readonly && [
      'horizontal',
      'both',
    ].includes(this.props.resize)
  }
  isResizeableY() {
    return !this.props.readonly && [
      'vertical',
      'both',
    ].includes(this.props.resize)
  }
  isRowEmpty(row) {
    return this.state.columns.every(col => !String(col[row]).length)
  }
  isColumnEmpty(col) {
    return this.state.columns[col].every(cell => !String(cell).length)
  }

  getHeight() {
    return this.state.columns[0].length
  }
  getWidth() {
    return this.state.columns.length
  }
  getColumns() {
    return this.state.columns
  }
  getRows() {
    return transpose(this.state.columns)
  }

  getCellValue(x, y) {
    if (x < 0 || y < 0 || x > this.getWidth() - 1 || y > this.getHeight() - 1) return ''
    return this.state.columns[x][y]
  }
  setCellValue(x, y, val) {
    let columns = this.state.columns
    columns[x][y] = isNaN(+val) ? '' : +val
    this.setState({ columns })
  }

  moveCell(dx, dy) {
    const {
      caret,
      activeCell: [x, y],
    } = this.state
    let cellX = x
    let cellY = y + dy
    let caretPos = caret + dx

    const cellContentLenth = String(this.getCellValue(cellX, y)).length
    if (caret + dx > cellContentLenth) {
      cellX++
      caretPos = 0; // First pos in next cell
    } else if (caret + dx < 0) {
      cellX--
      caretPos = cellContentLenth
    }

    this.setCell(caretPos, cellX, cellY)
  }
  setCell(caret, cellX, cellY) {
    if (caret === null) {
      return this.setState({
        activeCell: [-1, -1],
      })
    }
    // Negative position is not allowed
    if (cellX < 0) cellX = 0
    if (cellY < 0) cellY = 0

    const width = this.getWidth()
    const height = this.getHeight()

    // If outside bounds and resizing is disabled
    if (!this.isResizeableX() && cellX >= width) cellX = width - 1
    if (!this.isResizeableY() && cellY >= height) cellY = height - 1

    // Remove columns / rows if needed
    this.truncate(cellX, cellY)

    // Add column / row if needed
    if (cellX >= width && this.isResizeableX()) this.addColumn()
    if (cellY >= height && this.isResizeableY()) this.addRow()

    this.setState({
      caret: caret,
      activeCell: [cellX, cellY],
    })
    this.props.onCellActive([cellX, cellY], this.getRows())
  }

  addRow() {
    const { columns } = this.state
    columns.forEach(col => col.push(''))
    this.setState({ columns })
  }
  removeRow(row) {
    const { columns } = this.state
    columns.forEach(col => col.splice(row, 1))
    this.setState({ columns })
  }
  addColumn() {
    const { columns } = this.state
    columns.push(new Array(this.getHeight()).fill(''))
    this.setState({ columns })
  }
  removeColumn(col) {
    const { columns } = this.state
    columns.splice(col, 1)
    this.setState({ columns })
  }

  truncate(cellX, cellY) {
    for (let x = this.getWidth() - 1; x > cellX; x--) {
      if (this.isColumnEmpty(x) && this.isResizeableX()) this.removeColumn(x)
    }

    for (let y = this.getHeight() - 1; y > cellY; y--) {
      if (this.isRowEmpty(y) && this.isResizeableY()) this.removeRow(y)
    }
  }

  render() {
    let { activeCell } = this.state
    let {
      liftDestination,
      liftPosition,
    } = this.props

    activeCell = activeCell.join('-')
    liftDestination = liftDestination.join('-')
    liftPosition = liftPosition.join('-')

    const columns = this.state.columns.map((column, x) => {
      const cells = column.map((value, y) => {
        const position = [x, y]
        const key = position.join('-')
        return (
          <MatrixCell
            key={key}
            value={value}
            matrix={this}
            position={position}
            active={activeCell === key}
            readonly={this.props.readonly}
            elevator={liftPosition === key}
            destination={liftDestination === key}
          />
        )
      })

      const columnStyle = {
        float: 'left',
        padding: '2px',
      }

      return <div key={x} style={columnStyle}>{cells}</div>
    })

    return <div style={this.style}>{columns}</div>
  }
}

export default MatrixInput
