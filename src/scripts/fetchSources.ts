import fs   from 'fs'
import path from 'path'
import axios from 'axios'
import * as dotenv from 'dotenv'

dotenv.config()   

const apiKey = process.env.WATCHMODE_API_KEY
if (!apiKey) {
  console.error('WATCHMODE_API_KEY is not set in .env or the environment')
  process.exit(1)
}

;(async () => {
  console.log('Fetching Watchmode sources…')
  try {
    const { data } = await axios.get<{ source_id: number }[]>(
      'https://api.watchmode.com/v1/sources/',
      { params: { apiKey } }
    )

    const outputPath = path.resolve(process.cwd(), 'data/watchmodeSources.json')
    fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2))

    console.log(`Saved ${data.length} sources to ${outputPath}`)
    process.exit(0)
  } catch (err) {
    console.error('Failed to fetch Watchmode sources:', err)
    process.exit(1)
  }
})()
