# flask-angular-security
Example application that shows some security best practices

## Angular Frontend Installation and Deployment
The following commands have to be executed to build and run the frontend app:

* npm install
* ng serve

To build the minified JavaScript files, run the following command:

* npm build --prod

The app runs on 4200. Nevertheless, a proxy is used which redirects outgoing requests to port 5000.
This is needed to avoid CORS errors.