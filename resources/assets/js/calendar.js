"use strict";
var ITESCAM;
(function (ITESCAM) {
    var constMonths = [
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
    ITESCAM.constDays = [
        { name: "domingo" },
        { name: "lunes" },
        { name: "martes" },
        { name: "miércoles" },
        { name: "jueves" },
        { name: "viernes" },
        { name: "sábado" },
    ];
    var MDate = /** @class */ (function () {
        function MDate(day, month, year) {
            this.day = { value: day };
            this.month = this.getMonthByMMYY(month, year);
            this.year = { value: year };
        }
        MDate.prototype.getMonthByMMYY = function (month, year) {
            var nmon = { value: 0, numdays: 0 };
            for (var _i = 0, constMonths_1 = constMonths; _i < constMonths_1.length; _i++) {
                var mon = constMonths_1[_i];
                if (mon.value === month) {
                    nmon.value = month;
                    if (mon.name === 'febrero' && MDate.isLeapYear(year)) {
                        nmon.numdays = mon.numdays++;
                    }
                    else {
                        nmon.numdays = mon.numdays;
                    }
                    nmon.year = { value: year };
                    return nmon;
                }
            }
            return { name: 'enero', value: 1, numdays: 31 };
        };
        MDate.isLeapYear = function (year) {
            var response = false;
            response = (year % 4 == 0) ? ((year % 100 == 0) ? ((year % 400 == 0) ? true : false) : true) : false;
            return response;
        };
        MDate.prototype.getCurrentDate = function () {
            return { day: this.day, month: this.month, year: this.year };
        };
        MDate.prototype.toString = function () {
            return this.day.value + "/" + this.month.value + "/" + this.year.value;
        };
        return MDate;
    }());
    ITESCAM.MDate = MDate;
    function capitalize(word) {
        var response = '';
        if (typeof word === 'string') {
            response = word[0].toUpperCase() + word.slice(1);
        }
        return response;
    }
    ITESCAM.capitalize = capitalize;
    function getCompleteMDate(date) {
        var name = Calendar.getDayName(date.day.value, date.month.value, date.year.value);
        var mon = {
            value: date.month.value,
            numdays: date.month.numdays,
            name: constMonths[date.month.value - 1].name,
            year: date.year
        };
        var ndate = date;
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
        };
        return ndate;
    }
    var Calendar = /** @class */ (function () {
        function Calendar(startDate, endDate) {
            if (typeof startDate !== "undefined" && typeof endDate !== "undefined") {
                this.period = this.createPeriod(startDate, endDate);
                this.periods = [];
            }
            else {
                this.period = this.emptyPeriod();
            }
        }
        /* Start Periods Methods */
        Calendar.prototype.createPeriod = function (startDate, endDate) {
            var start = getCompleteMDate(startDate);
            var end = getCompleteMDate(endDate);
            var name = startDate.year.value.toString() + "-" + endDate.year.value.toString();
            var period = {
                startDate: start,
                endDate: end,
                years: this.getYears(start, end),
                name: name
            };
            return period;
        };
        Calendar.prototype.emptyPeriod = function () {
            var start = new MDate(1, 1, 2000);
            var end = new MDate(1, 1, 2000);
            var period = {
                startDate: start,
                endDate: end
            };
            return period;
        };
        Calendar.prototype.setPeriod = function (period) {
            this.period = period;
        };
        /**
         * Tries to add a new period to the periods array, if exists already it returns `false`, else `true`
         * @param period
         */
        Calendar.prototype.addPeriod = function (period) {
            if (this.periods.find(function (elem) { return elem.name == period.name; }))
                return false;
            this.periods.push(period);
            return true;
        };
        Calendar.prototype.setActivePeriod = function (name) {
            var active;
            active = this.periods.find(function (elem) { return elem.name == name; });
            if (active) {
                this.period = active;
                return true;
            }
            return false;
        };
        /* End Period Methods*/
        /* Start cycles Methods */
        /**
         * Genera los ciclos dentro del periodo dado la las fecha de final de N y la fecha de inicio de P.
         * @param endDateN La fecha donde terminará el ciclo N
         * @param startDateP la fecha en que iniciará el ciclo P
         */
        Calendar.prototype.generateCycles = function (endDateN, startDateP) {
            var cycles = [];
            var __startDateN = this.period.startDate, __startDateP = getCompleteMDate(startDateP);
            var __endDateN = getCompleteMDate(endDateN), __endDateP = this.period.endDate;
            cycles.push({
                startDate: __startDateN,
                endDate: __endDateN,
                type: "N",
                years: this.getYears(__startDateN, __endDateN),
                name: this.period.name + 'N'
            });
            cycles.push({
                startDate: __startDateP,
                endDate: __endDateP,
                type: "P",
                years: this.getYears(__startDateN, __endDateN),
                name: this.period.name + 'P'
            });
            this.period.cycles = cycles;
        };
        /* End Cycles Methods*/
        Calendar.prototype.getYears = function (startDate, endDate) {
            var years = [];
            var startYear = startDate.year.value, endYear = endDate.year.value;
            var startMonth = startDate.month.value, lastMonth = endDate.month.value;
            var startDay = startDate.day.value, lastDay = endDate.day.value;
            var currentYear = startYear;
            var month;
            while (currentYear <= endYear) {
                month = constMonths[0];
                if (currentYear === endYear) {
                    month.year = { value: currentYear };
                    years.push({
                        value: currentYear,
                        months: this.getMonths(month, constMonths[lastMonth - 1], undefined, lastDay)
                    });
                }
                else {
                    if (currentYear === startYear) {
                        month = constMonths[startMonth - 1];
                        month.year = { value: currentYear };
                        years.push({
                            value: currentYear,
                            months: this.getMonths(month, undefined, startDay, undefined)
                        });
                    }
                    else {
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
        };
        Calendar.prototype.getMonths = function (startMonth, endMonth, startDay, endDay) {
            var months = [];
            var __startMonth = startMonth.value, __endMonth = 12, __year = 2000;
            var __startDay = 1, __endDay = constMonths[11].numdays;
            if (typeof endMonth !== "undefined") {
                __endMonth = endMonth.value;
            }
            if (typeof startMonth.year !== "undefined") {
                __year = startMonth.year.value;
            }
            var currentMonth = __startMonth;
            var month = { value: 0, numdays: 0 };
            var days = [];
            var weeks = [];
            while (currentMonth <= __endMonth) {
                month = constMonths[currentMonth - 1];
                month.year = { value: __year };
                if (month.value === constMonths[1].value && MDate.isLeapYear(__year)) {
                    month.numdays++;
                }
                if (currentMonth === __startMonth && typeof startDay !== "undefined") {
                    __startDay = startDay;
                    __endDay = month.numdays;
                }
                else if (currentMonth === __endMonth && typeof endDay !== "undefined") {
                    __startDay = 1;
                    __endDay = endDay;
                }
                else {
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
                    name: constMonths[currentMonth - 1].name,
                    year: month.year
                });
                currentMonth++;
            }
            return months;
        };
        Calendar.prototype.getWeeks = function (days) {
            var weeks = [], daysOfWeek = [];
            var weekNum = 1;
            var lastDay;
            if (typeof days !== "undefined") {
                lastDay = days[days.length - 1];
                for (var _i = 0, days_1 = days; _i < days_1.length; _i++) {
                    var day = days_1[_i];
                    daysOfWeek.push(day);
                    if (day.name == "sábado" || day === lastDay) {
                        weeks.push({
                            value: weekNum,
                            days: daysOfWeek
                        });
                        weekNum++;
                        daysOfWeek = [];
                    }
                }
            }
            return weeks;
        };
        Calendar.prototype.getDays = function (month, startDay, endDay) {
            var days = [];
            var mon = { value: 0, numdays: 0 };
            mon.value = month.value;
            mon.numdays = month.numdays;
            mon.name = month.name;
            mon.year = month.year;
            var currentDay = startDay;
            var year = (typeof month.year !== "undefined") ? month.year.value : 2000;
            var name;
            while (currentDay <= endDay) {
                name = Calendar.getDayName(currentDay, month.value, year);
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
        };
        /**
         * Get the days of the month and completes it until there's a complete sheet of calendar
         * @param days the days to map
         */
        Calendar.prototype.getWeeksForCalendar = function (days) {
            var weeks = [], daysOfWeek = [];
            var weekNum = 1;
            var startDay, lastDay;
            if (typeof days !== "undefined") {
                startDay = days[0];
                lastDay = days[days.length - 1];
                if (startDay.name != ITESCAM.constDays[0].name) {
                    for (var _i = 0, constDays_1 = ITESCAM.constDays; _i < constDays_1.length; _i++) {
                        var day = constDays_1[_i];
                        if (day.name == startDay.name) {
                            break;
                        }
                        daysOfWeek.push({
                            value: 0,
                            name: day.name
                        });
                    }
                }
                for (var _a = 0, days_2 = days; _a < days_2.length; _a++) {
                    var day = days_2[_a];
                    daysOfWeek.push(day);
                    if (day.name == "sábado") {
                        weeks.push({
                            value: weekNum,
                            days: daysOfWeek
                        });
                        if (day != lastDay)
                            weekNum++;
                        daysOfWeek = [];
                    }
                }
                if (lastDay.name != ITESCAM.constDays[ITESCAM.constDays.length - 1].name) {
                    for (var i = ITESCAM.constDays.map(function (e) { return e.name; }).indexOf(lastDay.name) + 1; i < ITESCAM.constDays.length; i++) {
                        daysOfWeek.push({
                            value: 0,
                            name: ITESCAM.constDays[i].name
                        });
                    }
                    weeks.push({
                        value: weekNum,
                        days: daysOfWeek
                    });
                }
                if (weekNum < 6) {
                    weekNum++;
                    daysOfWeek = [];
                    for (var _b = 0, constDays_2 = ITESCAM.constDays; _b < constDays_2.length; _b++) {
                        var day = constDays_2[_b];
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
        };
        /**
         * Applies the Zeller rule to calculate the name of an speciefied Date
         * @param {number} day The day of in number format
         * @param {number} month The month in number format
         * @param {number} year The year in number format
         */
        Calendar.getDayName = function (day, month, year) {
            var k = day, m = constMonths[month - 1].zellerVal;
            var yearText = year.toString();
            var C = parseInt(yearText.substring(0, 2));
            var d = parseInt(yearText.substring(2));
            var D = (m >= 11) ? (d - 1) : d;
            var f = k + Math.floor((13 * m - 1) / 5) + D + Math.floor(D / 4) + Math.floor(C / 4) - 2 * C;
            var numDay = 0;
            if (f < 0) {
                f *= -1;
                var mult = 7;
                while (f > mult) {
                    mult += 7;
                }
                numDay = mult - f;
            }
            else {
                numDay = f % 7;
            }
            var response = ITESCAM.constDays[numDay].name;
            return response;
        };
        Calendar.prototype.searchMonth = function (month, year) {
            var mon = { value: 0, numdays: 0 };
            if (typeof this.period.years !== "undefined") {
                for (var _i = 0, _a = this.period.years; _i < _a.length; _i++) {
                    var cYear = _a[_i];
                    if (cYear.value === year && typeof cYear.months !== "undefined") {
                        for (var _b = 0, _c = cYear.months; _b < _c.length; _b++) {
                            var cMonths = _c[_b];
                            if (cMonths.name === month) {
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
        };
        Calendar.prototype.getTableHTML = function (month, year) {
            var monNode = this.searchMonth(constMonths[month - 1].name, year);
            var monYear = (typeof monNode.year !== "undefined") ? monNode.year.value.toString() : "";
            var yearText = capitalize(monNode.name) + ' ' + monYear;
            // let id = `${monNode.name!.substring(0,3)+monYear}`;
            var HTMLText = "<table onclick=\"toggleView(this)\" data-year=\"" + monYear + "\" data-month=\"" + monNode.name + "\">\n        <tbody>\n          <tr><th colspan=\"7\">" + yearText + "</th></tr>\n          <tr class=\"dweek\">\n            <td>D</td>\n            <td>L</td>\n            <td>M</td>\n            <td>M</td>\n            <td>J</td>\n            <td>V</td>\n            <td>S</td>\n          </tr>\n          " + this.drawWeeksGrid(monNode.weeks) + "\n        </tbody>\n      </table>";
            return HTMLText;
        };
        Calendar.prototype.drawWeeksGrid = function (weeks) {
            var response = '';
            var isLastWeek = false, lastWeek = weeks[weeks.length - 1].value, hasSixWeeks = (lastWeek <= 5) ? false : true;
            if (typeof weeks !== "undefined") {
                for (var _i = 0, weeks_1 = weeks; _i < weeks_1.length; _i++) {
                    var week = weeks_1[_i];
                    if (week.value === lastWeek) {
                        isLastWeek = true;
                    }
                    response +=
                        "<tr class=\"week\">\n            " + this.drawDaysGrid(week.days, isLastWeek) + "\n          </tr>\n";
                }
                if (!hasSixWeeks) {
                    var currentDay = 0;
                    response += "<tr class=\"week\">";
                    while (currentDay <= ITESCAM.constDays.map(function (e) { return e.name; }).indexOf("sábado")) {
                        response += "<td></td>\n";
                        currentDay++;
                    }
                    response += "</tr>\n";
                }
            }
            return response;
        };
        Calendar.prototype.drawDaysGrid = function (days, isLastWeek) {
            var response = '';
            var lastDay = days[days.length - 1].name;
            for (var _i = 0, constDays_3 = ITESCAM.constDays; _i < constDays_3.length; _i++) {
                var day = constDays_3[_i];
                if (day.name === days[0].name) {
                    break;
                }
                response += "<td></td>\n";
            }
            for (var _a = 0, days_3 = days; _a < days_3.length; _a++) {
                var day = days_3[_a];
                response +=
                    "<td id=\"" + day.value + "_" + day.month.value + "_" + day.year.value + "\">" + day.value + "</td>\n";
            }
            if (isLastWeek && lastDay !== ITESCAM.constDays[6].name) {
                var currentDay = ITESCAM.constDays.map(function (e) { return e.name; }).indexOf(lastDay);
                while (currentDay !== ITESCAM.constDays.map(function (e) { return e.name; }).indexOf("sábado")) {
                    response += "<td></td>\n";
                    currentDay++;
                }
            }
            return response;
        };
        Calendar.prototype.getAllMonthsHTML = function (months) {
            var text = '';
            for (var _i = 0, months_1 = months; _i < months_1.length; _i++) {
                var month = months_1[_i];
                text +=
                    "<div class=\"month\" id=\"" + (month.name.substring(0, 3) + month.year.value) + "\">"
                        + this.getTableHTML(month.value, month.year.value)
                        + '</div>\n';
            }
            return text;
        };
        /**
         * Compares two dates, and returns numbers depending if `anotherDate` is lower, same of higher than `date`
         * @param date The first date
         * @param anotherDate The date to be compared
         * @returns {number} `0` if they're the same, `1` if `date` is higher, and `-1` if `date` is lower.
         */
        Calendar.prototype.compareDates = function (date, anotherDate) {
            var response = 0;
            var fdate = new Date(date.year.value, date.month.value, date.day.value);
            fdate.setHours(0, 0, 0, 0);
            var sdate = new Date(anotherDate.year.value, anotherDate.month.value, anotherDate.day.value);
            sdate.setHours(0, 0, 0, 0);
            var first = fdate.getTime();
            var second = sdate.getTime();
            if (first === second) {
                response = 0;
            }
            else if (first > second) {
                response = 1;
            }
            else {
                response = -1;
            }
            console.log(first, second, response);
            return response;
        };
        /**
         * This gets the events and assigns them to the calendar, and it normalizes the date that comes as string.
         * We receive a string date of the format `yyyy-MM-dd`
         * @param events
         */
        Calendar.prototype.setEvents = function (events) {
            var nomEvents = [];
            events.forEach(function (event) {
                if (typeof event.startDate === "string" && typeof event.endDate === "string") {
                    /// sdA & edA stands for startDateArray and end... the same.
                    var sdA = event.startDate.split('-').map(function (n) { return parseInt(n); });
                    var edA = event.endDate.split('-').map(function (n) { return parseInt(n); });
                    //var[0] = YEAR, var[1] = MONTH, var[2] = DAY
                    nomEvents.push({
                        id: event.id,
                        name: event.name,
                        typeId: event.typeId,
                        startDate: new MDate(sdA[2], sdA[1], sdA[0]),
                        endDate: new MDate(edA[2], edA[1], edA[0])
                    });
                }
            });
            this.events = nomEvents;
            // this.events = events;
        };
        Calendar.prototype.setEventsType = function (eventTypes) {
            this.eventTypes = eventTypes;
        };
        Calendar.prototype.populateDayWEvents = function () {
            var el = this;
            el.restoreDayEvents();
            el.events.forEach(function (event) {
                if (typeof event.startDate !== "string" && typeof event.endDate !== "string") {
                    var sy = event.startDate.year.value, ey = event.endDate.year.value;
                    var sm = event.startDate.month.value, em = event.endDate.month.value;
                    var sd = event.startDate.day.value, ed = event.endDate.day.value;
                    var cy = void 0, cm = void 0;
                    for (var _i = 0, _a = el.period.years; _i < _a.length; _i++) {
                        var year = _a[_i];
                        if (year.value >= sy && year.value <= ey) {
                            cy = year.value;
                            for (var _b = 0, _c = year.months; _b < _c.length; _b++) {
                                var month = _c[_b];
                                if ((month.value >= sm && cy == sy) || (month.value <= em && cy > sy && cy <= ey)) {
                                    cm = month.value;
                                    for (var _d = 0, _e = month.days; _d < _e.length; _d++) {
                                        var day = _e[_d];
                                        if ((day.value >= sd && cm == sm && day.value <= ed) || (day.value <= ed && cm > sm && cm <= em)) {
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
        };
        Calendar.prototype.updateWeeksForSheet = function (month) {
            var _loop_1 = function (day) {
                var evLength = day.events.length;
                if (evLength == 1) {
                    var evType = this_1.eventTypes.find(function (et) { return et.id === day.events[0].typeId; });
                    day.color = evType.color;
                }
                else if (evLength == 2) {
                    var evType1 = this_1.eventTypes.find(function (et) { return et.id === day.events[0].typeId; });
                    var evType2 = this_1.eventTypes.find(function (et) { return et.id === day.events[1].typeId; });
                    day.color = "-moz-linear-gradient(90deg, " + evType1.color + " 50%, " + evType2.color + " 50%)";
                }
                else if (evLength >= 3) {
                }
            };
            var this_1 = this;
            for (var _i = 0, _a = month.days; _i < _a.length; _i++) {
                var day = _a[_i];
                _loop_1(day);
            }
            var weeks = this.getWeeksForCalendar(month.days);
            month.weeks = weeks;
        };
        Calendar.prototype.restoreDayEvents = function () {
            var el = this;
            el.events.forEach(function (event) {
                if (typeof event.startDate !== "string" && typeof event.endDate !== "string") {
                    var sy = event.startDate.year.value, ey = event.endDate.year.value;
                    var sm = event.startDate.month.value, em = event.endDate.month.value;
                    var sd = event.startDate.day.value, ed = event.endDate.day.value;
                    var cy = void 0, cm = void 0;
                    for (var _i = 0, _a = el.period.years; _i < _a.length; _i++) {
                        var year = _a[_i];
                        if (year.value >= sy && year.value <= ey) {
                            cy = year.value;
                            for (var _b = 0, _c = year.months; _b < _c.length; _b++) {
                                var month = _c[_b];
                                if ((month.value >= sm && cy == sy) || (month.value <= em && cy > sy && cy <= ey)) {
                                    cm = month.value;
                                    for (var _d = 0, _e = month.days; _d < _e.length; _d++) {
                                        var day = _e[_d];
                                        if ((day.value >= sd && cm == sm && day.value <= ed) || (day.value <= ed && cm > sm && cm <= em)) {
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
        };
        return Calendar;
    }());
    ITESCAM.Calendar = Calendar;
})(ITESCAM || (ITESCAM = {}));
module.exports = ITESCAM;

//# sourceMappingURL=calendar.js.map
