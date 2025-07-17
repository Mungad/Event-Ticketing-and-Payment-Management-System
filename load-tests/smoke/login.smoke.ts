import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 1,
    iterations: 1,
    duration: '10s',
};

export default function () {
    const headers = {
        headers: { 'Content-Type': 'application/json' },
    };

    // 1. Login User
    const loginPayload = JSON.stringify({
        email: 'haven047@gmail.com',
        password: 'josh@123',
    });

    const loginRes = http.post('http://localhost:8088/users/login', loginPayload, headers);

    check(loginRes, {
        'login status is 200': (r) => r.status === 200,
        'login response has token': (r) => {
            try {
                const body = typeof r.body === 'string' ? JSON.parse(r.body) : {};
                return typeof body.token === 'string';
            } catch {
                return false;
            }
        },
    });

    sleep(1);
}
