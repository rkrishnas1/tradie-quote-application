const AWS = require('aws-sdk');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const bodyParser = require('body-parser');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Moment = require('moment-timezone');

AWS.config.update({ region: process.env.TABLE_REGION });
const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = 'TradieTable';
if (process.env.ENV && process.env.ENV !== 'NONE') {
  tableName = tableName + '-' + process.env.ENV;
}

// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

//Get all the jobs created
app.get('/jobs', function (request, response) {
  let params = {
    TableName: tableName,
    limit: 100,
  };
  dynamodb.scan(params, (error, result) => {
    if (error) {
      response.json({ statusCode: 500, error: error.message });
    } else {
      response.json({ statusCode: 200, url: request.url, body: JSON.stringify(result.Items) });
    }
  });
});

//Create new job
app.post('/jobs', function (request, response) {
  console.log('request ', request.body);
  const createdDate = Moment().format('DD-MM-YYYY');
  let params = {
    TableName: tableName,
    Item: {
      ...request.body,
      id: uuidv4(), // auto-generate id
      updatedAt: createdDate,
      userId: getUserId(request), // userId from request
    },
  };
  dynamodb.put(params, (error, result) => {
    if (error) {
      response.json({ statusCode: 500, error: error.message, url: request.url });
    } else {
      console.log('DynamoDB row created successfully');
      response.json({ statusCode: 200, url: request.url, body: JSON.stringify(params.Item) });
    }
  });
});

//Update the job with the quote
app.put('/jobs', function (request, response) {
  console.log('Request for update', request);
  const timestamp = Moment().format('DD-MM-YYYY');
  const params = {
    TableName: tableName,
    Key: {
      id: request.body.id,
    },
    ExpressionAttributeNames: { '#finalQuotes': 'finalQuotes' },
    ExpressionAttributeValues: {},
    ReturnValues: 'UPDATED_NEW',
  };
  params.UpdateExpression = 'SET ';
  if (request.body.finalQuotes) {
    params.ExpressionAttributeValues[':finalQuotes'] = request.body.finalQuotes;
    params.UpdateExpression += '#finalQuotes = :finalQuotes, ';
  }
  if (request.body.finalQuotes) {
    params.ExpressionAttributeValues[':updatedAt'] = timestamp;
    params.UpdateExpression += 'updatedAt = :updatedAt';
  }
  dynamodb.update(params, (error, result) => {
    if (error) {
      response.json({ statusCode: 500, error: error.message, url: request.url });
    } else {
      response.json({ statusCode: 200, url: request.url, body: JSON.stringify(result.Attributes) });
    }
  });
});

const getUserId = (request) => {
  try {
    console.log('Request ID');
    const reqContext = request.apiGateway.event.requestContext;
    const authProvider = reqContext.identity.cognitoAuthenticationProvider;
    return authProvider ? authProvider.split(':CognitoSignIn:').pop() : 'UNAUTH';
  } catch (error) {
    return 'UNAUTH';
  }
};

app.listen(3000, function () {
  console.log('App started');
});

module.exports = app;
