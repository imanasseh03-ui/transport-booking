CREATE TABLE routes (
    id SERIAL PRIMARY KEY,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    distance_km INT,
    duration VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE buses (
    id SERIAL PRIMARY KEY,
    bus_number VARCHAR(30) UNIQUE NOT NULL,
    bus_type VARCHAR(50),
    capacity INT NOT NULL,
    plate_number VARCHAR(30) UNIQUE,
    status VARCHAR(20) DEFAULT 'Available' 
);

CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    route_id INT REFERENCES routes(id),
    bus_id INT REFERENCES buses(id),
    departure_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    fare DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Scheduled'
);

CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    bus_id INT REFERENCES buses(id),
    seat_number VARCHAR(10) NOT NULL, 
    UNIQUE(bus_id, seat_number)
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    trip_id INT REFERENCES trips(id),
    seat_id INT REFERENCES seats(id),
    booking_reference VARCHAR(30) UNIQUE NOT NULL,
    booking_status VARCHAR(30) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX bookings_active_trip_seat_key
ON bookings(trip_id, seat_id)
WHERE booking_status != 'Cancelled';

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    booking_id INT REFERENCES bookings(id),
    amount DECIMAL(10,2),
    payment_method VARCHAR(30),
    payment_status VARCHAR(30),
    transaction_reference VARCHAR(100),
    paid_at TIMESTAMP
);

CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    booking_id INT REFERENCES bookings(id),
    ticket_number VARCHAR(50) UNIQUE,
    qr_code TEXT,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    license_number VARCHAR(100),
    assigned_bus INT REFERENCES buses(id)
);

