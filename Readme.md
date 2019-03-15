## Networking Project

### Setup
- clone this repo
- ensure you have postgres installed on your local system
- from the root of this project run `cd backend && npm install`
- create a `.env` file in the backend directory using the `.env.sample file`
- create a postgres database and update the content with your `DB_NAME`, `DB_USER`, and `DB_PASSWORD`
- from the backend directory, run `npm run migrate` to migrate DB tables
- from the backend directory, run `npm run seed` to run seeders
- run `npm start`
- use postman to test
- use GET `http://localhost:8000/user` to retrieve a user by ID: by setting the `id` property on the request body; Note: not params
- use POST `http://localhost:8000/user` to add a user : you can add a user by either setting the `userName` field in the request body. To make a network, you would have to specify linking by setting the `referalId` on the request body also

- ENJOY