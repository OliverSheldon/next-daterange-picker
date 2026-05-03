'use client'

import moment from "moment";
import { useState } from "react";

type Props = {
    initDate: Date,
    setDate: Function,
    earlierMonthsSelectable: boolean,
    showTwoMonths: boolean
}

export default function MonthSelector({initDate, setDate, earlierMonthsSelectable, showTwoMonths} : Props) {
    let [chosenDate, setChosenDate] = useState<Date>(moment.utc(initDate).startOf('day').toDate())

    const updateDate = (direction: string) => {
        let date: Date = moment.utc(initDate).startOf('month').toDate();
        switch(direction){
            case "Left":
                date = moment.utc(initDate).add(-1, 'month').startOf('month').toDate();                
                break;
            case "Right":
                date = moment.utc(initDate).add(1, 'month').startOf('month').toDate();
                break;
        }
        setChosenDate(date)
        setDate(date)
    }

    return(
        <div className="controls">
            <button type="button" disabled={!earlierMonthsSelectable && moment.utc(chosenDate).startOf('month').isSame(moment.utc().startOf('month'))} onClick={()=>updateDate('Left')}>{'<'}</button>
            <div className={`monthHeader ${!showTwoMonths && 'single'}`}>
                <span>{moment.utc(chosenDate).format('MMM YYYY')}</span>
                {showTwoMonths && <span>{moment.utc(chosenDate).add(1, 'month').format('MMM YYYY')}</span>}
            </div>
            <button type="button" onClick={()=>updateDate('Right')}>{'>'}</button>
        </div>
    );
}