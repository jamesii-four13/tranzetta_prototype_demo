const OauthClient = require('client-oauth2');
const axios = require('axios');
const HttpWrapper = require('./http-wrapper');

class AcumaticaClient extends HttpWrapper {
  constructor(account) {
    super()

    this.account = account;

    this.OauthClient = new OauthClient({
      clientId: account.clientId,
      clientSecret: account.clientSecret,
      accessTokenUri: `${account.baseUrl}/identity/connect/token`,
      scopes: ['api'],
    });
    
    
    this.login();
  }

  async login() {
    let accessToken = this.account.accessToken

    if (!accessToken) {
      const token = await this.OauthClient.owner.getToken(this.account.username, this.account.password);
      accessToken = token.accessToken;
      
      // update access token in db
      await strapi.service('api::client.client').update(this.account.id, { data: { acumatica : { ...this.account.acumatica, accessToken: accessToken }}});
    }

    this.axios = axios.create({
      baseURL: `${this.account.baseUrl}/entity/Default/${this.account.version}`,
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
  
  async getProduct(id, query) {
    try {
      return await this.get(`/StockItem/${id}`, query);
    } catch(err) {
      console.log(err, 'asdasd')
    }
  }
}

module.exports =
  ({ strapi }) =>
  (account) => {
    return new AcumaticaClient(account);
  };
