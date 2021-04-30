const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  // app.get('/getDomos', mid.requiresLogin, controllers.Domo.getDomos);
  app.get('/getBoards', mid.requiresLogin, controllers.Board.getBoards);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Board.makerPage);
  app.get('/saver', mid.requiresLogin, controllers.Board.saverPage);
  app.post('/maker', mid.requiresLogin, controllers.Board.make);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
