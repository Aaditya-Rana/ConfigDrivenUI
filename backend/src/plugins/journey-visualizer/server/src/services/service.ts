import type { Core } from '@strapi/strapi';

const service = ({ strapi }: { strapi: Core.Strapi }) => ({
  async findAllJourneys() {
    const entries = await (strapi.documents as any)('api::journey.journey').findMany({
      fields: ['name', 'slug'],
    });
    return (entries ?? []).map((j: any) => ({
      id: j.documentId,
      name: j.name,
      slug: j.slug,
    }));
  },

  async getJourneyGraph(slug: string) {
    const journeys = await (strapi.documents as any)('api::journey.journey').findMany({
      filters: { slug: { $eq: slug } },
      populate: {
        startScreen: { fields: ['documentId', 'title', 'slug'] },
      },
    });

    const journey = journeys?.[0];
    if (!journey?.startScreen) {
      return { nodes: [], edges: [], journeyName: journey?.name ?? 'Not Found' };
    }

    const startScreenId: string = journey.startScreen.documentId;
    const nodes = new Map<string, any>();
    const edges: any[] = [];
    const queue: string[] = [startScreenId];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (visited.has(currentId)) continue;
      visited.add(currentId);

      const screens = await (strapi.documents as any)('api::screen.screen').findMany({
        filters: { documentId: { $eq: currentId } },
        populate: {
          transitions: {
            populate: {
              targetScreen: { fields: ['documentId', 'title', 'slug'] },
              conditions: true,
            },
          },
        },
      });

      const screen: any = screens?.[0];
      if (!screen) continue;

      nodes.set(currentId, {
        id: currentId,
        data: {
          label: screen.title || screen.slug || 'Untitled',
          slug: screen.slug,
          screenType: screen.type,
        },
        type: 'default',
      });

      for (const t of screen.transitions ?? []) {
        const targetId: string | undefined = t.targetScreen?.documentId;
        if (!targetId) continue;

        const conds: any[] = t.conditions ?? [];
        const logicType: string = t.type ?? 'AND';

        let label = 'Always';
        if (conds.length === 1) {
          label = `${conds[0].field} ${conds[0].operator} ${conds[0].value}`;
        } else if (conds.length > 1) {
          label = conds
            .map((c: any) => `(${c.field} ${c.operator} ${c.value})`)
            .join(` ${logicType} `);
        }

        edges.push({
          id: `e-${currentId}-${targetId}`,
          source: currentId,
          target: targetId,
          label,
        });

        if (!visited.has(targetId)) queue.push(targetId);
      }
    }

    return {
      nodes: Array.from(nodes.values()),
      edges,
      journeyName: journey.name,
    };
  },
});

export default service;