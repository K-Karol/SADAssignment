# Sheffield Hallam SAD Assignment : Attendance System

## Repository Link:

https://github.com/K-Karol/SADAssignment

## Introduction

This repository contains all of the source code for the attendance system built by **Thu 16-18 Group 3** group which consists of the following members:

* Casey Henderson
* Omer Hyman
* Karol Kierzkowski
* Danny Oxby
* Reece Wareham

## Architecture

The attendance system is composed of a **React.JS** SPA that utilises a **Node.JS** backend with a **MongoDb** database.

The system is orchestrated using **Docker** and **Docker Compose**. All relevant parts of the system are containerised and **Nginx** is used as a gateway/reverse proxy and is the only public-facing component which handles serving the SPA files as well as handling SSL connection to the Node.JS server. All connections are HTTPS. The backend server cannot be accessed directly and the database has no external access.

## Building

### Easiest method to get started

1. Create the `.env` file in the `/SADBackend/` directory based off the example down the page. `SECRET` and `ADMIN_APIKEY` can be set to anything.
2. Run `docker-compose -f docker-compose.yml -f docker-compose.admin.yml  up --build`. This will build the containers and run them using production configuration with the addition of the admin panel.
3. If there is an error regarding I/O timeouts, run the command again. If there are any other issues, use `docker-compose up --build`.
4. Once the server is running, you may access the React app by going to `https://localhost`
5. To seed the system, navigate to `https://localhost/admin`. Submit the `ADMIN_APIKEY` and navigate to `User tools`.
6. Use `Create Admin User` to create an Admin user. This will be used to access the frontend.
7. Use the `Import users using a JSON file` to import both `MOCK_STUDENTS.json` and `MOCK_STAFF.json`. The operation may take a while. Make sure to keep the files that are downloaded at the end of each import.
8. Navigate to `Module & Course tool`, and supply the files as dictated. You will need to use the result files from the batch imports done in step 7, along with `MOCK_MODULES.json` and `MOCK_COURSES.json`. Submit the files and the system should be seeded.
9. Navigate to the frontend (`https://localhost`) and you may use the created Admin credentials and any credentials found in `MOCK_STUDENTS.json`.

### Prerequisites

* Docker
  * *Requires WSL on Windows*
* Repository cloned locally
* `.env` file configured in the `/SADBackend/` directory

### .env file

Due to security concerns, this file is ignored by default using git.

Below is an example:

```shell
PORT=5000
DATABASE_URL=mongodb://mongodb:27017/saddb
SECRET=<YOUR SECRET HERE>
CORS_ORIGIN=*
ADMIN_APIKEY=<API KEY HERE>
```

The `PORT`, `DATABASE_URL` and `CORS_ORIGIN` should remain as they are since Docker-Compose is configured that way. For production, `CORS_ORIGIN` should match the DNS of the website.

The `SECRET` and `ADMIN_APIKEY` can be literally anything. The `ADMIN_APIKEY` is then entered into the Blazor Admin Panel so the panel can access admin endpoints.

### Commands

* `docker-compose build` will build all of the containers
* `docker-compose up` will deploy all of the containers
  * Use the argument `--build` to skip running `docker-compose build`
* `docker-compose down` to take down all containers
  * Use the argument `--volumes` to remove all data that was generated.

### Environment configuration

The base `docker-compose.yml` file is used for **production**. The repository contains a `docker-compose.override.yml` which applies overrides to the base file that will provide a **development** environment. This override file is automatically applied when running `docker-compose` such as `docker-compose up --build`. To run the solution for production, you would either get rid of the override file, or specify the configuration file for each `docker-compose` command using the `-f / --file` argument.

For example, to run the solution in production without deleting the override file, simple run:

> `docker-compose -f docker-compose.yml up --build`

This will build and run the containers in production mode.

Alternatively there is an **admin** environment which is based of production with the difference being the enabled Blazor admin panel and backend admin endpoint. Example command:

> `docker-compose -f docker-compose.yml -f docker-compose.admin.yml up --build`


#### Environments

##### Production

Containers:

* sad-backend
  * Environment variables: `ENV=PROD`
  * Runs build
* nginx
  * Environment variables: `ENV=PROD`
  * Builds frontend
* mongodb

Nginx configuration:

* Serves SPA dist files
* Routes to backend API

##### DEVELOPMENT

Containers:

* sad-backend
  * Environment variables: `ENV=DEV`
  * Backend will allow the Admin Route
  * Runs backend in 'dev' mode (watch; hot reload; debug)
* nginx
  * Environment variables: `ENV=DEV`
  * Does not build the frontend SPA
  * Builds Blazor Admin Panel
* frontend
  * Runs frontend in 'dev' mode (watch; hot reload; debug)
* mongodb
* mongo-express
  * Provides MongoDb GUI

Nginx configuration:

* Routes to frontend development server
* Routes to backend API
* Routes to MongoDb stream
* Serves Admin panel area (protected by basic auth)

##### ADMIN

Changes in regards to **Production**

* `ENV=ADMIN`
  * Backend will allow the Admin Route
* *nginx* container builds Blazor Admin Panel
* *nginx* is configured to serve the admin panel area

##### TEST

