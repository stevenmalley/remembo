CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT,
  password TEXT
);

CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY,
  owner INTEGER REFERENCES users(id),
  name TEXT,
  description TEXT,
  public boolean
);

CREATE TABLE facts (
  id SERIAL PRIMARY KEY,
  quiz_id INTEGER REFERENCES quizzes(id),
  text TEXT,
  hint TEXT,
  order_number INTEGER,
  info TEXT
);