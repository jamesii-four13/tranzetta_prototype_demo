'use strict';

/**
 *  global-module controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::global-module.global-module');
