const authRoutes = require('../routes/authroutes.js');

const registerAuthModule = (app) => {
  app.use('/api/auth', authRoutes);
};

module.exports = { registerAuthModule };