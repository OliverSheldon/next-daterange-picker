'use client'

import * as Moment from 'moment';
import { DateRange, extendMoment } from 'moment-range';
const moment = extendMoment(Moment);
import Day from "./Day";

type DateStates = {
    state: string,
    range: DateRange
}

type Props = {
    setIsMouseDown: Function,
    isMouseDown: boolean,
    mouseDown: Function,
    mouseUp: Function,
    mouseOver: Function,
    dates: Date[],
    monthStart: Date,
    monthEnd: Date,
    dateStates: DateStates[] | null | undefined,
    selectedStartDay: Date | null,
    selectedEndDay: Date | null,
    setStartDay: Function,
    setEndDay: Function,
    monthDates: Date[][],
    selectableDateRange: DateRange | null
}

export default function Week({mouseDown, mouseUp, mouseOver, dates, monthStart, monthEnd, dateStates, selectedStartDay, selectedEndDay, setStartDay, setEndDay, monthDates, selectableDateRange} : Props) {
    const belongsToMonth = (date: Date) : boolean =>{
        return moment().range(monthStart, monthEnd).contains(date)
    }   

    return (    
        <div>
            {dates.map((item, index)=>
                <Day
                    key={index}
                    date={item}
                    mouseDown={()=>mouseDown(item)}
                    mouseUp={()=>mouseUp(item)}
                    setMouseOver={()=>mouseOver(item)}
                    belongsToMonth={belongsToMonth(item)}
                    selectedStartDay={selectedStartDay}
                    selectedEndDay={selectedEndDay}
                    dateStates={dateStates}
                    setStartDay={setStartDay}
                    setEndDay={setEndDay}
                    monthDates={monthDates}
                    selectableDateRange={selectableDateRange}
                />
            )}            
        </div>
    );
}