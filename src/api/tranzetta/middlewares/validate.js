const crypto = require('crypto');
const bufferEq = require('buffer-equal-constant-time');

module.exports =
  (config, { strapi }) =>
  async (ctx, next) => {
    const { accessToken } = ctx.params;

    const [id, signature] = accessToken.split(':')
    const client = await strapi.service('api::client.client').findOneByField({ id });


    if (client) {
      const isVerified = verifySignature(`${id}${client.name}`, signature, client.secretToken)
  
      if (isVerified) {
        ctx.state.client = {
          ac: await strapi.service('api::tranzetta.acumatica-wrapper')({ 
            ...client.apps.find(i => i.__component === 'connectors.acumatica'), accountId: id 
          }),
          bc: await strapi.service('api::tranzetta.bigcommerce-wrapper')(client.apps.find(i => i.__component === 'connectors.bigcommerce'))
        }
      } else {
        return ctx.unauthorized('Unauthorized Request')
      }
    } else {
      return ctx.unauthorized('Unauthorized Request')
    }

    await next(); 
  };


  const verifySignature = (string_to_sign, signature, shared_secret) => {
    const hmac = crypto.createHmac('sha256', shared_secret);
    hmac.write(string_to_sign);
    hmac.end()
    
    return bufferEq(Buffer.from(hmac.read().toString('hex')), Buffer.from(signature));
  }