-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create users table with proper constraints
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT DEFAULT '',
    last_name TEXT DEFAULT '',
    phone TEXT,
    location TEXT,
    profile_pic TEXT,
    login_method TEXT DEFAULT 'email' CHECK (login_method IN ('email', 'google', 'facebook', 'apple')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM NOW()) + 1),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    mileage INTEGER NOT NULL CHECK (mileage >= 0),
    condition TEXT NOT NULL CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
    description TEXT,
    images TEXT[] DEFAULT '{}',
    location TEXT NOT NULL,
    contact_phone TEXT,
    contact_email TEXT,
    preferred_contact TEXT DEFAULT 'email' CHECK (preferred_contact IN ('phone', 'email')),
    features TEXT[] DEFAULT '{}',
    fuel_type TEXT NOT NULL CHECK (fuel_type IN ('gasoline', 'diesel', 'electric', 'hybrid')),
    transmission TEXT NOT NULL CHECK (transmission IN ('manual', 'automatic')),
    body_type TEXT NOT NULL CHECK (body_type IN ('sedan', 'suv', 'truck', 'coupe', 'convertible', 'wagon', 'hatchback')),
    exterior_color TEXT NOT NULL,
    interior_color TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create saved_vehicles table
CREATE TABLE IF NOT EXISTS public.saved_vehicles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, vehicle_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON public.vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_make_model ON public.vehicles(make, model);
CREATE INDEX IF NOT EXISTS idx_vehicles_price ON public.vehicles(price);
CREATE INDEX IF NOT EXISTS idx_vehicles_year ON public.vehicles(year);
CREATE INDEX IF NOT EXISTS idx_vehicles_location ON public.vehicles(location);
CREATE INDEX IF NOT EXISTS idx_vehicles_is_active ON public.vehicles(is_active);
CREATE INDEX IF NOT EXISTS idx_saved_vehicles_user_id ON public.saved_vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_vehicles_vehicle_id ON public.saved_vehicles(vehicle_id);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_vehicles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

-- Create RLS policies for users table
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Drop existing vehicle policies if they exist
DROP POLICY IF EXISTS "Anyone can view active vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Users can view own vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Users can insert own vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Users can update own vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Users can delete own vehicles" ON public.vehicles;

-- Create RLS policies for vehicles table
CREATE POLICY "Anyone can view active vehicles" ON public.vehicles
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view own vehicles" ON public.vehicles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vehicles" ON public.vehicles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vehicles" ON public.vehicles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vehicles" ON public.vehicles
    FOR DELETE USING (auth.uid() = user_id);

-- Drop existing saved_vehicles policies if they exist
DROP POLICY IF EXISTS "Users can view own saved vehicles" ON public.saved_vehicles;
DROP POLICY IF EXISTS "Users can insert own saved vehicles" ON public.saved_vehicles;
DROP POLICY IF EXISTS "Users can delete own saved vehicles" ON public.saved_vehicles;

-- Create RLS policies for saved_vehicles table
CREATE POLICY "Users can view own saved vehicles" ON public.saved_vehicles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved vehicles" ON public.saved_vehicles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved vehicles" ON public.saved_vehicles
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle new user registration with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert new user profile with error handling
    INSERT INTO public.users (id, email, first_name, last_name, login_method)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        CASE 
            WHEN NEW.app_metadata->>'provider' = 'google' THEN 'google'
            WHEN NEW.app_metadata->>'provider' = 'facebook' THEN 'facebook'
            WHEN NEW.app_metadata->>'provider' = 'apple' THEN 'apple'
            ELSE 'email'
        END
    );
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't prevent user creation
        RAISE WARNING 'Failed to create user profile for %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_vehicles_updated_at ON public.vehicles;
CREATE TRIGGER update_vehicles_updated_at 
    BEFORE UPDATE ON public.vehicles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-pictures', 'profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('vehicle-images', 'vehicle-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Anyone can view profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own profile pictures" ON storage.objects;

-- Create storage policies for profile pictures
CREATE POLICY "Anyone can view profile pictures" ON storage.objects
    FOR SELECT USING (bucket_id = 'profile-pictures');

CREATE POLICY "Users can upload own profile pictures" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'profile-pictures' AND 
        auth.uid() IS NOT NULL
    );

CREATE POLICY "Users can update own profile pictures" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'profile-pictures' AND 
        auth.uid() IS NOT NULL
    );

CREATE POLICY "Users can delete own profile pictures" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'profile-pictures' AND 
        auth.uid() IS NOT NULL
    );

-- Drop existing vehicle image policies if they exist
DROP POLICY IF EXISTS "Anyone can view vehicle images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload vehicle images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update vehicle images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete vehicle images" ON storage.objects;

-- Create storage policies for vehicle images
CREATE POLICY "Anyone can view vehicle images" ON storage.objects
    FOR SELECT USING (bucket_id = 'vehicle-images');

CREATE POLICY "Users can upload vehicle images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'vehicle-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update vehicle images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'vehicle-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete vehicle images" ON storage.objects
    FOR DELETE USING (bucket_id = 'vehicle-images' AND auth.uid() IS NOT NULL);
