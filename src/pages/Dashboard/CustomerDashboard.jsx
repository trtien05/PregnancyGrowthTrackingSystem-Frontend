import './CustomerDashboard.css'
import MenuSider from "../../components/MenuSider"
import { Outlet } from "react-router-dom"

function CustomerDashboard() {
  return (
    <div className="dashboard-container">
      <MenuSider />

      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  )
}

export default CustomerDashboard