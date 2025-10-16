import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import OnboardingPage from './pages/OnboardingPage'

const Home = () => (
  <div style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
  <h1>VaultCraft</h1>
    <p>Setup wizard coming soon.</p>
  </div>
)

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/onboarding', element: <OnboardingPage /> },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)


