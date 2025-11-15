import dotenv from "dotenv";
import app from "./app";

import db from "./config/db";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function main() {
  await db.sync({ alter: true });
  console.log("DB synced");
}

app.listen(PORT, async () => {
  await main();
  console.log(`Server is running on http://localhost:${PORT}`);
});
