#!/bin/bash

# Prompt for the app name
echo "Enter your app name (lowercase, no spaces):"
read app_name

# Convert to lowercase and remove spaces
app_name=$(echo "$app_name" | tr '[:upper:]' '[:lower:]' | tr -d ' ')

# Run pnpm install
echo "Installing dependencies..."
pnpm install

# Create .env files for backend
echo "Creating environment files..."
cat > packages/backend/.env << EOL
# App
NODE_ENV=development
PORT=3000

# Domain Configuration
API_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

# Authentication
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SESSION_SECRET=local_dev_secret_$(openssl rand -hex 12)

# Database - Using Docker service names
DATABASE_URL="postgresql://$app_name:$app_name@localhost:5432/$app_name-db?schema=public"
REDIS_URL=redis://localhost:6379

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PRICE_ID=
STRIPE_WEBHOOK_SECRET=

# Postgres
POSTGRES_USER=$app_name
POSTGRES_PASSWORD=$app_name
POSTGRES_DB=$app_name-db

# OpenAI
OPENAI_API_KEY=

# Resend
RESEND_API_KEY=

# JWT
JWT_ACCESS_SECRET=local_access_secret_$(openssl rand -hex 12)
JWT_REFRESH_SECRET=local_refresh_secret_$(openssl rand -hex 12)

# BETTER_AUTH
BETTER_AUTH_SECRET=local_better_auth_secret_$(openssl rand -hex 12)
BETTER_AUTH_URL=http://localhost:3000
EOL

cat > packages/backend/.env.production << EOL
# App
NODE_ENV=production
PORT=3000

# Domain Configuration
API_URL=https://api.$app_name.com
FRONTEND_URL=https://$app_name.com

# Authentication
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SESSION_SECRET=

# Database - Using Docker service names
DATABASE_URL=
REDIS_URL=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PRICE_ID=
STRIPE_WEBHOOK_SECRET=

# Postgres
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=

# OpenAI
OPENAI_API_KEY=

# Resend
RESEND_API_KEY=

# JWT
JWT_ACCESS_SECRET=access_secret_$(openssl rand -hex 12)
JWT_REFRESH_SECRET=refresh_secret_$(openssl rand -hex 12)

# BETTER_AUTH
BETTER_AUTH_SECRET=better_auth_secret_$(openssl rand -hex 12)
EOL

# Create .env files for frontend
echo "Creating frontend environment files..."
cat > packages/frontend/.env << EOL
# API Configuration
VITE_API_URL=http://localhost:3000
NODE_ENV=development
EOL

cat > packages/frontend/.env.production << EOL
# API Configuration
VITE_API_URL=https://api.$app_name.com
NODE_ENV=production
EOL

# # Find and replace MY_APP_NAME in all files
echo "Updating app name in files..."
find . -type f \( -name "*.json" -o -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.html" -o -name "*.md" -o -name "*.yml" -o -name "*.yaml" -o -name "nginx.conf" -o -name "docker-compose.yml" \) -not -path "./node_modules/*" -not -path "*/node_modules/*" -exec sed -i '' "s/MY_APP_NAME/$app_name/g" {} +

echo "Bootstrap complete! Your app is now named: $app_name"
