# Local S3 Development Setup

This project uses MinIO as a local S3-compatible storage for development.

## Services

- **MinIO Server**: An S3-compatible object storage server
  - Web UI: http://localhost:9091 (Console)
  - S3 API Endpoint: http://localhost:9090
  - Access Key: `minioadmin`
  - Secret Key: `minioadmin`
  - Default Bucket: `MY_APP_NAME`

## How to Use in Your Application

When configuring your S3 client, use these settings for local development:

```javascript
// Example for AWS SDK v3
import { S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  endpoint: 'http://localhost:9090',
  region: 'us-east-1', // This can be any value with MinIO
  credentials: {
    accessKeyId: 'minioadmin',
    secretAccessKey: 'minioadmin',
  },
  forcePathStyle: true, // Required for MinIO
});
```

## Switching Between Local and Production

For switching between local development and Digital Ocean Spaces in production, use environment variables:

```javascript
const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT || 'http://localhost:9090',
  region: process.env.S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin',
  },
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
});
```

## Testing the Setup

1. Start the services with `docker-compose up`
2. Access the MinIO Console at http://localhost:9091
3. Login with username `minioadmin` and password `minioadmin`
4. You should see the `MY_APP_NAME` bucket created automatically

When deploying to Digital Ocean, update your environment variables to use the appropriate Spaces configuration.
