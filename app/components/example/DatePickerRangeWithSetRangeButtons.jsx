import createClass from 'create-react-class';
import DateRangePicker from '../range-picker/DateRangePicker'
import QuickSelection from './quick-selection/index'
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

const today = moment();

const DatePickerRangeWithSetRangeButtons = createClass({
    getInitialState() {
      return {
        value: null,
        states: null,
      };
    },
  
    handleSelect(value, states) {
      this.setState({ value, states });
    },
  
    setRange(value){
      this.setState({ value });
    },
  
    render() {
      const dateRanges = {
        'Last 7 days': moment.range(
          today.clone().subtract(7, 'days'),
          today.clone()
        ),
        'This Year': moment.range(
          today.clone().startOf('year'),
          today.clone()
        ),
      };
  
      return (
        <div className="rangeDateContainer">
          <QuickSelection dates={dateRanges} value={this.state.value} onSelect={this.setRange} />
          <DateRangePicker {...this.props} onSelect={this.handleSelect} value={this.state.value} />
          <div>
            <input type="text"
              value={this.state.value ? this.state.value.start.format('LL') : ''}
              readOnly={true}
              placeholder="Start date"/>
            <input type="text"
              value={this.state.value ? this.state.value.end.format('LL') : ''}
              readOnly={true}
              placeholder="End date" />
          </div>
        </div>
      );
    },
  });

  export default DatePickerRangeWithSetRangeButtons;