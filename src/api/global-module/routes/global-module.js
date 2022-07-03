'use strict';

/**
 * global-module router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::global-module.global-module');
