import React from 'react'
import { Link } from 'react-router'

const Sidebar = () => {
  const listStyle = {
    width: 300,
  }
  return (
    <div className="sidebar">
      <Link className="navlink" to="/">
        <i className="fa fa-fw fa-home" />
      </Link>
      <Link className="navlink" to="/">
        <i className="fa fa-fw fa-server" />
      </Link>
      <Link className="navlink" to="/">
        <i className="fa fa-fw fa-gears" />
      </Link>
      <Link className="navlink" to="/">
        <i className="fa fa-fw fa-info-circle" />
      </Link>
      <Link className="navlink" to="/">
        <i className="fa fa-fw fa-database" />
      </Link>
      <Link className="navlink" to="/">
        <i className="fa fa-fw fa-users" />
      </Link>
    </div>
  )
}

export default Sidebar
