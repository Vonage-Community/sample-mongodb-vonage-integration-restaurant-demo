# Vonage and MongoDB Atlas Demo

This repository contains code for a MongoDB Atlas and Vonage demo application, as well as configuration files for a related MongoDB App Service. 

To run the demo, please see [webapp/README.md](webapp/README.md).

## Basic Configuration

### Requirements

* [MongoDB Account](https://www.mongodb.com/cloud/atlas/register)
* [Vonage Developer Account](https://developer.vonage.com/sign-up)
* [Realm CLI](https://www.mongodb.com/docs/atlas/app-services/cli/)
* Node.js 16+

### Set up MongoDB Atlas

1. To go `https://mogodb.com` and sign up for a free account
1. Create an M0 instance on your provider of choice
1. For now, use "Username and Password" authentication. Feel free to change the suggested username and password as you see fit. When you are ready, click "Create User"
1. Select "My Local Environment" for where you would like to connect from.
1. Your local public IP address should already be added to the IP Access List.
1. Click "Finish and Close"

### Set up a MongoDB App Service

1. Click on "App Services" in the lower navbar
1. Select "Build your own App" and click "Next"
1. Give your application a name, and click "Create App Service"
1. Pull down the application with `realm-cli pull --remote <application-short-name>`
1. `cd` into the newly created directory
1. Move over configuration files:
    1. Copy [app-service/auth/customer_user_data.json.dist](app-service/auth/customer_user_data.json.dist) to `auth/customer_user_data.json` and edit with your database and data source name
    1. Copy [app-service/auth/providers.json.dist](app-service/auth/providers.json.dist) to `auth/providers.json` and edit with your reset password URLs
    1. Copy [app-service/data_sources/mongodb-atlas/restaurant_pos_demo/*](app-service/data_sources/mongodb-atlas/restaurant_pos_demo) to `data_sources/<data-source-name>/<database-name>`
    1. Copy [app-services/data_sources/mongodb-atlas/default_rule.json](app-services/data_sources/mongodb-atlas/default_rule.json) to `data_sources/<data-source-name>/default_rule.json`
1. Push the configuration back up to Atlas with `realm-cli push --remote <application-short-name>`

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