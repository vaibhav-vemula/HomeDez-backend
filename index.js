const express = require("express");
const nodemailer = require("nodemailer");
const exphbs = require("express-handlebars");
var cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");
const hbs = require("nodemailer-express-handlebars");

const app = express();
const port = 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
    cors({
      origin: "*",
    })
  );

  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.SEND_EMAIL,
      pass: process.env.PASS,
    },
  });
  
  transporter.use(
    "compile",
    hbs({
      viewEngine: {
        extname: ".handlebars", // handlebars extension
        layoutsDir: "views/", // location of handlebars templates
        defaultLayout: "index", // name of main template
        partialsDir: "views/", // location of your subtemplates aka. header, footer etc
      },
      viewPath: "views",
      extName: ".handlebars",
    })
  );
  
  app.post("/contactemail", (req, res) => {
    let mailOptions = {
      from: process.env.SEND_EMAIL,
      to: process.env.TO_MAIL,
      subject: `${req.body.name} sent a message`,
      template: "index",
      context: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        message: req.body.message,
      },
      attachments: [
        {
          filename: "homedezlogo.png",
          path: __dirname + "/images/homedezlogo.png",
          cid: "logo",
        },
      ],
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      // console.log("Message sent: %s", info.messageId);
    });
  
    // console.log(req.body);
    res.status(200).json("success");
  });
  
  app.listen(process.env.PORT || port, () =>
    console.log(`Example app listening at http://localhost:${port}`)
  );