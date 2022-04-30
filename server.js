const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const multiparty = require("multiparty");
require("dotenv").config();
const session = require('express-session');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { request } = require("express");
const PORT = process.env.PORT || 5000;


// instantiate an express app
const app = express();
// cors
app.use(cors({ origin: "*" }));
//middlewares
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cookieParser('secret'))
app.use(session({cookie: {maxAge: null}}))



//flash message middleware
app.use((req, res, next)=>{
  res.locals.message = req.session.message
  delete req.session.message
  next()
})

app.use("/public", express.static(process.cwd() + "/public")); //make public static

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure:true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

// verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

app.post("/", (req, res) => {
  let form = new multiparty.Form();
  let data = {};
  form.parse(req, function (err, fields) {
    Object.keys(fields).forEach(function (property) {
      data[property] = fields[property].toString();
    });
    // console.log(data);
    const mail = {
      sender: `${data.name} <${data.email}>`,
      to: process.env.EMAIL, // receiver email,
      subject: data.subject,
      text: `${data.name} <${data.email}> \n${data.message}`,
    };
    transporter.sendMail(mail, (err, data) => 
    {
      if (err) {
        console.log(err);
        res.status(500).send("Something went wrong.");
      } else {
        // res.status(204).send();
        // res.status(200).send("Email successfully sent to recipient!");
        req.session.message = {
        type: 'success',
        
        // intro: 'You are now registered! ',
        message: 'Email successfully sent to recipient!'
      }
          res.redirect('/');
        }
        
        
      });
  });
});

const handlebars = require('express3-handlebars').create()
app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')

app.get('/', (req, res)=>{
  res.render('index')
})
//Index page (static HTML)
// app.route("/").get(function (req, res) {
//   // res.sendFile(process.cwd() + "/public/index.html");
//   res.render('index');
// });


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});