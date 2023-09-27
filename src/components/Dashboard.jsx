import React from 'react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div>
        <p>this is Dashboard</p> <Link to="/recency">go to recency</Link>
    </div>
  )
}

export default Dashboard
