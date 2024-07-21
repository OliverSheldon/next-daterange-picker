import createClass from 'create-react-class';
import DateRangePicker from '../range-picker/DateRangePicker'
import moment from 'moment';
import QuickSelection from './quick-selection/index'

const DatePickerSingleWithSetDateButtons = createClass({
    getInitialState() {
      return {
        value: null,
      };
    },
  
    handleSelect(value) {
      this.setState({ value });
    },
  
    setDate(value) {
      this.setState({ value });
    },
  
    render() {
        const today = moment();
      const dateRanges = {
        'Today': today,
        'Next Month': today.clone().add(1, 'month'),
        'Last Month': today.clone().subtract(1, 'month'),
  
        'Next Year': today.clone().add(1, 'year'),
        'Last Year': today.clone().subtract(1, 'year'),
      };
  
      return (
        <div className="singleDateRange">
          <DateRangePicker {...this.props} onSelect={this.handleSelect} value={this.state.value} />
          <QuickSelection dates={dateRanges} value={this.state.value} onSelect={this.setDate} />
          <div>
            <input type="text"
              value={this.state.value ? this.state.value.format('LL') : ''}
              readOnly={true} />
          </div>
        </div>
      );
    },
  });

  export default DatePickerSingleWithSetDateButtons;