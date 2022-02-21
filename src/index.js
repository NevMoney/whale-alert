import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { MoralisProvider } from 'react-moralis'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

const appId = process.env.REACT_APP_MORALIS_APPLICATION_ID
const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
  },
})

ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider appId={appId} serverUrl={serverUrl}>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
