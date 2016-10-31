'use strict';
import Schedule from 'node-schedule';

let setSchedule = () =>{
    let announcement = Schedule.scheduleJob({hour: 12, minute: 0}, function(){
    //var announcement = schedule.scheduleJob('10 * * * * *', function(){
        //slackIncomingWebhook();
        console.log('haha');
    });
}

export default setSchedule;
