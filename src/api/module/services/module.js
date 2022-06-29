'use strict';

/**
 * module service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService(
    'api::module.module',
    ({ strapi }) => ({
      async findOneByField(entity, params = {}) {
        
        const client = await strapi.db
          .query('api::module.module')
          .findOne({
            where: entity,
            populate: {
              actions: true,
            },
          });
  
        return client;
      },
    })
  );