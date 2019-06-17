const CosmosClient = require('@azure/cosmos').CosmosClient;
const config = require('./config');

const endpoint = config.endpoint;
const masterKey = config.primaryKey;

const client = new CosmosClient({ endpoint: endpoint, auth: { masterKey: masterKey } });
const HttpStatusCodes = { NOTFOUND: 404 };

const databaseId = config.database.id;
const containerId = config.container.id;
const partitionKey = { kind: "Hash", paths: ["/Country"] };

/**
 * Create the database if it does not exist
 */
async function createDatabase() {
    const { database } = await client.databases.createIfNotExists({ id: databaseId });
    console.log(`Created database:\n${database.id}\n`);
}

/**
* Read the database definition
*/
async function readDatabase() {
   const { body: databaseDefinition } = await client.database(databaseId).read();
   console.log(`Reading database:\n${databaseDefinition.id}\n`);
}

/**
* Create the container if it does not exist
*/

async function createContainer() {
    const { container } = await client.database(databaseId).containers.createIfNotExists({ id: containerId, partitionKey }, { offerThroughput: 400 });
    console.log(`Created container:\n${config.container.id}\n`);
}

/**
* Read the container definition
*/
async function readContainer() {
    const { body: containerDefinition } = await client.database(databaseId).container(containerId).read();
    console.log(`Reading container:\n${containerDefinition.id}\n`);
}

/**
* Create item
*/
async function createItem(itemBody) {
    const { item } = await client.database(databaseId).container(containerId).items.upsert(itemBody);
    console.log(`Created label item with id:\n${itemBody.id}\n`);
 }

 /**
* Query the container using SQL
 */
async function queryContainer() {
    console.log(`Querying container:\n${config.container.id}`);
  
    // query to return all children in a family
    const querySpec = {
       query: "SELECT VALUE r.id FROM root r WHERE r.name = @name",
       parameters: [
           {
               name: "@name",
               value: "Dummy Label 1"
           }
       ]
   };
  
   const { result: results } = await client.database(databaseId).container(containerId).items.query(querySpec, {enableCrossPartitionQuery:true}).toArray();
   for (var queryResult of results) {
       let resultString = JSON.stringify(queryResult);
       console.log(`\tQuery returned ${resultString}\n`);
   }
  }

/**
* Cleanup the database and container on completion
*/
async function cleanup() {
    await client.database(databaseId).delete();
  }

function exit(message) {
    console.log(message);
    console.log('Press any key to exit');
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
 }

 function printError(err) {
     return `Completed with error ${JSON.stringify(err)}`;
 }

 createDatabase()
    .then(() => readDatabase())
    .then(() => createContainer())
    .then(() => readContainer())
    //.then(() => createItem(config.items.TenantId))
    .then(() => createItem(config.items.Label1))
    .then(() => createItem(config.items.Label2))
    .then(() => createItem(config.items.Label3))
    .then(() => createItem(config.items.Label4))
    .then(() => queryContainer())
    .then(() => cleanup())
    .then(() => { exit(`Completed successfully`); })
    .catch((error) => { exit(printError(error)) });