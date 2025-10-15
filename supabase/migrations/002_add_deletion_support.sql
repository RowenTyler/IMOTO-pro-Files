-- Add deletion_reason column to vehicles table if it doesn't exist
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS deletion_reason TEXT;

-- Update vehicles table to ensure status column includes 'deleted'
ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_status_check;
ALTER TABLE vehicles ADD CONSTRAINT vehicles_status_check 
    CHECK (status IN ('active', 'inactive', 'sold', 'deleted'));

-- Add indexes for better performance on deletion queries
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_user_id_status ON vehicles(user_id, status);

-- Add comment for documentation
COMMENT ON COLUMN vehicles.deletion_reason IS 'Reason provided when vehicle is soft-deleted';
