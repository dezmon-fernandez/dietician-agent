#!/bin/sh
set -e

# Wait for MinIO to be ready
echo "Waiting for MinIO to be ready..."
sleep 5
until (mc config host add myminio http://minio:9000 minioadmin minioadmin) do
  echo "MinIO not ready yet. Waiting..."
  sleep 2
done

echo "MinIO is ready. Creating bucket..."

# Create bucket if it doesn't exist
mc mb --ignore-existing myminio/MY_APP_NAME

# Set bucket policy to allow public read
echo "Setting bucket policy..."
mc policy set public myminio/MY_APP_NAME

echo "MinIO setup completed successfully"
exit 0
