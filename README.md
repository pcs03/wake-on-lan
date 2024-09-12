# Full-stack application to wake your devices on your LAN

### Database Setup

This app uses MongoDB. A local instance can be ran using Docker, the included `mongo.sh` script spins up a MongoDB instance on localhost:27017. This instance does not auto start on setup. Do start an existing instance, assuming the name of the container is `mongo`:

```bash
docker start mongo
```

#### Setup a new Database with Schema

The app uses a database named `wol`, and uses two mongoDB collections:

- devices
- users

This will be created automatically through mongoose.


### Deployment
Create a .env file at the root of the project containing the following:
```
MONGO_PORT=27017 # Port for Mongo DB database
PORT=3500 # Port for backend REST API
TOKEN_SECRET=secret # Token for password hashing
ADMIN_PW=secret # Admin password to register new accounts
```

Then set the host of the device hosting the backend api in the `.env` file in the `client` directory:
```
API_HOST=some.host.com:port
```

Now, the app can be run using the docker compose file:
```
sudo docker compose up -d
```
