import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ConfigProvider, App as AppAntd } from 'antd'
import { AntdThemeConfig } from './themes/'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider theme={AntdThemeConfig}>
      <AppAntd>
        <App />
      </AppAntd>
    </ConfigProvider>
  </React.StrictMode>
)
