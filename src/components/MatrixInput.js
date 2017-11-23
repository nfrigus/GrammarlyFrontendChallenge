import React from 'react'
import PropTypes from 'prop-types'
import MatrixCell from './MatrixInputCell'


/**
 * Based on https://github.com/oal/react-matrix
 */
export class MatrixInput extends React.Component {
  static propTypes = {
    columns: PropTypes.array,
    resize: PropTypes.oneOf(['both', 'vertical', 'horizontal', 'none']),
    readonly: PropTypes.bool,
  }
  constructor(props) {
    super(props)

    this.state = {
      activeCell: [-1, -1],
      caret: 0,
      columns: this.props.columns,
    }

    this.style = {
      overflow: 'hidden',
      display: 'inline-block',
      borderLeft: '2px solid #333',
      borderRight: '2px solid #333',
      padding: '0 2px',
      borderRadius: '4px',
    }
  }

  getHeight() {
    return this.state.columns[0].length
  }

  getWidth() {
    return this.state.columns.length
  }

  getCellValue(x, y) {
    if (x < 0 || y < 0 || x > this.getWidth() - 1 || y > this.getHeight() - 1) return ''
    return this.state.columns[x][y]
  }

  setCellValue(x, y, val) {
    let columns = this.state.columns
    columns[x][y] = +val
    this.setState({
      columns: columns,
    })
  }

  getColumn(n) {
    return this.state.columns[n]
  }

  setColumn(n, values) {
    let columns = this.state.columns
    columns[n] = values
    this.setState({ columns: columns })
  }

  getColumns() {
    return this.state.columns
  }

  getRow(n) {
    const row = []
    const columns = this.state.columns
    for (let i = 0; i < columns.length; i++) {
      row[i] = columns[i][n]
    }

    return row
  }

  setRow(n, values) {
    let columns = this.state.columns
    for (let i = 0; i < values.length; i++) {
      columns[i][n] = values[i]
    }

    this.setState({ columns: columns })
  }

  getRows() {
    let rows = []
    for (let i = 0; i < this.getHeight(); i++) {
      rows[i] = this.getRow(i)
    }

    return rows
  }

  isResizeableX() {
    let resize = this.props.resize
    return (!this.props.readonly && (resize === 'horizontal' || resize === 'both' || resize === undefined))
  }

  isResizeableY() {
    let resize = this.props.resize
    return (!this.props.readonly && (resize === 'vertical' || resize === 'both' || resize === undefined))
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
    let columns = this.state.columns
    for (let i = 0; i < columns.length; i++) {
      columns[i].push('')
    }

    this.setState({
      height: this.getHeight() + 1,
      columns: columns,
    })
  }

  addColumn() {
    let columns = this.state.columns
    let newColumn = new Array(this.getHeight())
    for (let i = 0; i < newColumn.length; i++) {
      newColumn[i] = ''
    }

    columns.push(newColumn)

    this.setState({
      width: this.state.width + 1,
      columns: columns,
    })
  }

  isRowEmpty(row) {
    for (let i = 0; i < this.state.columns.length; i++) {
      let col = this.state.columns[i]
      if (('' + col[col.length - 1]).length > 0) {
        return false
      }
    }

    return true
  }

  isColumnEmpty(col) {
    let column = this.state.columns[col]
    for (let i = 0; i < column.length; i++) {
      if (('' + column[i]).length > 0) return false
    }

    return true
  }

  removeRow(row) {
    for (let i = 0; i < this.state.columns.length; i++) {
      this.state.columns[i].splice(row, 1)
    }

    this.setState({
      columns: this.state.columns,
    })
  }

  removeColumn(col) {
    this.state.columns.splice(col, 1)
    this.setState({
      columns: this.state.columns,
    })
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
