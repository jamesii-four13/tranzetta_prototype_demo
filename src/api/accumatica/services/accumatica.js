'use strict';

/**
 * accumatica service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::accumatica.accumatica', ({ strapi }) =>  ({
    async findOneByField(entity, params = {}) {
        return strapi.db.query('api::bigcommerce.bigcommerce').findOne({
            where: entity
        });
    },
}));
