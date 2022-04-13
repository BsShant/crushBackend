const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const myNumber = process.env.TWILIO_NUMBER;
const client = require("twilio")(accountSid, authToken);

exports.sendMessage = (toNumber, body) => {
  client.messages
    .create({
      body: body,
      from: myNumber,
      to: toNumber,
    })
    .then((message) => console.log(message.sid))
    .catch((err) => console.log("Error sending message: ", err));
};
