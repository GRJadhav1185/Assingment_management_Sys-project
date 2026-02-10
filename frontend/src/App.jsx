import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import StudentDashboard from './pages/student/Dashboard';
import AssignmentSubmit from './pages/student/AssignmentSubmit';
import FacultyDashboard from './pages/faculty/Dashboard';
import FacultyAssignments from './pages/faculty/Assignments';
import Submissions from './pages/faculty/Submissions';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/login" replace />} />

          {/* Student Routes */}
          <Route
            path="student/dashboard"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="student/assignments"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentDashboard /> {/* Reusing Dashboard for Assignments list for now */}
              </ProtectedRoute>
            }
          />
          <Route
            path="student/submit/:id"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <AssignmentSubmit />
              </ProtectedRoute>
            }
          />

          {/* Faculty Routes */}
          <Route
            path="faculty/dashboard"
            element={
              <ProtectedRoute allowedRoles={['FACULTY']}>
                <FacultyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="faculty/assignments"
            element={
              <ProtectedRoute allowedRoles={['FACULTY']}>
                <FacultyAssignments />
              </ProtectedRoute>
            }
          />
          <Route
            path="faculty/submissions"
            element={
              <ProtectedRoute allowedRoles={['FACULTY']}>
                <Submissions />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
