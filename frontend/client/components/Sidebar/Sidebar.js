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
      <Link className="navlink" to="/events">
        <i className="fa fa-fw fa-bar-chart" />
      </Link>
      <Link className="navlink" to="/daily/all">
        <i className="fa fa-fw fa-share-alt" />
      </Link>
      {/*<Link className="navlink" to="/services">
        <i className="fa fa-fw fa-gears" />
      </Link>*/}
      <Link className="navlink" to="/userconfig">
        <i className="fa fa-fw fa-user" />
      </Link>
      {window.honeydbAdmin ?
      <Link className="navlink" to="/nodes">
        <i className="fa fa-fw fa-server" />
      </Link> : ''}
    </div>
  )
}

export default Sidebar
