const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const fileUpload = require('express-fileupload')
const SequelizeStore = require('connect-session-sequelize');
const db = require('./models/index.js');

const auth_router = require('./routes/auth.route.js');
const reset_password_router = require('./routes/reset_password.route.js');
const user_router = require('./routes/user.route.js');

dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db:db.sequelize
});

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store:store,
    cookie: {
        secure: 'auto',
        expires: 1000 * 60 * 60 * 2
    }
}))

app.use(cors({
    credentials: true,
    origin: [process.env.LINK_FRONTEND]
}));

app.use(express.json());
app.use(fileUpload());

//router
app.use('/auth', auth_router);
app.use('/reset', reset_password_router);
app.use('/user', user_router);

app.listen(5000, ()=>{
    console.log('server running at port 5000');
});
