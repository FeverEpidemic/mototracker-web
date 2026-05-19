This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploying & Running on Docker

This project includes a production-ready, multi-stage `Dockerfile` and a `docker-compose.yml` configuration optimized for high-performance hosting (leveraging Next.js `standalone` output mode to keep the final container image under 150MB).

### Prerequisites
Make sure you have [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.

### Environment Setup
Create a `.env.local` file in the root directory (or ensure your existing one has these values). These variables are required both during the Next.js static asset build phase and at container runtime:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

### Option 1: Running with Docker Compose (Recommended)

Docker Compose reads the `.env.local` file automatically, injects them as build arguments to compile the Next.js app, and spins up the container.

#### 1. Build and Start the Container
```bash
docker compose up -d --build
```

#### 2. Check Service Status
```bash
docker compose ps
```

#### 3. View Logs
```bash
docker compose logs -f
```

#### 4. Stop the Container
```bash
docker compose down
```

---

### Option 2: Running with the Native Docker CLI

If you prefer to build and run the image manually using the Docker CLI:

#### 1. Build the Image
You must pass your Supabase environment variables as `--build-arg` parameters so that Next.js can compile static content and bake them into the JS bundles:

```bash
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="your_supabase_url" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key" \
  -t mototracker-web:latest .
```

#### 2. Run the Container
Run the built image, mapping port `3000` to your host machine:

```bash
docker run -d \
  -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL="your_supabase_url" \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key" \
  --name mototracker-web-container \
  mototracker-web:latest
```

---

### Verifying the Deployment
Once the container starts, open your browser and navigate to:
[**http://localhost:3000**](http://localhost:3000)

