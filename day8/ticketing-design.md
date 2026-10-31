
# TicketHub – Event Ticketing System Design

## 1. Introduction

TicketHub is an online event ticketing platform that allows users to discover concerts and events, view available seats, purchase tickets, and access their bookings.

The system must support normal daily activity as well as sudden increases in traffic when popular concerts go on sale.

One of the most important design challenges is preventing two users from purchasing the same seat.

## 2. Requirements

### 2.1 Functional Requirements

The system must allow users to:

1. Register and log in securely.
2. Browse available concerts and events.
3. View event details, prices, and dates.
4. View available and unavailable seats.
5. Select and temporarily hold seats.
6. Purchase tickets through a payment process.
7. Receive confirmation after successful payment.
8. View their purchased tickets.
9. Cancel bookings when permitted by the event's cancellation policy.

### 2.2 Non-Functional Requirements

**Performance:** Event pages and seat availability should load quickly, even during busy periods.

**Scalability:** The system must support millions of registered users and sudden traffic increases during popular ticket sales.

**Availability:** Users should be able to access the platform with minimal downtime.

**Consistency:** A seat must never be successfully sold to two different customers.

**Security:** User accounts, personal information, and payment information must be protected.

**Fairness:** The system should manage high-demand ticket sales fairly and prevent users from reserving excessive numbers of seats.

**Reliability:** Failed payments and interrupted booking processes should not result in incorrect bookings.

## 3. Traffic and Storage Estimates

### 3.1 Given Assumptions

The assignment provides the following information:

- Registered users: 2,000,000.
- Normal daily visitors: 50,000.
- Each visitor views 10 pages daily.
- Normal daily ticket sales: 5,000.
- Popular concert visitors: 200,000.
- Available seats for the popular concert: 20,000.
- Popular concert sale duration: 10 minutes.

For calculations, assume one page view per request and one initial purchase attempt per person during the popular sale.

### 3.2 Normal Daily Traffic

Total daily page views:

50,000 × 10 = 500,000 page views per day.

Average page requests per second:

500,000 ÷ 86,400 = 5.79 requests per second.

Approximately 6 page requests per second.

### 3.3 Normal Ticket Sales

Daily ticket sales:

5,000 tickets per day.

Average successful ticket sales per second:

5,000 ÷ 86,400 = 0.058 tickets per second.

This is approximately 5,000 successful sales per day.

### 3.4 Popular Concert Sale Traffic

During a popular concert sale, 200,000 people attempt to purchase 20,000 available seats within 10 minutes.

Convert 10 minutes into seconds:

10 × 60 = 600 seconds.

Average purchase attempts per second:

200,000 ÷ 600 = 333.33 attempts per second.

Approximately 333 purchase attempts per second.

### 3.5 Available Seats Compared to Demand

Available seats = 20,000.

People attempting to buy = 200,000.

Demand is:

200,000 ÷ 20,000 = 10 times the available capacity.

Only 10% of interested buyers can obtain a seat.

Maximum average successful sales during the 10-minute period:

20,000 ÷ 600 = 33.33 tickets per second.

### 3.6 Traffic Comparison

| Metric | Normal Day | Popular Concert Sale |
|---|---:|---:|
| Visitors | 50,000/day | 200,000 in 10 minutes |
| Page views | 500,000/day | Not specified |
| Average page requests/second | 5.79 | Not specified |
| Purchase attempts/second | Not specified | 333 |
| Available seats | Not specified | 20,000 |

The popular concert sale creates a sudden increase in demand. The system must be designed to handle this burst without crashing or selling the same seat twice.


## 4. API Design

TicketHub uses a RESTful API to allow users to browse events, check seat availability, reserve seats, make payments, and access their tickets.

The API uses HTTP methods and JSON to communicate between the frontend and backend.

### 4.1 API Endpoints

