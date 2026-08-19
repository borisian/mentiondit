# Mentiondit

Mentiondit analyzes Reddit discussions to compare mentions, sentiment, and recommendations. Results link back to the original comments.

## Setup

Create a Reddit application of type `script`, then set up the server:

```bash
cd server
cp .env.example .env
pnpm install
pnpm run dev
```

Add your Reddit credentials to `server/.env`. The `SERPER_API_KEY` is optional.

Start the client in a second terminal:

```bash
cd client
cp .env.example .env.local
pnpm install
pnpm run dev
```

Open http://localhost:3001.

## License

MIT
