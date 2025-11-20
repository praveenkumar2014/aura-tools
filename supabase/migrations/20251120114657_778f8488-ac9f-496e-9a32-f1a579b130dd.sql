-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- User roles policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Create AI tools table
CREATE TABLE public.ai_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  website_url TEXT,
  image_url TEXT,
  price TEXT,
  rating INTEGER,
  tags TEXT[],
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.ai_tools ENABLE ROW LEVEL SECURITY;

-- AI tools policies (public read access)
CREATE POLICY "Anyone can view AI tools"
  ON public.ai_tools FOR SELECT
  USING (true);

-- Create user_favorites table
CREATE TABLE public.user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tool_id UUID REFERENCES public.ai_tools(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, tool_id)
);

ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- User favorites policies
CREATE POLICY "Users can view their own favorites"
  ON public.user_favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites"
  ON public.user_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON public.user_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Create user_activity table
CREATE TABLE public.user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL,
  activity_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- User activity policies
CREATE POLICY "Users can view their own activity"
  ON public.user_activity FOR SELECT
  USING (auth.uid() = user_id);

-- Insert sample AI tools
INSERT INTO public.ai_tools (name, description, category, website_url, image_url, price, rating, tags, is_premium) VALUES
('ChatGPT', 'Advanced conversational AI for natural language understanding and generation', 'Text Generation', 'https://chat.openai.com', 'https://images.unsplash.com/photo-1677442136019-21780ecad995', 'Free - $20/mo', 5, ARRAY['NLP', 'Chatbot', 'Writing'], true),
('Midjourney', 'AI art generator creating stunning images from text descriptions', 'Image Generation', 'https://midjourney.com', 'https://images.unsplash.com/photo-1686191128892-c15d4443f5a0', '$10 - $60/mo', 5, ARRAY['Art', 'Design', 'Creative'], true),
('GitHub Copilot', 'AI-powered code completion and suggestions for developers', 'Code Generation', 'https://github.com/features/copilot', 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb', '$10/mo', 5, ARRAY['Coding', 'Development', 'Productivity'], true),
('Jasper AI', 'AI writing assistant for marketing copy and content creation', 'Content Writing', 'https://jasper.ai', 'https://images.unsplash.com/photo-1455390582262-044cdead277a', '$39 - $125/mo', 4, ARRAY['Marketing', 'Writing', 'SEO'], true),
('Runway ML', 'AI-powered video editing and generation platform', 'Video Generation', 'https://runwayml.com', 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d', 'Free - $95/mo', 5, ARRAY['Video', 'Editing', 'Creative'], true),
('Copy.ai', 'AI copywriting tool for marketing content and social media', 'Content Writing', 'https://copy.ai', 'https://images.unsplash.com/photo-1499750310107-5fef28a66643', 'Free - $49/mo', 4, ARRAY['Marketing', 'Social Media', 'Writing'], false),
('Stable Diffusion', 'Open-source AI image generation model', 'Image Generation', 'https://stability.ai', 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e', 'Free - $30/mo', 4, ARRAY['Art', 'Open Source', 'Design'], false),
('Grammarly', 'AI-powered writing assistant for grammar and style', 'Writing Assistant', 'https://grammarly.com', 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32', 'Free - $30/mo', 5, ARRAY['Writing', 'Grammar', 'Productivity'], true),
('Synthesia', 'AI video generation with realistic avatars', 'Video Generation', 'https://synthesia.io', 'https://images.unsplash.com/photo-1598550476439-6847785fcea6', '$30 - $90/mo', 4, ARRAY['Video', 'Avatars', 'Presentation'], true),
('Notion AI', 'AI-powered workspace for notes and collaboration', 'Productivity', 'https://notion.so', 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b', 'Free - $10/mo', 5, ARRAY['Productivity', 'Notes', 'Collaboration'], true),
('Loom AI', 'AI-enhanced screen recording and video messaging', 'Video Tools', 'https://loom.com', 'https://images.unsplash.com/photo-1611162616475-46b635cb6868', 'Free - $15/mo', 4, ARRAY['Video', 'Communication', 'Productivity'], false),
('Canva AI', 'AI design tools integrated into Canva platform', 'Design', 'https://canva.com', 'https://images.unsplash.com/photo-1626785774573-4b799315345d', 'Free - $15/mo', 5, ARRAY['Design', 'Graphics', 'Marketing'], true)
ON CONFLICT (id) DO NOTHING;