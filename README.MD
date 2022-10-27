# Attendance startup prototype

I've made this project as a startup for our project.

The repo is setup with Docker and Docker Compose to run and manage currently both a Node.Js app and Nginx to serve as a reverse proxy. Currently Nginx is setup to serve `/api` which maps to the NodeJs app `/api` endpoints. If we host more than 1 thing or decide to use load balancing and running more than 1 instance of Node.Js app, then it will be easily configured to do that since Nginx is already setup.

I've setup MongoDb & mondodb express. If you want to use a CLI or MongoDb compass, then currently there is a public port exposed through nginx specifically 4321.

Example connection string: `mongodb://root:rootpassword@localhost:4321/?authMechanism=DEFAULT`

MongoDb express available from `localhost:8081`

## Run

In root of the repo, running `docker-compose up --build` should be enough. Using `Ctrl+C` (cancel/quit command) should make the containers stop *gracefully*.
After each change, you can Ctrl+C the current `docker-compose up` session, and then run it again.

You can also use `docker-compose down` to stop and take down containers that were created for this. Adding the parameter `--volumes` should clear the volume created for MongoDb.


## Extra

You need a `.env` file which is ignored on git by default.

The current version of the file:

```
PORT=5000
DATABASE_URL=mongodb://mongodb:27017/saddb
SECRET="<YOUR SECRET HERE>"
CORS_ORIGIN=https://localhost
```
