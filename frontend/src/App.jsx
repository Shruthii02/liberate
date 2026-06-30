import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import { HomePage, ProtectedRoute, PublicRoute } from './pages/HomePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
