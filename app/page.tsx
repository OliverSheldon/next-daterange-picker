'use client'
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);
/* import Main from './components/example/code-snippets/main'
import I18n from './components/example/code-snippets/i18n' */
import timekeeper from 'timekeeper';
import Header from './components/example/header';
import Footer from './components/example/footer';
import GithubRibbon from './components/example/github-ribbon';
//import CodeSnippet from './components/example/code-snippet';
import Install from './components/example/install';
import Features from './components/example/features';

import DatePickerRange from './components/example/DatePickerRange';
import DatePickerSingle from './components/example/DatePickerSingle';
import DatePickerSingleWithSetDateButtons from './components/example/DatePickerSingleWithSetDateButtons';
import DatePickerRangeWithSetRangeButtons from './components/example/DatePickerRangeWithSetRangeButtons';
import { useState } from 'react';

const today = moment();

timekeeper.freeze(new Date('2024-07-01'));

function processCodeSnippet(src : string) {
  var lines = src.split('\n');
  lines.splice(0, 3);
  return lines.join('\n');
}

//var mainCodeSnippet = fs.readFileSync(__dirname + '/code-snippets/main.jsx', 'utf8');
//var i18nCodeSnippet = fs.readFileSync(__dirname + '/code-snippets/i18n.jsx', 'utf8');

export default function Home() {
  const [locale, setLocale] = useState('en');

  function _selectLocale() {
    const loc = locale;
    if (loc !== 'en') {
      require(`moment/locale/${loc}`);
    }
    moment.locale(loc);
  
    setLocale(loc)
  }

  const stateDefinitions = {
    available: {
      color: '#ffffff',
      label: 'Available',
    },
    unavailable: {
      selectable: false,
      color: '#78818b',
      label: 'Unavailable',
    },
  };

  const dateRanges = [
    {
      state: 'unavailable',
      range: moment.range(
        moment().add(3, 'weeks'),
        moment().add(3, 'weeks').add(5, 'days')
      ),
    }
  ];

  const initialStart = moment().add(1, 'weeks').startOf('day');
  const initialEnd = moment().add(1, 'weeks').add(3, 'days').startOf('day');

  return (
    <main>
      <Header />
      <GithubRibbon />

      <div className="content">
        <div className="example">
          <DatePickerRange
            firstOfWeek={1}
            numberOfCalendars={2}
            selectionType='range'
            singleDateRange={true}
            minimumDate={new Date()}
            maximumDate={moment().add(2, 'years').toDate()}
            stateDefinitions={stateDefinitions}
            dateStates={dateRanges}
            defaultState="available"
            value={moment.range(initialStart, initialEnd)}
            showLegend={true}
            className="DatePickerRange"
            />
        </div>

        <Features />
        <Install />

        <div className="examples">
          <h2>Examples</h2>

          <div className="example">
            <h4>Range with no date states</h4>
            <DatePickerRange
              numberOfCalendars={2}
              selectionType="range"
              minimumDate={new Date()} />
          </div>

          <div className="example">
            <h4>Range with day-long ranges allowed</h4>
            <DatePickerRange
              numberOfCalendars={2}
              selectionType="range"
              singleDateRange={true}
              minimumDate={new Date()} />
          </div>

          <div className="example">
            <h4>Single with no date states</h4>
            <DatePickerSingle
              numberOfCalendars={2}
              selectionType="single"
              minimumDate={new Date()} />
          </div>

          <div className="example">
            <h4>
              i18n support based on moment/locale &nbsp;&nbsp;
              <select onChange={_selectLocale} name="locale" id="locale">
                <option value="en">EN</option>
                <option value="ar-sa">AR</option>
                <option value="fr">FR</option>
                <option value="it">IT</option>
                <option value="es">ES</option>
                <option value="de">DE</option>
                <option value="ru">RU</option>
              </select>
            </h4>
            <DatePickerRange
              locale={locale}
              numberOfCalendars={2}
              selectionType="range"
              minimumDate={new Date()} />
          </div>

          <div className="example">
            <h4>Setting Calendar Externally</h4>
            <DatePickerSingleWithSetDateButtons
              numberOfCalendars={1}
              selectionType="single"
              />
          </div>

          <div className="example">
            <h4>Setting Calendar Range Externally</h4>
            <DatePickerRangeWithSetRangeButtons
              numberOfCalendars={2}
              selectionType="range"
              />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
