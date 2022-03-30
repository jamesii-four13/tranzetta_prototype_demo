'use strict';

/**
 *  bigcommerce controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::bigcommerce.bigcommerce', ({ strapi }) => ({
    async findOneByStoreHash(ctx) {
        const { storeHash } = ctx.params;

        // Calling the default core action
        const entry = await strapi.service('api::bigcommerce.bigcommerce').findOneByField({ storeHash });

        console.log(entry)

        return { entry }
    }
}));
