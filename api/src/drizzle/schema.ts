import { relations } from "drizzle-orm/relations";
import { pgEnum } from "drizzle-orm/pg-core";
import {
  text,
  varchar,
  serial,
  pgTable,
  decimal,
  integer,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

// Enums
export const RoleEnum = pgEnum("role", ["admin", "user", "host"]);
export const StatusEnum = pgEnum("status", ["Open", "In Progress", "Resolved", "Closed"]);
export const PaymentStatusEnum = pgEnum("payment_status", ["Pending", "Completed", "Failed"]);

// Users Table
export const UsersTable = pgTable("users", {
  user_id: serial("user_id").primaryKey(),
  firstname: varchar("firstname", { length: 50 }),
  lastname: varchar("lastname", { length: 50 }),
  email: varchar("email", { length: 100 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  contact_phone: varchar("contact_phone", { length: 20 }),
  address: text("address"),
  role: RoleEnum("role").default("user"),
  verification_code: varchar("verification_code", { length: 10 }),
  is_verified: boolean("is_verified").default(false),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Venues Table
export const VenuesTable = pgTable("venues", {
  venue_id: serial("venue_id").primaryKey(),
  name: varchar("name", { length: 100 }),
  address: text("address"),
  capacity: integer("capacity"),
  created_at: timestamp("created_at").defaultNow(),
});

// Events Table
export const EventsTable = pgTable("events", {
  event_id: serial("event_id").primaryKey(),
  title: varchar("title", { length: 100 }),
  description: text("description"),
  venue_id: integer("venue_id").references(() => VenuesTable.venue_id),
  category: varchar("category", { length: 50 }),
  date: timestamp("date"),
  time: varchar("time", { length: 10 }),
  ticket_price: decimal("ticket_price", { precision: 10, scale: 2 }),
  tickets_total: integer("tickets_total"),
  tickets_sold: integer("tickets_sold").default(0),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// TicketOrdersTable (bookings)
export const TicketOrdersTable = pgTable("ticket_orders", {
  order_id: serial("order_id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => UsersTable.user_id),
  event_id: integer("event_id")
    .notNull()
    .references(() => EventsTable.event_id, { onDelete: "cascade" }), // ✅
  quantity: integer("quantity").notNull(),
  total_price: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  payment_status: PaymentStatusEnum("payment_status").default("Pending"),
  order_date: timestamp("order_date").defaultNow(),
});

// PaymentsTable
export const PaymentsTable = pgTable("payments", {
  payment_id: serial("payment_id").primaryKey(),
  order_id: integer("order_id")
    .references(() => TicketOrdersTable.order_id, { onDelete: "cascade" }), // ✅
  user_id: integer("user_id").references(() => UsersTable.user_id),
  event_id: integer("event_id")
    .references(() => EventsTable.event_id, { onDelete: "cascade" }), // ✅
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  payment_status: PaymentStatusEnum("payment_status").default("Pending"),
  payment_date: timestamp("payment_date").defaultNow(),
  payment_method: varchar("payment_method", { length: 50 }),
  transaction_id: varchar("transaction_id", { length: 100 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});


// Support Tickets Table
export const SupportTicketsTable = pgTable("support_tickets", {
  ticket_id: serial("ticket_id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => UsersTable.user_id),
  subject: varchar("subject", { length: 100 }),
  description: text("description"),
  status: StatusEnum("status").default("Open"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// RELATIONSHIPS
export const UsersRelations = relations(UsersTable, ({ many }) => ({
  ticketOrders: many(TicketOrdersTable),
  payments: many(PaymentsTable),
  supportTickets: many(SupportTicketsTable),
}));

export const VenuesRelations = relations(VenuesTable, ({ many }) => ({
  events: many(EventsTable),
}));

export const EventsRelations = relations(EventsTable, ({ many, one }) => ({
  venue: one(VenuesTable, {
    fields: [EventsTable.venue_id],
    references: [VenuesTable.venue_id],
  }),
  ticketOrders: many(TicketOrdersTable),
  payments: many(PaymentsTable),
}));

export const TicketOrdersRelations = relations(TicketOrdersTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [TicketOrdersTable.user_id],
    references: [UsersTable.user_id],
  }),
  event: one(EventsTable, {
    fields: [TicketOrdersTable.event_id],
    references: [EventsTable.event_id],
  })
}));

export const PaymentsRelations = relations(PaymentsTable, ({ one }) => ({
  order: one(TicketOrdersTable, {
    fields: [PaymentsTable.order_id],
    references: [TicketOrdersTable.order_id],
  }),
  user: one(UsersTable, {
    fields: [PaymentsTable.user_id],
    references: [UsersTable.user_id],
  }),
  event: one(EventsTable, {
    fields: [PaymentsTable.event_id],
    references: [EventsTable.event_id],
  }),
}));

export const SupportTicketsRelations = relations(SupportTicketsTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [SupportTicketsTable.user_id],
    references: [UsersTable.user_id],
  }),
}));

// TYPE INFERENCE
export type TIUser = typeof UsersTable.$inferInsert;
export type TSUser = typeof UsersTable.$inferSelect;
export type TIVenue = typeof VenuesTable.$inferInsert;
export type TSVenue = typeof VenuesTable.$inferSelect;
export type TIEvent = typeof EventsTable.$inferInsert;
export type TSEvent = typeof EventsTable.$inferSelect;
export type TITicketOrder = typeof TicketOrdersTable.$inferInsert;
export type TSTicketOrder = typeof TicketOrdersTable.$inferSelect;
export type TIPayment = typeof PaymentsTable.$inferInsert;
export type TSPayment = typeof PaymentsTable.$inferSelect;
export type TISupportTicket = typeof SupportTicketsTable.$inferInsert;
export type TSSupportTicket = typeof SupportTicketsTable.$inferSelect;
