import React from 'react'
import PropTypes from 'prop-types'


export default class MatrixInputCell extends React.PureComponent {
  static propTypes = {
    active: PropTypes.bool,
    elevator: PropTypes.bool,
    matrix: PropTypes.any.isRequired,
    position: PropTypes.arrayOf(Number).isRequired,
    readonly: PropTypes.bool,
    value: PropTypes.any,
  }
  static defaultProps = {
    active: false,
    elevator: false,
    readonly: false,
    value: '',
  }

  styleDefault = {
    border: '1px solid #eee',
    display: 'block',
    margin: '4px 0',
    padding: '4px',
    width: '30px',
    textAlign: 'center',
  }
  styleActive = {
    border: '1px solid #000',
  }
  styleElevator = {
    boxShadow: '0px 0px 25px inset',
  }

  componentDidMount = this.focus
  componentDidUpdate = this.focus

  onChange = e => {
    const { value: prevValue } = this.props
    const { value } = e.target
    const diffLen = String(value).length - String(prevValue).length

    this.props.matrix.setCellValue(...this.props.position, value)
    this.props.matrix.moveCell(diffLen, 0)
  }
  onKeyUp = e => {
    const deltaByKey = {
      ArrowUp: [0, -1],
      ArrowRight: [1, 0],
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0],
    }

    const delta = e.key in deltaByKey
      ? deltaByKey[e.key]
      : [0, 0]

    this.props.matrix.moveCell(...delta)
  }

  activate = () => {
    this.props.matrix.setCell(
      this.refs.input.selectionStart,
      ...this.props.position
    )
  }
  deactivate = () => {
    this.props.matrix.setCell(null)
  }
  focus() {
    if (!this.props.active) return

    const { input } = this.refs
    const { caret } = this.props.matrix.state
    input.focus()
    input.setSelectionRange(caret, caret)
  }

  render() {
    let style = this.styleDefault

    if (this.props.active) style = { ...style, ...this.styleActive }
    if (this.props.elevator) style = { ...style, ...this.styleElevator }

    return (
      <input
        ref="input"
        type="text"
        style={style}
        value={this.props.value}
        readOnly={this.props.readonly}
        onBlur={this.deactivate}
        onChange={this.onChange}
        onClick={this.activate}
        onFocus={this.activate}
        onKeyUp={this.onKeyUp}
      />
    )
  }
}
