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

  createNode = () => {
    const nodename = this.refs['newnode-name'].value
    const owner = this.refs['newnode-owner'].value
    this.refs.newNodeButton.disabled = true
    this.props.createNode(nodename, owner)
    .then(r => {
      this.refs.newNodeButton.disabled = false
    })
    .catch(r => {
      this.refs.newNodeButton.disabled = false
    })
  }

  componentWillMount() {
    const { getUsers, getNodes } = this.props
    getUsers()
    getNodes()
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
      regenerateNodeAPIKey,
    } = this.props

    if (!loadedNodes || !loadedUsers) {
      return (
        <LoadingIndicator />
      )
    }

    return (
      <div>
        <h3 className="title">Nodes</h3>
        <div className="new-node m-b-2">
          <input type="text" className="form-control elm" ref="newnode-name" />
          <select className="form-control elm" ref="newnode-owner">
            {
              users.valueSeq().map((user, uindex) => (
                <option key={uindex} value={user.get('id')}>{user.get('username')}</option>
              ))
            }
          </select>
          <button className="btn btn-primary" ref="newNodeButton" onClick={this.createNode}>
            Create new node
          </button>
        </div>
        <div className="nodes p-t-2">
          {
            nodes.valueSeq().map((node, index) => {
              return (
                <div className="node m-b-2 p-b-2" key={index}>
                  <h5>{node.get('nodename')}</h5>
                  <div className="m-t-1">
                    <select className="form-control user-select" defaultValue={node.get('owner')} ref={"node" + index}
                      onChange={e => {
                        this.refs['saveButton' + index].disabled = false
                      }}>
                      <option value={0}>- Not assigned -</option>
                      {
                        users.valueSeq().map((user, uindex) => (
                          <option key={uindex} value={user.get('id')}>{user.get('username')}</option>
                        ))
                      }
                    </select>
                    <button className="btn btn-primary" ref={"saveButton" + index}
                      onClick={e => {
                        this.updateNode(node.get('id'), this.refs['node' + index].value)
                        this.refs['saveButton' + index].disabled = true
                      }}>
                      Reassign to user
                    </button>
                  </div>
                  <div className="m-t-1">
                    API Key: <span className="api-key">{node.get('api_key')}</span>
                    <button className="btn btn-primary" ref={"regenApiButton" + index}
                      onClick={e => {
                        this.refs["regenApiButton" + index].disabled = true
                        regenerateNodeAPIKey(node.get('id'))
                        .then(() => {
                          this.refs["regenApiButton" + index].disabled = false
                        })
                        .catch(() => {
                          this.refs["regenApiButton" + index].disabled = false
                        })
                      }}>
                      Regenerate
                    </button>
                  </div>
                </div>
              )
            })
          }
          {/*<div className="m-t-2 text-xs-right">
            <button className="btn btn-primary" onClick={this.updateAllNodes}>Save All</button>
          </div>*/}
        </div>
      </div>
    )
  }
}

export default hoc(Nodes)
