# Vibe Coading (vyntra)

This repository is a Next.js + Tailwind starter with a small landing UI and placeholder cards.

## Requirements
- Node >= 20
- npm

## Setup
1. `npm install`
2. `npm run dev`
3. Open http://localhost:3000

## Notes
- Dependencies have been pinned for deterministic installs.
- Run `npm run type-check` to run TypeScript checks.

## Firestore Seeding

This project includes a one-click Firestore seeding API for dev/staging environments.

### Environment Variables

Set the following environment variables in your Vercel project or `.env.local`:

1. **FIREBASE_SERVICE_ACCOUNT_B64** (recommended for Vercel)
   - Base64-encoded Firebase service account JSON
   - Generate: `cat service-account.json | base64 -w 0` (Linux) or `cat service-account.json | base64` (Mac)
   
2. **FIREBASE_SERVICE_ACCOUNT** (alternative)
   - Plain JSON string of Firebase service account
   
3. **SEED_SECRET** (required)
   - Secret token for authenticating seed requests
   - Generate a strong random string: `openssl rand -hex 32`

### Seeding via API (Vercel/Production)

After deploying to Vercel:

```bash
# Using x-seed-secret header
curl -X POST https://your-app.vercel.app/api/seed \
  -H "x-seed-secret: YOUR_SEED_SECRET"

# Using Authorization Bearer
curl -X POST https://your-app.vercel.app/api/seed \
  -H "Authorization: Bearer YOUR_SEED_SECRET"
```

Response:
```json
{
  "success": true,
  "message": "Firestore seeded successfully",
  "tripIds": ["abc123", "def456", "ghi789"],
  "timestamp": "2024-03-15T10:30:00.000Z"
}
```

### Local Seeding via Script

For local development, use the admin seed script:

1. Download your Firebase service account JSON from Firebase Console
2. Set the environment variable:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"
   ```
3. Run the seed script:
   ```bash
   npx tsx scripts/seed-admin.ts
   ```

### Security Notes

⚠️ **Important Security Guidelines:**

- **Never commit** service account JSON files or real secrets to the repository
- Use `.gitignore` to exclude `*service-account*.json` files
- Rotate or remove `SEED_SECRET` after seeding in production
- The seed endpoint is protected and requires authentication
- Consider disabling the seed API in production by removing the route or checking `NODE_ENV`

### Firestore Rules

Deploy the included `firestore.rules` to your Firebase project:

```bash
firebase deploy --only firestore:rules
```

The rules enforce:
- Authenticated users can create trips (with themselves as owner)
- Public trips are readable by anyone
- Private trips are only readable by owner and members
- Subcollections (itinerary, expenses) inherit parent trip permissions
