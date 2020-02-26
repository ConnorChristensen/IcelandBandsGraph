# Iceland Bands Graph
A network graph of Icelandic bands

## Running the app
### Environment
* Node: v11.10.0

### Setup
This project pulls data from an airtable database with information about
icelandic bands in it.

1. `cp .env.sample .env` - Make sure you have an env file `.env` with an `AIRTABLE_API_KEY` and `AIRTABLE_ID`
1. `npm install`
1. `chmod 777 build.sha`
1. `./build.sh`
1. Double click on index.html to open it in a browser
