const express = require('express')
const session = require('express-session');
const bodyParser = require('body-parser');
const routes = require('./routes/routes')

const port = 4000
app = express()
app.use(express.json())
app.use('/images',express.static('./images'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(
    session({
      secret: 'A12', 
      resave: false,
      saveUninitialized: true,
    })
  );
app.set('view engine','ejs')
app.use('/',routes)

app.listen(port,()=>{
    console.log(`PortConnected to ${port}`)
}
)