| Method | Endpoint | Description | Success Status |
|---|---|---|---|
| GET | /events | Retrieve available events | 200 OK |
| GET | /events/{eventId} | Retrieve details of a specific event | 200 OK |
| GET | /events/{eventId}/seats | View available and unavailable seats | 200 OK |
| POST | /seat-holds | Temporarily reserve selected seats | 201 Created |
| POST | /payments | Process payment for a reservation | 200 OK |
| GET | /tickets | Retrieve tickets belonging to a user | 200 OK |
| GET | /tickets/{ticketId} | Retrieve details of a specific ticket | 200 OK |

### 4.2 Example API Requests and Responses

#### A. Browse Events

**Endpoint:** GET /events

This endpoint retrieves available concerts and events.

Example response:

```json
{
  "events": [
    {
      "id": 1,
      "name": "Summer Music Festival",
      "date": "2026-12-20",
      "venue": "Nairobi Arena",
      "status": "on_sale"
    }
  ]
}
```

**Status:** 200 OK

#### B. View Available Seats

**Endpoint:** GET /events/1/seats

This endpoint displays the seats available for a particular event.

Example response:

```json
{
  "eventId": 1,
  "seats": [
    {
      "id": 101,
      "seatNumber": "A1",
      "status": "available",
      "price": 2500
    },
    {
      "id": 102,
      "seatNumber": "A2",
      "status": "held",
      "price": 2500
    },
    {
      "id": 103,
      "seatNumber": "A3",
      "status": "sold",
      "price": 2500
    }
  ]
}
```

**Status:** 200 OK

#### C. Hold Seats

**Endpoint:** POST /seat-holds

This endpoint temporarily reserves selected seats for a user while they complete payment.

Example request:

```json
{
  "userId": 25,
  "eventId": 1,
  "seatIds": [101, 102]
}
```

Example response:

```json
{
  "holdId": 501,
  "eventId": 1,
  "seatIds": [101, 102],
  "status": "held",
  "expiresAt": "2026-12-20T14:15:00Z"
}
```

**Status:** 201 Created

If a seat has already been held or sold, the API rejects the request with:

**Status:** 409 Conflict

#### D. Process Payment

**Endpoint:** POST /payments

This endpoint processes payment for a valid seat reservation.

Example request:

```json
{
  "holdId": 501,
  "paymentMethod": "card",
  "amount": 5000
}
```

Example response:

```json
{
  "paymentId": 701,
  "holdId": 501,
  "status": "successful",
  "message": "Payment completed successfully."
}
```

**Status:** 200 OK

The payment process must verify that the seat reservation is still valid before completing the purchase.

#### E. View Purchased Tickets

**Endpoint:** GET /tickets

This endpoint retrieves tickets belonging to the authenticated user.

Example response:

```json
{
  "tickets": [
    {
      "ticketId": 901,
      "eventId": 1,
      "eventName": "Summer Music Festival",
      "seatNumber": "A1",
      "status": "confirmed"
    }
  ]
}
```

**Status:** 200 OK

### 4.3 Error Handling

TicketHub uses standard HTTP status codes to communicate errors.

| Status Code | Meaning | Example |
|---|---|---|
| 400 | Bad Request | Invalid booking information |
| 401 | Unauthorized | User is not logged in |
| 403 | Forbidden | User cannot access another user's ticket |
| 404 | Not Found | Event or seat does not exist |
| 409 | Conflict | Seat is already held or sold |
| 500 | Internal Server Error | Unexpected server failure |

### 4.4 API Security

- Users must authenticate before holding seats or purchasing tickets.
- Users can only access their own tickets.
- Payment requests must be validated securely.
- The backend must verify seat availability instead of trusting the frontend.
- Requests should be rate-limited to prevent abuse during popular ticket sales.


## 5. Database Design

TicketHub uses PostgreSQL, a relational database, to store users, events, seats, reservations, and orders.

The database uses primary keys, foreign keys, unique constraints, and transactions to maintain data consistency and prevent double-booking.

### 5.1 Database Tables

The system contains five main tables.

#### A. Users Table

Stores information about registered customers.

