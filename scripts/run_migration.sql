-- This script runs the complete database migration
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (be careful in production!)
DROP TABLE IF EXISTS saved_vehicles CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop existing functions and triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL DEFAULT '',
    last_name VARCHAR(100) NOT NULL DEFAULT '',
    phone VARCHAR(20),
    profile_pic TEXT,
    suburb VARCHAR(100),
    city VARCHAR(100),
    province VARCHAR(100),
    login_method VARCHAR(20) DEFAULT 'email' CHECK (login_method IN ('email', 'google', 'facebook', 'apple')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vehicles table
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM NOW()) + 1),
    price DECIMAL(12,2) NOT NULL CHECK (price >= 0),
    mileage INTEGER NOT NULL CHECK (mileage >= 0),
    transmission VARCHAR(20) NOT NULL CHECK (transmission IN ('Manual', 'Automatic')),
    fuel VARCHAR(20) NOT NULL CHECK (fuel IN ('Petrol', 'Diesel', 'Electric', 'Hybrid')),
    engine_capacity VARCHAR(10),
    body_type VARCHAR(50),
    variant VARCHAR(100),
    description TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    images TEXT[] DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create saved_vehicles table
CREATE TABLE saved_vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, vehicle_id)
);

-- Create indexes
CREATE INDEX idx_vehicles_user_id ON vehicles(user_id);
CREATE INDEX idx_vehicles_make_model ON vehicles(make, model);
CREATE INDEX idx_vehicles_price ON vehicles(price);
CREATE INDEX idx_vehicles_year ON vehicles(year);
CREATE INDEX idx_vehicles_city_province ON vehicles(city, province);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_created_at ON vehicles(created_at DESC);
CREATE INDEX idx_saved_vehicles_user_id ON saved_vehicles(user_id);
CREATE INDEX idx_saved_vehicles_vehicle_id ON saved_vehicles(vehicle_id);

-- Create full-text search index
CREATE INDEX idx_vehicles_search ON vehicles USING gin(
    to_tsvector('english', make || ' ' || model || ' ' || COALESCE(variant, '') || ' ' || COALESCE(description, ''))
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_vehicles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for vehicles table
CREATE POLICY "Anyone can view active vehicles" ON vehicles
    FOR SELECT USING (status = 'active');

CREATE POLICY "Users can insert their own vehicles" ON vehicles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vehicles" ON vehicles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vehicles" ON vehicles
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for saved_vehicles table
CREATE POLICY "Users can view their own saved vehicles" ON saved_vehicles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save vehicles" ON saved_vehicles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave their own saved vehicles" ON saved_vehicles
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle user creation from auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    BEGIN
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
    EXCEPTION
        WHEN OTHERS THEN
            -- Log the error but don't fail the auth user creation
            RAISE WARNING 'Failed to create user profile for %: %', NEW.id, SQLERRM;
    END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('vehicle-storage', 'vehicle-storage', true),
    ('profile-picture', 'profile-picture', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for vehicle-storage bucket
CREATE POLICY "Anyone can view vehicle images" ON storage.objects
    FOR SELECT USING (bucket_id = 'vehicle-storage');

CREATE POLICY "Authenticated users can upload vehicle images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'vehicle-storage' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own vehicle images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'vehicle-storage' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own vehicle images" ON storage.objects
    FOR DELETE USING (bucket_id = 'vehicle-storage' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for profile-picture bucket
CREATE POLICY "Anyone can view profile pictures" ON storage.objects
    FOR SELECT USING (bucket_id = 'profile-picture');

CREATE POLICY "Users can upload their own profile picture" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'profile-picture' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own profile picture" ON storage.objects
    FOR UPDATE USING (bucket_id = 'profile-picture' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own profile picture" ON storage.objects
    FOR DELETE USING (bucket_id = 'profile-picture' AND auth.uid()::text = (storage.foldername(name))[1]);
