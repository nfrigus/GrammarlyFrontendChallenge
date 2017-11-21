import React from 'react'
import { render } from 'react-dom'
import { solve } from './solver'
import { times } from './data'
import App from './components/App'


const app = <App times={times} />


Object.assign(window, {
  go: app.go,
  solve,
  times,
})


render(
  app,
  document.getElementById('root'),
)
