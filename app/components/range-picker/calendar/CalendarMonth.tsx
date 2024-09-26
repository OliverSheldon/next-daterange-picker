import React, { ChangeEvent, ReactNode } from 'react';

import * as Moment from 'moment';
import { DateRange, extendMoment, MomentRange } from 'moment-range';

const moment = extendMoment(Moment);
import CalendarDate from './CalendarDate';
import Immutable, { List } from 'immutable';
import calendar from 'calendar'
import isMomentRange from '../utils/isMomentRange';

type propTypes = {
  bemBlock: string,
  bemNamespace: string | null,
  dateComponent: ReactNode,
  disableNavigation: boolean,
  enabledRange: DateRange,
  firstOfMonth: Moment.Moment,
  firstOfWeek: number,
  hideSelection: boolean,
  highlightedDate: (DateRange & Moment.Moment) | null,
  highlightedRange: DateRange,
  onMonthChange: Function,
  onYearChange: Function,
  value: DateRange | moment.Moment | null,
  locale: string,
  dateStates: Immutable.List<Immutable.Map<string, any>>,
  index: number,
  selectionType: "single" | "range",
  maxIndex: number,
  onSelectDate: Function,
  onHighlightDate: Function,
  onUnHighlightDate: Function,
  dateRangesForDate: Function,
  className: string
}

let WEEKDAYS: List<[string, string]> = Immutable.List(moment.weekdays()).zip(Immutable.List(moment.weekdaysShort()));
let MONTHS: List<string> = Immutable.List(moment.months());

function CalendarMonth(props : propTypes){

  function renderDay(date : Moment.MomentInput, i : number) {
    let d = moment(date).locale(props.locale);

    let isInSelectedRange;
    let isSelectedDate;
    let isSelectedRangeStart;
    let isSelectedRangeEnd;
    let val = props.value as DateRange;

    if (!props.hideSelection && props.value && moment.isMoment(props.value) && props.value.isSame(d, 'day')) {
      isSelectedDate = true;
    } else if (!props.hideSelection && props.value && isMomentRange(props.value) && val.contains(d)) {
      isInSelectedRange = true;
      
      isSelectedRangeStart = val.start.isSame(d, 'day');
      isSelectedRangeEnd = val.end.isSame(d, 'day');
    }

    return (
      <CalendarDate
        key={i}
        isToday={d.isSame(moment(), 'day')}
        isDisabled={!props.enabledRange.contains(d)}
        isHighlightedDate={!!(props.highlightedDate && props.highlightedDate.isSame(d, 'day'))}
        isHighlightedRangeStart={!!(props.highlightedRange && props.highlightedRange.start.isSame(d, 'day'))}
        isHighlightedRangeEnd={!!(props.highlightedRange && props.highlightedRange.end.isSame(d, 'day'))}
        isInHighlightedRange={!!(props.highlightedRange && props.highlightedRange.contains(d))}
        isSelectedDate={isSelectedDate}
        isSelectedRangeStart={isSelectedRangeStart}
        isSelectedRangeEnd={isSelectedRangeEnd}
        isInSelectedRange={isInSelectedRange}
        date={d}
        {...props} />
    );
  }

  function renderWeek(dates : Date[], i : number) {
    let days : React.JSX.Element[] = dates.map((date, i) => {return(renderDay(date, i))});
    return (
      <tr className={`DateRangePicker__Week`} key={i}>{days}</tr>
    );
  }

  function renderDayHeaders() {
    let {firstOfWeek} = props;
    let indices = Immutable.Range(firstOfWeek, 7).concat(Immutable.Range(0, firstOfWeek));

    let headers = indices.map((index : number) => {
      let weekday = WEEKDAYS.get(index);
      return(
        <th className={`DateRangePicker__WeekdayHeading`} key={weekday?.[0]} scope="col"><abbr title={weekday?.[0]}>{weekday?.[1]}</abbr></th>
      );
    });

    return (
      <tr className={`DateRangePicker__Weekdays`}>{headers}</tr>
    );
  }

  function handleYearChange(event : ChangeEvent<any>) {
    props.onYearChange(parseInt(event.target.value, 10));
  }

  function renderYearChoice(year : number) {
    let {enabledRange} = props;

    if (year < enabledRange.start.year()) {
      return null;
    }

    if (year > enabledRange.end.year()) {
      return null;
    }

    return (
      <option key={year} value={year}>{moment(year, 'YYYY').locale(props.locale).format('YYYY')}</option>
    );
  }

  function renderHeaderYear() {
    let {firstOfMonth} = props;
    let y = firstOfMonth.year();
    let years = Immutable.Range(y - 5, y).concat(Immutable.Range(y, y + 10));
    let choices = years.map(renderYearChoice);
    let modifiers = {year: true};
    return (
      <span className={`DateRangePicker__MonthHeaderLabel DateRangePicker__MonthHeaderLabel--year`}>
        {firstOfMonth.locale(props.locale).format('YYYY')}
        {props.disableNavigation ? null : <select className={`DateRangePicker__MonthHeaderSelect`} value={y} onChange={handleYearChange}>{choices.toJS()}</select>}
      </span>
    );
  }

  function handleMonthChange(event : ChangeEvent<any>) {
    props.onMonthChange(parseInt(event.target.value, 10));
  }

  function renderMonthChoice(month: string, i: number) {
    let {firstOfMonth, enabledRange} = props;
    let disabled = false;
    let year = firstOfMonth.year();

    if (moment({years: year, months: i + 1, date: 1}).unix() < enabledRange.start.unix()) {
      disabled = true;
    }

    if (moment({years: year, months: i, date: 1}).unix() > enabledRange.end.unix()) {
      disabled = true;
    }

    return (
      <option key={month} value={i} disabled={disabled}>{month}</option>
    );
  }

  function renderHeaderMonth() {
    let {firstOfMonth} = props;
    let choices = MONTHS.map((month, index) => renderMonthChoice(month, index));
    let modifiers = {month: true};

    return (
      <span className={`DateRangePicker__MonthHeaderLabel DateRangePicker__MonthHeaderLabel--month`}>
        {firstOfMonth.locale(props.locale).format('MMMM')}
        {props.disableNavigation ? null : <select className={`DateRangePicker__MonthHeaderSelect`} value={firstOfMonth.month()} onChange={handleMonthChange}>{choices.toJS()}</select>}
      </span>
    );
  }

  function renderHeader() {
    return (
      <div className={`DateRangePicker__MonthHeader`}>
        {renderHeaderMonth()} {renderHeaderYear()}
      </div>
    );
  }

  let {firstOfWeek, firstOfMonth} = props;

  let cal = new calendar.Calendar(firstOfWeek);
  let monthDates = cal.monthDates(firstOfMonth.year(), firstOfMonth.month());
  let weeks = monthDates.map((dates, index)=>renderWeek(dates, index));

    return (
      <div className={`DateRangePicker__Month`}>
        {renderHeader()}
        <table className={`DateRangePicker__MonthDates`}>
          <thead>
            {renderDayHeaders()}
          </thead>
          <tbody>
          {weeks}
          </tbody>
        </table>
      </div>
    );
}

export default CalendarMonth;
