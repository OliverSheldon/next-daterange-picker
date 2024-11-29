'use client'

import moment from "moment";
import { DateRange } from "moment-range";
import { useEffect, useRef, useState } from "react";

type DateStates = {
    state: string,
    range: DateRange
}

type Props = {
    date: Date,
    mouseUp: Function,
    mouseDown: Function,
    setMouseOver: Function,
    belongsToMonth: boolean,
    selectedStartDay: Date | null,
    selectedEndDay: Date | null,
    dateStates: DateStates[] | null | undefined,
    setStartDay: Function,
    setEndDay: Function,
    monthDates: Date[][],
    selectableDateRange: DateRange | null,
    setLastTouched: Function,
    lastTouched: EventTarget | undefined
}

export default function Day({date, mouseUp, mouseDown, setMouseOver, belongsToMonth, selectedStartDay, selectedEndDay, dateStates, setStartDay, setEndDay, monthDates, selectableDateRange, setLastTouched, lastTouched}: Props){
    //console.log(selectedStartDay)
    const ref = useRef(null);
    const getIsUnavailable = () : boolean => {
        let result = false;
        //console.log(date, ' ', monthDates)
        if(dateStates != null && dateStates != undefined && Array.isArray(dateStates)){
            dateStates?.forEach(element => {
                //console.log(moment(date).isSameOrAfter(element.range.start), ' ',moment(date).isSameOrBefore(element.range.end))
                if(element.state == 'unavailable'){
                    if(moment(date).isSameOrAfter(element.range.start) && moment(date).isSameOrBefore(element.range.end)){
                        //console.log(date, ' between ', element.range.start, ' ', element.range.end)
                        if(!result){
                            result = true;
                        }
                    }
                }
            });
        }
        return result;
    }

    let [isSelected, setIsSelected] = useState<boolean>(false)
    let [isUnavailable, setIsUnavailable] = useState<boolean>(false)

    useEffect(() => {
        (ref.current as any).addEventListener('sim-down', (e: Event)=>{
            setLastTouched(e.target)
            mouseDown(date);
        });
        (ref.current as any).addEventListener('sim-up', (e: Event)=>{
            mouseUp(date);
        });
        (ref.current as any).addEventListener('sim-over', (e: Event)=>{
            setLastTouched(e.target)
            setMouseOver(date);
        });
    });

    useEffect(() => {
        setIsUnavailable(getIsUnavailable())
    }, [date, monthDates])

    useEffect(() => {
        //console.log(selectableDateRange, selectedStartDay)
        if(selectableDateRange != null){
            let canSelect = false;
            //console.log(date, ' ', moment(date).isSameOrAfter(selectableDateRange?.start), ' ', moment(date).isSameOrBefore(selectableDateRange?.end), ' ',moment(date).isSameOrAfter(selectedStartDay) , ' ', moment(date).isSameOrBefore(selectedEndDay))
            //console.log('selectable ',selectableDateRange)
            if(selectedStartDay != null && selectedEndDay == null){
                
                //console.log(date, ' ', moment(date).isSameOrAfter(selectableDateRange?.start), ' ', moment(date).isSameOrBefore(selectableDateRange?.end), ' ',moment(date).isSameOrAfter(selectedStartDay))
                //console.log('selected start',selectedStartDay)
                if(moment(date).isSameOrAfter(selectableDateRange?.start) && moment(date).isSameOrBefore(selectableDateRange?.end)/*  && moment(date).isSameOrAfter(selectedStartDay) */){
                    /* console.log('range',selectableDateRange)
                    console.log('date',date) */
                    canSelect = true;
                }
            }
            else if(selectedStartDay != null && selectedEndDay != null){
                //console.log(date, ' ', moment(date).isSameOrAfter(selectableDateRange?.start), ' ', moment(date).isSameOrBefore(selectableDateRange?.end), ' ',moment(date).isSameOrAfter(selectedStartDay) , ' ', moment(date).isSameOrBefore(selectedEndDay))
                //console.log(date, ' ',selectableDateRange?.end)
                if(moment(date).isSameOrAfter(selectableDateRange?.start) && moment(date).isSameOrBefore(selectableDateRange?.end) && moment(date).isSameOrAfter(selectedStartDay) && moment(date).isSameOrBefore(selectedEndDay)){
                    //console.log(date)
                    canSelect = true;
                }
            }

            if(canSelect){
                //console.log(selectedStartDay, selectableDateRange?.start)
                if(selectedStartDay != null && selectedEndDay != null){
                    if(moment(selectedStartDay).isBefore(selectableDateRange?.start)){
                        //console.log(date)
                        setStartDay(selectableDateRange?.start);
                    }

                    if(moment(date).isSame(selectedStartDay)){
                        setStartDay(date);
                        //console.log('start: ', date)
                    }
                    else if(moment(date).isAfter(selectedStartDay) && moment(date).isSameOrBefore(selectedEndDay)){
                        setEndDay(date);
                        //console.log('end: ', date)
                        //console.log(selectedStartDay, selectedEndDay)
                    }
                }
                else if(selectedStartDay != null){
                    if(moment(date).isSame(selectedStartDay)){
                        setStartDay(date);
                        setEndDay(date);
                        //console.log('single start: ', date)
                        //console.log('single end: ', date)
                    }
                }
                /* console.log(date)
                console.log('can select ', canSelect)
                console.log('single date and is start', (selectedEndDay == null && selectedStartDay != null && date == selectedStartDay))
                console.log('selected start', selectedStartDay)
                console.log('selected end', selectedEndDay)
                console.log('this == start', moment(date).isSame(selectedStartDay))
                console.log('multi date and between', (selectedStartDay != null && selectedEndDay != null && date >= selectedStartDay && date <= selectedEndDay))
                console.log(canSelect && ((selectedEndDay == null && selectedStartDay != null && moment(date).isSame(selectedStartDay)) || (selectedStartDay != null && selectedEndDay != null && moment(date).isSameOrAfter(selectedStartDay) && moment(date).isSameOrBefore(selectedEndDay)))) */
            }
            setIsSelected(canSelect && ((selectedEndDay == null && selectedStartDay != null && moment(date).isSame(selectedStartDay)) || (selectedStartDay != null && selectedEndDay != null && moment(date).isSameOrAfter(selectedStartDay) && moment(date).isSameOrBefore(selectedEndDay))))
        }
    }, [selectableDateRange, selectedStartDay, selectedEndDay])

    return <div
    key={date.toString()}
    ref={ref}
    className={`day${isSelected ? ' selected' : ''}${isUnavailable ? ' unavailable' : ''}${belongsToMonth ? '' : ' notInMonth'}`}
    onMouseDown={(e)=>mouseDown(date)}
    onTouchStart={(e)=>{document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY)?.dispatchEvent(new Event('sim-down'))}}
    onMouseUp={(e)=>mouseUp(date)}
    onTouchEnd={(e)=>{lastTouched?.dispatchEvent(new Event('sim-up'))}}
    onMouseOver={(e)=>setMouseOver(date)}
    onTouchMove={(e)=>{document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY)?.dispatchEvent(new Event('sim-over'))}}
    onDrag={(e)=>{e.preventDefault()}}
    >{new Date(date).getDate() }</div>
}