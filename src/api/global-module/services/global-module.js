'use strict';

/**
 * global-module service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::global-module.global-module');
