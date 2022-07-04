const translate = require("friendly-node-cron");
const cronParser = require("cron-parser");

module.exports = ({ strapi }) => async () => {
    const module = await strapi.entityService.findMany('api::module.module', { populate: { actions: true } });
    const globalModule = await strapi.entityService.findMany('api::global-module.global-module', { populate: { actions: true, clients: true } });

    globalModule.actions.filter(i => i.schedule).forEach(async mods => {
        const interval = cronParser.parseExpression(translate(mods.schedule));
        mods.startAt = interval.next().toDate();
    });

    try {
        await strapi.entityService.update('api::global-module.global-module', globalModule.id, { data: globalModule });
    } catch(error) {
        console.log(error, 'error')
    }

    return {}
};
