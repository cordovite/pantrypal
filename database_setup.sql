-- PantryPal Database Setup Script
-- Run this script in your PostgreSQL database to create all required tables

-- Create users table (required for authentication)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR PRIMARY KEY NOT NULL,
    email VARCHAR UNIQUE,
    first_name VARCHAR,
    last_name VARCHAR,
    profile_image_url VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create sessions table (required for authentication)
CREATE TABLE IF NOT EXISTS sessions (
    sid VARCHAR PRIMARY KEY,
    sess JSONB NOT NULL,
    expire TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions(expire);

-- Create inventory_items table
CREATE TABLE IF NOT EXISTS inventory_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    quantity INTEGER DEFAULT 0 NOT NULL,
    unit VARCHAR(50) NOT NULL,
    expiry_date DATE,
    low_stock_threshold INTEGER DEFAULT 5,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR REFERENCES users(id)
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
    id SERIAL PRIMARY KEY,
    donor_name VARCHAR(255) NOT NULL,
    donor_email VARCHAR(255),
    donor_phone VARCHAR(50),
    donation_type VARCHAR(100) NOT NULL,
    description TEXT,
    value DECIMAL(10,2),
    donation_date TIMESTAMP DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR REFERENCES users(id)
);

-- Create donation_items table
CREATE TABLE IF NOT EXISTS donation_items (
    id SERIAL PRIMARY KEY,
    donation_id INTEGER REFERENCES donations(id),
    inventory_item_id INTEGER REFERENCES inventory_items(id),
    quantity INTEGER NOT NULL,
    expiry_date DATE
);

-- Create distribution_events table
CREATE TABLE IF NOT EXISTS distribution_events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP NOT NULL,
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'scheduled',
    registered_families INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR REFERENCES users(id)
);

-- Create distribution_items table
CREATE TABLE IF NOT EXISTS distribution_items (
    id SERIAL PRIMARY KEY,
    distribution_event_id INTEGER REFERENCES distribution_events(id),
    inventory_item_id INTEGER REFERENCES inventory_items(id),
    quantity_planned INTEGER NOT NULL,
    quantity_distributed INTEGER DEFAULT 0
);

-- Create activity_log table
CREATE TABLE IF NOT EXISTS activity_log (
    id SERIAL PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR REFERENCES users(id)
);

-- Insert sample data (optional - you can remove this section if you want to start fresh)
-- Insert a test user
INSERT INTO users (id, email, first_name, last_name) 
VALUES ('test-user', 'test@example.com', 'Test', 'User') 
ON CONFLICT (id) DO NOTHING;

-- Insert sample inventory items
INSERT INTO inventory_items (name, category, quantity, unit, low_stock_threshold, created_by) VALUES
('Canned Beans', 'Canned Goods', 50, 'cans', 10, 'test-user'),
('Rice', 'Grains', 25, 'lbs', 5, 'test-user'),
('Pasta', 'Grains', 30, 'boxes', 8, 'test-user')
ON CONFLICT DO NOTHING;

-- Insert sample donations
INSERT INTO donations (donor_name, donor_email, donation_type, description, value, created_by) VALUES
('John Smith', 'john@example.com', 'food', 'Canned goods donation', 50.00, 'test-user'),
('Local Grocery', 'contact@grocery.com', 'food', 'Weekly produce donation', 100.00, 'test-user')
ON CONFLICT DO NOTHING;

COMMIT;