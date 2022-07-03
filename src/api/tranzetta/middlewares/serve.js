
module.exports =
  (config, { strapi }) =>
  async (ctx, next) => {
    const { service, scope, accessToken } = ctx.params
    const [clientId] = accessToken.split(':')
    
    let actions = [];

    if (scope === 'global') {
      const globalModule = await strapi.entityService.findMany('api::global-module.global-module', { populate: { actions: true } });
      actions = globalModule.actions;
    } else {
      const module = await strapi.service('api::module.module').findOneByField({ client: clientId });
      actions = module.actions;
    }

    if (actions.length > 0) {
      const action = actions.find(i => i.name === service);

      if (!action) {
        return ctx.badRequest('Missing Service', { service })
      }

      if (ctx.request.method === action.type) {
        ctx.state.actions = {
          [service] : eval("async (client) => {" + action.event + "}")
        }
      } else {
        return ctx.badRequest(`Invalid Request for ${action.type} service`, { service })
      }
    } else {
      return ctx.badRequest('No actions is created for this client.')
    }
    
    await next(); 
  };
