import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8088'; 

export const options = {
    stages: [
        { duration: '30s', target: 50 },    // ramp-up to 50 users
        { duration: '30s', target: 100 },   // ramp-up to 100 users
        { duration: '30s', target: 200 },   // ramp-up to 200 users
        { duration: '30s', target: 0 },     // ramp-down
    ],
    ext: {
        loadimpact: {
            name: 'Events GET Breakpoint Test',
        },
    },
};

export default function () {
    const res = http.get(`${BASE_URL}/events`, {
        headers: {
            'Content-Type': 'application/json',
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
