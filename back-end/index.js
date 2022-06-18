const express = require('express');
const mongoose = require('mongoose');
const bodyparser=require('body-parser');
const cookieParser=require('cookie-parser');
// const db=require('./config/config').get(process.env.NODE_ENV);


const User = require('./models/userModel/userModel');
const {auth} =require('./middlewares/auth');

//Importa o arquivo de rotas
const routes = require('./routes/routes');

//Importa as variáveis do arquivo .env
require('dotenv').config();

//Realiza a conexão com o banco
const mongoString = process.env.DATABASE_URL
mongoose.connect(mongoString);
const database = mongoose.connection
database.on('error', (error) => {
  console.log(error)
})
database.once('connected', () => {
  console.log('Database Connected');
})

const app = express();

app.use(bodyparser.urlencoded({extended : false}));
app.use(bodyparser.json());
app.use(cookieParser());
app.use('/calendar', routes)

app.listen(3000, () => {
  console.log(`Server Started at ${3000}`)
})