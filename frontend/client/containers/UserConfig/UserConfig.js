import React, { Component } from 'react'
import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator'
import UserConfigForm from 'components/UserConfigForm/UserConfigForm'

import hoc from './hoc'

class UserConfig extends Component {

  componentDidMount() {
    this.props.getUserConfig()
  }

  handleSubmit = (data) => {
    return this.props.updateUserConfig(data)
  }

  render() {
    const {
      loaded, email, threshold
    } = this.props

    if (!loaded) {
      return (
        <LoadingIndicator />
      )
    }

    const data = {
      email,
      threshold,
    }

    return (
      <div>
        <h3 className="title">User Config</h3>
        <UserConfigForm initialValues={data} onSubmit={this.handleSubmit} />
      </div>
    )
  }

}

export default hoc(UserConfig)
