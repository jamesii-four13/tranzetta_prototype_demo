module.exports = {
  routes: [
    // webhook with authentication
    {
      method: 'GET',
      path: '/v1/tranzetta/:scope/:accessToken/:service',
      handler: 'tranzetta.connection',
      config: {
        auth: false,
        middlewares: ['api::tranzetta.validate', 'api::tranzetta.serve'],
      },
    },
  ],
};
