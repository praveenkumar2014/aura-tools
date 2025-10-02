-- Update handle_new_user function to include new admin email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  
  -- Assign admin role to specific emails, user role to others
  IF NEW.email IN ('praveen.kanneganti@guideitsol.com', 'praveenkumar.kanneganto@gmail.com', 'pranu21m@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Add columns to AuraAi table
ALTER TABLE public."AuraAi" ADD COLUMN IF NOT EXISTS name text NOT NULL DEFAULT '';
ALTER TABLE public."AuraAi" ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public."AuraAi" ADD COLUMN IF NOT EXISTS model_type text;
ALTER TABLE public."AuraAi" ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';
ALTER TABLE public."AuraAi" ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public."AuraAi" ADD COLUMN IF NOT EXISTS config jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public."AuraAi" ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Add trigger for updated_at
CREATE TRIGGER update_auraai_updated_at
  BEFORE UPDATE ON public."AuraAi"
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add RLS policies for AuraAi table
CREATE POLICY "Users can view their own AuraAi models"
  ON public."AuraAi"
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all AuraAi models"
  ON public."AuraAi"
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create their own AuraAi models"
  ON public."AuraAi"
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AuraAi models"
  ON public."AuraAi"
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can update all AuraAi models"
  ON public."AuraAi"
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete their own AuraAi models"
  ON public."AuraAi"
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete all AuraAi models"
  ON public."AuraAi"
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));