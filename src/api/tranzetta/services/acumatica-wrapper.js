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
      let accessToken = this.account.accessToken
    
      this.axios = axios.create({
        baseURL: `${this.account.baseUrl}/entity/Default/${this.account.version}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      this.axios.interceptors.response.use(
        response => {
          return response;
        },
        async error => {
          const originalRequest = error.config;
          
          if (error.response.status === 401) {
            const token = await this.OauthClient.owner.getToken(this.account.username, this.account.password);
            accessToken = token.accessToken;
            console.log('####################',  token.accessToken, ' token.accessToken ##############')
            const data = await strapi.service('api::client.client').update(this.account.id, { acumatica : { ...this.account.acumatica, accessToken:  token.accessToken }});
            console.log('###################################', data, 'updated#####################')
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
  
            return axios(originalRequest);
          }
  
          return Promise.reject(error);
        },
      );
    } catch(error) {
      console.log(error, 'error');
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
