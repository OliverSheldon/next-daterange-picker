'use client'

import { useEffect, useState } from "react";
import * as Moment from 'moment';
import { DateRange, extendMoment } from 'moment-range';
const moment = extendMoment(Moment);
import Month from "./Month";
import { Calendar } from "calendar";

type DateStates = {
    state: string,
    range: DateRange
}

type Props = {
    initDate: Date,
    dateStates: DateStates[] | null | undefined,
    monthDates: Date[][],
    monthStart: Date,
    monthEnd: Date,
    monthDates2: Date[][],
    monthStart2: Date,
    monthEnd2: Date,
    pickerDates: Date[][],
    getSelectedDates: Function | undefined
}

export default function Picker({initDate, dateStates, monthDates, monthStart, monthEnd, monthDates2, monthStart2, monthEnd2, pickerDates, getSelectedDates = undefined} : Props) {

  let [isMouseDown, setIsMouseDown] = useState(false);
  let [startDay, setStartDay] = useState<Date | null>(null);
  let [endDay, setEndDay] = useState<Date | null>(null);
  let [selectedStartDay, setSelectedStartDay] = useState<Date | null>(null);
  let [selectedEndDay, setSelectedEndDay] = useState<Date | null>(null);
  let [normalisedStartDay, setNormalisedStartDay] = useState<Date | null>(null);
  let [normalisedEndDay, setNormalisedEndDay] = useState<Date | null>(null);
  let [selectableDateRange, setSelectableDateRange] = useState<DateRange | null>(null)

  useEffect(() => {
    if(getSelectedDates != null){
      getSelectedDates({start: startDay, end: endDay})
    }
  }, [startDay, endDay])

  const mouseDown = (date: Date) =>
  {
    reset();
    setSelectedStartDay(date);
    normaliseDates();
    setIsMouseDown(true);
  }

  const mouseUp = (date: Date) =>
  {
    setSelectedEndDay(date);
    normaliseDates();
    setIsMouseDown(false);
    setSelectedStartDay(null);
    setSelectedEndDay(null);
  }

  const reset = () =>{
    setSelectedStartDay(null);
    setSelectedEndDay(null);
    normaliseDates();
    setStartDay(null);
    setEndDay(null);
  }

  const mouseOver = (date: Date) => {
    if(isMouseDown){
      setSelectedEndDay(date);
      normaliseDates();
    }
  }

  const updateStartDay = (date: Date | null) => {
    setStartDay(date)
  }

  const updateEndDay = (date: Date | null) => {
    setEndDay(date)
  }

  const normaliseDates = () => {
    if(selectedStartDay != null && selectedEndDay == null){
      setNormalisedStartDay(selectedStartDay);
    }
    else if(selectedStartDay != null && selectedEndDay != null){
      if(selectedStartDay < selectedEndDay){
        setNormalisedStartDay(selectedStartDay);
        setNormalisedEndDay(selectedEndDay);
      }
      else{
        setNormalisedStartDay(selectedEndDay);
        setNormalisedEndDay(selectedStartDay);
      }
    }
    else if(selectedStartDay == null && selectedEndDay == null){
        setNormalisedStartDay(null);
        setNormalisedEndDay(null);
    }
  }

  const configureSelectedStart = (date: Date | null) =>{
    if(dateStates != null){
      if(date != null){
          for(var x=0; x < dateStates.length; x++){
              if(x==0){
                  if(moment(date).isBefore(moment(dateStates[x].range.start))){
                      setSelectableDateRange(new DateRange(pickerDates[0][0], moment(dateStates[x].range.start).add(-1, 'days').startOf('day')))
                      //console.log('1st range ',new DateRange(pickerDates[0][0], moment(dateStates[x].range.start).add(-1, 'days').startOf('day')))
                  }
              }
              else{
                if(moment(date).isBetween(dateStates[x-1].range.end,dateStates[x].range.start) || (x > 0 && x < dateStates.length - 2)){
                  //console.log('mid range ',new DateRange(moment(dateStates[x-1].range.end).add(1, 'days').startOf('day'), moment(dateStates[x].range.start).add(-1, 'days').startOf('day')))
                  setSelectableDateRange(new DateRange(moment(dateStates[x-1].range.end).add(1, 'days').startOf('day'), moment(dateStates[x].range.start).add(-1, 'days').startOf('day')))
                }
                else{
                  if(moment(date).isBetween(dateStates[x].range.end, moment(pickerDates[pickerDates.length-1][pickerDates[pickerDates.length-1].length-1]).add(1, 'days').startOf('day'))){
                    setSelectableDateRange(new DateRange(moment(dateStates[x].range.end).add(1, 'days').startOf('day'), moment(pickerDates[pickerDates.length-1][pickerDates[pickerDates.length-1].length-1]).add(1, 'days').startOf('day')))
                    //console.log('end range ',new DateRange(moment(dateStates[x].range.end).add(1, 'days').startOf('day'), pickerDates[pickerDates.length-1][pickerDates[pickerDates.length-1].length-1]))
                  }
                }
              }
          }
      }
      else{
        setSelectableDateRange(null)
      }
    }
    else{
        setSelectableDateRange(null)
    }
  }

  useEffect(() => {
    configureSelectedStart(selectedStartDay)
  },[selectedStartDay]);

  return (
    <div className="picker" onMouseLeave={()=>setIsMouseDown(false)}>
        <Month
            key={`m0-${initDate}`}
            setIsMouseDown={setIsMouseDown}
            mouseDown={mouseDown}
            isMouseDown={isMouseDown}
            mouseUp={mouseUp}
            mouseOver={mouseOver}
            dateStates={dateStates}
            selectedStartDay={normalisedStartDay}
            selectedEndDay={normalisedEndDay}
            setStartDay={updateStartDay}
            setEndDay={updateEndDay}
            monthDates={monthDates}
            monthStart={monthStart}
            monthEnd={monthEnd}
            selectableDateRange={selectableDateRange}
        />
        <Month
            key={`m1-${initDate}`}
            setIsMouseDown={setIsMouseDown}
            mouseDown={mouseDown}
            isMouseDown={isMouseDown}
            mouseUp={mouseUp}
            mouseOver={mouseOver}
            dateStates={dateStates}
            selectedStartDay={normalisedStartDay}
            selectedEndDay={normalisedEndDay}
            setStartDay={updateStartDay}
            setEndDay={updateEndDay}
            monthDates={monthDates2}
            monthStart={monthStart2}
            monthEnd={monthEnd2}
            selectableDateRange={selectableDateRange}
        />
    </div>
  );
}
