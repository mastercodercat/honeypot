import React, { Component } from 'react'
import { Field, Fields, reduxForm } from 'redux-form'

class UserConfigForm extends Component {

  render() {
    const { handleSubmit, submitting } = this.props
    return (
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <Field name="email" component="input" type="text" className="form-control" />
        </div>
        <div className="form-group">
          <label>Threshold:</label>
          <Field name="threshold" component="input" type="text" className="form-control" />
        </div>
        <div className="text-xs-right m-t-2">
          <input type="submit" className="btn btn-primary" disabled={submitting} value="Save" />
        </div>
      </form>
    )
  }

}

export default reduxForm({
  form: 'UserConfigForm'
})(UserConfigForm)
