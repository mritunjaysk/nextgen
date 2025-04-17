CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  ingredients TEXT,
  steps TEXT,
  media TEXT,
  category TEXT,
  cooking_time TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);