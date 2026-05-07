import { Routes, Route, Navigate } from "react-router-dom"
import DashboardLayout from "../../components/layout/DashboardLayout"
import ShipperHome        from "./Home"
import ShipperShipments   from "./Shipments"
import ShipperNotifications from "./Notifications"
import ShipperProfile     from "./Profile"

const navItems = [
  { path: "/shipper",              label: "Home",          icon: "🏠" },
  { path: "/shipper/shipments",    label: "Shipments",     icon: "📦" },
  { path: "/shipper/notifications", label: "Alerts",       icon: "🔔" },
  { path: "/shipper/profile",      label: "Profile",       icon: "👤" },
]

export default function ShipperDashboard() {
  return (
    <DashboardLayout navItems={navItems} title="Shipper Dashboard">
      <Routes>
        <Route index                  element={<ShipperHome />} />
        <Route path="shipments"       element={<ShipperShipments />} />
        <Route path="notifications"   element={<ShipperNotifications />} />
        <Route path="profile"         element={<ShipperProfile />} />
        <Route path="*"               element={<Navigate to="/shipper" replace />} />
      </Routes>
    </DashboardLayout>
  )
}