| Column | Data Type | Key | Description |
|---|---|---|---|
| id | SERIAL | Primary Key | Unique user ID |
| full_name | VARCHAR(100) | | Customer's name |
| email | VARCHAR(100) | UNIQUE | Customer's email |
| password_hash | VARCHAR(255) | | Secure password hash |
| created_at | TIMESTAMP | | Account creation date |

#### B. Events Table

Stores information about concerts and events.

| Column | Data Type | Key | Description |
|---|---|---|---|
| id | SERIAL | Primary Key | Unique event ID |
| name | VARCHAR(150) | | Event name |
| venue | VARCHAR(150) | | Event location |
| event_date | TIMESTAMP | | Event date and time |
| status | VARCHAR(30) | | Event sale status |
| created_at | TIMESTAMP | | Record creation date |

#### C. Seats Table

Stores the seats available for each event.

| Column | Data Type | Key | Description |
|---|---|---|---|
| id | SERIAL | Primary Key | Unique seat ID |
| event_id | INTEGER | Foreign Key | References an event |
| seat_number | VARCHAR(20) | | Seat label |
| price | DECIMAL(10,2) | | Ticket price |
| status | VARCHAR(20) | | Available, held, or sold |
| held_by | INTEGER | Foreign Key | User currently holding the seat |
| hold_expires_at | TIMESTAMP | | Time when the temporary hold expires |

Each seat belongs to one event.

A unique constraint on event_id and seat_number ensures that the same physical seat is not registered twice for the same event.

#### D. Orders Table

Stores customer ticket purchase orders.

| Column | Data Type | Key | Description |
|---|---|---|---|
| id | SERIAL | Primary Key | Unique order ID |
| user_id | INTEGER | Foreign Key | Customer placing the order |
| total_amount | DECIMAL(10,2) | | Total purchase amount |
| payment_status | VARCHAR(30) | | Pending, successful, or failed |
| created_at | TIMESTAMP | | Order creation date |

#### E. Order_Items Table

Stores the individual seats included in each order.

| Column | Data Type | Key | Description |
|---|---|---|---|
| id | SERIAL | Primary Key | Unique order item ID |
| order_id | INTEGER | Foreign Key | References an order |
| seat_id | INTEGER | Foreign Key, UNIQUE | References a seat |
| ticket_code | VARCHAR(100) | UNIQUE | Unique ticket identifier |

The UNIQUE constraint on seat_id ensures that one seat cannot be assigned to multiple successful orders.

### 5.2 Database Relationships

The database uses the following relationships:

**Users and Orders — One-to-Many**

One user can place many orders, but each order belongs to one user.

**Events and Seats — One-to-Many**

One event can have many seats, but each seat belongs to one event.

**Orders and Order_Items — One-to-Many**

One order can contain multiple seats, but each order item belongs to one order.

**Seats and Order_Items — One-to-One**

A seat can appear in only one successful order item because seat_id is unique.

---

## 6. SQL Table Creation

The following SQL statements create the database tables.

### A. Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### B. Events Table

```sql
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    venue VARCHAR(150) NOT NULL,
    event_date TIMESTAMP NOT NULL,
    status VARCHAR(30) DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### C. Seats Table

```sql
CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id),
    seat_number VARCHAR(20) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'available',
    held_by INTEGER REFERENCES users(id),
    hold_expires_at TIMESTAMP,
    UNIQUE(event_id, seat_number),
    CHECK (status IN ('available', 'held', 'sold'))
);
```

### D. Orders Table

```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(30) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### E. Order_Items Table

```sql
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    seat_id INTEGER NOT NULL UNIQUE REFERENCES seats(id),
    ticket_code VARCHAR(100) UNIQUE NOT NULL
);
```

---

## 7. Example SQL Queries

### Query 1: Retrieve Available Seats for an Event

```sql
SELECT *
FROM seats
WHERE event_id = 1
AND status = 'available';
```

This query retrieves seats that have not been reserved or sold.

### Query 2: Create a New Order

```sql
INSERT INTO orders (
    user_id,
    total_amount,
    payment_status
)
VALUES (
    25,
    5000.00,
    'pending'
);
```

