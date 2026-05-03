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
    const ref = useRef(null);

    const getIsUnavailable = (): boolean => {
        let result = false;

        if (Array.isArray(dateStates)) {
            const target = moment.utc(date);

            dateStates.forEach((element) => {
                if (element.state === "unavailable") {
                    const start = moment.utc(element.range.start).startOf('day');
                    const end = moment.utc(element.range.end).endOf('day');

                    if (
                        target.isSameOrAfter(start, 'day') &&
                        target.isSameOrBefore(end, 'day')
                    ) {
                        result = true;
                    }
                }
            });
        }

        return result;
    };

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
        if(selectableDateRange != null){
            let canSelect = false;
            const utcDate = moment.utc(date).startOf('day');
            const utcRangeStart = moment.utc(selectableDateRange.start).startOf('day');
            const utcRangeEnd = moment.utc(selectableDateRange.end).endOf('day');
            const utcSelectedStart = selectedStartDay ? moment.utc(selectedStartDay).startOf('day') : null;
            const utcSelectedEnd = selectedEndDay ? moment.utc(selectedEndDay).startOf('day') : null;

            if(selectedStartDay != null && selectedEndDay == null){
                if(utcDate.isSameOrAfter(utcRangeStart, 'day') && utcDate.isSameOrBefore(utcRangeEnd, 'day')){
                    canSelect = true;
                }
            }
            else if(selectedStartDay != null && selectedEndDay != null){
                if(utcDate.isSameOrAfter(utcRangeStart, 'day') && utcDate.isSameOrBefore(utcRangeEnd, 'day') && utcSelectedStart && utcSelectedEnd && utcDate.isSameOrAfter(utcSelectedStart, 'day') && utcDate.isSameOrBefore(utcSelectedEnd, 'day')){
                    canSelect = true;
                }
            }

            if(canSelect){
                if(utcSelectedStart != null && utcSelectedEnd != null){
                    if(utcSelectedStart.isBefore(utcRangeStart, 'day')){
                        setStartDay(moment.utc(selectableDateRange.start).startOf('day').toDate());
                    }

                    if(utcDate.isSame(utcSelectedStart, 'day')){
                        setStartDay(date);
                    }
                    else if(utcDate.isAfter(utcSelectedStart, 'day') && utcDate.isSameOrBefore(utcSelectedEnd, 'day')){
                        setEndDay(date);
                    }
                }
                else if(utcSelectedStart != null){
                    if(utcDate.isSame(utcSelectedStart, 'day')){
                        setStartDay(date);
                        setEndDay(date);
                    }
                }
            }

            const isStartDay = selectedEndDay == null && selectedStartDay != null && utcSelectedStart != null && utcDate.isSame(utcSelectedStart, 'day');
            const isWithinRange = selectedStartDay != null && selectedEndDay != null && utcSelectedStart != null && utcSelectedEnd != null && utcDate.isSameOrAfter(utcSelectedStart, 'day') && utcDate.isSameOrBefore(utcSelectedEnd, 'day');
            setIsSelected(canSelect && (isStartDay || isWithinRange));
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
    >{moment.utc(date).date()}</div>
}