namespace ITESCAM {

  const constMonths: zellerMonth[] = [
    { name: "enero", value: 1, numdays: 31, zellerVal: 11 },
    { name: "febrero", value: 2, numdays: 28, zellerVal: 12 },
    { name: "marzo", value: 3, numdays: 31, zellerVal: 1 },
    { name: "abril", value: 4, numdays: 30, zellerVal: 2 },
    { name: "mayo", value: 5, numdays: 31, zellerVal: 3 },
    { name: "junio", value: 6, numdays: 30, zellerVal: 4 },
    { name: "julio", value: 7, numdays: 31, zellerVal: 5 },
    { name: "agosto", value: 8, numdays: 31, zellerVal: 6 },
    { name: "septiembre", value: 9, numdays: 30, zellerVal: 7 },
    { name: "octubre", value: 10, numdays: 31, zellerVal: 8 },
    { name: "noviembre", value: 11, numdays: 30, zellerVal: 9 },
    { name: "diciembre", value: 12, numdays: 31, zellerVal: 10 },
  ];

  export const constDays = [
    { name: "domingo" },
    { name: "lunes" },
    { name: "martes" },
    { name: "miércoles" },
    { name: "jueves" },
    { name: "viernes" },
    { name: "sábado" },
  ];

  export interface Day {
    name?: string;
    value: number;
    abbr?: string;
    month?: Month;
    year?: Year;
    color?: string;
    events?: Event[]
  }

  export interface Month {
    name?: string;
    value: number;
    numdays: number;
    days?: Day[];
    weeks?: Week[];
    year?: Year;
  }

  interface zellerMonth extends Month {
    zellerVal?: number;
  }

  export interface Week {
    value: number;
    days?: Day[];
  }

  export interface Year {
    value: number;
    months?: Month[];
  }

  export interface Event {
    id: number;
    name: string;
    typeId: number;
    startDate?: MDate | string;
    endDate?: MDate | string;
    important?: boolean;
    iconPath?: string;
    url?: string;
    description?: string;
  }

  export interface EventType {
    id: number;
    name: string;
    color: string;
    required?: boolean;
  }

  export class MDate {
    day!: Day;
    month!: Month;
    year!: Year;
    constructor(day: number, month: number, year:number){
      this.day = { value: day };
      this.month = this.getMonthByMMYY(month, year);
      this.year = { value: year };
    }
    getMonthByMMYY(month: number, year: number): Month {
      let nmon: Month = { value: 0, numdays: 0 };
      for (const mon of constMonths) {
        if(mon.value === month){
          nmon.value = month;
          if(mon.name === 'febrero' && MDate.isLeapYear(year)){
            nmon.numdays = mon.numdays++;
          } else {
            nmon.numdays = mon.numdays;
          }
          nmon.year = { value: year };
          return nmon;
        }
      }
      return { name: 'enero', value: 1, numdays: 31 };
    }
    static isLeapYear(year: number): boolean {
			let response = false;
			response = (year%4==0) ? ((year%100==0) ? ((year%400==0) ? true : false): true ) : false;
			return response;
    }
    getCurrentDate() {
      return { day: this.day, month: this.month, year: this.year };
    }
    toString(): string {
      return `${this.day.value}/${this.month.value}/${this.year.value}`;
    }
  }

  export interface Cycle {
    startDate: MDate;
    endDate: MDate;
    type?: string;
    years?: Year[];
    name?: string;
  }

  export interface Period {
    startDate: MDate;
    endDate: MDate;
    cycles?: Cycle[];
    years?: Year[];
    name?: string;
  }

  export function capitalize(word: string|undefined): string {
    let response = '';
    if(typeof word === 'string'){
      response = word[0].toUpperCase() + word.slice(1);
    }
    return response;
  }

  function getCompleteMDate(date: MDate): MDate {
    let name = Calendar.getDayName(date.day.value, date.month.value, date.year.value);
    let mon: Month = {
      value: date.month.value,
      numdays: date.month.numdays,
      name: constMonths[date.month.value-1].name,
      year: date.year
    };
    let ndate = date;
    ndate.day = {
      value: date.day.value,
      name: name,
      abbr: (typeof name === "string") ? name.substring(0, 3) : undefined,
      month: mon,
      year: date.year
    };
    // console.log(date.month);
    ndate.month = mon;
    ndate.year = {
      value: date.year.value
    }
    return ndate;
  }

