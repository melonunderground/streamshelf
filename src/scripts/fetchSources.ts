import fs from "fs";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";
import { Source } from "@/lib/types";

// Load .env from the project root (2 levels up from src/scripts)
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const apiKey = process.env.WATCHMODE_API_KEY;

if (!apiKey) {
  console.error("WATCHMODE_API_KEY is not set in .env");
  process.exit(1);
}

const fetchSources = async (): Promise<void> => {
  try {
    const { data } = await axios.get<Source[]>("https://api.watchmode.com/v1/sources/", {
      params: {
        apiKey,
      },
    });

    const outputPath = path.resolve(__dirname, "../../data/watchmodeSources.json");
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Watchmode API error:", error.response?.data);
    } else if (error instanceof Error) {
      console.error("Unexpected error:", error.message);
    } else {
      console.error("Unknown throwL:", error)
    }
  }
};

fetchSources();
