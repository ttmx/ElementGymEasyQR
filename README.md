# ElementGymEasyQR

ElementGymEasyQR is a webserver that allows users to log in to the Element Gym using a QR code, avoiding the need to use the app.

## Features
- Generate QR codes for easy login.
- Runs in a Docker container for easy deployment.

## Using the Webserver with Query Parameters

To authenticate and generate QR codes, you need to provide your username and password as query parameters in the URL.

1. Start the webserver using the instructions above.

2. Access the webserver by appending `?user=<your-username>&pass=<your-password>` to the URL. For example:
   ```
   http://localhost:3000?user=myusername&pass=mypassword
   ```

3. The server will authenticate the provided credentials and display the QR codes for login.


## Prerequisites
- Docker installed on your system.

## Using the Prebuilt Docker Image

1. Run the container (Docker will automatically pull the image if it's not available locally):
   ```bash
   docker run -p 3000:3000 ghcr.io/ttmx/elementgym-easyqr:latest
   ```

2. Access the webserver at `http://localhost:3000`.

## Running the Webserver Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/ttmx/ElementGymEasyQR.git
   cd ElementGymEasyQR
   ```

2. Build and run the Docker container:
   ```bash
   docker-compose up --build
   ```

3. Access the webserver at `http://localhost:3000`.
