# CrowdFund - Web3 Crowdfunding Platform

CrowdFund is a decentralized crowdfunding platform built on Web3 technologies that allows creators to launch campaigns and receive funding directly from supporters using cryptocurrency.

## Features

- 🚀 **Create Campaigns**: Launch your project with customizable goals, descriptions, and funding tiers
- 💰 **Tiered Support**: Set up multiple contribution tiers with unique perks for backers
- 🔐 **Web3 Authentication**: Secure wallet-based authentication using SIWE (Sign-In with Ethereum)
- 🌐 **Decentralized Payments**: Accept contributions directly to your wallet
- 📊 **Campaign Dashboard**: Track your campaign's progress and contributions
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 20+ and npm/yarn
- PostgreSQL database
- Metamask or other Web3 wallet

### Environment Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/crowd-fund.git
   cd crowd-fund
   ```
2. Copy the environment variables:
   ```bash
   cp .env.example .env
   ```
3. Fill in your environment variables in the `.env` file:
   - Database connection string

### Required Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `NEXT_PUBLIC_API_URL`: API base URL

### Installation

```bash
# Install dependencies
npm install

# Set up the database
npx prisma migrate dev

# Start the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application in action.

### Docker Setup

```bash
# Start with Docker Compose
docker compose up -d
```

## Project Structure

- `/app` - Next.js app directory with pages and API routes
- `/components` - Reusable React components
- `/lib` - Utility functions and shared code
- `/prisma` - Database schema and migrations
- `/config` - Application configuration

## Database Schema

The application uses three main models:

- **Campaign** - Stores campaign details, funding goals, and metadata
- **Tier** - Defines different contribution levels and perks
- **Contribution** - Records of user contributions to campaigns

## Deployment

This project is configured for easy deployment to Vercel. It also includes Docker configuration for alternative deployment options.

## Docker Deployment

### Prerequisites

- Docker and Docker Compose installed on your system
- Git (to clone the repository)

### Deployment Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/crowd-fund.git
   cd crowd-fund
   ```

2. Create a `.env` file for production settings:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your production values:

   ```
   DATABASE_URL="postgresql://postgres:postgres@postgres:5432/crowdfund?schema=public"
   NEXT_PUBLIC_API_URL="your-production-url"
   ```

3. Build and start the Docker containers:

   ```bash
   docker compose up -d
   ```

4. Access your application at http://localhost:3000

## Development Environment

### Prerequisites

- Node.js 20 or higher
- PostgreSQL 16

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/crowd-fund.git
   cd crowd-fund
   ```

2. Copy the environment variables:

   ```bash
   cp .env.example .env
   ```

3. Update the environment variables in the `.env` file with your local development values.

4. Install dependencies:

   ```bash
   npm install
   ```

5. Set up the database:

   ```bash
   npx prisma migrate dev
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Additional Commands

- Build the application:

  ```bash
  npm run build
  ```

- Start the production server:

  ```bash
  npm start
  ```

- Format code:

  ```bash
  npm run format
  ```

- Lint code:
  ```bash
  npm run lint
  ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
