# flask-angular-security
Example application that shows how to use flask-security with Angular.

## Flask Deployment
Install python 3.6. Run the Flask app with:

* pip install -r requirements.txt
* python main.py

## Angular Frontend Installation and Deployment
Change directory to the ***angular*** folder and run the following commands to build and execute the frontend app:

* npm install
* ng serve

To build the minified JavaScript files, execute the following command:

* npm build --prod

The app runs on port 4200. Nevertheless, a proxy is used which redirects outgoing requests to port 5000.
This is needed to avoid CORS errors.
