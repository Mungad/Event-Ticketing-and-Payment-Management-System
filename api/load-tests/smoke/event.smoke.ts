import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 1,        // 1 virtual user for smoke test
    iterations: 1, // 1 iteration for quick health check
};

export default function () {
    const url = 'http://localhost:8088/events'; 

    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEwLCJ1c2VyX2lkIjoxMCwiZmlyc3RfbmFtZSI6Ikpvc2giLCJsYXN0X25hbWUiOiJIYXZlbiIsImVtYWlsIjoiaGF2ZW4wNDdAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzUyNzU0NjM2LCJpYXQiOjE3NTI0OTU0MzZ9.ZE89hNi4gKYpoxtyMnQzDQCGAJ21xTnEGOPN0WRq5nk`,
        },
    };

    const res = http.get(url, params);

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
