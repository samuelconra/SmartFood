-- ------------------------------------------------------------
--  SALES - GENESIS SCRIPT
-- ------------------------------------------------------------

-- =====================================================
-- SCHEMAS
-- =====================================================
CREATE SCHEMA IF NOT EXISTS smartfood;
SET search_path TO smartfood;

-- ==========================================
-- 1. USUARIOS Y METAS NUTRICIONALES
-- ==========================================
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    -- Metas diarias para cuadrar el Meal Plan (volumen limpio, déficit, etc.)
    target_calories DECIMAL(6,2),
    target_protein_g DECIMAL(5,2),
    target_carbs_g DECIMAL(5,2),
    target_fats_g DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 2. CATÁLOGO MAESTRO DE INGREDIENTES
-- ==========================================
CREATE TABLE ingredients (
    ingredient_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50), -- Ej. 'Lácteos', 'Proteínas', 'Vegetales'
    unit_of_measure VARCHAR(20) NOT NULL -- Ej. 'gramos', 'mililitros', 'piezas'
);

-- ==========================================
-- 3. INVENTARIO INTELIGENTE (POR LOTES/CADUCIDAD)
-- ==========================================
CREATE TABLE user_inventory (
    inventory_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    ingredient_id INT REFERENCES ingredients(ingredient_id),
    quantity DECIMAL(8,2) NOT NULL CHECK (quantity > 0),
    expiration_date DATE NOT NULL,
    added_date DATE DEFAULT CURRENT_DATE,
    is_consumed BOOLEAN DEFAULT FALSE,
    -- Índice para acelerar las alertas de caducidad
    CONSTRAINT fk_inventory_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);
CREATE INDEX idx_expiration_date ON user_inventory(expiration_date) WHERE is_consumed = FALSE;

-- ==========================================
-- 4. CATÁLOGO DE RECETAS Y MACROS
-- ==========================================
CREATE TABLE recipes (
    recipe_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    instructions TEXT NOT NULL,
    prep_time_minutes INT,
    -- Información nutricional total por porción
    calories DECIMAL(6,2) NOT NULL,
    protein_g DECIMAL(5,2) NOT NULL,
    carbs_g DECIMAL(5,2) NOT NULL,
    fats_g DECIMAL(5,2) NOT NULL
);

-- ==========================================
-- 5. RELACIÓN RECETA <-> INGREDIENTES
-- ==========================================
CREATE TABLE recipe_ingredients (
    recipe_id INT REFERENCES recipes(recipe_id) ON DELETE CASCADE,
    ingredient_id INT REFERENCES ingredients(ingredient_id) ON DELETE RESTRICT,
    required_quantity DECIMAL(8,2) NOT NULL,
    PRIMARY KEY (recipe_id, ingredient_id)
);

-- ==========================================
-- 6. PLANIFICADOR DE DIETAS (MEAL PLAN)
-- ==========================================
CREATE TABLE meal_plans (
    plan_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    plan_date DATE NOT NULL,
    UNIQUE (user_id, plan_date) -- Un plan por día por usuario
);

CREATE TABLE meal_plan_items (
    plan_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES meal_plans(plan_id) ON DELETE CASCADE,
    recipe_id INT REFERENCES recipes(recipe_id),
    meal_type VARCHAR(20) CHECK (meal_type IN ('Desayuno', 'Comida', 'Cena', 'Snack')),
    servings DECIMAL(4,2) DEFAULT 1.0
);
