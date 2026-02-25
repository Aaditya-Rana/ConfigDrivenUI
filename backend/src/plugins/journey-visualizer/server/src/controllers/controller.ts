import type { Core } from '@strapi/strapi';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  async findJourneys(ctx: any) {
    try {
      const journeys = await strapi
        .plugin('journey-visualizer')
        .service('service')
        .findAllJourneys();
      ctx.body = journeys;
    } catch (err) {
      ctx.throw(500, (err as Error).message);
    }
  },

  async getGraph(ctx: any) {
    const { slug } = ctx.params;
    try {
      const graph = await strapi
        .plugin('journey-visualizer')
        .service('service')
        .getJourneyGraph(slug);
      ctx.body = graph;
    } catch (err) {
      ctx.throw(500, (err as Error).message);
    }
  },
});

export default controller;