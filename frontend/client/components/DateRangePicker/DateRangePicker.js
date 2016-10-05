import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import Moment from 'moment'

class DateRange {

  period = 1;

  constructor(_start = null, _end = null) {
    this.start = _start ? new Moment(_start) : null;
    this.end = _end ? new Moment(_end) : null;
  }

  isIn = (date) => {
    if (this.period == 0) {
      if (this.start && this.start.toDate() > date) {
        return false
      }
      if (this.end && this.end.toDate() < date) {
        return false
      }
    } else {
      const _date = new Date()
      _date.setHours(date.getHours() - this.period)
      if (_date > date) {
        return false
      }
    }
    return true
  }
}

class DateRangePicker extends Component {

  handlePeriodChange = (e) => {
    const { value, onChange } = this.props
    const _v = value ? value : new DateRange()
    _v.period = e.currentTarget.value
    if (onChange) {
      onChange(_v);
    }
  }

  handleStartDateChange = (m) => {
    const { value, onChange } = this.props
    const _v = value ? value : new DateRange()
    _v.start = m
    if (onChange) {
      onChange(_v);
    }
  }

  handleEndDateChange = (m) => {
    const { value, onChange } = this.props
    const _v = value ? value : new DateRange()
    _v.end = m
    if (onChange) {
      onChange(_v);
    }
  }

  render() {
    const { className, value, customOnly } = this.props
    return (
      <div className={className}>
        {
          customOnly ?
          undefined
          :
          <div>
            <label>Period:</label>
            <select
              className="form-control"
              style={{ width: 300 }}
              value={value.period}
              onChange={this.handlePeriodChange}
              >
              <option value={1}>Last one hour</option>
              <option value={24}>Last one day</option>
              <option value={168}>Last one week</option>
              <option value={168 * 30}>Last 30 days</option>
              <option value={168 * 180}>Last 6 months</option>
              <option value={0}>Custom...</option>
            </select>
          </div>
        }
        {
          value.period == 0 || customOnly ?
          (
            <div className="m-t-2">
              <div style={{ display: 'inline-block' }}>
                <label style={{ display: 'block' }}>Start date:</label>
                <DatePicker
                  className="form-control"
                  dateFormat="YYYY/MM/DD"
                  selected={value.start}
                  onChange={this.handleStartDateChange} />
              </div>
              <div style={{ display: 'inline-block', marginLeft: 10 }}>
                <label style={{ display: 'block' }}>End date:</label>
                <DatePicker
                  className="form-control"
                  dateFormat="YYYY/MM/DD"
                  selected={value.end}
                  onChange={this.handleEndDateChange} />
              </div>
            </div>
          )
          :
          ''
        }
      </div>
    )
  }
}

export {
  DateRange,
  DateRangePicker
}
