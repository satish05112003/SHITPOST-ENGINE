
-- Create generations table
CREATE TABLE public.generations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  input_content TEXT NOT NULL,
  output_shitpost TEXT NOT NULL,
  tone_preset TEXT NOT NULL DEFAULT 'auto'
);

-- Enable RLS
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

-- Authenticated users can insert (user_id must match their own)
CREATE POLICY "Users can insert their own generations"
  ON public.generations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only see their own generations
CREATE POLICY "Users can view their own generations"
  ON public.generations FOR SELECT
  USING (auth.uid() = user_id);

-- Users can delete their own generations
CREATE POLICY "Users can delete their own generations"
  ON public.generations FOR DELETE
  USING (auth.uid() = user_id);
