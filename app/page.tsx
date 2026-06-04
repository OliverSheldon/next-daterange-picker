'use client'

import { useState } from "react";
import * as Moment from 'moment';
import { DateRange, extendMoment } from 'moment-range';
const moment = extendMoment(Moment);
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
  let [dates, setDates] = useState<Dates>({start: moment().startOf('day').toDate(), end: moment().startOf('day').toDate()})


  let dateStates: DateStates[] = [
    {
      state: 'unavailable',
      range: moment.range(
        moment("2026-05-22").startOf('day'),
        moment("2026-05-25").endOf("day")
      ),
    }
  ]

  return (
    <>
      <Calendar getSelectedDates={setDates} dateStates={dateStates} showTwoMonths={true}/>
      <div className="example-inputs">
        <input type="date" defaultValue={dates.start ? moment(dates.start).format('YYYY-MM-DD') : ''}/>
        <input type="date" defaultValue={dates.end ? moment(dates.end).format('YYYY-MM-DD') : ''}/>
      </div>
    </>
  );
}
