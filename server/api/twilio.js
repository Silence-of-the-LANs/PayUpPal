const twilio = require('twilio');

const accountSid =
  process.env.TWILIO_ACCOUNT_SID || require('../../secrets').TWILIO_ACCOUNT_SID;
const authToken =
  process.env.TWILIO_AUTH_TOKEN || require('../../secrets').TWILIO_AUTH_TOKEN;
const phoneNumber =
  process.env.TWILIO_PHONE_NUMBER ||
  require('../../secrets').TWILIO_PHONE_NUMBER;
const client = require('twilio')(accountSid, authToken);

const sendTextMessage = (
  userName,
  total,
  eventName,
  paypalLink,
  requesteePhone
) => {
  client.messages
    .create({
      body: `${userName} has requested a payment from you of $${total} for your meal at ${eventName}. Please use the below link to send payment:${'\n\n'}${paypalLink}`,
      from: phoneNumber,
      to: `+1${requesteePhone}`,
    })
    .then((message) => console.log(message.sid));
};

module.exports = sendTextMessage;
