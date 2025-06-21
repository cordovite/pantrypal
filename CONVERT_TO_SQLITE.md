# Converting PantryPal to SQLite

If you prefer a simple database file instead of PostgreSQL, here are the changes needed:

## 1. Install SQLite Dependencies
```bash
npm install better-sqlite3 drizzle-orm
npm uninstall @neondatabase/serverless
```

## 2. Update Database Connection (server/db.ts)
Replace PostgreSQL connection with SQLite:

```typescript
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from "@shared/schema";

const sqlite = new Database('pantrypal.db');
export const db = drizzle(sqlite, { schema });
```

## 3. Update Schema (shared/schema.ts)
Change PostgreSQL-specific types to SQLite:
- `serial("id").primaryKey()` → `integer("id").primaryKey({ autoIncrement: true })`
- `varchar()` → `text()`
- `timestamp()` → `integer("timestamp", { mode: "timestamp" })`

## 4. Update Environment
Your `.env` file would just need:
```
DATABASE_URL=sqlite:./pantrypal.db
SESSION_SECRET=your-secret-key
```

## 5. Database File
After conversion, you'll have a `pantrypal.db` file that contains all your data.

This approach gives you a single file database that's easy to backup and move around.