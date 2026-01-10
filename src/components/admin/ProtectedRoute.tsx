import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAdminStore } from '@/store/adminStore'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated)
  const location = useLocation()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const adminUser = localStorage.getItem('adminUser')
    if (token && adminUser) {
      useAdminStore.setState({
        isAuthenticated: true,
        token,
        admin: JSON.parse(adminUser),
      })
    }
  }, [])

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
