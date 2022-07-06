'use strict';

/**
 * A set of functions called "actions" for `tranzetta`
 */
module.exports = {
  connection: async (ctx, next) => {
    const { client, actions } = ctx.state
    const { service } = ctx.params
    
    const data = await actions[service](client);

    await next();
    
    return data;
  },
};
