'use client'

import React, { ReactNode, useEffect, useState } from 'react';
import Immutable from 'immutable';
import calendar from 'calendar';

import Legend from './Legend';

import CalendarMonth from './calendar/CalendarMonth';
import CalendarDate from './calendar/CalendarDate';

import PaginationArrow from './PaginationArrow';

import isMomentRange from './utils/isMomentRange';
import hasUpdatedValue from './utils/hasUpdatedValue';
import { getYearMonth, getYearMonthProps } from './utils/getYearMonth';

import * as Moment from 'moment';
import { DateRange, extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

const absoluteMinimum = moment(new Date(-8640000000000000 / 2)).startOf('day');
const absoluteMaximum = moment(new Date(8640000000000000 / 2)).startOf('day');

function noop() {}

interface propTypes {
  bemBlock: string,
  bemNamespace: string | null,
  className: string,
  dateStates: Immutable.List<Immutable.Map<string, any>>, // an array of date ranges and their states
  defaultState: string,
  disableNavigation: boolean,
  firstOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6,
  helpMessage: string,
  initialDate: Date,
  initialFromValue: boolean,
  initialMonth: number, // Overrides values derived from initialDate/initialRange
  initialRange: object,
  initialYear: number, // Overrides values derived from initialDate/initialRange
  locale: string,
  maximumDate: Date,
  minimumDate: Date,
  numberOfCalendars: number,
  onHighlightDate: Function, // triggered when a date is highlighted (hovered)
  onHighlightRange: Function, // triggered when a range is highlighted (hovered)
  onSelect: Function, // triggered when a date or range is selectec
  onSelectStart: Function, // triggered when the first date in a range is selected
  selectedLabel: string,
  selectionType: 'single' | 'range',
  singleDateRange: boolean,
  showLegend: boolean,
  stateDefinitions: object,
  value: DateRange | moment.Moment | null,
  selectedStartDate: moment.Moment | null,
  hideSelection: boolean,
  enabledRange: DateRange,
  year: number,
  month: number,
  nextLabel: string,
  previousLabel: string,
  paginationArrowComponent: JSX.Element
};

/* const defaultProps: propTypes ={
  bemNamespace: null,
  bemBlock: 'DateRangePicker',
  className: '',
  numberOfCalendars: 1,
  firstOfWeek: 0,
  disableNavigation: false,
  nextLabel: '',
  previousLabel: '',
  initialDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
  initialFromValue: true,
  locale: moment().locale(),
  selectionType: 'range',
  singleDateRange: false,
  stateDefinitions: {
    '__default': {
      color: null,
      selectable: true,
      label: null,
    }
  },
  selectedLabel: "Your selected dates",
  defaultState: '__default',
  dateStates: [] as unknown as Immutable.List<Immutable.Map<string, any>>,
  showLegend: false,
  onSelect: noop,
  paginationArrowComponent: PaginationArrow,
  helpMessage: '',
  initialMonth: 0,
  initialRange: new DateRange(),
  initialYear: 0,
  maximumDate: new Date(),
  minimumDate: new Date(),
  onHighlightDate: ()=>{},
  onHighlightRange: ()=>{},
  onSelectStart: ()=>{},
  value: null,
  selectedStartDate: null,
  hideSelection: false,
  enabledRange: new DateRange,
  year: 0,
  month: 0
} */

  function getDateStates(dateStates: Immutable.List<Immutable.Map<string, any>>, defaultState: string, stateDefinitions: any) {
    let actualStates = [];
    let minDate = absoluteMinimum;
    let maxDate = absoluteMaximum;
    let dateCursor = moment(minDate).startOf('day');

    let defs = Immutable.fromJS(stateDefinitions);

    dateStates.forEach(function(s: any) {
      let r = s.range;
      let start = r.start.startOf('day');
      let end = r.end.startOf('day');

      if (!dateCursor.isSame(start, 'day')) {
        actualStates.push({
          state: defaultState,
          range: moment.range(
            dateCursor,
            start
          ),
        });
      }
      actualStates.push(s);
      dateCursor = end;
    });

    actualStates.push({
      state: defaultState,
      range: moment.range(
        dateCursor,
        maxDate
      ),
    });

    // sanitize date states
    return Immutable.List(actualStates).map(function(s) {
      let def = defs.get(s.state);
      return Immutable.Map({
        range: s.range,
        state: s.state,
        selectable: def.get('selectable', true),
        color: def.get('color'),
      });
    });
  }

export default async function DateRangePicker(props: propTypes) {

  //props = defaultProps;

  let [value, setValue] = useState<moment.Moment | DateRange | null>(moment())
  let [dateStates, setDateStates] = useState(getDateStates(props.dateStates, props.defaultState, props.stateDefinitions))
  let [enabledRange, setEnabledRange] = useState(getEnabledRange(props.minimumDate, props.maximumDate))
  let [selectedStartDate, setSelectedStartDate] = useState<moment.Moment | null>(null)
  let [hideSelection, setHideSelection] = useState(false)
  let [year, setYear] = useState(moment().year())
  let [month, setMonth] = useState(moment().month())
  let [initialYear, setInitialYear] = useState(moment().year())
  let [initialMonth, setInitialMonth] = useState(moment().month())
  let [initialFromValue, setInitialFromValue] = useState(true)
  let [defaultState, setDefaultState] = useState('__default')
  let [stateDefinitions, setStateDefinitions] = useState({
    '__default': {
      color: null,
      selectable: true,
      label: null,
    }
  })
  let [highlightedRange, setHighlightedRange] = useState<DateRange>(moment.range())
  let [highlightedDate, setHighlightedDate] = useState<(DateRange & moment.Moment) | null>(null)

  getInitialState();

  //ToDo: Replace UNSAFE_componentWillReceiveProps with this
  /* useEffect(() => {

  }); */

  /* function UNSAFE_componentWillReceiveProps(nextProps: propTypes) {
    const nextDateStates = getDateStates(dateStates, defaultState, stateDefinitions);
    const nextEnabledRange = getEnabledRange(props.minimumDate, props.maximumDate);

    setSelectedStartDate(null)
    setHideSelection(false)
    setDateStates(dateStates && Immutable.is(dateStates, nextDateStates) ? dateStates : nextDateStates)
    setEnabledRange(enabledRange && enabledRange.isSame(nextEnabledRange) ? enabledRange : nextEnabledRange)

    if (hasUpdatedValue(value, nextProps)) {
      if (!nextProps.value || !isStartOrEndVisible()) {
        const yearMonth = getYearMonthProps(nextProps);

        setYear(yearMonth?.year)
        setMonth(yearMonth?.month)
      }
    }
  } */

  function getInitialState() {
    let now = new Date();
    setInitialYear(props.initialYear)
    setInitialMonth(props.initialMonth)
    setInitialFromValue(props.initialFromValue)
    setValue(props.value)
    let year = now.getFullYear();
    let month = now.getMonth();

    if (Number.isInteger(initialYear) && Number.isInteger(initialMonth)) {
      year = initialYear;
      month = initialMonth;
    }

    if (initialFromValue && (moment.isMoment(value) || isMomentRange(value))) {
      const yearMonth = getYearMonthProps(props);
      month = yearMonth?.month;
      year = yearMonth?.year;
    }

    setYear(year);
    setMonth(month);
  }

  function getEnabledRange(minimumDate: Date, maximumDate: Date ) {
    let min = minimumDate ? moment(minimumDate).startOf('day') : absoluteMinimum;
    let max = maximumDate ? moment(maximumDate).startOf('day') : absoluteMaximum;

    return moment.range(min, max);
  }

  

  function isDateDisabled(date: any) {
    return !enabledRange.contains(date);
  }

  function isDateSelectable(date: any) {
    return dateRangesForDate(date).some(r => r.get('selectable'));
  }

  function nonSelectableStateRanges() {
    return dateStates.filter(d => !d.get('selectable'));
  }

  function dateRangesForDate(date: any) {
    return dateStates.filter(d => d.get('range').contains(date));
  }

  function sanitizeRange(range: any, forwards: boolean) {
    /* Truncates the provided range at the first intersection
     * with a non-selectable state. Using forwards to determine
     * which direction to work
     */
    let blockedRanges = nonSelectableStateRanges().map(r => r.get('range'));
    let intersect;

    if (forwards) {
      intersect = blockedRanges.find(r => range.intersect(r));
      if (intersect) {
        return moment.range(range.start, intersect.start);
      }

    } else {
      intersect = blockedRanges.findLast(r => range.intersect(r));

      if (intersect) {
        return moment.range(intersect.end, range.end);
      }
    }

    if (range.start.isBefore(enabledRange.start)) {
      return moment.range(enabledRange.start, range.end);
    }

    if (range.end.isAfter(enabledRange.end)) {
      return moment.range(range.start, enabledRange.end);
    }

    return range;
  }

  function highlightRange(range: DateRange) {
    setHighlightedRange(range)
    setHighlightedDate(null)
    if (typeof props.onHighlightRange === 'function') {
      props.onHighlightRange(range, statesForRange(range));
    }
  }

  function onUnHighlightDate() {
    setHighlightedDate(null);
  }

  function onSelectDate(date: any) {
    setSelectedStartDate(props.selectedStartDate)
    if (props.selectionType === 'range') {
      if (selectedStartDate) {
        completeRangeSelection();
      } else if (date && !isDateDisabled(date) && isDateSelectable(date)) {
        startRangeSelection(date);
        if (props.singleDateRange) {
          highlightRange(moment.range(date, date));
        }
      }

    } else {
      if (!isDateDisabled(date) && isDateSelectable(date)) {
        completeSelection();
      }
    }
  }

  function onHighlightDate(date: any) {
    let datePair;
    let range;
    let forwards;

    if (props.selectionType === 'range') {
      if (selectedStartDate) {
        let selected: moment.Moment = selectedStartDate;
        datePair = Immutable.List.of(selectedStartDate, date).sortBy(d => d.unix());
        range = moment.range(datePair.get(0), datePair.get(1));
        forwards = (range.start.unix() === selected.unix());
        range = sanitizeRange(range, forwards);
        highlightRange(range);
      } else if (!isDateDisabled(date) && isDateSelectable(date)) {
        highlightDate(date);
      }
    } else {
      if (!isDateDisabled(date) && isDateSelectable(date)) {
        highlightDate(date);
      }
    }
  }

  function startRangeSelection(date: moment.Moment) {
    setHideSelection(true)
    setSelectedStartDate(date)
    
    if (typeof props.onSelectStart === 'function') {
      props.onSelectStart(moment(date));
    }
  }

  function statesForDate(date: any) {
    return dateStates.filter(d => date.within(d.get('range'))).map(d => d.get('state'));
  }

  function statesForRange(range: any) {
    if (range.start.isSame(range.end, 'day')) {
      return statesForDate(range.start);
    }
    return dateStates.filter(d => d.get('range').intersect(range)).map(d => d.get('state'));
  }

  function completeSelection() {
    if (highlightedDate) {
      setHideSelection(false)
      setHighlightedDate(null)
      props.onSelect(highlightedDate, statesForDate(highlightedDate));
    }
  }

  function completeRangeSelection() {
    let range = highlightedRange;

    if (range && (!range.start.isSame(range.end, 'day') || props.singleDateRange)) {
      setSelectedStartDate(null)
      setHighlightedRange(moment.range())
      setHighlightedDate(null)
      setHideSelection(false)
      props.onSelect(range, statesForRange(range));
    }
  }

  function highlightDate(date: any) {
    setHighlightedDate(date)
    if (typeof props.onHighlightDate === 'function') {
      props.onHighlightDate(date, statesForDate(date));
    }
  }

  function getMonthDate() {
    return moment(new Date(year, month, 1));
  }

  function isVisible(date: moment.Moment | DateRange | null) {
    const yearMonth = getYearMonth(date);
    const isSameYear = (yearMonth?.year === year);

    const isMonthVisible = yearMonth ? (yearMonth.month === month) || (numberOfCalendars === 2 && (yearMonth.month - 1 === month)) : false;

    return isSameYear && isMonthVisible;
  };

  function isStartOrEndVisible() {
    if (props.selectionType === 'single') {
      return isVisible(value);
    }

    let val: DateRange = value as DateRange;

    return isVisible(val.start) || isVisible(val.end);
  }

  function canMoveBack() {
    if (getMonthDate().subtract(1, 'days').isBefore(enabledRange.start)) {
      return false;
    }
    return true;
  }

  function moveBack() {
    let monthDate;

    if (canMoveBack()) {
      monthDate = getMonthDate();
      monthDate.subtract(1, 'months');
      let ym = getYearMonth(monthDate);
      if(ym){
        setYear(ym.year)
        setMonth(ym.month)
      }
    }
  }

  function canMoveForward() {
    if (getMonthDate().add(props.numberOfCalendars, 'months').isAfter(enabledRange.end)) {
      return false;
    }
    return true;
  }

  function moveForward() {
    let monthDate;

    if (canMoveForward()) {
      monthDate = getMonthDate();
      monthDate.add(1, 'months');
      let ym = getYearMonth(monthDate);
      if(ym){
        setYear(ym.year)
        setMonth(ym.month)
      }
    }
  }

  function changeYear(y: any) {
    if (moment({years: y, months: month, date: 1}).unix() < enabledRange.start.unix()) {
      setMonth(enabledRange.start.month());
    }

    if (moment({years: y, months: month + 1, date: 1}).unix() > enabledRange.end.unix()) {
      setMonth(enabledRange.end.month());
    }

    setYear(y);
  }

  function changeMonth(month: number) {
    setMonth(month)
  }

  function rangesOverlap(rangeA: any, rangeB: any) {
    if (rangeA.overlaps(rangeB) || rangeA.contains(rangeB.start) || rangeA.contains(rangeB.end)) {
      return true;
    }
    return false;
  }

  function renderCalendar(index: any) {
    let monthDate = getMonthDate();
    let year = monthDate.year();
    let month = monthDate.month();
    let key = `${ index}-${ year }-${ month }`;

    monthDate.add(index, 'months');

    let cal = new calendar.Calendar(props.firstOfWeek);
    let monthDates = cal.monthDates(monthDate.year(), monthDate.month());
    let monthStart = monthDates[0][0];
    let len = monthDates && monthDates.length > 0 ? monthDates[monthDates.length] ? monthDates[monthDates.length].length : 0 : 0;
    let monthEnd = monthDates && monthDates[monthDates.length] ? monthDates[monthDates.length][len] : moment();
    let monthRange = moment.range(monthStart, monthEnd);

    if (moment.isMoment(value) && !monthRange.contains(value)) {
      value = null;
    } else if (isMomentRange(value) && !(rangesOverlap(monthRange, value))) {
      value = null;
    }

    if (!moment.isMoment(highlightedDate) || !monthRange.contains(highlightedDate)) {
      highlightedDate = null;
    }

    if (!isMomentRange(highlightedRange) || !(rangesOverlap(monthRange, highlightedRange))) {
      setHighlightedRange(moment.range());
    }

    type calandarPropTypes = {
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

    let calandarProps: calandarPropTypes = {
      bemBlock: props.bemBlock,
      bemNamespace: props.bemNamespace,
      dateStates,
      enabledRange,
      firstOfWeek: props.firstOfWeek,
      hideSelection,
      highlightedDate: highlightedDate,
      highlightedRange: highlightedRange,
      index,
      selectionType: props.selectionType,
      value,
      maxIndex: numberOfCalendars - 1,
      firstOfMonth: monthDate,
      onMonthChange: changeMonth,
      onYearChange: changeYear,
      onSelectDate: onSelectDate,
      onHighlightDate: onHighlightDate,
      onUnHighlightDate: onUnHighlightDate,
      dateRangesForDate: dateRangesForDate,
      dateComponent: CalendarDate,
      locale: props.locale,
      className: props.className,
      disableNavigation: props.disableNavigation
    };

    return <CalendarMonth {...calandarProps} key={key} />;
  }


  let {className, numberOfCalendars, selectedLabel, showLegend, helpMessage} = props;

  let calendars = Immutable.Range(0, numberOfCalendars).map(renderCalendar);

  return (
    <div className={className.trim()}>
      <PaginationArrow direction="previous" onTrigger={moveBack} disabled={!canMoveBack()} />
      {calendars.toJS()}
      <PaginationArrow direction="next" onTrigger={moveForward} disabled={!canMoveForward()} />
      {helpMessage ? <span className='HelpMessage'>{helpMessage}</span> : null}
      {showLegend ? <Legend stateDefinitions={stateDefinitions} selectedLabel={selectedLabel} /> : null}
    </div>
  );
};