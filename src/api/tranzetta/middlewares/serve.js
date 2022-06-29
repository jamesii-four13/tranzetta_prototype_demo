
module.exports =
  (config, { strapi }) =>
  async (ctx, next) => {
    const { service } = ctx.params 
    const module = await strapi.service('api::module.module').findOneByField({ client: 1});
    
    if (module && module.actions.length > 0) {
      const action = module.actions.find(i => i.name === service);

      if (ctx.request.method === action.type) {
        ctx.state.actions = {
          [service] : eval("async (client) => {" + action.event + "}")
        }
      } else {
        // invalid request
      }
    } else {
      // missing module
    }

    await next(); 
  };