This creates a pending order for a customer.

### Query 3: Retrieve Orders With Customer Details

```sql
SELECT
    orders.id,
    users.full_name,
    users.email,
    orders.total_amount,
    orders.payment_status
FROM orders
JOIN users
ON orders.user_id = users.id;
```

The JOIN operation combines information from the users and orders tables.

---

## 8. Preventing Double-Booking

Preventing two customers from purchasing the same seat is one of the most important requirements of TicketHub.

The system uses database transactions, row-level locking, and unique constraints.

### Step 1: Customer Selects a Seat

A customer selects an available seat from the event seating plan.

### Step 2: Check Seat Availability

The backend checks whether the seat is still available.

### Step 3: Temporarily Hold the Seat

The system uses a database transaction to lock the seat row and reserve it for the customer.

Example:

```sql
BEGIN;

SELECT *
FROM seats
WHERE id = 101
FOR UPDATE;
```

The FOR UPDATE clause locks the selected row while the transaction is active.

The system checks that the seat is still available or that an earlier hold has expired.

If available, it updates the seat:

```sql
UPDATE seats
SET
    status = 'held',
    held_by = 25,
    hold_expires_at = CURRENT_TIMESTAMP + INTERVAL '10 minutes'
WHERE id = 101;

COMMIT;
```

Another customer attempting to reserve the same seat must wait for the first transaction to finish and then recheck its availability.

### Step 4: Customer Completes Payment

After a successful payment, the system confirms the reservation and changes the seat status to sold.

The order and order item are created within a database transaction.

The unique constraint on order_items.seat_id provides an additional protection against selling the same seat twice.

### Step 5: Release Expired Holds

If the customer does not complete payment within the reservation period, the system releases the seat.

Example:

```sql
UPDATE seats
SET
    status = 'available',
    held_by = NULL,
    hold_expires_at = NULL
WHERE status = 'held'
AND hold_expires_at < CURRENT_TIMESTAMP;
```

The seat becomes available for another customer.

### Why This Prevents Double-Booking

- Row-level locking prevents simultaneous customers from reserving the same seat without checking the latest state.
- Database transactions ensure related booking operations succeed or fail together.
- Unique constraints prevent the same seat from appearing in multiple successful orders.
- Temporary holds prevent customers from keeping seats indefinitely without paying.

These mechanisms ensure that a seat can only be sold once.

---

## 9. Database Design Considerations

- Primary keys uniquely identify database records.
- Foreign keys maintain relationships between tables.
- Unique constraints prevent duplicate records.
- Transactions protect booking operations.
- Indexes improve database query performance.
- Row-level locking protects seats during simultaneous booking attempts.

---

## 10. Conclusion

The TicketHub database design uses PostgreSQL to manage customers, events, seats, and orders.

The use of transactions, row-level locking, and unique constraints protects the system from double-booking.

This design helps maintain accurate ticket availability and reliable purchase records, even when many customers attempt to purchase tickets simultaneously.

## 11. High-Level System Architecture

TicketHub uses a scalable architecture designed to handle normal traffic and sudden increases in requests during popular concert sales.

The architecture uses a CDN, load balancer, multiple application servers, caching, PostgreSQL, a message queue, and background workers.

### 11.1 Architecture Diagram

```text
                      USERS
                        |
                        v
                       DNS
                        |
                        v
                       CDN
                        |
                        v
                  LOAD BALANCER
                        |
              +---------+---------+
              |                   |
              v                   v
        APP SERVER 1         APP SERVER 2
              |                   |
              +---------+---------+
                        |
                        v
                      CACHE
                     (Redis)
                        |
              +---------+---------+
              |                   |
              v                   v
        PRIMARY DATABASE     READ REPLICA
          (PostgreSQL)       (PostgreSQL)
              |
              v
         MESSAGE QUEUE
              |
              v
       BACKGROUND WORKERS
              |
        +-----+------+
        |            |
        v            v
   Notifications  Booking Jobs

              PAYMENT GATEWAY
                     |
                     v
                APP SERVERS
```

