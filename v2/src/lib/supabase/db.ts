import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";
import * as schema from "../../../migrations/schema";
import { migrate } from "drizzle-orm/postgres-js/migrator";

dotenv.config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  console.log("No Database Url Found");
}

import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

// Fix for "sorry, too many clients already"
declare global {
  // eslint-disable-next-line no-var -- only var works here
  var db: PostgresJsDatabase<typeof schema> | undefined;
}

let db: PostgresJsDatabase<typeof schema>;

const client = postgres(process.env.DATABASE_URL as string);
if (process.env.NODE_ENV === "production") {
  db = drizzle(client, { schema });
} else {
  if (!global.db) global.db = drizzle(client, { schema });

  db = global.db;
}
const migrateDB = async () => {
  try {
    console.log("Migrating client...");
    await migrate(db, { migrationsFolder: "migrations" });
    console.log("Successfuly Migrated");
  } catch (error) {
    console.log(error);
    console.log("Error Migrating client...");
  }
};

migrateDB();

export default db;
