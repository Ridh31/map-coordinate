var displayDate  = $("#display-date");
var digitalClock = $("#digital-clock");

// days
var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

// months
var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

$(() => {
    displayDigitalClock();
    setInterval(displayDigitalClock, 1000);
});

// display digital clock (footer)
function displayDigitalClock() {

    var _date_ = new Date();

    function addZero(x) {

        if (x < 10) {
            return x = '0' + x;

        } else {
            return x;
        }
    }

    // 12-hour clock
    function twelveHour(x) {

        if (x > 12) {
            return x = x - 12;

        } else if (x == 0) {
            return x = 12;

        } else {
            return x;
        }
    }

    // AM & PM
    function formatAMPM(date) {

        var hours   = date.getHours();
        var minutes = date.getMinutes();
        var ampm    = hours >= 12 ? "PM" : "AM";

        return ampm;
    }

    var date = days[_date_.getDay()] + ", " + _date_.getDate() + " " + months[_date_.getMonth()] + " " + _date_.getFullYear();
    var hh   = addZero(twelveHour(_date_.getHours()));
    var mm   = addZero(_date_.getMinutes());
    var ss   = addZero(_date_.getSeconds());
    var ampm = formatAMPM(_date_);

    displayDate.text(date);
    digitalClock.text(hh + ":" + mm + ":" + ss + " " + ampm);
}