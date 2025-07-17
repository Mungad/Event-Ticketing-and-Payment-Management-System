import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8088'; // Update to match your backend port

export const options = {
  stages: [
    { duration: '30s', target: 20 },   // ramp-up to 20 users
    { duration: '30s', target: 100 },  // ramp-up to 100 users
    { duration: '30s', target: 200 },  // ramp-up to 200 users
    { duration: '1m', target: 300 },   // stress point
    { duration: '30s', target: 0 },    // ramp-down
  ],
  ext: {
    loadimpact: {
      name: 'Events GET Stress Test',
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
