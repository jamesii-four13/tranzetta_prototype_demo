'use strict';

/**
 * bigcommerce service.
 */

 const { createCoreService } = require('@strapi/strapi').factories;
 const BigCommerce = require('./bigcommerce-wrapper');

module.exports = createCoreService('api::bigcommerce.bigcommerce', ({ strapi }) =>  ({
    async findOneByField(entity, params = {}) {

        const connections = await strapi.db.query('api::bigcommerce.bigcommerce').findOne({
            where: entity
        })

        const bigcommerce = new BigCommerce()
        bigcommerce.initSync(connections);

        const categories = await bigcommerce.getCategories();


        return categories;
    },
}));
