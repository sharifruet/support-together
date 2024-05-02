# node-api : (APIs of support-together)

A node js projects for APIs of support-together 

## Installation

Use the node package manager [npm](https://www.npmjs.com/) to install node dependencies of node-api.

```bash
npm install
```
## Configuration

Change database parameters of 'config.js' file in below section
```` 
 development: {
    username: 'root',
    password: 'toor',
    database: 'support',
    host: 'localhost',
    dialect: 'mysql',
    logging: false // Disable logging SQL queries
  },
````
## Run

Use the below command to run node-api

```bash
node index
```
