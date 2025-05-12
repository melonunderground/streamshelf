import fs from "fs";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";

// Load .env from the project root (2 levels up from src/scripts)
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const apiKey = process.env.WATCHMODE_API_KEY;

if (!apiKey) {
  console.error("WATCHMODE_API_KEY is not set in .env");
  process.exit(1);
}

const fetchSources = async () => {
  try {
    const { data } = await axios.get("https://api.watchmode.com/v1/sources/", {
      params: {
        apiKey,
      },
    });

    const outputPath = path.resolve(__dirname, "../../data/watchmodeSources.json");
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

    console.log(`Saved ${data.length} sources to ${outputPath}`);
  } catch (err: any) {
    console.error("Failed to fetch Watchmode sources:", err.response?.data || err.message);
  }
};

fetchSources();
