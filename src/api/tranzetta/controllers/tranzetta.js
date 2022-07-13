'use strict';

/**
 * A set of functions called "actions" for `tranzetta`
 */
module.exports = {
  connection: async (ctx, next) => {
    const { client, actions } = ctx.state
    const { service, scope } = ctx.params
    
    const data = await actions[scope][service](client, actions);

    // const data = await client.ac.getProducts({ $expand: 'Categories,Attributes' });
    // const customers = await client.ac.getCustomers({ $expand: 'Attributes' });

    // // data.forEach(async product => {
    // //     const { Attributes, id } = product;
    // //     const attrbs = [];
        
    // //     Attributes.forEach(attr => {

    // //     });

    // //     if (attrbs.length) {
    // //         const createdAttribute = await client.bc.createProductCustomField(id, attrbs);
    // //     }
    // // });

    await next();

    return data;
  },
};
