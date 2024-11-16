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
        moment().add(4, 'weeks').add(1, 'days').startOf('day'),
        moment().add(4, 'weeks').add(5, 'days').endOf('day')
      ),
    },
    {
      state: 'unavailable',
      range: moment.range(
        moment().add(6, 'weeks').add(1, 'days').startOf('day'),
        moment().add(6, 'weeks').add(5, 'days').endOf('day')
      ),
    }
  ]

  /* let dateStates: DateStates[] = [
    {
        state: "unavailable",
        range: moment.range(
            new Date("2024-11-18T00:00:00.000Z"),
            new Date("2024-11-20T00:00:00.000Z")
        )
    },
    {
        state: "unavailable",
        range: moment.range(
            new Date("2024-11-23T00:00:00.000Z"),
            new Date("2024-11-23T00:00:00.000Z")
        )
    },
    {
        state: "unavailable",
        range: moment.range(
            new Date("2024-11-25T00:00:00.000Z"),
            new Date("2024-12-01T00:00:00.000Z")
        )
    },
    {
        state: "unavailable",
        range: moment.range(
            new Date("2024-12-16T00:00:00.000Z"),
            new Date("2024-12-22T00:00:00.000Z")
        )
    },
    {
        state: "unavailable",
        range: moment.range(
            new Date("2025-03-10T00:00:00.000Z"),
            new Date("2025-03-16T00:00:00.000Z")
        )
    }
] */

  return (
    <>
      <Calendar getSelectedDates={setDates} dateStates={dateStates} showTwoMonths={true}/>
      <div style={{width: "500px",display: "flex", justifyContent: "space-between"}}>
        <input style={{width: "calc(34px*7)", boxSizing: "border-box", padding: "5px"}} type="date" defaultValue={dates.start ? moment(dates.start).format('yyyy-MM-DD') : ''}/>
        <input style={{width: "calc(34px*7)", boxSizing: "border-box", padding: "5px"}} type="date" defaultValue={dates.end ? moment(dates.end).format('yyyy-MM-DD') : ''}/>
      </div>
    </>
  );
}
