'use client'

import moment from "moment";
import Picker from "./Picker";
import { useState } from "react";

type Props = {
    initDate: Date,
    setDate: Function
}

export default function MonthSelector({initDate, setDate} : Props) {
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
            <button disabled={moment(chosenDate).startOf('month').isSame( moment(new Date()).startOf('month'))} onClick={()=>updateDate('Left')}>{'<'}</button>
            <div className="monthHeader">
                <span>{moment(chosenDate).format('MMMM YYYY')}</span>
                <span>{moment(chosenDate).add(1, 'month').format('MMMM YYYY')}</span>
            </div>
            <button onClick={()=>updateDate('Right')}>{'>'}</button>
        </div>
    );
}