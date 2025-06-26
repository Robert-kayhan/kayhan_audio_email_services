// index.js
import dotenv from "dotenv";
dotenv.config();

import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

const sesClient = new SESv2Client({
  region: "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const params = {
  FromEmailAddress: "kayhanaudio@gmail.com",
  Destination: {
    ToAddresses: ["kayhanaudio@gmail.com", "success@simulator.amazonses.com"],
  },
  Content: {
    Simple: {
      Subject: {
        Data: "Welcome to Kayhan Audio!",
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: `<h1>Hello from Kayhan Audio</h1><p>We received your request!</p>`,
          Charset: "UTF-8",
        },
        Text: {
          Data: "Thanks for contacting us. We'll get back to you shortly.",
          Charset: "UTF-8",
        },
      },
    },
  },
};

const command = new SendEmailCommand(params);

async function sendEmail() {
  try {
    const result = await sesClient.send(command);
    console.log("✅ Email sent successfully:", result);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
}

sendEmail();
