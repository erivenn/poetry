import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './components/App'
import { BrowserRouter as Router } from "react-router-dom"
import { createBrowserHistory } from "history"

const history = createBrowserHistory()
const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <Router history={history}>
    <App />
  </Router>
)
