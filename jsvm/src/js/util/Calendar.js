/**

 Copyright 2010-2011, The JSVM Project. 
 All rights reserved.
 
 Redistribution and use in source and binary forms, with or without modification, 
 are permitted provided that the following conditions are met:
 
 1. Redistributions of source code must retain the above copyright notice, 
 this list of conditions and the following disclaimer.
 
 2. Redistributions in binary form must reproduce the above copyright notice, 
 this list of conditions and the following disclaimer in the 
 documentation and/or other materials provided with the distribution.
 
 3. Neither the name of the JSVM nor the names of its contributors may be 
 used to endorse or promote products derived from this software 
 without specific prior written permission.
 
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
 IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, 
 INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, 
 BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, 
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF 
 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE 
 OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 OF THE POSSIBILITY OF SUCH DAMAGE.

 *
 * Author: Hu Dong
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: http://jzvm.googlecode.com
 */

$package("js.util");

js.util.Calendar = function(year, month, dayOfMonth, hourOfDay, minute, second){

    var CLASS = js.util.Calendar, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, System = J$VM.System;
    
    /**
     * Field number for <code>get</code> and <code>set</code> indicating the
     * era, e.g., AD or BC in the Julian calendar. This is a calendar-specific
     * value; see subclass documentation.
     *
     * @see GregorianCalendar#AD
     * @see GregorianCalendar#BC
     */
    var ERA = CLASS.ERA = 0;

    /**
     * Field number for <code>get</code> and <code>set</code> indicating the
     * year. This is a calendar-specific value; see subclass documentation.
     */
    var YEAR = CLASS.YEAR = 1;

    /**
     * Field number for <code>get</code> and <code>set</code> indicating the
     * month. This is a calendar-specific value. The first month of
     * the year in the Gregorian and Julian calendars is
     * <code>JANUARY</code> which is 0; the last depends on the number
     * of months in a year.
     *
     * @see #JANUARY
     * @see #FEBRUARY
     * @see #MARCH
     * @see #APRIL
     * @see #MAY
     * @see #JUNE
     * @see #JULY
     * @see #AUGUST
     * @see #SEPTEMBER
     * @see #OCTOBER
     * @see #NOVEMBER
     * @see #DECEMBER
     * @see #UNDECIMBER
     */
    var MONTH = CLASS.MONTH = 2;

    /**
     * Field number for <code>get</code> and <code>set</code> indicating the
     * week number within the current year.  The first week of the year, as
     * defined by <code>getFirstDayOfWeek()</code> and
     * <code>getMinimalDaysInFirstWeek()</code>, has value 1.  Subclasses define
     * the value of <code>WEEK_OF_YEAR</code> for days before the first week of
     * the year.
     *
     * @see #getFirstDayOfWeek
     * @see #getMinimalDaysInFirstWeek
     */
    var WEEK_OF_YEAR = CLASS.WEEK_OF_YEAR = 3;

    /**
     * Field number for <code>get</code> and <code>set</code> indicating the
     * week number within the current month.  The first week of the month, as
     * defined by <code>getFirstDayOfWeek()</code> and
     * <code>getMinimalDaysInFirstWeek()</code>, has value 1.  Subclasses define
     * the value of <code>WEEK_OF_MONTH</code> for days before the first week of
     * the month.
     *
     * @see #getFirstDayOfWeek
     * @see #getMinimalDaysInFirstWeek
     */
    var WEEK_OF_MONTH = CLASS.WEEK_OF_MONTH = 4;

    /**
     * Field number for <code>get</code> and <code>set</code> indicating the
     * day of the month. This is a synonym for <code>DAY_OF_MONTH</code>.
     * The first day of the month has value 1.
     *
     * @see #DAY_OF_MONTH
     */
    var DATE = CLASS.DATE = 5;

    /**
     * Field number for <code>get</code> and <code>set</code> indicating the
     * day of the month. This is a synonym for <code>DATE</code>.
     * The first day of the month has value 1.
     *
     * @see #DATE
     */
    var DAY_OF_MONTH = CLASS.DAY_OF_MONTH = 5;

    /**
     * Field number for <code>get</code> and <code>set</code> indicating the day
     * number within the current year.  The first day of the year has value 1.
     */
    var DAY_OF_YEAR = CLASS.DAY_OF_YEAR = 6;

    /**
     * Field number for <code>get</code> and <code>set</code> indicating the day
     * of the week.  This field takes values <code>SUNDAY</code>,
     * <code>MONDAY</code>, <code>TUESDAY</code>, <code>WEDNESDAY</code>,
     * <code>THURSDAY</code>, <code>FRIDAY</code>, and <code>SATURDAY</code>.
     *
     * @see #SUNDAY
     * @see #MONDAY
     * @see #TUESDAY
     * @see #WEDNESDAY
     * @see #THURSDAY
     * @see #FRIDAY
     * @see #SATURDAY
     */
    var DAY_OF_WEEK = CLASS.DAY_OF_WEEK = 7;

    /**
     * Field number for <code>get</code> and <code>set</code> indicating the
     * ordinal number of the day of the week within the current month. Together
     * with the <code>DAY_OF_WEEK</code> field, this uniquely specifies a day
     * within a month.  Unlike <code>WEEK_OF_MONTH</code> and
     * <code>WEEK_OF_YEAR</code>, this field's value does <em>not</em> depend on
     * <code>getFirstDayOfWeek()</code> or
     * <code>getMinimalDaysInFirstWeek()</code>.  <code>DAY_OF_MONTH 1</code>
     * through <code>7</code> always correspond to <code>DAY_OF_WEEK_IN_MONTH
     * 1</code>; <code>8</code> through <code>14</code> correspond to
     * <code>DAY_OF_WEEK_IN_MONTH 2</code>, and so on.
     * <code>DAY_OF_WEEK_IN_MONTH 0</code> indicates the week before
     * <code>DAY_OF_WEEK_IN_MONTH 1</code>.  Negative values count back from the
     * end of the month, so the last Sunday of a month is specified as
     * <code>DAY_OF_WEEK = SUNDAY, DAY_OF_WEEK_IN_MONTH = -1</code>.  Because
     * negative values count backward they will usually be aligned differently
     * within the month than positive values.  For example, if a month has 31
     * days, <code>DAY_OF_WEEK_IN_MONTH -1</code> will overlap
     * <code>DAY_OF_WEEK_IN_MONTH 5</code> and the end of <code>4</code>.
     *
     * @see #DAY_OF_WEEK
     * @see #WEEK_OF_MONTH
     */
    var DAY_OF_WEEK_IN_MONTH = CLASS.DAY_OF_WEEK_IN_MONTH = 8;

    /**
     * Field number for <code>get</code> and <code>set</code> indicating
     * whether the <code>HOUR</code> is before or after noon.
     * E.g., at 10:04:15.250 PM the <code>AM_PM</code> is <code>PM</code>.
     *
     * @see #AM
     * @see #PM
     * @see #HOUR
     */
    var AM_PM = CLASS.AM_PM = 9;

    /**
     * Field number for <code>get</code> and <code>set</code> indicating the
     * hour of the morning or afternoon. <code>HOUR</code> is used for the
     * 12-hour clock (0 - 11). Noon and midnight are represented by 0, not by 12.
     * E.g., at 10:04:15.250 PM the <code>HOUR</code> is 10.
     *
     * @see #AM_PM
     * @see #HOUR_OF_DAY
     */
    var HOUR = CLASS.HOUR = 10;

    /**
     * Field number for <code>get</code> and <code>set</code> indicating the
     * hour of the day. <code>HOUR_OF_DAY</code> is used for the 24-hour clock.
     * E.g., at 10:04:15.250 PM the <code>HOUR_OF_DAY</code> is 22.
     *
     * @see #HOUR
     */
    var HOUR_OF_DAY = CLASS.HOUR_OF_DAY = 11;

    /**
     * Field number for <code>get</code> and <code>set</code> indicating the
     * minute within the hour.
     * E.g., at 10:04:15.250 PM the <code>MINUTE</code> is 4.
     */
    var MINUTE = CLASS.MINUTE = 12;

    /**
     * Field number for <code>get</code> and <code>set</code> indicating the
     * second within the minute.
     * E.g., at 10:04:15.250 PM the <code>SECOND</code> is 15.
     */
    var SECOND = CLASS.SECOND = 13;

    /**
     * Field number for <code>get</code> and <code>set</code> indicating the
     * millisecond within the second.
     * E.g., at 10:04:15.250 PM the <code>MILLISECOND</code> is 250.
     */
    var MILLISECOND = CLASS.MILLISECOND = 14;

    /**
     * Field number for <code>get</code> and <code>set</code>
     * indicating the raw offset from GMT in milliseconds.
     * <p>
     * This field reflects the correct GMT offset value of the time
     * zone of this <code>Calendar</code> if the
     * <code>TimeZone</code> implementation subclass supports
     * historical GMT offset changes.
     */
    var ZONE_OFFSET = CLASS.ZONE_OFFSET = 15;

    /**
     * Field number for <code>get</code> and <code>set</code> indicating the
     * daylight saving offset in milliseconds.
     * <p>
     * This field reflects the correct daylight saving offset value of
     * the time zone of this <code>Calendar</code> if the
     * <code>TimeZone</code> implementation subclass supports
     * historical Daylight Saving Time schedule changes.
     */
    var DST_OFFSET = CLASS.DST_OFFSET = 16;

    /**
     * Value of the {@link #DAY_OF_WEEK} field indicating
     * Sunday.
     */
    var SUNDAY = CLASS.SUNDAY = 0;

    /**
     * Value of the {@link #DAY_OF_WEEK} field indicating
     * Monday.
     */
    var MONDAY = CLASS.MONDAY = 1;

    /**
     * Value of the {@link #DAY_OF_WEEK} field indicating
     * Tuesday.
     */
    var TUESDAY = CLASS.TUESDAY = 2;

    /**
     * Value of the {@link #DAY_OF_WEEK} field indicating
     * Wednesday.
     */
    var WEDNESDAY = CLASS.WEDNESDAY = 3;

    /**
     * Value of the {@link #DAY_OF_WEEK} field indicating
     * Thursday.
     */
    var THURSDAY = CLASS.THURSDAY = 4;

    /**
     * Value of the {@link #DAY_OF_WEEK} field indicating
     * Friday.
     */
    var FRIDAY = CLASS.FRIDAY = 5;

    /**
     * Value of the {@link #DAY_OF_WEEK} field indicating
     * Saturday.
     */
    var SATURDAY = CLASS.SATURDAY = 6;

    /**
     * Value of the {@link #MONTH} field indicating the
     * first month of the year in the Gregorian and Julian calendars.
     */
    var JANUARY = CLASS.JANUARY = 0;

    /**
     * Value of the {@link #MONTH} field indicating the
     * second month of the year in the Gregorian and Julian calendars.
     */
    var FEBRUARY = CLASS.FEBRUARY = 1;

    /**
     * Value of the {@link #MONTH} field indicating the
     * third month of the year in the Gregorian and Julian calendars.
     */
    var MARCH = CLASS.MARCH = 2;

    /**
     * Value of the {@link #MONTH} field indicating the
     * fourth month of the year in the Gregorian and Julian calendars.
     */
    var APRIL = CLASS.APRIL = 3;

    /**
     * Value of the {@link #MONTH} field indicating the
     * fifth month of the year in the Gregorian and Julian calendars.
     */
    var MAY = CLASS.MAY = 4;

    /**
     * Value of the {@link #MONTH} field indicating the
     * sixth month of the year in the Gregorian and Julian calendars.
     */
    var JUNE = CLASS.JUNE = 5;

    /**
     * Value of the {@link #MONTH} field indicating the
     * seventh month of the year in the Gregorian and Julian calendars.
     */
    var JULY = CLASS.JULY = 6;

    /**
     * Value of the {@link #MONTH} field indicating the
     * eighth month of the year in the Gregorian and Julian calendars.
     */
    var AUGUST = CLASS.AUGUST = 7;

    /**
     * Value of the {@link #MONTH} field indicating the
     * ninth month of the year in the Gregorian and Julian calendars.
     */
    var SEPTEMBER = CLASS.SEPTEMBER = 8;

    /**
     * Value of the {@link #MONTH} field indicating the
     * tenth month of the year in the Gregorian and Julian calendars.
     */
    var OCTOBER = CLASS.OCTOBER = 9;

    /**
     * Value of the {@link #MONTH} field indicating the
     * eleventh month of the year in the Gregorian and Julian calendars.
     */
    var NOVEMBER = CLASS.NOVEMBER = 10;

    /**
     * Value of the {@link #MONTH} field indicating the
     * twelfth month of the year in the Gregorian and Julian calendars.
     */
    var DECEMBER = CLASS.DECEMBER = 11;

    /**
     * Value of the {@link #AM_PM} field indicating the
     * period of the day from midnight to just before noon.
     */
    var AM = CLASS.AM = 0;

    /**
     * Value of the {@link #AM_PM} field indicating the
     * period of the day from noon to just before midnight.
     */
    var PM = CLASS.PM = 1;

    /**
     * Value of the <code>ERA</code> field indicating
     * the period before the common era (before Christ), also known as BCE.
     * The sequence of years at the transition from <code>BC</code> to <code>AD</code> is
     * ..., 2 BC, 1 BC, 1 AD, 2 AD,...
     *
     */
    var BC = CLASS.BC = 0;

    /**
     * Value of the <code>ERA</code> field indicating
     * the common era (Anno Domini), also known as CE.
     * The sequence of years at the transition from <code>BC</code> to <code>AD</code> is
     * ..., 2 BC, 1 BC, 1 AD, 2 AD,...
     *
     */
    var AD = CLASS.AD = 1;

    var EPOCH_OFFSET = 719163; // Fixed date of January 1, 1970 (Gregorian)
    var EPOCH_YEAR   = 1970;

    var MONTH_LENGTH  = [31,28,31,30,31,30,31,31,30,31,30,31]; // 0-based
    var LONTH_LENGTH  = [31,29,31,30,31,30,31,31,30,31,30,31]; // 0-based

    var QUATERS = [JANUARY, APRIL, JULY, OCTOBER];

    // Useful millisecond constants.  Although ONE_DAY and ONE_WEEK can fit
    // into ints, they must be longs in order to prevent arithmetic overflow
    // when performing (bug 4173516).
    var ONE_SECOND = CLASS.ONE_SECOND = 1000;
    var ONE_MINUTE = CLASS.ONE_MINUTE = 60*ONE_SECOND;
    var ONE_HOUR   = CLASS.ONE_HOUR   = 60*ONE_MINUTE;
    var ONE_DAY    = CLASS.ONE_DAY    = 24*ONE_HOUR;
    var ONE_WEEK   = CLASS.ONE_WEEK   = 7*ONE_DAY;

    /*
     * <pre>
     *                            Greatest       Least
     * Field name        Minimum   Minimum     Maximum     Maximum
     * ----------        -------   -------     -------     -------
     * ERA                     0         0           1           1
     * YEAR                    1         1   292269054   292278994
     * MONTH                   0         0          11          11
     * WEEK_OF_YEAR            1         1          52*         53
     * WEEK_OF_MONTH           0         0           4*          6
     * DAY_OF_MONTH            1         1          28*         31
     * DAY_OF_YEAR             1         1         365*        366
     * DAY_OF_WEEK             1         1           7           7
     * DAY_OF_WEEK_IN_MONTH   -1        -1           4*          6
     * AM_PM                   0         0           1           1
     * HOUR                    0         0          11          11
     * HOUR_OF_DAY             0         0          23          23
     * MINUTE                  0         0          59          59
     * SECOND                  0         0          59          59
     * MILLISECOND             0         0         999         999
     * ZONE_OFFSET        -13:00    -13:00       14:00       14:00
     * DST_OFFSET           0:00      0:00        0:20        2:00
     * </pre>
     * *: depends on the Gregorian change date
     */
    var MIN_VALUES = [
        BC,             // ERA
        1,              // YEAR
        JANUARY,        // MONTH
        1,              // WEEK_OF_YEAR
        0,              // WEEK_OF_MONTH
        1,              // DAY_OF_MONTH
        1,              // DAY_OF_YEAR
        SUNDAY,         // DAY_OF_WEEK
        1,              // DAY_OF_WEEK_IN_MONTH
        AM,             // AM_PM
        0,              // HOUR
        0,              // HOUR_OF_DAY
        0,              // MINUTE
        0,              // SECOND
        0,              // MILLISECOND
            -13*ONE_HOUR,   // ZONE_OFFSET (UNIX compatibility)
        0               // DST_OFFSET
    ];

    var MAX_VALUES = [
        AD,             // ERA
        292278994,      // YEAR
        DECEMBER,       // MONTH
        53,             // WEEK_OF_YEAR
        6,              // WEEK_OF_MONTH
        31,             // DAY_OF_MONTH
        366,            // DAY_OF_YEAR
        SATURDAY,       // DAY_OF_WEEK
        6,              // DAY_OF_WEEK_IN
        PM,             // AM_PM
        11,             // HOUR
        23,             // HOUR_OF_DAY
        59,             // MINUTE
        59,             // SECOND
        999,            // MILLISECOND
        14*ONE_HOUR,    // ZONE_OFFSET
        2*ONE_HOUR      // DST_OFFSET (double summer time)
    ];

    /**
     * Returns a <code>Date</code> object representing this
     * <code>Calendar</code>'s time value (millisecond offset from the <a
     * href="#Epoch">Epoch</a>").
     *
     * @return a <code>Date</code> representing the time value.
     */
    thi$.getDate = function(){
        return this.date;   
    };

    /**
     * Sets this Calendar's time with the given <code>Date</code>.
     * <p>
     * Note: Calling <code>setTime()</code> with
     * <code>Date(Long.MAX_VALUE)</code> or <code>Date(Long.MIN_VALUE)</code>
     * may yield incorrect field values from <code>get()</code>.
     *
     * @param date the given Date.
     */
    thi$.setDate = function(date){
        this.date = date || new Date();
    };

    /**
     * Returns this Calendar's time value in milliseconds.
     *
     * @return the current time as UTC milliseconds from the epoch.
     * @see #getTime()
     * @see #setTimeInMillis(long)
     */
    thi$.getTimeInMillis = function(){
        return this.date.getTime();
    };

    /**
     * Sets this Calendar's current time from the given long value.
     *
     * @param millis the new time in UTC milliseconds from the epoch.
     * @see #setTime(Date)
     * @see #getTimeInMillis()
     */
    thi$.setTimeInMillis = function(millis){
        this.date.setTime(millis);
    };

    thi$.getFirstDayOfWeek = function(){
        return this.firstDay;
    };
    
    thi$.setFirstDayOfWeek = function(day){
        this.firstDay = day;
    };
    
    thi$.getMinimalDaysInFirstWeek = function(){
        return this.miniDays1stWeek;
    };
    
    thi$.setMinimalDaysInFirstWeek = function(days){
        this.miniDays1stWeek = days;
    };
    
    /**
     * Return the first day of current date's year
     * 
     * @return Date
     */
    thi$.getFirstDayOfCurrentYear = function(){
        return new Date(this.get(YEAR), JANUARY, 1);
    };
    
    /**
     * Return the first day of current date's month
     * 
     * @return Date
     */
    thi$.getFirstDayOfCurrentMonth = function(){
        return new Date(this.get(YEAR), this.get(MONTH), 1);
    };
    
    /**
     * Return the first day of current date's quarter
     * 
     * @return Date
     */
    thi$.getFirstDayOfCurrentQuarter = function(){
        month= QUATERS[Math.floor(this.get(MONTH)/3)];
        return new Date(this.get(YEAR), month, 1);
    };

    /**
     * Return the first day of current date's week
     */
    thi$.getFirstDayOfCurrentWeek = function(){
        var calendar = new CLASS(
            this.get(YEAR), 
            this.get(MONTH), 
            this.get(DAY_OF_MONTH)), 
        dayOfWeek = this.get(DAY_OF_WEEK);
        
        calendar.add(DAY_OF_MONTH, -dayOfWeek);

        return calendar.getDate();
    };

    /**
     * Returns the value of the given calendar field.
     *
     * @param field the given calendar field.
     * @return the value for the given calendar field.
     * @see #set(int,int)
     */
    thi$.get = function(field){
        var date = this.date, val, t0, t1, dayOfWeekT0;

        switch(field){
        case ERA:
            year = date.getFullYear();
            val = year > 0 ? AD : BC;
            break;
        case YEAR:
            val = date.getFullYear();            
            break;
        case MONTH:
            val = date.getMonth();
            break;
        case WEEK_OF_YEAR:
            year = date.getFullYear();
            t0 = new Date(year, JANUARY, 1);
            t1 = new Date(year, date.getMonth(), date.getDate());
            dayOfWeekT0 = t0.getDay();
            val= Math.ceil(((t1-t0)/ONE_DAY + dayOfWeekT0 + 1)/7);
            break;
        case WEEK_OF_MONTH:
            year = date.getFullYear();
            month= date.getMonth();
            t0 = new Date(year, month, 1);
            t1 = new Date(year, month, date.getDate());
            dayOfWeekT0 = t0.getDay();
            val= Math.ceil(((t1-t0)/ONE_DAY + dayOfWeekT0 + 
                            (dayOfWeekT0 == this.getFirstDayOfWeek() ? 1 : 0))/7);
            break;
        case DATE:
        case DAY_OF_MONTH:
            val = date.getDate();
            break;
        case DAY_OF_YEAR:
            year = date.getFullYear();
            t0 = new Date(year, JANUARY, 1);
            t1 = new Date(year, date.getMonth(), date.getDate());
            val= (t1-t0)/ONE_DAY + 1;
            break;
        case DAY_OF_WEEK:
            val = date.getDay();
            break;
        case DAY_OF_WEEK_IN_MONTH:
            val = Math.ceil(date.getDate()/7);
            break;
        case AM_PM:
            val = date.getHours() < 12 ? AM : PM;
            break;
        case HOUR:
            val = date.getHours() % 12;
            break;
        case HOUR_OF_DAY:
            val = date.getHours();
            break;
        case MINUTE:
            val = date.getMinutes();
            break;
        case SECOND:
            val = date.getSeconds();
            break;
        case MILLISECOND:
            val = date.getMilliseconds();
            break;
        case ZONE_OFFSET:
            val = date.getTimezoneOffset()*ONE_MINUTE;
            break;
        case DST_OFFSET:
            val = 0;
            break;
        default:
            throw "Unsupported field";
        }
        return val;
    };

    /**
     * Sets the given calendar field to the given value. The value is not
     * interpreted by this method regardless of the leniency mode.
     *
     * @param field the given calendar field.
     * @param value the value to be set for the given calendar field.
     * @see #get(int)
     */
    thi$.set = function(field, value){
        if(!Class.isNumber(value)) return;

        var date = this.date, day = date.getDate(),
        t0, t1;

        switch(field){
        case ERA:
            if(this.get(ERA) != value){
                year = this.get(YEAR);
                this.set(YEAR, 1-year);
            }
            break;
        case YEAR:
            if(value <= 0){
                value = 9999;
            }else{
                value = (value > 9999 ? value - 9999 : value);
            }
            
            date.setFullYear(value);
            pinDayOfMonth.call(this, day);
            break;
        case MONTH:
            if(value >= JANUARY && value <= DECEMBER){
                day = date.getDate();
                date.setDate(1);
                date.setMonth(value);
                pinDayOfMonth.call(this, day);
            }
            break;
        case WEEK_OF_YEAR:
            break;
        case WEEK_OF_MONTH:
            break;
        case DATE:
        case DAY_OF_MONTH:
            if(value >= 1 && value <= this.monthLength(
                   this.get(MONTH), this.get(YEAR))){

                date.setDate(value);

            }
            break;
        case DAY_OF_YEAR:// 1~366
            year = date.getFullYear();
            if(value>=1 && value < this.yearLength(year)){
                t0 = new Date(year, JANUARY, 1);
                t1 = new Date(t0.getTime() + (value-1)*ONE_DAY);
                this.set(DAY_OF_MONTH, t1.getDate());
                this.set(MONTH, t1.getMonth());
            }
            break;
        case DAY_OF_WEEK:
            break;
        case DAY_OF_WEEK_IN_MONTH:
            break;
        case AM_PM:
            if(this.get(AM_PM) != value){
                if(AM == value){
                    this.set(HOUR_OF_DAY, this.get(HOUR_OF_DAY)-12);
                }else{
                    this.set(HOUR_OF_DAY, this.get(HOUR_OF_DAY)+12);
                }
            }
            break;
        case HOUR:// 0~11
            if(value >=0 && value < 12){
                date.setHours(value+1);
            }
            break;
        case HOUR_OF_DAY:
            if(value >=0 && value < 24){
                date.setHours(value);                
            }
            break;
        case MINUTE:
            if(value >=0 && value < 60){
                date.setMinutes(value);                
            }
            break;
        case SECOND:
            if(value >=0 && value < 60){
                date.setSeconds(value);                
            }
            break;
        case MILLISECOND:
            if(value >=0 && value < 1000){
                date.setMilliseconds(value);                
            }
            break;
        case ZONE_OFFSET:
        case DST_OFFSET:
            break;
        default:
            throw "Unsupported field";
        }
    };

    /**
     * Sets the values for the fields <code>YEAR</code>, <code>MONTH</code>,
     * <code>DAY_OF_MONTH</code>, <code>HOUR</code>, <code>MINUTE</code>, and
     * <code>SECOND</code>.
     * Previous values of other fields are retained.  If this is not desired,
     * call {@link #clear()} first.
     *
     * @param year the value used to set the <code>YEAR</code> calendar field.
     * @param month the value used to set the <code>MONTH</code> calendar field.
     * Month value is 0-based. e.g., 0 for January.
     * @param date the value used to set the <code>DAY_OF_MONTH</code> calendar field.
     * @param hour the value used to set the <code>HOUR_OF_DAY</code> calendar field.
     * @param minute the value used to set the <code>MINUTE</code> calendar field.
     * @param second the value used to set the <code>SECOND</code> calendar field.
     * @see #set(int,int)
     */
    thi$.setFields = function(year, month, date, hour, minute, second, mills){
        this.set(YEAR, year);
        this.set(MONTH, month);
        this.set(DATE, date);
        this.set(HOUR_OF_DAY, hour);
        this.set(MINUTE, minute);
        this.set(SECOND, second);
        this.set(MILLISECOND, mills);
    };
    
    /**
     * Adds the specified (signed) amount of time to the given calendar field,
     * based on the calendar's rules.
     *
     * <p><em>Add rule 1</em>. The value of <code>field</code>
     * after the call minus the value of <code>field</code> before the
     * call is <code>amount</code>, modulo any overflow that has occurred in
     * <code>field</code>. Overflow occurs when a field value exceeds its
     * range and, as a result, the next larger field is incremented or
     * decremented and the field value is adjusted back into its range.</p>
     *
     * <p><em>Add rule 2</em>. If a smaller field is expected to be
     * invariant, but it is impossible for it to be equal to its
     * prior value because of changes in its minimum or maximum after
     * <code>field</code> is changed, then its value is adjusted to be as close
     * as possible to its expected value. A smaller field represents a
     * smaller unit of time. <code>HOUR</code> is a smaller field than
     * <code>DAY_OF_MONTH</code>. No adjustment is made to smaller fields
     * that are not expected to be invariant. The calendar system
     * determines what fields are expected to be invariant.</p>
     *
     * @param field the calendar field.
     * @param amount the amount of date or time to be added to the field.
     * @exception IllegalArgumentException if <code>field</code> is
     * <code>ZONE_OFFSET</code>, <code>DST_OFFSET</code>, or unknown,
     * or if any calendar fields have out-of-range values in
     * non-lenient mode.
     */
    thi$.add = function(field, amount){
        if(amount == 0){
            return;
        }
        
        if(field < 0 || field >= ZONE_OFFSET){
            throw "IllegalArgumentException "+field;
        }
        
        if(field == YEAR){
            year = this.get(YEAR);
            if(this.get(ERA) == AD){
                year += amount;
                if(year > 0){
                    this.set(YEAR, year);
                }else{
                    this.set(YEAR, 1-year);
                    this.set(ERA, BC);
                }
            }else{
                year -= amount;
                if(year > 0){
                    this.set(YEAR, year);
                }else{
                    this.set(YEAR, 1-year);
                    this.set(ERA, AD);
                }
            }

        }else if (field == MONTH){
            month = this.get(MONTH) + amount;
            year = this.get(YEAR);

            var y_amount = 0;
            
            if(month >= 0){
                y_amount = Math.floor(month/12);
            }else{
                y_amount = Math.ceil((month+1)/12) - 1;
            }
            if(y_amount != 0){
                if(this.get(ERA) == AD){
                    year += y_amount;
                    if(year > 0){
                        this.set(YEAR, year);
                    }else{
                        this.set(YEAR, 1-year);
                        this.set(ERA, BC);
                    }
                }else{
                    year -= y_amount;
                    if(year > 0){
                        this.set(YEAR, year);
                    }else{
                        this.set(YEAR, 1-year);
                        this.set(ERA, AD);
                    }
                }
            }
            
            if(month >= 0){
                this.set(MONTH, (month%12));
            }else{
                month %= 12;
                if(month < 0){
                    month += 12;
                }
                this.set(MONTH, JANUARY + month);
            }

        }else if (field == ERA){
            var era = this.get(ERA) + amount;
            if(era < 0){
                era = 0;
            }
            if(era > 1){
                era = 1;
            }
            this.set(ERA, era);
        }else{
            var delta = amount, timeOfDay = 0;
            switch(field){
            case HOUR:
            case HOUR_OF_DAY:
                delta *= ONE_HOUR; // 60*60*1000
                break;
            case MINUTE:
                delta *= ONE_MINTUE; // 60*1000
                break;
            case SECOND:
                delta *= ONE_SECOND;
                break;
            case MILLISECOND:
                break;
            case WEEK_OF_YEAR:
            case WEEK_OF_MONTH:
            case DAY_OF_WEEK_IN_MONTH:
                delta *= 7;
                break;
            case DAY_OF_MONTH: // synonym of DATE
            case DAY_OF_YEAR:
            case DAY_OF_WEEK:
                break;
            case AM_PM:
                delta = amount/2;
                timeOfDay =  12 * (amount % 2);
                break;                
            }
            
            if(field >= HOUR){
                this.setTimeInMillis(this.getTimeInMillis() + delta);
                return;
            }
            
            // Refactory algorithm to avoid losing precision.
            // var fd = new Date(this.get(YEAR), 
            //                   this.get(MONTH), 
            //                   this.get(DATE))/ONE_DAY;
            var curDay = new Date(this.get(YEAR), 
                                  this.get(MONTH), 
                                  this.get(DATE)),
            deltaDay = 0;
            
            timeOfDay += this.get(HOUR_OF_DAY);
            timeOfDay *= 60;
            timeOfDay += this.get(MINUTE);
            timeOfDay *= 60;
            timeOfDay += this.get(SECOND);
            timeOfDay *= 1000;
            timeOfDay += this.get(MILLISECOND);
            
            if(timeOfDay >= ONE_DAY){
                // fd++;
                deltaDay = 1;
                timeOfDay -= ONE_DAY;
            }else if(timeOfDay < 0){
                // fd--;
                deltaDay = -1;
                timeOfDay += ONE_DAY;
            }            
            
            // fd += delta;
            deltaDay += delta;
            
            // this.setTimeInMillis(fd*ONE_DAY + timeOfDay);
            this.setTimeInMillis(curDay.getTime() + deltaDay * ONE_DAY + timeOfDay);
        }
        
    };

    /**
     * After adjustments such as add(MONTH), add(YEAR), we don't want the
     * month to jump around.  E.g., we don't want Jan 31 + 1 month to go to Mar
     * 3, we want it to go to Feb 28.  Adjustments which might run into this
     * problem call this method to retain the proper month.
     */
    var pinDayOfMonth = function(dom){
        var year = this.get(YEAR),
        monthLen = this.monthLength(this.get(MONTH), year);
        dom = dom || this.get(DAY_OF_MONTH);
        if(dom > monthLen){
            this.set(DAY_OF_MONTH, monthLen);
        }else{
            this.set(DAY_OF_MONTH, dom);
        }
    };
    
    /**
     * Returns the length (in days) of the specified year. The year
     * must be normalized. If the year was not specified, the internalGet(YEAR)
     * will be provided. 
     */
    thi$.yearLength = function(year){
        return this.isLeapYear(_reviseYear.call(this, year)) ? 366 : 365;
    };
    
    /**
     * Returns the length of the specified month in the specified
     * year. The year number must be normalized. If the year was not 
     * specified, the internalGet(YEAR) will be provided. 
     *
     * @see #isLeapYear(int)
     */
    thi$.monthLength = function(month, year){
        return this.isLeapYear(_reviseYear.call(this, year)) ? 
            LONTH_LENGTH[month] : 
            MONTH_LENGTH[month];
    };
    
    var _reviseYear = function(year){
        year = year || this.get(YEAR);
        if(this.get(ERA) == BC){
            year = 1 - year;
        }
        return year;
    };

    thi$.isLeapYear = function(year){
        year = Class.isNumber(year) ? year : this.get(YEAR);
        return (year%4 == 0 || year%400 == 0) && year%100  != 0 && year%1900 !=0;
    };

    thi$.clear = function(field){
        var date = this.date;
        switch(field){
        case ERA:
            break;
        case YEAR:
            date.setFullYear(EPOCH_YEAR);
            break;
        case MONTH:
            date.setMonth(JANUARY);
            break;
        case WEEK_OF_YEAR:
        case WEEK_OF_MONTH:
            break;
        case DATE:
        case DAY_OF_MONTH:
            date.setDate(1);
            break;
        case DAY_OF_YEAR:// 1~366
            break;
        case DAY_OF_WEEK:
        case DAY_OF_WEEK_IN_MONTH:
            break;
        case AM_PM:
            break;
        case HOUR:// 0~11
            break;
        case HOUR_OF_DAY:
            date.setHours(0);
            break;
        case MINUTE:
            date.setMinutes(0);                
            break;
        case SECOND:
            date.setSeconds(0);
            break;
        case MILLISECOND:
            date.setMilliseconds(0);
            break;
        case ZONE_OFFSET:
        case DST_OFFSET:
            break;
        default:
            date.setFullYear(EPOCH_YEAR);
            date.setMonth(JANUARY);
            date.setDate(1);
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
        }
    };
    
    /**
     * 
     * @param from, the start date
     * @param to, the end date
     * @param field, field of YEAR, MONTH, WEEK_OF_YEAR, DAY_OF_YEAR,
     * HOUR_OF_DAY, MINUTE, SECOND
     * @param unit 0.5 means half, 1 means one year, one month and so on.
     * For the MONTH, if unit is 3 that means one quarter
     * 
     * @return {
     *     from:
     *     to:
     * 
     *     field:
     *     unit:
     *     
     *     size:
     * }
     */
    CLASS.rangeOf = function(from, to, field, unit){
        var t0 = new CLASS(from), t1 = new CLASS(to),
        size = 2, firstDay, tmp;

        switch(field){
        case YEAR:
            if(t0.get(MONTH) != JANUARY || 
               t0.get(DAY_OF_MONTH) != 1){
                from = t0.getFirstDayOfCurrentYear();
            }
            if(t1.get(MONTH) != JANUARY ||
               t1.get(DAY_OF_MONTH) != 1){
                to = t1.getFirstDayOfCurrentYear();
            }

            if(from > to){
                tmp = from;
                from = to;
                to = tmp;
            }

            size = from.getFullYear()-to.getFullYear()+1;
            size = Math.ceil(size/unit);
            
            break;
        case MONTH:
            if(t0.get(DAY_OF_MONTH) != 1){
                from = t0.getFirstDayOfCurrentMonth();
            }
            if(t1.get(DAY_OF_MONTH) != 1){
                to = t1.getFirstDayOfCurrentMonth();
            }

            if(from > to){
                tmp = from;
                from = to;
                to = tmp;
            }
            
            size = (to.getFullYear() - from.getFullYear())*12 + 
                to.getMonth() - from.getMonth() + 1;

            size = Math.ceil(size/unit);

            break;
        case WEEK_OF_YEAR:
            firstDay = this.getFirstDayOfWeek();
            if(t0.get(DAY_OF_WEEK) != firstDay){
                from = t0.getFirstDayOfCurrentWeek();
            }
            if(t1.get(DAY_OF_WEEK) != firstDay){
                to = t1.getFirstDayOfCurrentWeek();
            }

            if(from > to){
                tmp = from;
                from = to;
                to = tmp;
            }

            size = ((to - from)/ONE_DAY)/7 + 1;
            size = Math.ceil(size/unit);            
            
            break;
        case DAY_OF_YEAR:
            break;
        case HOUR_OF_DAY:
            break;
        case MINUTE:
            break;
        case SECOND:
            
            break;
        default:
            break;
        }
        
        return{
            from: from,
            to: to,

            field: field,
            unit: unit,
            
            size: size
        };
    };

    CLASS.compareDate = function(date0, date1){
        var v0 = new Date(date0.getFullYear(), 
                          date0.getMonth(), 
                          date0.getDate());
        var v1 = new Date(date1.getFullYear(), 
                          date1.getMonth(), 
                          date1.getDate());
        
        return v0 - v1;
    };

    CLASS.compareTime = function(date0, date1){
        var v0 = new Date(1970, 1, 1, 
                      date0.getHours(), 
                      date0.getMinutes(), 
                      date0.getSeconds(), 
                      date0.getMilliseconds());
        var v1 = new Date(1970, 1, 1, 
                      date1.getHours(), 
                      date1.getMinutes(), 
                      date1.getSeconds(), 
                      date1.getMilliseconds());

        return v0 - v1;
    };

    CLASS.compareDateTime = function(v0, v1){
        return v0 - v1;
    };
    
    thi$._init = function(){
        if(arguments.length == 0){
            this.date = new Date();
        }else if(Class.isDate(arguments[0])){
            this.date = arguments[0];
        }else{
            this.date = new Date();
            this.clear();

            this.setFields(arguments[0], // year
                           arguments[1], // month
                           arguments[2], // dayOfMonth
                           arguments[3], // hourOfDay
                           arguments[4], // minute
                           arguments[5], // second
                           arguments[6]);// mills
        }
        
        // TODO: should according to the local
        this.setFirstDayOfWeek(SUNDAY);
        this.setMinimalDaysInFirstWeek(1);
    };

    thi$._init.apply(this, arguments);

}.$extend(js.lang.Object);

