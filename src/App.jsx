import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/common/Navbar'
import ProtectedRoute from './components/common/ProtectedRoute'

import HomePage        from './pages/HomePage'
import LoginPage       from './pages/LoginPage'
import RegisterPage    from './pages/RegisterPage'
import NoteDetailPage  from './pages/NoteDetailPage'
import CreateNotePage  from './pages/CreateNotePage'
import EditNotePage    from './pages/EditNotePage'
import MyNotesPage     from './pages/MyNotesPage'
import AdminPage       from './pages/AdminPage'
import NotFoundPage    from './pages/NotFoundPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main style={{ padding: '1rem' }}>
          <Routes>
            {/* public routes */}
            <Route path="/"            element={<HomePage />} />
            <Route path="/notes/:id"   element={<NoteDetailPage />} />
            <Route path="/login"       element={<LoginPage />} />
            <Route path="/register"    element={<RegisterPage />} />

            {/* protected — must be logged in */}
            <Route path="/notes/new"   element={
              <ProtectedRoute><CreateNotePage /></ProtectedRoute>
            } />
            <Route path="/notes/:id/edit" element={
              <ProtectedRoute><EditNotePage /></ProtectedRoute>
            } />
            <Route path="/my-notes"    element={
              <ProtectedRoute><MyNotesPage /></ProtectedRoute>
            } />

            {/* admin only */}
            <Route path="/admin"       element={
              <ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>
            } />

            {/* catch-all */}
            <Route path="*"            element={<NotFoundPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App