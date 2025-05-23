# StreamShelf

This is a **Next.js** application that helps users find streaming availability for movies and TV shows across multiple platforms. It features:

- **Step 1:** Select your subscription access (Included vs All).
- **Step 2:** Choose streaming platforms you use (e.g., Netflix, Hulu).
- **Step 3:** Search for a show or movie, view matching titles, and see available streaming options.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Configuration](#configuration)
- [Watchmode API Terms](#watchmode-api-terms)
- [Deployment](#deployment)
- [License](#license)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/streamshelf.git
   ```

2. Install dependencies:

   ```bash
   cd streamshelf
   npm install
   # or yarn install
   ```

## Usage

- **Development:**

  ```bash
  npm run dev
  # or yarn dev
  ```

  Navigate to `http://localhost:3000`.

- **Production Build:**

  ```bash
  npm run build
  npm run start
  # or yarn build && yarn start
  ```

## Features

- Autocompletion of titles using Watchmode API
- OMDb integration for title posters and plots
- Dynamic filtering by access and platform
- Responsive design with Tailwind CSS

## Configuration

Create a `.env.local` file at the project root and add your API keys:

```ini
OMDB_API_KEY=your_omdb_api_key
WATCHMODE_API_KEY=your_watchmode_api_key
```

## Watchmode API Terms

This application uses the Watchmode API, which is subject to Watchmode’s [Terms of Use](https://api.watchmode.com/terms). By using this application, you agree to comply with the Watchmode attribution, caching, and rate‑limit policies.

## Deployment

We recommend deploying on **Vercel** for seamless Next.js support:

1. Push your code to GitHub.
2. Import the repo on Vercel.
3. Set environment variables in Vercel dashboard.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
