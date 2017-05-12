function humaniseDate(date) {
    var now = getNow();

    if (date < now) {
        return 'In the past...';
    }
    else if (date === now) {
        return 'Today';
    }

    var diffInDays = (date - now)/86400000;

    if (diffInDays === 1) {
        return "Tomorrow";
    }

    var thisWeek = diffInDays < 7 && (date.getDay() > now.getDay());

    if (thisWeek) {
        return "This " + days[date.getDay()];
    }

    if (diffInDays === 7) {
        return "A week today";
    }
    
    var day = days[date.getDay()];
    var monthDay = formatMonthDay(date.getDate());
    var month = months[date.getMonth()];

    // Omit the month if date occurs this month
    if (now.getMonth() === date.getMonth()) {
        return `${day} ${monthDay}`;
    }

    // default format
    return`${day} ${monthDay} ${month}`; 
}

function formatMonthDay(monthDay){
    var dayStr = monthDay.toString();
    var lastChar = dayStr[dayStr.length-1];
    var tensValue = dayStr.length > 1 ? dayStr.substr(-2,1) : "";
    var suffix = "th";

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

const days = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
}

const months = {
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

function getNow(){
    if (exports.__nowOverride !== null) {
        return exports.__nowOverride;
    }

    var now = new Date();
    now.setHours(0,0,0);
    return now;
}


exports.__nowOverride = null;
exports.humaniseDate = humaniseDate;