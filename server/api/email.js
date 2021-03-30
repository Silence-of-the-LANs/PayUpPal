const nodemailer = require('nodemailer');

const pw = process.env.EMAIL_PW || require('../../secrets').EMAIL_PW;
const email =
  process.env.EMAIL_ADDRESS || require('../../secrets').EMAIL_ADDRESS;

export const sendInitialEmail = (
  userName,
  requesteeEmail,
  item,
  price,
  paymentOptions
) => {
  const transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com',
    secure: true,
    port: 465,
    auth: {
      user: email,
      pass: pw,
    },
  });

  const emailOptions = {
    from: email,
    to: `${requesteeEmail}`,
    subject: `You have received a payment request from ${userName}`,
    text: ``,
  };
};
