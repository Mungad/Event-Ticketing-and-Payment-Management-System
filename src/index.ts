import express from 'express';
import venueRoutes from './venues/venue.router';
import userRoutes from './users/user.router';
import eventRoutes from './events/event.router';
import ticketOrderRoutes from './ticketOrders/ticketOrder.router';
import paymentRoutes from './payments/payment.router';
import supportTicketRoutes from './supportTickets/supportTicket.router';

const app = express();
app.use(express.json()); //used to parse JSON bodies

//Routes
venueRoutes(app);
userRoutes(app);
eventRoutes(app);
ticketOrderRoutes(app);
paymentRoutes(app);
supportTicketRoutes(app);

app.listen(8088, () => {
    console.log(`Server is running on http://localhost:8088`);
});