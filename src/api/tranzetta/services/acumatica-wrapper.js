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
    
    this.login()
  }

  async login() {
    try {    
      this.axios = axios.create({
        baseURL: `${this.account.baseUrl}/entity/Default/${this.account.version}`,
        headers: {
          Authorization: `Bearer ${this.account.accessToken}`,
        },
      });
  
      this.axios.interceptors.response.use(
        response => {
          return response;
        },
        async error => {
          const originalRequest = error.config;
          
          if (error.response.status === 401) {
            const client = await strapi.service('api::client.client').findOneByField({ id: this.account.accountId });
            const token = await this.OauthClient.owner.getToken(this.account.username, this.account.password);

            client.apps.forEach(app => {
              if (app.__component === 'connectors.acumatica') {
                app.accessToken = token.accessToken;
              }
            });
                        
            await strapi.service('api::client.client').update(this.account.accountId, { data: client });
            
            originalRequest.headers['Authorization'] = `Bearer ${token.accessToken}`;
  
            return axios(originalRequest);
          }
  
          return Promise.reject(error);
        },
      );
    } catch(error) {
      // console.log(error, 'error');
    }
  }
  
  async getProduct(id, query) {
    return await this.get(`/StockItem/${id}`, query);
  }

  async getProducts(query) {
    return await this.get(`/StockItem`, query);
  }

  async getItemSalesCategory(query) {
    return await this.get(`/ItemSalesCategory`, query);
  }
}

module.exports =
  ({ strapi }) =>
  (account) => {
    return new AcumaticaClient(account);
  };
