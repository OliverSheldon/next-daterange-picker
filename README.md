# Next Daterange Picker

A Date Range Picker built with next.js and TypeScript

---

## Features

- Click and drag calendar
- Select single date
- Select a date range over 1-2 months
- Define unavailable dates
- Prevention of dates being selected if they fall outside of the selectable range (determined by unavailable dates)
- Output date values to input elements

---

## Demo

Try it out at [https://oliversheldon.co.uk/next-daterange-picker](https://oliversheldon.co.uk/next-daterange-picker).

---

## Getting Started

Import the following:

```
import Calendar from 'next-daterange-picker/app/components/Calendar';
import 'next-daterange-picker/public/styles/calandar.scss'
import * as Moment from 'moment';
import { DateRange, extendMoment } from 'moment-range';
const moment = extendMoment(Moment);
```

The `Calendar` element takes 3 optional parameters: getSelectedDates, dateStates and showTwoMonths.

getSelectedDates is a callback Function which will return the selected start and end date, on change, in the following format:

```
type Dates = {
  start: Date,
  end: Date
}
```
These dates can then be passed to input elements.

dateStates accepts an array of DateStates, which is used to pre highlight any date ranges.
At the moment, this feature only supports one state: "unavailable", which will prevent users from selecting those dates. **Note, this will not stop users from inputting invalid dates in any connected input elements**.
The DateStates type parameters are as follows: 'state: string, range: DateRange' *See imports above*. 
Here is an example of the type and implementation:

```
type DateStates = {
  state: string,
  range: DateRange
}

let dateStates: DateStates[] = [
    {
      state: 'unavailable',
      range: moment.range(
        moment().add(2, 'weeks').startOf('day'),
        moment().add(2, 'weeks').add(5, 'days').endOf('day')
      ),
    },
    {
      state: 'unavailable',
      range: moment.range(
        moment().add(4, 'weeks').add(1, 'days').startOf('day'),
        moment().add(4, 'weeks').add(5, 'days').endOf('day')
      ),
    },
    {
      state: 'unavailable',
      range: moment.range(
        moment().add(6, 'weeks').add(1, 'days').startOf('day'),
        moment().add(6, 'weeks').add(5, 'days').endOf('day')
      ),
    }
  ]
```

showTwoMonths is a boolean which determines how many calendar months are rendered. true = 2 months, false = 1 month.

For a full example, including input elements, see the page.tsx file at 'next-daterange-picker/app/page.tsx'.

---

## Sponsorship

Like what you see? Please consider sponsoring my work via [Github Sponsors](https://github.com/sponsors/OliverSheldon).