### 11.2 Architecture Components

**1. Client**

The client is the user's browser or mobile application used to browse events, select seats, and purchase tickets.

**2. DNS (Domain Name System)**

DNS translates the TicketHub domain name into the IP address of the application entry point.

**3. CDN (Content Delivery Network)**

The CDN delivers static resources such as images, CSS, JavaScript, and event posters from servers closer to users.

**4. Load Balancer**

The load balancer distributes incoming requests across multiple application servers to prevent one server from becoming overloaded.

**5. Application Servers**

Application servers handle business logic, user authentication, seat reservations, order processing, and communication with the database.

Multiple application servers allow TicketHub to handle more requests and remain available if one server fails.

**6. Redis Cache**

Redis temporarily stores frequently requested information, such as event details and seating information.

This reduces repeated database queries and improves response times.

The backend must still verify the latest seat availability in PostgreSQL before confirming a reservation.

**7. Primary PostgreSQL Database**

The primary database stores users, events, seats, reservations, and orders.

It handles important write operations, including seat reservations, payment confirmations, and ticket purchases.

**8. Read Replica**

The read replica receives database updates from the primary database and handles additional read requests.

It reduces the workload on the primary database, especially when many users browse events and view seat availability.

**9. Message Queue**

The message queue stores background tasks that do not need to be completed immediately.

For example, sending ticket confirmation emails and notifications.

**10. Background Workers**

Background workers process tasks from the message queue, allowing the main application servers to respond to users without waiting for every background task to finish.

**11. Payment Gateway**

The payment gateway processes customer payments securely and sends payment results back to the application.

The application verifies the payment result before confirming the ticket purchase.

---

## 12. Request Flows

### 12.1 Browsing Events

When a user browses available events:

1. The user opens TicketHub.
2. DNS resolves the application domain.
3. The CDN delivers static application resources.
4. The user's request reaches the load balancer.
5. The load balancer forwards the request to an available application server.
6. The application server checks Redis for cached event information.
7. If the information is not cached, the application retrieves it from the database read replica.
8. The application server returns the event information as JSON.
9. The browser displays the available events.

### 12.2 Booking and Purchasing a Seat

When a customer purchases a ticket:

1. The customer selects an event and chooses a seat.
2. The browser sends a seat-hold request to the application server.
3. The application server verifies the user's identity.
4. The backend checks the latest seat availability in PostgreSQL.
5. A database transaction locks the selected seat using SELECT FOR UPDATE.
6. If the seat is available, the system temporarily holds it for the customer.
7. The customer proceeds to the payment gateway.
8. The payment gateway processes the payment and returns the result.
9. If payment succeeds, the system confirms the order and marks the seat as sold using a database transaction.
10. A unique ticket record is created.
11. The system places a confirmation notification task in the message queue.
12. A background worker sends the ticket confirmation to the customer.
13. The customer can view the purchased ticket in their account.

If payment fails or the temporary hold expires, the system releases the seat so another customer can purchase it.

---

## 13. Handling the Popular Concert Sale

TicketHub must handle 200,000 people attempting to purchase 20,000 seats within 10 minutes.

This creates approximately 333 purchase attempts per second.

The system uses the following strategies to manage this traffic.

### A. Load Balancing

Multiple application servers receive incoming requests through a load balancer.

This prevents one application server from handling all 333 purchase attempts per second.

### B. Caching

Redis stores frequently requested event details and other information that can safely be cached.

This reduces repeated database queries when many customers view the same concert.

However, the system does not rely on cached seat availability when confirming purchases.

### C. Database Transactions and Row-Level Locking

PostgreSQL uses transactions and SELECT FOR UPDATE to protect seats during simultaneous booking attempts.

Only one transaction can successfully reserve a particular seat at a time.

### D. Temporary Seat Holds

A selected seat is temporarily held for a limited period while a customer completes payment.

If the customer does not complete payment before the hold expires, the seat becomes available again.

### E. Rate Limiting and Fairness

