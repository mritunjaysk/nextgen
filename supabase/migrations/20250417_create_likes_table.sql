CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

-- Add index for performance
CREATE INDEX likes_recipe_id_idx ON likes(recipe_id);
CREATE INDEX likes_user_id_idx ON likes(user_id);

-- Add column to recipes table to track like count
ALTER TABLE recipes ADD COLUMN likes_count INTEGER DEFAULT 0;