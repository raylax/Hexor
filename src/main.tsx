import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App'
// import '@/samples/node-api'
import '@/index.scss'
import { FluentProvider, webDarkTheme } from '@fluentui/react-components'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <FluentProvider theme={webDarkTheme}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </FluentProvider>,
)

postMessage({ payload: 'removeLoading' }, '*')