Changes in regards to **Production**
* sad-backend
  * `ENV=DEV`
  * Will run unit tests instead of running the server

Regarding testing, it is required to start the environment with no prior data (`docker-compose down --volumes`), run the solution normally (if override file is not present, no need to specify config) `docker-compose -f docker-compose.yml  up --build`, let the server initialise, then close the containers down gracefully (do not delete) and start up the containers again using the test configuration using the command `docker-compose -f docker-compose.yml -f docker-compose.test.yml up --build` which will run `mocha`. Expected output example:

```
sad-backend  |   backend root
sad-backend  |     ✔ it should return a 200
sad-backend  |     ✔ it should return a 404 test
sad-backend  | 
sad-backend  |   Test Module
sad-backend  |     ✔ Create a Module
sad-backend  |     ✔ Delete a Module
sad-backend  | 
sad-backend  |   Attendence
sad-backend  |     ✔ Create Session
sad-backend  |     ✔ Check User
sad-backend  |     ✔ Update User
sad-backend  |     ✔ Delete Session
sad-backend  |
sad-backend  |   Users
sad-backend  |     Test Users
sad-backend  |       ✔ Create a Staff (73ms)
sad-backend  |       ✔ Update a Staff
sad-backend  |       ✔ Delete a Staff
sad-backend  |
sad-backend  |
sad-backend  |   11 passing (1s)
sad-backend  |
```

### Potential errors

On Windows, if docker is saying that the port is already used, try disabling the **World Wide Web Publishing Service** Windows Service, aka `W3SVC`.

### When finished with development

To free up resources (Windows), close down Docker Desktop and then run the command:

`wsl --shutdown`

If you want to develop with Docker again, just start up the Docker Desktop client again.

## Docker Compose configuration

This repository uses **Docker Compose** to build all containers with the correct configuration. The file can be found in the root called `docker-compose.yml`. This file describes all containers and their names (incl. DNS names), volumes and which ports are exposed and/or published. Only **Nginx** has ports 80 and 443 published. As of right now, **Nginx** also publishes port `4321` which maps to the internal port `2000` which maps to **MongoDb**. This is only temporary and used for debugging only and will be removed (incl. Nginx stream).

## Nginx configuration

This file can be found in `/Http/nginx.conf` and is used to configure **Nginx**. This includes all of the routing(proxy) and serving of SPA files, as well as setting up SSL. Redirection from Http to Https is also setup. Currently all routes that do not begin with `\api` will route to the SPA and all routes prefixed with `\api` will be routed to the **Node.JS** backend.Additionally `\admin` routes to the Blazor Admin panel. The SPA will access the API this way (e.g. `https://example.com/api/auth`). CORS is also setup as `https://localhost` for development purposes.

Whilst SSL is setup, it is not a proper configuration and it does not have a password and it is setup with a self-signed certificated. Perfect for development but would need changing for production.

## Dockerfile

This repository has 2 `Dockerfile`s. One for the **Node.JS** found in `/NodeJS` and the other for both the **SPA** and **Nginx** found in `/Http`. This is done because **Nginx** requires the React `/dist` files to be copied during the build process. The `Dockerfile` describes the build steps for the environment configuration. If you require debugging, then simply changing the execution command to open up a debug port and then publishing that port is probably the way to do it.

## mongo-express

For debug purposes, a `mongo-express` container is currently setup which can be accessed by the port `8081` like so: `https://localhost:8081`. This can be used to view the MongoDb database graphically, add and remove records.

## MongoDb

Currently MongoDb is setup with no password. If you want to access MongoDb using a tool like **MongoDb Compass** or the shell/CLI, given that the port `4321` is published (debug only) that maps to a `MongoDb` stream, you can simply use the connection string:

`mongodb://localhost:4321`

This will be removed during production.

Additionally to access the MongoDb server directly, you can use the docker command `docker exec -it <container name or id> /bin/bash` where the container name should be `mongodb` but you may use the ID found by running `docker ps`. Once you do that, you are using the shell on the container (AKA small VM). Running `mongosh` will open the MongoDb CLI.

You can also use Docker tools on VSCode to get the bash graphically.

## /admin Blazor

I've added a temp Admin Panel built with Blazor that runs on top of WASM. It uses the admin route that uses an API key instead of a user. This panel is used for debugging etc. You enter the `ADMIN_APIKEY` into the configuration bit on the panel and that key will (should) persist between browser sessions.

## Thunder Client

**VSCode** has this amazing addon called **Thunder Client**. It is used for API testing and I've saved the test files to the repository. I'm setting up a full testing environment using this so API testing will be a breeze. For example, setting your credentials in the `Env` will mean all relevant endpoints in the `SAD` collection will use these credentials such as `/auth/login`. Even better, running the login endpoint, given correct credentials, will save the access token in the environment so all requests will be automatically authorised. This means you can setup a request that runs a series of different requests which all save data to variables so you can do unit testing on the API.

## Postman

Whilst we can use **Thunder Client**, for our actual testing we will probably setup a Postman workspace where we will do all of the tests. Postman allows us to define unit tests per endpoint (as well as save stuff like tokens just like using **Thunder**). And then you can create I believe a project file to run many endpoints in some order and pass data around and use unit tests to verify the run.