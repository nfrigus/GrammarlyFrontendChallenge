import React from 'react'
import PropTypes from 'prop-types'


export default class MatrixInputCell extends React.PureComponent {
  static propTypes = {
    active: PropTypes.bool,
    matrix: PropTypes.any.isRequired,
    readonly: PropTypes.bool,
    value: PropTypes.any,
    position: PropTypes.arrayOf(Number).isRequired,
  }
  static defaultProps = {
    active: false,
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
    ...this.styleDefault,
    border: '1px solid #000',
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
    const style = this.props.active
      ? this.styleActive
      : this.styleDefault

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
