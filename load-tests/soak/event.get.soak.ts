import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8088';

export const options = {
  stages: [
    { duration: '1m', target: 20 },   // ramp-up to 20 users over 1 minute
    { duration: '58m', target: 20 },  // stay at 20 users for 58 minutes
    { duration: '40s', target: 0 },   // ramp-down to 0 users
  ],
  ext: {
    loadimpact: {
      name: 'Events GET Soak Test',
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
