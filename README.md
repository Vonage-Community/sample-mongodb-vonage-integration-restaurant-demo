# Vonage and MongoDB Atlas Demo

## Running the demo

This demo is comprised of two parts - a Vite/Vue-based front-end application and an ExpressJS-based backend. It requires a MongoDB account as well as a free Vonage Developer account.

This demo shows off a more full-fledged way to integrate Vonage Verify, Vonage Messages, and the Vonage Meetings API in a structured application. It is powered by MongoDB's Atlas cloud database service, and can be managed by any MongoDB-compatible suite of tools. 

### Set up MongoDB Atlas

1. To go `https://mogodb.com` and sign up for a free account
1. Create an M0 instance on your provider of choice
1. For now, use "Username and Password" authentication. Feel free to change the suggested username and password as you see fit. When you are ready, click "Create User"
1. Select "My Local Environment" for where you would like to connect from.
1. Your local public IP address should already be added to the IP Access List.
1. Click "Finish and Close"

### Set up a Vonage Account

1. Sign up for a free account at [https://developer.vonage.com/sign-up](https://developer.vonage.com/sign-up)
1. Under "Build & Manage", select "Applications"
1. Click "Create a new application"
1. Give the application a name
1. Click "Generate public and private key" to download a new private key for this application
1. Enable the Messages and Meetings API Capabilities
1. For now, just enter `https://example.com` for the Inbound and Status URLs for Messages
1. Click "Generate new application" at the bottom
1. Under the "Link Numbers" section, click the "Link" button to attach your Vonage Number to this application

### Set up the Application
1. Clone this repository with `git clone`
1. Install dependencies with `npm ci`
1. Copy `.env.dist` to `.env` and edit with the appropriate values:

| Key | Description |
| --- | ------------|
| VITE_API_URL | URL for the backend API server. Can be left at default for the demo |
| ENABLE_SMS | Whether to send confirmation SMS Messages |
| ENABLE_VERIFY | Whether to send Verify messages. If disable, any PIN will work for 2FA |
| MONGODB_DSN | The DSN supplied by MongoDB under "Connect" -> "Connect your application" |
| VONAGE_API_KEY | Your Vonage API Key from the Vonage Dashboard
| VONAGE_API_SECRET | Your Vonage API Secret from the Vonage Dashboard
| VONAGE_APPLICATION_ID | The Vonage Application ID you just created |
| VONAGE_PRIVATE_KEY | A Base64 Encoded version of the private key you downloaded from above, or a full path to the file |
| JWT_SIGNING_KEY | A string that can be used to sign JWT tokens for the demo

4. Open two new terminals
   1. In one, run `npm run dev` to start the front-end
   1. In the second, `cd server/` to enter the server directory, and run `npm run dev` to start the backened server
1. Visit `https://localhost:5173/login` to visit the admin login
1. Log in with any username or password combination
1. Add a few sample dishes with prices

## Using the Demo
1. Visit `https://localhost:5173/website/login` to visit the user login
1. Register a new user with an e-mail address, telephone number, and password
1. Log in with the e-mail address and password
1. Enter the 2FA pin that was texted to your device
    1. If you have set `ENABLE_VERIFY` to "0", you can enter any pin
1. Select any number of items to add them to your order
1. Click the "Check Out" button to review your order
1. Click "Submit Order" to submit your order
1. If `ENABLE_SMS` is set to "1", you should receive a text message confirming your order

### Video Calls
1. On the order status screen for a user, click on "Video Call" to open up a new meeting window
1. In a separate window, log into `http://localhost:5173` with any username or password
    1. Click on the "View Orders" button
    1. For any order where the user has clicked the "Video Call" button, click the "Enter Meeting" button to join