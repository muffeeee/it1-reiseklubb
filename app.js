var express = require("express")
  , app = express()
  , email = require("emailjs")
  , server = email.server.connect({
    user: "SMTP_Injection",
    password: "5387af9f0bf8c5faf87729c83a954410bb8262f1",
    host: "smtp.sparkpostmail.com",
    port: 587,
    tls: true
  })
  , mongoose = require("mongoose")
  , Schema = mongoose.Schema
  , html_dir = "/var/www/rik.muffe.no/public_html/"
  , bodyParser = require('body-parser')
  , ejs = require('ejs')

app.use(bodyParser())
app.set('view engine', '.ejs');

mongoose.connect('mongodb://localhost/tada')

var travelerSchema = new Schema({
  firstName: String,
  familyName: String,
  email: String,
  phone: String,
  birthday: String,
  destination: String
});

var destinationSchema = new Schema({
  destination: String,
  seatsTotal: Number,
  price: Number,
  nights: Number,
  travelDate: String
})




var traveler = mongoose.model('traveler', travelerSchema)
var destination = mongoose.model('destination', destinationSchema)


app.get('/', function(req, res) {
  res.sendfile(html_dir + 'index.html');
  console.log(req)
})

app.get('/dump', function(req, res) {
  traveler.find({}, function(err, trav) {
  if (err) console.log(err);
  else {
    console.log(trav)
    res.send();
  }})
});

app.get('/hoteller', function(req, res) {
  destination.find({}, function(err, dest) {
    if (err) console.log(err);
    else {
      console.log(dest)
      res.render('hoteller.ejs', {
      des: dest,

    })


    }
  })
})

app.get('/:dir', function(req, res) {
  res.sendfile(html_dir + req.params.dir + ".html");
  console.log(req)
  console.log("WITH RESPONSE");
  console.log(res);
});

app.post("/sendreise", function(req, res) {
  console.log("REISE MOTTATT")
  console.log(req.body);
  var pt =req.body;
  var newTraveler = traveler({
    firstName: pt.firstName,
    familyName: pt.familyName,
    email: pt.email,
    phone: pt.phone,
    birthday: pt.birthday,
    destination: pt.destination
  })
  newTraveler.save(function(err, newTraveler) {
    if (err) { console.log(err) }
    else {
      console.dir(newTraveler);
      server.send({
        text:"Velkommen ombord, " + pt.firstName + " \n Vi ser fram til å bade i rikdom under denne turen.\n Litt info om detaljene vi har fått om deg:\n Navn: " + pt.firstName + pt.familyName + "\n Telefonnummer: " + pt.phone + "\n Fødselsdato: " + pt.birthday + "\n Destinasjon: " + pt.destination + "\n Vi gleder oss til å møte deg. \n Med vennlig hilsen \n Rikinger Reiser.",
        from: "no-reply@muffe.no",
        to: pt.email,
        subject: "Velkommen ombord!"
      }, function(err, message) {
        console.log(err || message);
      })
    }
})



  res.redirect('/')
})

app.listen(3000, function() {
  console.log("listening...");
})
