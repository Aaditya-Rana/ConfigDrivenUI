/**
 * screen controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::screen.screen', ({ strapi }) => ({
    async find(ctx) {
        const { query } = ctx;
        const { results, meta } = await strapi.service('api::screen.screen').find(query);
        const sanitizedResults = await this.sanitizeOutput(results, ctx);
        return this.transformResponse(sanitizedResults, { meta });
    },

    async findOne(ctx) {
        const { id } = ctx.params;
        const { query } = ctx;
        const entity = await strapi.service('api::screen.screen').findOne(id, query);
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
        return this.transformResponse(sanitizedEntity);
    }
}));
