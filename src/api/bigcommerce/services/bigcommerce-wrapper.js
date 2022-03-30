const BigcommerceHelper = require('./bigcommerce-helper');

class BigcommerceWrapper extends BigcommerceHelper {
  async initSync(apiKeys) {
    await this.initSyncHelper(apiKeys);
  }

  async getCategories() {
    return this.client.get(`/catalog/categories`).then((data) => {
      return data.data;
    });
  }
}

module.exports = BigcommerceWrapper;
