import React from 'react'
import { render } from 'react-dom'
import { solve } from './solver'
import { times } from './data'
import App from './components/App'


const app = render(
  <App times={times} />,
  document.getElementById('root'),
)

Object.assign(window, {
  go: app.go,
  solve,
  times,
})
