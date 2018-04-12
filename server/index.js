const express = require('express');
const bodyParser = require('body-parser');
const mc = require( `./controllers/messages_controller` );
const session = require('express-session')
const {createInitialSession} = require('./middlewares/session')
const shroot = require('./middlewares/filter')

const app = express();

app.use( bodyParser.json() );
app.use( (req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        shroot(req, res, next)
    }else {
        next()
    }
})
app.use( express.static( `${__dirname}/../build` ) );
app.use(session({
    secret: 'DMPC',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 10
    }
}));
app.use(createInitialSession);


const messageBaseUrl = "/api/messages"
app.post( messageBaseUrl, mc.create );
app.get( messageBaseUrl, mc.read );
app.put( messageBaseUrl, mc.update );
app.delete( messageBaseUrl, mc.delete );

app.get(messageBaseUrl + '/history', mc.history);

const port = process.env.PORT || 3000
app.listen( port, () => { console.log(`Server listening on port ${port}.`); } );