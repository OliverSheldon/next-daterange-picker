'use client'

import { useEffect, useState } from "react";
import * as Moment from 'moment';
import { DateRange, extendMoment } from 'moment-range';
const moment = extendMoment(Moment);
import Month from "./Month";
import hash from 'object-hash'

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

const utcDate = (date: Date | null | undefined) => date ? moment.utc(date).startOf('day') : null;
const utcDateObject = (date: Date | null | undefined) => date ? moment.utc(date).startOf('day').toDate() : null;

export default function Picker({initDate, dateStates, monthDates, monthStart, monthEnd, monthDates2, monthStart2, monthEnd2, pickerDates, getSelectedDates = undefined} : Props) {

  let [isMouseDown, setIsMouseDown] = useState(false);
  let [startDay, setStartDay] = useState<Date | null>(null);
  let [endDay, setEndDay] = useState<Date | null>(null);
  let [selectedStartDay, setSelectedStartDay] = useState<Date | null>(null);
  let [selectedEndDay, setSelectedEndDay] = useState<Date | null>(null);
  let [normalisedStartDay, setNormalisedStartDay] = useState<Date | null>(null);
  let [normalisedEndDay, setNormalisedEndDay] = useState<Date | null>(null);
  let [selectableDateRange, setSelectableDateRange] = useState<DateRange | null>(null)
  let [lastTouched, setLastTouched] = useState<EventTarget | undefined>()

  useEffect(() => {
    if(getSelectedDates != null){
      getSelectedDates({start: startDay, end: endDay})
    }
  }, [startDay, endDay])

  const reset = () =>{
    setSelectedStartDay(null);
    setSelectedEndDay(null);
    normaliseDates();
    setStartDay(null);
    setEndDay(null);
  }

  const mouseDown = (date: Date) =>
  {
    reset();
    setSelectedStartDay(utcDateObject(date));
    normaliseDates();
    setIsMouseDown(true);
  }

  const mouseOver = (date: Date) => {
    if(isMouseDown){
      setSelectedEndDay(utcDateObject(date));
      normaliseDates();
    }
  }

  const mouseUp = (date: Date) =>
  {
    setSelectedEndDay(utcDateObject(date));
    normaliseDates();
    setIsMouseDown(false);
    setSelectedStartDay(null);
    setSelectedEndDay(null);
  }

  const updateStartDay = (date: Date | null) => {
    setStartDay(utcDateObject(date));
  }

  const updateEndDay = (date: Date | null) => {
    setEndDay(utcDateObject(date));
  }

  const normaliseDates = () => {
    if(selectedStartDay != null && selectedEndDay == null){
      setNormalisedStartDay(utcDateObject(selectedStartDay));
      setNormalisedEndDay(null);
    }
    else if(selectedStartDay != null && selectedEndDay != null){
      const utcStart = utcDate(selectedStartDay)!;
      const utcEnd = utcDate(selectedEndDay)!;
      if(utcStart.isBefore(utcEnd)){
        setNormalisedStartDay(utcStart.toDate());
        setNormalisedEndDay(utcEnd.toDate());
      }
      else{
        setNormalisedStartDay(utcEnd.toDate());
        setNormalisedEndDay(utcStart.toDate());
      }
    }
    else{
        setNormalisedStartDay(null);
        setNormalisedEndDay(null);
    }
  }

  const configureSelectedStart = (date: Date | null) =>{
    if(dateStates != null && dateStates != undefined && dateStates.length > 0){
      if(date != null){
          const utcSelected = utcDate(date)!;
          for(var x=0; x < dateStates.length; x++){
            const utcRangeStart = moment.utc(dateStates[x].range.start).startOf('day');
            const utcRangeEnd = moment.utc(dateStates[x].range.end).endOf('day');
            if(dateStates.length == 1)
            {
              if(utcSelected.isBefore(utcRangeStart)){
                setSelectableDateRange(new DateRange(pickerDates[0][0], utcRangeStart.clone().add(-1, 'days').startOf('day').toDate()))
              }
              else{
                setSelectableDateRange(new DateRange(utcRangeEnd.clone().add(1, 'days').startOf('day').toDate(), pickerDates[pickerDates.length-1][pickerDates[pickerDates.length-1].length-1]))
              }
            }
            else{
              if(x==0){
                  if(utcSelected.isBefore(utcRangeStart)){
                      setSelectableDateRange(new DateRange(pickerDates[0][0], utcRangeStart.clone().add(-1, 'days').startOf('day').toDate()))
                  }
              }
              else{
                const previousRangeEnd = moment.utc(dateStates[x-1].range.end).endOf('day');
                if(utcSelected.isBetween(previousRangeEnd, utcRangeStart)){
                  setSelectableDateRange(new DateRange(previousRangeEnd.clone().add(1, 'days').startOf('day').toDate(), utcRangeStart.clone().add(-1, 'days').startOf('day').toDate()))
                }
                else{
                  const lastPickerDate = moment.utc(pickerDates[pickerDates.length-1][pickerDates[pickerDates.length-1].length-1]).startOf('day');
                  if(utcSelected.isBetween(utcRangeEnd, lastPickerDate.clone().add(1, 'days').startOf('day'))){
                    setSelectableDateRange(new DateRange(utcRangeEnd.clone().add(1, 'days').startOf('day').toDate(), lastPickerDate.clone().add(1, 'days').startOf('day').toDate()))
                  }
                }
              }
            }
          }
      }
    }
    else{
        setSelectableDateRange(new DateRange(pickerDates[0][0], pickerDates[pickerDates.length-1][pickerDates[pickerDates.length-1].length-1]))
    }
  }

  useEffect(() => {
    configureSelectedStart(selectedStartDay)
  },[selectedStartDay]);

  return (
    <>
      <div className="picker" onMouseLeave={()=>setIsMouseDown(false)}>
          <Month
              key={`${hash(monthDates)}-${initDate}`}
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
              setLastTouched={setLastTouched}
              lastTouched={lastTouched}
          />
          <Month
              key={`${hash(monthDates2)}-${initDate}`}
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
              setLastTouched={setLastTouched}
              lastTouched={lastTouched}
          />
      </div>
      <div className="state-legend">
        <span className="state-selected">Your Selection</span>
        <span className="state-unavailable">Unavailable</span>
      </div>
    </>
  );
}