  export class Calendar {
    period!: Period;
    periods?: Period[];
    eventTypes?: EventType[];
    events?: Event[];
    // cycles?: Cycle[];
    constructor()
    constructor(startDate?: MDate, endDate?: MDate) {
      if(typeof startDate !== "undefined" && typeof endDate !== "undefined"){
        this.period = this.createPeriod(startDate, endDate);
        this.periods = [];
      } else {
        this.period = this.emptyPeriod();
      }
    }
    /* Start Periods Methods */
    createPeriod(startDate: MDate, endDate:MDate): Period {
      let start = getCompleteMDate(startDate);
      let end = getCompleteMDate(endDate);
      let name = startDate.year.value.toString() +"-"+endDate.year.value.toString();
      let period: Period = {
        startDate: start,
        endDate: end,
        years: this.getYears(start, end),
        name: name
      };
      return period;
    }
    emptyPeriod(): Period {
      let start = new MDate(1,1,2000);
      let end = new MDate(1,1,2000);
      let period: Period = {
        startDate: start,
        endDate: end,
      };
      return period;
    }
    setPeriod(period: Period): void {
      this.period = period;
    }
    /**
     * Tries to add a new period to the periods array, if exists already it returns `false`, else `true`
     * @param period
     */
    addPeriod(period: Period): boolean {
      if(this.periods.find(elem => elem.name == period.name))
        return false;
      this.periods.push(period);
      return true;
    }
    setActivePeriod(name: string): boolean {
      let active: Period | undefined;
      active = this.periods.find(elem => elem.name == name)
      if(active){
        this.period = active;
        return true;
      }
      return false;
    }
    /* End Period Methods*/
    /* Start cycles Methods */
    /**
     * Genera los ciclos dentro del periodo dado la las fecha de final de N y la fecha de inicio de P.
     * @param endDateN La fecha donde terminará el ciclo N
     * @param startDateP la fecha en que iniciará el ciclo P
     */
    generateCycles(endDateN: MDate, startDateP: MDate): void {
      let cycles: Cycle[] = [];
      let __startDateN = this.period.startDate, __startDateP = getCompleteMDate(startDateP);
      let __endDateN = getCompleteMDate(endDateN), __endDateP = this.period.endDate;
      cycles.push({
        startDate: __startDateN,
        endDate: __endDateN,
        type: "N",
        years: this.getYears(__startDateN, __endDateN),
        name: this.period.name+'N'
      });
      cycles.push({
        startDate: __startDateP,
        endDate: __endDateP,
        type: "P",
        years: this.getYears(__startDateN, __endDateN),
        name: this.period.name+'P'
      });
      this.period.cycles = cycles;
    }
    /* End Cycles Methods*/
    getYears(startDate: MDate, endDate: MDate): Year[] {
      let years: Year[] = [];
      const startYear = startDate.year.value, endYear = endDate.year.value;
      const startMonth = startDate.month.value, lastMonth = endDate.month.value;
      const startDay = startDate.day.value, lastDay = endDate.day.value;
      let currentYear = startYear;
      let month: Month;
      while(currentYear <= endYear){
        month = constMonths[0];
        if(currentYear === endYear){
          month.year = { value: currentYear };
          years.push({
            value: currentYear,
            months: this.getMonths(month , constMonths[lastMonth-1], undefined, lastDay)
          });
        } else {
          if(currentYear === startYear){
            month = constMonths[startMonth-1];
            month.year = { value: currentYear };
            years.push({
              value: currentYear,
              months: this.getMonths(month, undefined , startDay, undefined)
            });
          } else {
            month.year = { value: currentYear };
            years.push({
              value: currentYear,
              months: this.getMonths(month)
            });
          }
        }
        currentYear++;
      }
      return years;
    }
    getMonths(startMonth: Month, endMonth?: Month, startDay?: number, endDay?: number): Month[] {
      let months: Month[] = [];
      let __startMonth = startMonth.value, __endMonth = 12, __year = 2000;
      let __startDay = 1, __endDay = constMonths[11].numdays;
      if(typeof endMonth !== "undefined"){
        __endMonth = endMonth.value;
      }
      if(typeof startMonth.year !== "undefined"){
        __year = startMonth.year.value;
      }
      let currentMonth = __startMonth;
      let month: Month = { value: 0, numdays: 0 }; let days: Day[] = [];
      let weeks: Week[] = [];
      while(currentMonth <= __endMonth){
        month = constMonths[currentMonth-1];
        month.year = { value: __year };
        if(month.value === constMonths[1].value && MDate.isLeapYear(__year)){
          month.numdays++;
        }
        if(currentMonth === __startMonth && typeof startDay !== "undefined"){
          __startDay = startDay;
          __endDay = month.numdays;
        }else if(currentMonth === __endMonth && typeof endDay !== "undefined"){
          __startDay = 1;
          __endDay = endDay;
        } else {
          __startDay = 1;
          __endDay = month.numdays;
        }
        days = this.getDays(month, __startDay, __endDay);
        weeks = this.getWeeksForCalendar(days);
        // weeks = this.getWeeks(days);
        months.push({
          value: currentMonth,
          numdays: month.numdays,
          days: days,
          weeks: weeks,
          name: constMonths[currentMonth-1].name,
          year: month.year
        });
        currentMonth++;
      }
      return months;
    }
    getWeeks(days: Day[]): Week[] {
      let weeks: Week[] = [], daysOfWeek: Day[] = [];
      let weekNum = 1; let lastDay: Day;
      if(typeof days !== "undefined"){
        lastDay = days[days.length -1];
        for (const day of days) {
          daysOfWeek.push(day);
          if(day.name == "sábado" || day === lastDay){
            weeks.push({
              value: weekNum,
              days: daysOfWeek
            })
            weekNum++;
            daysOfWeek = [];
          }
        }
      }
      return weeks;
    }
    getDays(month: Month, startDay: number, endDay: number): Day[] {
      let days: Day[] = [];
      let mon: Month = { value: 0, numdays: 0 };
      mon.value = month.value;
      mon.numdays = month.numdays;
      mon.name = month.name;
      mon.year = month.year;
      let currentDay = startDay;
      let year = (typeof month.year !== "undefined") ? month.year.value : 2000;
      let name: string;
      while(currentDay <= endDay){
        name = Calendar.getDayName(currentDay, month.value, year)!;
        days.push({
          value: currentDay,
          month: mon,
          year: month.year,
          name: name,
          abbr: (typeof name === "string") ? name.substring(0, 3) : undefined,
          color: '',
          events: []
        });
        //color : '-moz-linear-gradient(left, black, grey 30%, green 30%, white)'
        currentDay++;
      }
      return days;
    }
    /**
     * Get the days of the month and completes it until there's a complete sheet of calendar
     * @param days the days to map
     */
    getWeeksForCalendar(days: Day[]): Week[] {
      let weeks: Week[] = [], daysOfWeek: Day[] = [];
      let weekNum = 1;
      let startDay: Day, lastDay: Day;
      if(typeof days !== "undefined"){
        startDay = days[0];
        lastDay = days[days.length -1];
        if(startDay.name != constDays[0].name){
          for (const day of constDays) {
            if(day.name == startDay.name){
              break;
            }
            daysOfWeek.push({
              value: 0,
              name: day.name
            });
          }
        }
        for (const day of days) {
          daysOfWeek.push(day);
          if(day.name == "sábado"){
            weeks.push({
              value: weekNum,
              days: daysOfWeek
            })
            if(day != lastDay ) weekNum++;
            daysOfWeek = [];
          }
        }
        if(lastDay.name != constDays[constDays.length-1].name){
          for(let i = constDays.map(e => e.name).indexOf(lastDay.name!) + 1; i < constDays.length; i++){
            daysOfWeek.push({
              value: 0,
              name: constDays[i].name
            });
          }
          weeks.push({
            value: weekNum,
            days: daysOfWeek
          })
        }
        if(weekNum<6){
          weekNum++;
          daysOfWeek = [];
          for (const day of constDays) {
            daysOfWeek.push({
              value: 0,
              name: day.name
            });
          }
          weeks.push({
            value: weekNum,
            days: daysOfWeek
          });
        }
      }
      return weeks;
    }
    /**
     * Applies the Zeller rule to calculate the name of an speciefied Date
     * @param {number} day The day of in number format
     * @param {number} month The month in number format
     * @param {number} year The year in number format
     */
    static getDayName(day: number, month: number, year: number): string | undefined {
      let k = day, m = constMonths[month-1].zellerVal;
      let yearText = year.toString();
      let C = parseInt(yearText.substring(0,2));
      let d = parseInt(yearText.substring(2));
      let D = (m>=11) ? (d-1) : d;
      let f = k + Math.floor((13*m-1)/5) + D + Math.floor(D/4) + Math.floor(C/4) - 2*C;
      let numDay = 0;
      if(f < 0){
        f *= -1;
        let mult = 7;
        while(f > mult){
          mult += 7;
        }
        numDay = mult - f;
      } else {
        numDay = f%7;
      }
      let response = constDays[numDay].name;
      return response;
    }
    searchMonth(month: string | undefined, year: number): Month {
      let mon: Month = { value: 0, numdays: 0 };
      if(typeof this.period.years !== "undefined"){
        for (const cYear of this.period.years) {
          if(cYear.value === year && typeof cYear.months !== "undefined"){
            for (const cMonths of cYear.months) {
              if(cMonths.name === month){
                mon.value = cMonths.value;
                mon.numdays = cMonths.numdays;
                mon.days = cMonths.days;
                mon.name = cMonths.name;
                mon.year = cMonths.year;
                mon.weeks = cMonths.weeks;
                break;
              }
            }
            break;
          }
        }
      }
      return mon;
    }
    getTableHTML(month: number, year: number): string {
      let monNode: Month = this.searchMonth(constMonths[month-1].name, year);
      let monYear = (typeof monNode.year !== "undefined") ? monNode.year.value.toString(): "";
      let yearText = capitalize(monNode.name)+' '+monYear;
      // let id = `${monNode.name!.substring(0,3)+monYear}`;
      let HTMLText: string =
      `<table onclick="toggleView(this)" data-year="${monYear}" data-month="${monNode.name!}">
        <tbody>
          <tr><th colspan="7">${yearText}</th></tr>
          <tr class="dweek">
            <td>D</td>
            <td>L</td>
            <td>M</td>
            <td>M</td>
            <td>J</td>
            <td>V</td>
            <td>S</td>
          </tr>
          ${this.drawWeeksGrid(monNode.weeks!)}
        </tbody>
      </table>`;
      return HTMLText;
    }
    drawWeeksGrid(weeks: Week[] ): string {
      let response = ''; let isLastWeek = false, lastWeek = weeks[weeks.length-1].value, hasSixWeeks = (lastWeek <= 5) ? false : true;
      if(typeof weeks !== "undefined"){
        for (const week of weeks) {
          if(week.value === lastWeek){ isLastWeek = true; }
          response +=
          `<tr class="week">
            ${this.drawDaysGrid(week.days!, isLastWeek)}
          </tr>\n`;
        }
        if(!hasSixWeeks){
          let currentDay = 0;
          response += `<tr class="week">`;
          while(currentDay <= constDays.map(e => e.name).indexOf("sábado")){
            response += `<td></td>\n`;
            currentDay++;
          }
          response +=`</tr>\n`;
        }
      }
      return response;
    }
    drawDaysGrid(days: Day[], isLastWeek: boolean): string {
      let response = '';
      let lastDay = days[days.length-1].name;
      for (const day of constDays) {
        if(day.name === days[0].name){
          break;
        }
        response += `<td></td>\n`;
      }
      for (const day of days) {
        response +=
        `<td id="${day.value}_${day.month!.value}_${day.year!.value}">${day.value}</td>\n`;
      }
      if(isLastWeek && lastDay !== constDays[6].name){
        let currentDay = constDays.map(e => e.name).indexOf(lastDay!);
        while(currentDay !== constDays.map(e => e.name).indexOf("sábado")){
          response += `<td></td>\n`;
          currentDay++;
        }
      }
      return response;
    }
    getAllMonthsHTML(months: Month[]): string {
      let text = '';
      for (const month of months) {
        text +=
        `<div class="month" id="${month.name!.substring(0,3)+month.year!.value}">`
          + this.getTableHTML(month.value, month.year!.value)
        +'</div>\n';
      }
      return text;
    }
    /**
     * Compares two dates, and returns numbers depending if `anotherDate` is lower, same of higher than `date`
     * @param date The first date
     * @param anotherDate The date to be compared
     * @returns {number} `0` if they're the same, `1` if `date` is higher, and `-1` if `date` is lower.
     */
    compareDates(date: MDate, anotherDate: MDate): number {
      let response: number = 0;
      let fdate = new Date(
        date.year.value,
        date.month.value,
        date.day.value
      );
      fdate.setHours(0,0,0,0);
      let sdate = new Date(
        anotherDate.year.value,
        anotherDate.month.value,
        anotherDate.day.value
      );
      sdate.setHours(0,0,0,0);
      let first = fdate.getTime();
      let second = sdate.getTime();
      if(first === second){
        response = 0;
      } else if(first > second){
        response = 1;
      } else {
        response = -1;
      }
      console.log(first, second, response);
      return response;
    }
    /**
     * This gets the events and assigns them to the calendar, and it normalizes the date that comes as string.
     * We receive a string date of the format `yyyy-MM-dd`
     * @param events
     */
    setEvents(events: Event[]) {
      let nomEvents: Event[] =  [];
      events.forEach(event => {
        if(typeof event.startDate === "string" && typeof event.endDate === "string"){
          /// sdA & edA stands for startDateArray and end... the same.
          let sdA = event.startDate.split('-').map(n => parseInt(n));
          let edA = event.endDate.split('-').map(n => parseInt(n));
          //var[0] = YEAR, var[1] = MONTH, var[2] = DAY
          nomEvents.push({
            id: event.id,
            name: event.name,
            typeId: event.typeId,
            startDate: new MDate(sdA[2], sdA[1], sdA[0]),
            endDate: new MDate(edA[2], edA[1], edA[0])
          })
        }
      });
      this.events = nomEvents;
      // this.events = events;
    }
    setEventsType(eventTypes: EventType[]){
      this.eventTypes = eventTypes;
    }
    populateDayWEvents(){
      let el = this;
      el.restoreDayEvents();
      el.events.forEach(event => {
        if (typeof event.startDate !== "string" && typeof event.endDate !== "string"){
          const sy = event.startDate.year.value, ey = event.endDate.year.value;
          const sm = event.startDate.month.value, em = event.endDate.month.value;
          const sd = event.startDate.day.value, ed = event.endDate.day.value;
          let cy: number, cm: number;
          for (const year of el.period.years) {
            if(year.value >= sy && year.value <= ey){
              cy = year.value;
              for (const month of year.months) {
                if((month.value >= sm && cy == sy) || (month.value <= em && cy > sy && cy <= ey)){
                  cm = month.value;
                  for (const day of month.days) {
                    if((day.value >= sd && cm == sm && day.value <= ed) || (day.value <= ed && cm > sm && cm <= em)){
                      day.events.push(event);
                    }
                  }
                  el.updateWeeksForSheet(month);
                }
              }
            }
          }
        }
      });
    }
    updateWeeksForSheet(month: Month){
      for (const day of month.days) {
        const evLength = day.events.length;
        if(evLength == 1){
          const evType = this.eventTypes.find(et => et.id === day.events[0].typeId);
          day.color = evType.color;
        }else if(evLength == 2){
          const evType1 = this.eventTypes.find(et => et.id === day.events[0].typeId);
          const evType2 = this.eventTypes.find(et => et.id === day.events[1].typeId);
          day.color = `-moz-linear-gradient(90deg, ${evType1.color} 50%, ${evType2.color} 50%)`;
        }else if(evLength >= 3){

        }
      }
      let weeks: Week[] = this.getWeeksForCalendar(month.days);
      month.weeks = weeks;
    }
    restoreDayEvents(){
      let el = this;
      el.events.forEach(event => {
        if (typeof event.startDate !== "string" && typeof event.endDate !== "string"){
          const sy = event.startDate.year.value, ey = event.endDate.year.value;
          const sm = event.startDate.month.value, em = event.endDate.month.value;
          const sd = event.startDate.day.value, ed = event.endDate.day.value;
          let cy: number, cm: number;
          for (const year of el.period.years) {
            if(year.value >= sy && year.value <= ey){
              cy = year.value;
              for (const month of year.months) {
                if((month.value >= sm && cy == sy) || (month.value <= em && cy > sy && cy <= ey)){
                  cm = month.value;
                  for (const day of month.days) {
                    if((day.value >= sd && cm == sm && day.value <= ed) || (day.value <= ed && cm > sm && cm <= em)){
                      day.events = [];
                    }
                  }
                  el.updateWeeksForSheet(month);
                }
              }
            }
          }
        }
      });
    }
  }
}

export = ITESCAM
