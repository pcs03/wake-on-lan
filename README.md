# Full-stack application to wake your devices on your LAN

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
