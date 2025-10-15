-- Create deleted_vehicles table for research purposes
CREATE TABLE IF NOT EXISTS deleted_vehicles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    original_vehicle_id UUID NOT NULL,
    vehicle_data JSONB NOT NULL,
    deletion_reason TEXT,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deleted_vehicles_original_id ON deleted_vehicles(original_vehicle_id);
CREATE INDEX IF NOT EXISTS idx_deleted_vehicles_deleted_at ON deleted_vehicles(deleted_at);
CREATE INDEX IF NOT EXISTS idx_deleted_vehicles_deleted_by ON deleted_vehicles(deleted_by);

-- Add deletion_reason column to vehicles table if it doesn't exist
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS deletion_reason TEXT;

-- Update vehicles table to ensure status column includes 'deleted'
ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_status_check;
ALTER TABLE vehicles ADD CONSTRAINT vehicles_status_check 
    CHECK (status IN ('active', 'inactive', 'sold', 'deleted'));

-- Create RLS policies for deleted_vehicles table
ALTER TABLE deleted_vehicles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own deleted vehicles
CREATE POLICY "Users can view own deleted vehicles" ON deleted_vehicles
    FOR SELECT USING (deleted_by = auth.uid());

-- Policy: Users can only insert their own deleted vehicles (system use)
CREATE POLICY "Users can insert own deleted vehicles" ON deleted_vehicles
    FOR INSERT WITH CHECK (deleted_by = auth.uid());

-- Add comment for documentation
COMMENT ON TABLE deleted_vehicles IS 'Stores complete vehicle data when vehicles are soft-deleted for research and audit purposes';
