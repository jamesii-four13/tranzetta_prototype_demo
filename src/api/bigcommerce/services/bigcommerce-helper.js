const BigCommerce = require('node-bigcommerce');

class BigcommerceHelper {
  _http;
  _config;
  _apiKeys;
  _client;

  async initHelper(id) {
    const app = await appModel.findById(id);

    this.apiKeys = app.apiKey;
    this.client = new BigCommerce(this.apiKeys);
  }

  async initSyncHelper(apiKeys) {
    this.apiKeys = apiKeys
    this.client = new BigCommerce(this.apiKeys);
  }
}

module.exports = BigcommerceHelper
