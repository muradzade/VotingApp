const express = require('express');
const bodyParser = require('body-parser');


const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

const dbConfig = require('./app/config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(()=>{
    console.log("Database connection is successfull");
}).catch(err => {
    console.log("Error in database connection",err);
    process.exit();
});

require("./app/helpers/web3.helper").setAdmin();

require("./routes.js")(app);

app.listen(3001, ()=>{
    console.log("server listenin on 3001");
})