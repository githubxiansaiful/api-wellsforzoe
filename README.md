# Wells for Zoë — Water Pump Explorer

A modern Next.js web application built to explore water pump installations, community impact, GPS coordinates, and field photography from the **Wells for Zoë** initiative in Malawi, powered by their GraphQL API.

## Features

- **GraphQL Integration**: Connects to the AWS GraphQL API endpoint configured in [pumps_vscode.http](file:///D:/NextJs%20Projects/test/pumps_vscode.http).
- **Interactive Directory**:
  - Real-time search across titles, villages, areas, countries, and IDs.
  - Filter by administrative area / district.
  - Sort by newest, oldest, or highest number of people served.
  - Toggle between **Card Grid view** and **Table view**.
- **Impact Metrics**: Aggregates total pumps loaded, people served, and unique communities in real-time.
- **Photo Galleries**: Displays responsive thumbnail previews and full-resolution installation photographs.
- **Detailed Pump View (`/pumps/[id]` and modal)**:
  - GPS latitude & longitude coordinates with direct links to Google Maps.
  - Beneficiary count and installation timestamps.
  - Donor dedication records.
  - Community story and field notes.
  - Interactive raw JSON viewer for API exploration and developer inspection.

## Getting Started

### 1. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Build for Production

```bash
npm run build
npm run start
```

## Environment Variables

Configured in [.env.local](file:///D:/NextJs%20Projects/test/.env.local):

- `NEXT_PUBLIC_PUMP_API_URL`: The GraphQL endpoint (`https://xy8k2fbn87.execute-api.eu-west-1.amazonaws.com/staging/graphql`)
- `PUMP_API_KEY`: The API authorization key
