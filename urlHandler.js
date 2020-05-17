
function refreshSatImage() {
    const secondsInterval=5; /*refreshes every five minutes*/ 
    const millisecondsToSeconds=1000;
    const oneDay = 1000*60*60*24;
    const minuteDelay = 7; /*Accounts for new image upload time from satellites*/

    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    var day = Math.floor(diff / oneDay);
    var currentYear = now.getFullYear();
    var utcHour = now.getUTCHours(); /*makes current hour equal to standard for NOAA satellite/url*/
    var currentMinute = now.getUTCMinutes()-minuteDelay;

    console.log('Year: ' + currentYear);
    console.log('Day of year: ' + day);
    console.log('Hour of day: ' + utcHour);
    console.log('minute: ' + currentMinute);

    var roundedCurrentMinute=(5*(Math.floor(Math.abs(currentMinute/5))))+1;
    console.log('rounded current minute: ' + roundedCurrentMinute);

    var urlID="https://cdn.star.nesdis.noaa.gov/GOES16/ABI/SECTOR/cgl/GEOCOLOR/"+currentYear+day+utcHour+roundedCurrentMinute+"_GOES16-ABI-cgl-GEOCOLOR-2400x2400.jpg"
    console.log(urlID);
    document.getElementById("satMap").src=urlID; 

    setTimeout(refreshSatImage, secondsInterval*millisecondsToSeconds)
}

refreshSatImage();