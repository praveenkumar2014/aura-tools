-- Update handle_new_user function to add praveenkumar.kanneganto@gmail.com as admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  
  -- Assign admin role to specific emails, user role to others
  IF NEW.email IN ('praveen.kanneganti@guideitsol.com', 'praveenkumar.kanneganto@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create table for AI tools if not exists
CREATE TABLE IF NOT EXISTS public.ai_tools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  rating INTEGER DEFAULT 0,
  price TEXT,
  is_premium BOOLEAN DEFAULT false,
  image_url TEXT,
  website_url TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS on ai_tools
ALTER TABLE public.ai_tools ENABLE ROW LEVEL SECURITY;

-- Create policies for ai_tools
CREATE POLICY "Anyone can view AI tools" 
ON public.ai_tools 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert AI tools" 
ON public.ai_tools 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update AI tools" 
ON public.ai_tools 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete AI tools" 
ON public.ai_tools 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for automatic timestamp updates on ai_tools
CREATE TRIGGER update_ai_tools_updated_at
    BEFORE UPDATE ON public.ai_tools
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create table for user favorites
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id UUID NOT NULL REFERENCES public.ai_tools(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, tool_id)
);

-- Enable RLS on user_favorites
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Create policies for user_favorites
CREATE POLICY "Users can view their own favorites" 
ON public.user_favorites 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own favorites" 
ON public.user_favorites 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" 
ON public.user_favorites 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create table for user activity
CREATE TABLE IF NOT EXISTS public.user_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id UUID REFERENCES public.ai_tools(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_activity
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Create policies for user_activity
CREATE POLICY "Users can view their own activity" 
ON public.user_activity 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity" 
ON public.user_activity 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity" 
ON public.user_activity 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));