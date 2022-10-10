# Attendance startup prototype

I've made this project as a startup for our project.

The repo is setup with Docker and Docker Compose to run and manage currently both a Node.Js app and Nginx to serve as a reverse proxy. Currently Nginx is setup to serve `/api` which maps to the NodeJs app `/`. If we host more than 1 thing or decide to use load balancing and running more than 1 instance of Node.Js app, then it will be easily configured to do that since Nginx is already setup.

I'll additionally setup MongoDb and whatever else we might need (logging maybe, etc etc).