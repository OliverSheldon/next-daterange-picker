'use client'

import * as Moment from 'moment';
import { DateRange, extendMoment } from 'moment-range';
const moment = extendMoment(Moment);
import Picker from "./Picker";
import { useEffect, useState } from "react";
import MonthSelector from "./MonthSelector";
import { Calendar as C } from "calendar";

type DateStates = {
    state: string,
    range: DateRange
}

type Props = {
    dateStates?: DateStates[]
    getSelectedDates?: Function
}

export default function Calendar({dateStates = undefined, getSelectedDates = undefined} : Props) {
    let calendar = new C(1);

    let [initDate, setDate] = useState<Date>(new Date());
    
    let [monthDate, setMonthDate] = useState<moment.Moment>(moment(new Date(initDate.getFullYear(), initDate.getMonth(), 1)))
    let [monthDates, setMonthDates] = useState<Date[][]>(calendar.monthDates(monthDate.year(), monthDate.month()))
    let [monthStart, setMonthStart] = useState<Date>(monthDate.startOf('month').toDate())
    let [monthEnd, setMonthEnd] = useState<Date>(monthDate.endOf('month').toDate())

    let [monthDate2, setMonthDate2] = useState<moment.Moment>(moment(new Date(moment(initDate).add(1, 'month').toDate().getFullYear(), moment(initDate).add(1, 'month').toDate().getMonth(), 1)))
    let [monthDates2, setMonthDates2] = useState<Date[][]>(calendar.monthDates(monthDate2.year(), monthDate2.month()))
    let [monthStart2, setMonthStart2] = useState<Date>(monthDate2.startOf('month').toDate())
    let [monthEnd2, setMonthEnd2] = useState<Date>(monthDate2.endOf('month').toDate())

    let [pickerDates, setPickerDates] = useState<Date[][]>([...monthDates, ...monthDates2])

    useEffect(() => {
        let md = moment(new Date(initDate.getFullYear(), initDate.getMonth(), 1))
        let mdts = calendar.monthDates(md.year(), md.month())
        setMonthDate(md)
        setMonthDates(mdts)
        setMonthStart(md.startOf('month').toDate())
        setMonthEnd(md.endOf('month').toDate())

        let md2 = moment(new Date(moment(initDate).add(1, 'month').toDate().getFullYear(), moment(initDate).add(1, 'month').toDate().getMonth(), 1))
        let mdts2 = calendar.monthDates(md2.year(), md2.month())

        if(mdts.length > mdts2.length){
            let newDates: Date[] = [];
            let start: Date = mdts2[mdts2.length-1][mdts2[mdts2.length-1].length-1]
            for(var x=0; x<7; x++){
                newDates.push(moment(start).add(1+x, 'days').toDate())
            }
            mdts2.push(newDates)
        }
        else if(mdts2.length > mdts.length){
            let newDates: Date[] = [];
            let start: Date = mdts[mdts.length-1][mdts[mdts.length-1].length-1]
            for(var x=0; x<7; x++){
                newDates.push(moment(start).add(1+x, 'days').toDate())
            }
            mdts.push(newDates)
        }
        else{
            let newDates: Date[] = [];
            let start: Date = mdts2[mdts2.length-1][mdts2[mdts2.length-1].length-1]
            for(var x=0; x<7; x++){
                newDates.push(moment(start).add(1+x, 'days').toDate())
            }
            mdts2.push(newDates)

            let newDates2: Date[] = [];
            let start2: Date = mdts[mdts.length-1][mdts[mdts.length-1].length-1]
            for(var x=0; x<7; x++){
                newDates2.push(moment(start2).add(1+x, 'days').toDate())
            }
            mdts.push(newDates2)
        }

        setMonthDate2(md2)
        setMonthDates2(mdts2)
        setMonthStart2(md2.startOf('month').toDate())
        setMonthEnd2(md2.endOf('month').toDate())

        setPickerDates([...mdts, ...mdts2])
    }, [initDate])

    return(
        <div key={`${dateStates ? JSON.stringify(dateStates) : 'c1'}`} className="calendar">
            <MonthSelector initDate={initDate} setDate={setDate}/>
            <Picker initDate={initDate} dateStates={dateStates} monthDates={monthDates} monthStart={monthStart} monthEnd={monthEnd} monthDates2={monthDates2} monthStart2={monthStart2} monthEnd2={monthEnd2} pickerDates={pickerDates} getSelectedDates={getSelectedDates}/>
        </div>
    );
}