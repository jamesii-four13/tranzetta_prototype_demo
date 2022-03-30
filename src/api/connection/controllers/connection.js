'use strict';

/**
 *  connection controller
 */

const { createCoreController } = require('@strapi/strapi').factories;



module.exports = createCoreController('api::connection.connection', ({ strapi }) => ({
    async find(ctx) {
        const connections = await strapi.db.query('api::connection.connection').findMany({
            populate: {
                bigcommerce_id: true,
                accumatica_id: true,
            },
          }
        );

        return connections
    }
}));