function getCurrentDate() {
    const date = new Date();
    let hours = addZero(date.getHours());
    let minutes = addZero(date.getMinutes());
    let seconds = addZero(date.getSeconds());
    let time = hours + ":" + minutes + ":" +  seconds;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dateString = days[date.getDay()] + ", " + months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
    document.getElementById('date-time').innerHTML = dateString + " " + time;

    // executes the function once the timer expires i.e every second
    setTimeout(getCurrentDate, 1000)
}

getCurrentDate();

// Ensures that values are always 2 digits by padding with zeroes
function addZero(time) {
    return time.toString().padStart(2, '0');
}