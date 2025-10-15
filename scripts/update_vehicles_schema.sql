-- Add deletion_reason column to vehicles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'vehicles' 
    AND column_name = 'deletion_reason'
  ) THEN
    ALTER TABLE vehicles 
    ADD COLUMN deletion_reason TEXT;
    
    COMMENT ON COLUMN vehicles.deletion_reason IS 'Reason for vehicle deletion/removal';
  END IF;
END $$;

-- Add deleted_at column to vehicles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'vehicles' 
    AND column_name = 'deleted_at'
  ) THEN
    ALTER TABLE vehicles 
    ADD COLUMN deleted_at TIMESTAMPTZ;
    
    COMMENT ON COLUMN vehicles.deleted_at IS 'Timestamp when vehicle was deleted/removed';
  END IF;
END $$;

-- Update the status column constraint to include 'deleted' if not already present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'vehicles_status_check' 
    AND contype = 'c'
  ) THEN
    ALTER TABLE vehicles 
    DROP CONSTRAINT IF EXISTS vehicles_status_check;
    
    ALTER TABLE vehicles 
    ADD CONSTRAINT vehicles_status_check 
    CHECK (status IN ('available', 'pending', 'sold', 'deleted'));
  END IF;
END $$;

-- Create index on status and deleted_at for better query performance
CREATE INDEX IF NOT EXISTS idx_vehicles_status_deleted 
ON vehicles(status, deleted_at) 
WHERE deleted_at IS NOT NULL;

-- Create index on user_id and status for user vehicle queries
CREATE INDEX IF NOT EXISTS idx_vehicles_user_status 
ON vehicles(user_id, status) 
WHERE status != 'deleted';

COMMENT ON TABLE vehicles IS 'Stores vehicle listings with soft delete support';
