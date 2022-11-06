# Sheffield Hallam SAD Assignment : Attendance System

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

### Prerequisites

* Docker
  * *Requires WSL on Windows*
* Repository cloned locally
* `.env` file configured in the `/NodeJS/` directory

### .env file

Due to security concerns, this file is ignored by default using git.

Below is an example:

```shell
PORT=5000
DATABASE_URL=mongodb://mongodb:27017/saddb
SECRET=<YOUR SECRET HERE>
CORS_ORIGIN=https://localhost
ADMIN_APIKEY=<API KEY HERE(Hardcoded in Blazor)>
```

### Commands

In the root of the repository, run `docker-compose up --build`. This will proceed to pull all images required and start to build all of the containers. Once built, they are ran and the terminal used will start to display all logs from all containers.

Pressing `Ctrl+C` on Windows will gracefully stop the containers. The containers will be stopped but will still exist.

To take down the containers, you may run `docker-compose down`. If you want to clear all of the volumes which contain persistant data (like the **MongoDb** data), run `docker-compose down --volumes`. This will clear all volumes that were created.

### Potential errors

On Windows, if docker is saying that the port is already used, try disabling the **World Wide Web Publishing Service** Windows Service, aka `W3SVC`.

### When finished with development

To free up resources (Windows), close down Docker Desktop and then run the command:

`wsl --shutdown`

If you want to develop with Docker again, you need to start wsl again by running:

`wsl`

## Docker Compose configuration

This repository uses **Docker Compose** to build all containers with the correct configuration. The file can be found in the root called `docker-compose.yml`. This file describes all containers and their names (incl. DNS names), volumes and which ports are exposed and/or published. Only **Nginx** has ports 80 and 443 published. As of right now, **Nginx** also publishes port `4321` which maps to the internal port `2000` which maps to **MongoDb**. This is only temporary and used for debugging only and will be removed (incl. Nginx stream).

## Nginx configuration

This file can be found in `/Http/nginx.conf` and is used to configure **Nginx**. This includes all of the routing(proxy) and serving of SPA files, as well as setting up SSL. Redirection from Http to Https is also setup. Currently all routes that do not begin with `\api` will route to the SPA and all routes prefixed with `\api` will be routed to the **Node.JS** backend. The SPA will access the API this way (e.g. `https://example.com/api/auth`). CORS is also setup as `https://localhost` for development purposes.

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

I've added a temp Admin Panel built with Blazor that runs on top of WASM. It uses the admin route that uses an API key instead of a user. This panel is used for debugging etc.

## Thunder Client

**VSCode** has this amazing addon called **Thunder Client**. It is used for API testing and I've saved the test files to the repository. I'm setting up a full testing environment using this so API testing will be a breeze. For example, setting your credentials in the `Env` will mean all relevant endpoints in the `SAD` collection will use these credentials such as `/auth/login`. Even better, running the login endpoint, given correct credentials, will save the access token in the environment so all requests will be automatically authorised. This means you can setup a request that runs a series of different requests which all save data to variables so you can do unit testing on the API.
