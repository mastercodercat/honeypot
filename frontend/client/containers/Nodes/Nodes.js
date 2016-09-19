import React, { Component } from 'react'
import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator'

import hoc from './hoc'

class Nodes extends Component {

  updateNode = (nodeId, ownerId) => {
    this.props.updateNodeOwner(nodeId, ownerId)
  }

  updateAllNodes = () => {
    const {
      nodes, loadedNodes,
    } = this.props
    if (loadedNodes) {
      nodes.map((node, i) => {
        if (!this.refs['saveButton' + i].disabled) {
          this.updateNode(node.get('id'), this.refs['node' + i].value)
          this.refs['saveButton' + i].disabled = true
        }
      })
    }
  }

  componentDidMount() {
    const { loadedUsers, loadedNodes, getUsers, getNodes } = this.props
    if (!loadedUsers) {
      getUsers()
    }
    if (!loadedNodes) {
      getNodes()
    }
  }

  componentDidUpdate = () => {
    const {
      nodes, loadedNodes,
    } = this.props
    if (loadedNodes) {
      for(let i = 0; i < nodes.size; i++) {
        this.refs['saveButton' + i].disabled = true
      }
    }
  }

  render() {
    const {
      users, loadedUsers,
      nodes, loadedNodes,
    } = this.props

    if (!loadedNodes || !loadedUsers) {
      return (
        <LoadingIndicator />
      )
    }

    return (
      <div>
        <h3 className="title">Nodes</h3>
        <div className="nodes">
          <table className="nodes-table">
            <tbody>
              {
                nodes.valueSeq().map((node, index) => {
                  return (
                    <tr key={index}>
                      <td>{node.get('nodename')}</td>
                      <td>
                        <select className="form-control" defaultValue={node.get('owner')} ref={"node" + index}
                          onChange={e => {
                            this.refs['saveButton' + index].disabled = false
                          }}>
                          {
                            users.valueSeq().map((user, uindex) => (
                              <option key={uindex} value={user.get('id')}>{user.get('username')}</option>
                            ))
                          }
                        </select>
                      </td>
                      <td className="button">
                        <button className="btn btn-block btn-primary" ref={"saveButton" + index}
                          onClick={e => {
                            this.updateNode(node.get('id'), this.refs['node' + index].value)
                            this.refs['saveButton' + index].disabled = true
                          }}>
                          Update this node
                        </button>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
          <div className="m-t-2 text-xs-right">
            <button className="btn btn-primary" onClick={this.updateAllNodes}>Save All</button>
          </div>
        </div>
      </div>
    )
  }
}

export default hoc(Nodes)
