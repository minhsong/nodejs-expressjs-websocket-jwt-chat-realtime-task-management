const twilio = require("twilio");

class TwilioService {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  async sendSMS(to, body) {
    console.log("Sending SMS to", {
      body,
      to,
      from: process.env.TWILIO_PHONE_NUMBER,
    });
    try {
      await this.client.messages.create({
        body,
        to,
        from: process.env.TWILIO_PHONE_NUMBER,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = TwilioService;
