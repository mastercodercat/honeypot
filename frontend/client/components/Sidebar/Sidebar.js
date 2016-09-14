import React from 'react'
import { Link } from 'react-router'
import {List, ListItem} from 'material-ui/List'
import Paper from 'material-ui/Paper'

const SideNav = () => {
  const listStyle = {
    width: 300,
  }
  return (
    <Paper>
      <List style={listStyle}>
        <ListItem
          containerElement={<Link to="/home" />}
          primaryText="Full Employee List" />
        <ListItem primaryText="Project Managers/SFO" />
        <ListItem primaryText="Pilot Group" />
        <ListItem primaryText="MX Personnel" />
        <ListItem primaryText="Operations" />
        <ListItem primaryText="Group Email Directory" />
        <ListItem primaryText="Customer Service Agents" />
      </List>
    </Paper>
  )
}

export default SideNav
