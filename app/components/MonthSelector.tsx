'use client'

import moment from "moment";
import Picker from "./Picker";
import { useState } from "react";

type Props = {
    initDate: Date,
    setDate: Function,
    earlierMonthsSelectable: boolean,
    showTwoMonths: boolean
}

export default function MonthSelector({initDate, setDate, earlierMonthsSelectable, showTwoMonths} : Props) {
    let [chosenDate, setChosenDate] = useState<Date>(initDate)

    const updateDate = (direction: string) => {
        let date: Date = new Date();
        switch(direction){
            case "Left":
                date = moment(initDate).add(-1, 'month').toDate();                
                break;
            case "Right":
                date = moment(initDate).add(1, 'month').toDate();
                break;
        }
        setChosenDate(date)
        setDate(date)
    }

    return(
        <div className="controls">
            <button type="button" disabled={!earlierMonthsSelectable && moment(chosenDate).startOf('month').isSame( moment(new Date()).startOf('month'))} onClick={()=>updateDate('Left')}>{'<'}</button>
            <div className={`monthHeader ${!showTwoMonths && 'single'}`}>
                <span>{moment(chosenDate).format('MMMM YYYY')}</span>
                {showTwoMonths && <span>{moment(chosenDate).add(1, 'month').format('MMMM YYYY')}</span>}
            </div>
            <button type="button" onClick={()=>updateDate('Right')}>{'>'}</button>
        </div>
    );
}