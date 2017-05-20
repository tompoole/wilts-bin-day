export const humaniseDate = function(date: Date) {
    var now = getNow();

    if (date < now) {
        return 'In the past...';
    }
    else if (date === now) {
        return 'Today';
    }

    let diffInDays = (date.valueOf() - now.valueOf())/86400000;

    if (diffInDays === 1) {
        return "Tomorrow";
    }

    let thisWeek = diffInDays < 7 && (date.getDay() > now.getDay());

    if (thisWeek) {
        return "This " + days[date.getDay()];
    }

    if (diffInDays === 7) {
        return "A week today";
    }
    
    let day = days[date.getDay()];
    let monthDay = formatMonthDay(date.getDate());
    let month = months[date.getMonth()];

    // Omit the month if date occurs this month
    if (now.getMonth() === date.getMonth()) {
        return `${day} ${monthDay}`;
    }

    // default format
    return`${day} ${monthDay} ${month}`; 
}

function formatMonthDay(monthDay: Number){
    let dayStr = monthDay.toString();
    let lastChar = dayStr[dayStr.length-1];
    let tensValue = dayStr.length > 1 ? dayStr.substr(-2,1) : "";
    let suffix = "th";

    if (tensValue != '1') {
        switch(lastChar) {
            case '1':
                suffix = 'st';
                break;
            
            case '2':
                suffix = 'nd';
                break;

            case '3':
                suffix = 'rd';
                break;
        }
    }

    return dayStr + suffix;
} 

const days : {[key: number]: string} = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
}

const months : {[key: number]: string} = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
}

function getNow():Date{
    if (__nowOverride != null) {
        return __nowOverride;
    }

    let now = new Date();
    now.setHours(0,0,0);
    return now;
}

var __nowOverride : Date | null = null;
export var _setNowOverride = function(d : Date) {
    __nowOverride = d;
}