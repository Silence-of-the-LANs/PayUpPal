const express = require('express');
const session = require('express-session');
// This allows us to save our session information to our database instead
// of just saving it to memory in the server. This allows us to maintain the
// session information even if the server is re-deployed or restarted
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passport = require('passport');
const db = require('./db');
const sessionStore = new SequelizeStore({ db });
const path = require('path');
const PORT = process.env.PORT || 4000;
const app = express();

// This serializes the user (converts the information provided to a format
// that can be added to the session object). In this case we are only
// serializing the user ID
// This is only done once per session
passport.serializeUser((user, done) => {
  try {
    done(null, user.id);
  } catch (err) {
    done(err);
  }
});

// Any time we want to access the information, we need to deserialize it to
// conver the serialized information back to a more readable form
passport.deserializeUser(async (id, done) => {
  try {
    // console.log('DB is', db);
    const user = await db.models.user.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// logging middleware
// Only use logging middleware when not running tests

// body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static middleware
app.use(express.static(path.join(__dirname, '../public')));

// session middleware with passport
app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      'N8!69oGS&qP36JcGtg^$eVJEYm%9mxgfzNj%H3nGKz&4BhU9*FreqD@Uog!wXrHH!9J8qp8f!NLPGniPR7m@3W&%tVVgoGc9HfeP',
    // Forces the session to be saved back to the session store, if the
    // session never modified during the request. This is necessary if
    // the session store deletes idle (unused) sessions after a certain
    // amount of time
    // We set this to false since the session store we use keeps the session
    // active regardless of the time of inactivity
    resave: false,
    // This option, if set to true, will save the session object for the user
    // to the session store even if no information is added to the session
    // We set this to false to reduce server storage usage (we don't want a
    // lot of empty objects saved to the store)
    saveUninitialized: false,
    store: sessionStore,
  })
);

// These next two calls must come after app.use(session()) to ensure that the
// login is restored in the correct order
// Initializes the passport
app.use(passport.initialize());
// Session() alters the req object to reflect the user
app.use(passport.session());

// auth and api routes
app.use('/auth', require('./auth'));
app.use('/api', require('./api')); // include our routes!

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
}); // Send index.html for any other requests

// error handling middleware
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'test') console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error');
});

// Perform a sync so that our session table gets created
sessionStore.sync();

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

module.exports = app;
