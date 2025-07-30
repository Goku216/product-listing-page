import DashboardPage from "@/components/dashbord-component"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function Dashboard () {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  )
}
