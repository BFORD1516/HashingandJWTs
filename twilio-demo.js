var twilio = require("twilio");
var client = new twilio(accountSid, authToken);

client.messages
  .create({
    body: "Hello from Node",
    to: "+14155550000",
    from: "+14155551111",
  })
  .then((message) => console.log(message.sid));
