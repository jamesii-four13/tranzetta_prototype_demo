module.exports = {
    routes: [
      { // Path defined with a URL parameter
        method: 'GET',
        path: '/v1/bigcommerce/:storeHash',
        handler: 'custom-bigcommerce.findOneByStoreHash',
      }
    ]
  }
   