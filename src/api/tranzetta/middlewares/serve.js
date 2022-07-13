
module.exports =
  (config, { strapi }) =>
  async (ctx, next) => {
    const { service, scope, accessToken } = ctx.params
    const [clientId] = accessToken.split(':')

    const generalParam = '(client, actions)';

    let globalActions = [];
    let localActions = [];

    ctx.state.actions = {
      local: {},
      global: {}
    };

    const _getActionsEvent = async (service, src) => {
      let actions = src === 'local' ? localActions : globalActions;

      if (actions.length <= 0) {
        if (src === 'local') {
          const modules = await strapi.service('api::module.module').findOneByField({ client: clientId });
          localActions.push(...modules.actions);
        } else {
          const modules = await strapi.entityService.findMany('api::global-module.global-module', { populate: { actions: true } });
          globalActions.push(...modules.actions);
        }

        actions = src === 'local' ? localActions : globalActions;
      }

      const action = actions.find(i => i.name === service);

      if (action) {
        const _regexServices = new RegExp("{{(local||global).*}}", "gmi");
        let match = _regexServices.exec(action.event);

        if (match) {
          for(let x = 0; x < match.length; x++) {
            if (match[x] !== null) {
              const _scope = match[x].indexOf('local.') > -1 ? 'local' : 'global';
              action.event = action.event.replace(/{{(local||global)./i, 'actions.local.').replace('}}', generalParam);
              await _getActionsEvent(match[x].replace(/{{(local||global)./i, '').replace('}}', ''), _scope);
            }
          }
        }
        
        ctx.state.actions[src][service] = eval(`async ${generalParam} => { ${action.event} }`)
      }
    };

    await _getActionsEvent(service, scope);
  
    await next(); 
  };
