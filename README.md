# CS35L Club Tracker

Description: TO-DO

## Requirements
- Node.js (LTS) and npm
- Git


## Run locally
Clone the repo and move into it. Then:

`npm run install:all`
`cp server/.env.example server/.env`
`npm run dev`

The client runs at http://localhost:5173 and the server at
http://localhost:4000. Check the server at /api/health.

## Project structure
`client/` – React app (Vite)
`server/` – Express API (routes, controllers, services, middleware)

## Contributing
Branch off main, name branches after the user story (e.g. `MH7-club-login`),
and open a pull request for review.

## Environment variables
Fill in your credentials at `server/.env`, including the supabase links.

## Database
Wrote schema in `supabase/schema.sql`. All teammates share one
Supabase project, changes to schema go through a pull request.