The API limits excessive requests from individual users or clients.

The system can also use a virtual waiting room to control the number of customers entering the booking process simultaneously.

### F. Background Processing

Non-critical tasks, such as sending emails and notifications, are processed by background workers.

This prevents those tasks from slowing down the ticket purchase process.

---

## 14. Architecture Trade-Offs

A trade-off is a decision where improving one part of a system introduces a disadvantage somewhere else.

### Trade-off 1: Caching vs Data Consistency

**Advantages:**
- Caching improves response times.
- Reduces repeated database queries.
- Helps handle large numbers of event page views.

**Disadvantages:**
- Cached information can become outdated.
- Cache invalidation adds complexity.

**Decision:** Use caching for event information, but always verify seat availability against the primary database before confirming a reservation.

### Trade-off 2: Fairness vs Speed

**Advantages of a virtual waiting room:**
- Controls the number of users entering the booking process.
- Reduces sudden pressure on application servers.
- Helps manage high-demand ticket sales.

**Disadvantages:**
- Users may wait before accessing the booking page.
- Managing queue positions adds complexity.

**Decision:** Use a virtual waiting room during high-demand sales to protect the system and manage customer traffic fairly.

### Trade-off 3: Read Replicas vs Immediate Consistency

**Advantages:**
- Read replicas distribute database traffic.
- Reduce the workload on the primary database.
- Improve the ability to serve many browsing requests.

**Disadvantages:**
- Replication may introduce delays.
- Recently updated information may not immediately appear on a replica.

**Decision:** Use read replicas for browsing event information, but perform seat reservations and final booking checks against the primary database.

### Trade-off 4: Multiple Servers vs Infrastructure Cost

**Advantages:**
- Multiple application servers improve availability.
- Traffic can be distributed across servers.
- The system can scale as demand increases.

**Disadvantages:**
- More servers increase infrastructure costs.
- Monitoring and maintenance become more complex.

**Decision:** Use multiple application servers to support high-demand events and reduce the risk of one server becoming a single point of failure.

---

## 15. Preventing Single Points of Failure

A single point of failure is a component whose failure can cause the entire system to become unavailable.

TicketHub reduces this risk through:

1. Multiple application servers instead of one application server.
2. A load balancer that forwards requests to healthy application servers.
3. Database backups to protect important customer and booking information.
4. Database replication to support recovery.
5. Monitoring and health checks to detect failures.
6. Redundant infrastructure for important services.
7. Payment confirmation checks to prevent incomplete payments from creating confirmed tickets.

The system should also have tested recovery and failover procedures.

---

## 16. Conclusion

TicketHub is designed to handle normal event traffic as well as sudden increases in demand during popular concert sales.

The architecture uses multiple application servers, load balancing, Redis caching, PostgreSQL, read replicas, and background workers to improve performance and availability.

Database transactions, row-level locking, temporary seat holds, and unique constraints prevent two customers from successfully purchasing the same seat.

This architecture provides a foundation for a reliable, scalable, and fair event ticketing platform.
```

## Step 6: Save and check

Press **Ctrl + S**.

Before we continue, remember these three important concepts:

- **Load balancer:** Shares incoming traffic across servers.
- **Redis:** Makes frequently requested information faster to retrieve.
- **Database transaction:** Protects seat reservations from double-booking.

<box border radius="lg" padding={3} gap={2}>
  **Our progress**
  <row align="center" justify="between">
    Requirements and estimates

    <badge color="success">Completed</badge>
  </row>
  <row align="center" justify="between">
    API design

    <badge color="success">Completed</badge>
  </row>
  <row align="center" justify="between">
    Database design

    <badge color="success">Completed</badge>
  </row>
  <row align="center" justify="between">
    Architecture and trade-offs

    <badge color="success">Now working on</badge>
  </row>
  <row align="center" justify="between">
    Reflection

    <badge>Next</badge>
  </row>
</box>

**Tell me when you've saved the architecture section.** Then we'll write your 150–300-word reflection and prepare the final Day 8 submission. ❤️