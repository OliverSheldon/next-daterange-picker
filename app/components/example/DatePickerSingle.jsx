import createClass from 'create-react-class';
import DateRangePicker from '../range-picker/DateRangePicker'

const DatePickerSingle = createClass({
    getInitialState() {
      return {
        value: "",
      };
    },
  
    handleSelect(value) {
      this.setState({
        value: value,
      });
    },
  
    render() {
      return (
        <div>
          <DateRangePicker {...this.props} onSelect={this.handleSelect}
            value={this.state.value} />
          <div>
            <input type="text"
              value={this.state.value ? this.state.value.format('LL') : ""}
              readOnly={true} />
          </div>
        </div>
      );
    },
  });

  export default DatePickerSingle;