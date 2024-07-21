import createClass from 'create-react-class';
import PropTypes from 'prop-types';
import DateRangePicker from '../range-picker/DateRangePicker'

const DatePickerRange = createClass({
  propTypes: {
    value: PropTypes.object,
  },

  getInitialState() {
    return {
      value: this.props.value,
      states: null,
    };
  },

  handleSelect(value, states) {
    this.setState({value, states});
  },

  render() {
    return (
      <div>
        <DateRangePicker {...this.props} onSelect={this.handleSelect} value={this.state.value} />
        <div>
          <input type="text"
            value={this.state.value ? this.state.value.start.format('LL') : ""}
            readOnly={true}
            placeholder="Start date"/>
          <input type="text"
            value={this.state.value ? this.state.value.end.format('LL') : ""}
            readOnly={true}
            placeholder="End date" />
        </div>
      </div>
    );
  },
});

export default DatePickerRange;