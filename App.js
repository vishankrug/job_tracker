import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sessions from 'express-session';
import MsIdExpress from 'microsoft-identity-express'
  
const appSettings = {
    appCredentials: {
        clientId: "0309f862-9db7-4f35-865f-67cb3363a897", // Application (client) ID on Azure AD
        tenantId: "f6b6dd5b-f02f-441a-99a0-162ac5060bd2", // alt. "common" "organizations" "consumers"
        clientSecret: "Hk_7Q~AG5.KwDWApPj8NYRx9LGi0_xQ6Mupkk" // alt. client certificate or key vault credential
    },
    authRoutes: {
        // redirect: "https://www.websitesharer-vishank.me/redirect",
        redirect: "http://localhost:3000/redirect",
        error: "/error", // the wrapper will redirect to this route in case of any error.
        unauthorized: "/unauthorized" // the wrapper will redirect to this route in case of unauthorized access attempt.
    }
};

import indexRouter from './routes/index.js';
import apiv1Router from './routes/api/v1/apiv1.js'; //edited

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecret",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}))
// instantiate the MS auth wrapper
const msid = new MsIdExpress.WebAppAuthClientBuilder(appSettings).build();
// initialize the MS auth wrapper
app.use(msid.initialize());

app.use(express.static('./public/', {index: 'landing.html'}))


app.use('/', indexRouter);
app.use('/api/v1', apiv1Router) //edited

app.get('/signin', 
    msid.signIn({
        postLoginRedirect: '/'
    }
));

app.get('/signout', 
    msid.signOut({
        postLogoutRedirect: '/'
    }
));

// app.get()
app.get('/error', (req, res) => res.status(500).send('server error'));

// // error
app.get('/unauthorized', (req, res) => res.status(401).send('Permission denied'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Example app listening at http://localhost:PORT')
})

export default app;
