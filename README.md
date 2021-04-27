**Flexbundle SDK for JavaScript**

Flexbundle SDK provides a toolset for developers to build solutions on top of the Flexbundle platform. It provides:

- An API that allows you to interact with data and functions from your Flexbundle org
- Client-side capabilities that allows you to build custom layouts that extend the Flexbundle standard UI

Flexbundle SDK works in the browser and node environment. Normally, you would want to use the browser environment if you want to use the Client-side capabilities, while the node environment it's more suited if you want to use Flexbundle API (e.g. for integrations or automations).

## Installation

To install Flexbundle SDK:

`npm install flexbundle-sdk --save`

Then import into your project:

```js
import FlexbundleSdk from "flexbundle-sdk";
```

### As a `<script>` tag directly in your HTML code
You can also load the SDK directly into your HTML code by adding:
```html
<head>
  <script src="https://cdn.jsdelivr.net/npm/flexbundle-sdk/dist/flexbundle-sdk.js"></script>
</head>
```
and then, you can access the SDK in the global variable `FlexbundleSdk`.

## SDK features

The SDK exposes the following features:

| SDK Object | Feature |
|--|--|
| `flexbundleSdk.workspace` | Performing workspace operations against Flexbundle |
| `flexbundleSdk.execute` | Executes a function previously created on Flexbundle |
| `flexbundleSdk.publish` | Publishes an event that in context of your app or on Flexbundle |
| `flexbundleSdk.subscribe` | Subscribes to an event triggered by your app or by the Flexbundle |

## SDK Configuration

The following options are available for configuration:

- `apiKey`:  Your secret API key. Visit your app page to access an API token. 
- `endpointUrl`: The API endpoint to hit. You might want to override it if you use an on-premise version of Flexbundle or you're using an API proxy.  

To configure Flexbundle with credentials:

```js
const flexbundleSdk = FlexbundleSdk({ apiKey: <YOUR__API_KEY>}); 
```

or

```js
const flexbundleSdk = FlexbundleSdk().configure({ apiKey: <YOUR__API_KEY>}); 
```

To use Flexbundle SDK in browser environment (client-side development):

```js
const flexbundleSdk = FlexbundleSdk(); 
```

When used for client-side development, SDK methods that require to act on behalf of the connected user will work out-of-the-box by communicating (via iframe) with the Flexbundle platform. We strongly advise you to not use any explicit credentials when using the SDK on the browser environment. 

## Workspace methods

To access a particular workspace: 

```js
const workspace = flexbundleSdk.workspace(<YOUR_WORKSPACE_ID>); 
```

To check the fields mapping of your workspace, visit your workspace configuration page.

Every workspace has the following methods:

### `get(options)`

Allows you to fetch data from your workspace. To configure the data you want to fetch, you can specify the options one or more of the following properties:

- `fields`:  The list of fields you want to fetch. If not provided, all fields will be returned
- `query`: The query to execute against your workspace's data.
- `sort`: The fields you want to sort. Use -<FIELD_NAME> for descending order and +<FIELD_NAME> for ascending order. If you specify your fields without the - or + sign, Flexbundle by default will performs the ascending order.
- `limit`: The number of objects you want to return. By default, it's 50.
- `offset`: The number of objects you want to skip before starting to fetch your data.

Example request:

```js
const data = await workspace.get({
    fields: "col1,$sum(col2)",
    query: {
        col1: {$ne: "John"}
    },
    sort: "+col1",
    limit: 10
    offset: 10
}); 
```

#### How to query your data

In the query property, for every field you can specify filters that can be one of the following:

- `$eq`:  Will check if the field value is equal to your query value
- `$ne`: Will check if the field value is not equal to your query value
- `$gt`: Will check if the field value is greater than your query value
- `$gte`: Will check if the field value is greater than or equal to your query value
- `$lt`: Will check if the field value is less than your query value
- `$lte`: Will check if the field value is less than or equal to your query value
- `$li`: Will check if the field value contains your query value. Use % before or after the keywords you want to match.
- `$nl`: Will check if the field value does not contain your query value. Use % before or after the keywords you want to match.
- `$in`: Will check if the field value contains one of the query values specified. In this case, your values should be an array.
- `$nin`: Will check if the field value does not contain any of the query values specified. In this case, your values should be an array.

