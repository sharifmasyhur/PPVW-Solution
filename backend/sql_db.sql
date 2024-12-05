CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL CHECK (email ~* '^[^@]+@[^@]+\.[^@]+$'),
    password VARCHAR(255) NOT NULL,
    balance NUMERIC(12, 2) DEFAULT 0.00,  
    donation NUMERIC(12, 2) DEFAULT 0.00,
    income NUMERIC(12,2) DEFAULT 0.00,
    expense NUMERIC(12,2) DEFAULT 0.00,            
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE payment_type AS ENUM ( 
 'Food',  
 'Health',  
 'Education',
 'Entertainment',
 'Lifestyle',
 'General',
 'Other',
 'Transportation',
 'Transfer'
);


CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    user_sender_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_receiver_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    transaction_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    transaction_type payment_type NOT NULL 
);

CREATE TABLE titles (
    title_id SERIAL PRIMARY KEY,
    title_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE donations (
    donation_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    donation_sum NUMERIC(12, 2) NOT NULL CHECK (donation_sum > 0),
    title_id INT NOT NULL REFERENCES titles(title_id),
    description TEXT,
    donation_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE financial_health (
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_spending NUMERIC(12, 2) NOT NULL CHECK (total_spending >= 0),
    total_income NUMERIC(12, 2) NOT NULL CHECK (total_income >= 0),
    score NUMERIC(5, 2) CHECK (score BETWEEN 0 AND 100)
);


INSERT INTO titles (title_name, description) VALUES 
('Novice Donor', 'As a Novice Donor, you contribute to small-scale initiatives like local tree planting. Your support helps create green spaces and promotes community well-being.'),
('Supporter of Change', 'By reaching this level, you support community health programs, providing essential medical care to those in need. Your contribution directly impacts lives.'),
('Champion for Education', 'As a Champion for Education, your donations help fund resources for underprivileged children, improving their access to learning opportunities and empowering future generations.'),
('Guardian of the Environment', 'This title reflects your commitment to wildlife conservation efforts. Your contributions help protect endangered species and preserve biodiversity for future generations.'),
('Hero of Humanity', 'As a Hero of Humanity, you play a vital role in large-scale initiatives, such as providing clean water access to communities. Your generosity leads to significant change and lasting impact.');

CREATE TABLE api_keys (
    id SERIAL PRIMARY KEY,
    api_key TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
