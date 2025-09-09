import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'

createRoot(document.getElementById('root')).render(
  /**
   * Now yha hmne Apne Frontend ki puri hirerachy mai configureStore ko provide kraya with the help of ProviderHelper from 'react-redux'...
   * Now hmne yha App component ko bind krke yeah kaam kiya hai taki hmm uski puri hierarchy mai available ho...
   */
  <Provider store={store}>
    <App />
  </Provider>,
)