In the fields property, for every field you can specify one of the following modifiers:

- `$count`:  Performs a count operation against the field
- `$sum`: Performs a sum operation against the field
- `$min`: Performs a min operation against the field
- `$max`: Performs a max operation against the field
- `$avg`: Performs an average operation against the field
- `$day`: Extracts the day part of your field. Applies only to date fields
- `$week`: Extracts the week part of your field. Applies only to date fields
- `$month`: Extracts the month part of your field. Applies only to date fields
- `$quarter`: Extracts the quarter part of your field. Applies only to date fields
- `$year`: Extracts the year part of your field. Applies only to date fields

### `getById(id)`

Fetches an object by id.

Example request:

```js
const data = await workspace.getById(<YOUR_OBJECT_ID>); 
```

### `create(object)`

Creates an object. 

Example request:

```js
const data = await workspace.create({
    col1: "John",
    col2: "Doe",
    r_col1: [100,200,300]
}); 
```

### `update(object)`

Updates an object. 

Example request:

```js
const data = await workspace.update({
    id: <YOUR_OBJECT_ID>
    col1: "John",
    col2: "Doe",
    r_col1: [100,200,400]
}); 
```

### `destroy(object)`

Deletes an object. 

Example request:

```js
const data = await workspace.destroy({ id: <YOUR_OBJECT_ID> }); 
```

### `fields()`

Fetches all fields from your workspace. 

Example request:

```js
const fields = await workspace.fields(); 
```

## Functions methods

To execute a function defined in your flexbundle org:

```js
const data = await flexbundleSdk.execute(<YOUR_FUNCTION_NAME>, {
    //The http method defined for your function. It can be GET, POST, PUT, PATCH, or DELETE.
     method: "get",
     //The data to send to your function
     data: {}
});
```

## Events

When used for client-side development, Flexbundle SDK allows you to interact (via iframe) with the Flexbundle platform. You can subscribe to events (e.g. object creation), allowing your application to react to events performed by the user in the Flexbundle platform.

### `subscribe(<TOPIC_TO_LISTEN>, handler)`

To subscribe to an event:

```js
const unsubscribe = flexbundleSdk.subscribe(<TOPIC_TO_LISTEN>, (data) => {
    //your handler
});
//To avoid the pollution of the event bus, always remember to unsubscribe to events.
unsubscribe();
```

You can subscribe to the following events:

| Event           | Description                          |
|-----------------|--------------------------------------|
| `object.save`   | When an object is created or updated |
| `object.delete` | When an object is deleted            |

### `publish(<TOPIC_TO_PUBLISH>, data, parent)`

To publish to an event:

```js
flexbundleSdk.publish(<TOPIC_TO_PUBLISH>, data, true);
```
When parent is set to `true` the message will be posted on Flexbundle. The following messages can be posted:

#### toast

This message topic will post a subtle notification to users:

```js
flexbundleSdk.publish("toast", {
    message: "Hello World",
    type: "success", //by default the type of message is "success". You can also use "warning" and "error" message types.
    dismissible: true, //by default it's true. If false, users cannot dismiss the message.
    clean: false, //by default it's false. If true, all previous messages will be cleaned before showing this one.
}, true);
```

#### goto.login

This message topic will redirected the user to the login page:

```js
flexbundleSdk.publish("goto.login", {}, true);
```

#### open.cockpit

This message topic will open the object's cockpit page:

```js
flexbundleSdk.publish("open.cockpit", {
  id: "<THE OBJECT ID>",
  workspaceId: "<THE WORKSPACE ID>"
}, true);
```

#### open.form

This message topic will open the object's edit/create form:

```js
flexbundleSdk.publish("open.form", {
  id: "<THE OBJECT ID>", //leave it empty if you want to create a new object
  workspaceId: "<THE WORKSPACE ID>"
}, true);
```
