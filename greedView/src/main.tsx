import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './redux/store/store.js'
import "./index.css"

const App = lazy(() => import('./App.tsx'));

document.documentElement.classList.add('dark');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center"><div className="text-[#00ff88]">Loading...</div></div>}>
        <App />
      </Suspense>
    </Provider>
  </StrictMode>,
)
