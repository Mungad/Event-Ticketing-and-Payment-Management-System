import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8088';

export const options = {
    stages: [
        { duration: '10s', target: 10 },   // ramp-up to 10 users
        { duration: '10s', target: 200 },  // sudden spike to 200 users
        { duration: '20s', target: 300 },  // sustain 300 users
        { duration: '10s', target: 10 },   // quick ramp-down to 10 users
        { duration: '10s', target: 0 },    // finish
    ],
    ext: {
        loadimpact: {
            name: 'Events GET Spike Test',
        },
    },
};

export default function () {
    const res = http.get(`${BASE_URL}/events`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEwLCJ1c2VyX2lkIjoxMCwiZmlyc3RfbmFtZSI6Ikpvc2giLCJsYXN0X25hbWUiOiJIYXZlbiIsImVtYWlsIjoiaGF2ZW4wNDdAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzUyNzU0NjM2LCJpYXQiOjE3NTI0OTU0MzZ9.ZE89hNi4gKYpoxtyMnQzDQCGAJ21xTnEGOPN0WRq5nk`,
        },
    });

    check(res, {
        'status is 200': (r) => r.status === 200,
        'has data array': (r) => {
            try {
                const body = JSON.parse(r.body as string);
                return Array.isArray(body);
            } catch {
                return false;
            }
        },
    });

    sleep(1); 
}
