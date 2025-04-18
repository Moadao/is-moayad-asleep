// keepAlive.js
import { CronJob } from 'cron';
import https from 'https';

const backendURL = 'https://is-moayad-asleep.onrender.com'; // Replace with your backend URL
const job = new CronJob('*/14 * * * * *', function () {
    console.log('Pinging server to keep it alive');
    
    https.get(backendURL, (res) => {
        if (res.statusCode === 200) {
            console.log('Server is alive');
        } else {
            console.error(`Failed to ping server with status code: ${res.statusCode}`);
        }
    }).on('error', (err) => {
        console.error('Error during ping:', err.message);
    });
});

job.start(); // Start the cron job

export default job;
