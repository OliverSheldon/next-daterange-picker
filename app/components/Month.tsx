'use client'

import Week from "./Week";
import { Calendar } from "calendar";
import * as Moment from 'moment';
import { DateRange, extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

type DateStates = {
    state: string,
    range: DateRange
}

type Props = {
    setIsMouseDown: Function,
    mouseDown: Function,
    isMouseDown: boolean,
    mouseUp: Function,
    mouseOver: Function,
    dateStates: DateStates[] | null | undefined,
    selectedStartDay: Date | null,
    selectedEndDay: Date | null,
    setStartDay: Function,
    setEndDay: Function,
    monthDates: Date[][],
    monthStart: Date,
    monthEnd: Date,
    selectableDateRange: DateRange | null
}

export default function Month({setIsMouseDown, mouseDown, isMouseDown, mouseUp, mouseOver, dateStates, selectedStartDay, selectedEndDay, setStartDay, setEndDay, monthDates, monthStart, monthEnd, selectableDateRange}: Props) {
  return (
    <div>
      <div>
        <div className="day-title">Mon</div>
        <div className="day-title">Tue</div>
        <div className="day-title">Wed</div>
        <div className="day-title">Thu</div>
        <div className="day-title">Fri</div>
        <div className="day-title">Sat</div>
        <div className="day-title">Sun</div>
      </div>
      {
        monthDates.map((item, index)=>
            <Week
                key={index}
                setIsMouseDown={setIsMouseDown}
                mouseDown={mouseDown}
                isMouseDown={isMouseDown}
                mouseUp={mouseUp}
                mouseOver={mouseOver}
                dates={item}
                monthStart={monthStart}
                monthEnd={monthEnd}
                dateStates={dateStates}
                selectedStartDay={selectedStartDay}
                selectedEndDay={selectedEndDay}
                setStartDay={setStartDay}
                setEndDay={setEndDay}
                monthDates={monthDates}
                selectableDateRange={selectableDateRange}
            />
        )
      }
    </div>
  );
}
