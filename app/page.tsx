'use client'

import { useState } from "react";
import * as Moment from 'moment';
import { DateRange, extendMoment } from 'moment-range';
const moment = extendMoment(Moment);
import Month from "./components/Month";
import Calendar from "./components/Calendar";

type DateStates = {
  state: string,
  range: DateRange
}

type Dates = {
  start: Date,
  end: Date
}

export default function Home() {
  let [dates, setDates] = useState<Dates>({start: new Date(), end: new Date()})


  let dateStates: DateStates[] = [
    {
      state: 'unavailable',
      range: moment.range(
        moment().add(2, 'weeks').startOf('day'),
        moment().add(2, 'weeks').add(5, 'days').endOf('day')
      ),
    },
    {
      state: 'unavailable',
      range: moment.range(
        moment().add(3, 'weeks').add(1, 'days').startOf('day'),
        moment().add(3, 'weeks').add(5, 'days').endOf('day')
      ),
    }
  ]

  return (
    <>
      <Calendar getSelectedDates={setDates} dateStates={dateStates}/>
      <div style={{width: "500px",display: "flex", justifyContent: "space-between"}}>
        <input style={{width: "calc(34px*7)", boxSizing: "border-box", padding: "5px"}} type="date" defaultValue={dates.start ? moment(dates.start).format('yyyy-MM-DD') : ''}/>
        <input style={{width: "calc(34px*7)", boxSizing: "border-box", padding: "5px"}} type="date" defaultValue={dates.end ? moment(dates.end).format('yyyy-MM-DD') : ''}/>
      </div>
    </>
  );
}
