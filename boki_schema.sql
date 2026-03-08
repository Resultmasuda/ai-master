-- Boki AI Master: Multi-Grade & AI Analytics Schema

-- 1. Grade category mapping
CREATE TYPE boki_grade AS ENUM ('3', '2', '1', 'OTHER');

-- 2. Questions table (Grade-agnostic)
CREATE TABLE boki_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grade boki_grade NOT NULL,
    category TEXT NOT NULL, -- e.g. "有価証券", "減価償却"
    sub_category TEXT,
    question_text TEXT NOT NULL,
    choices JSONB NOT NULL, -- Array of strings
    correct_answer_index INTEGER NOT NULL,
    explanation TEXT,
    type TEXT DEFAULT 'CHOICE', -- CHOICE, JOURNAL, CALC
    difficulty INTEGER DEFAULT 1, -- 1 to 5
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. User performance logs (For AI Analysis)
CREATE TABLE boki_user_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- Link to auth.users
    question_id UUID REFERENCES boki_questions(id),
    is_correct BOOLEAN NOT NULL,
    selected_index INTEGER,
    time_spent_seconds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. AI Analysis cache / reports
CREATE TABLE boki_ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    insight_text TEXT NOT NULL, -- AI generated summary
    weak_categories JSONB, -- e.g. {"有価証券": 0.4, "連結決算": 0.2}
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies (Draft)
ALTER TABLE boki_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for questions" ON boki_questions FOR SELECT USING (true);

ALTER TABLE boki_user_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own logs" ON boki_user_logs FOR SELECT USING (auth.uid() = user_id);
