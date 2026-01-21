import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      const roles = await strapi
        .plugin('users-permissions')
        .service('role')
        .find();

      const publicRole = roles.find((r: any) => r.type === 'public');

      if (publicRole) {
        const permissions = {
          ...publicRole.permissions,
          'api::page': {
            controllers: {
              page: {
                find: { enabled: true },
                findOne: { enabled: true },
              },
            },
          },
        };

        await strapi
          .plugin('users-permissions')
          .service('role')
          .updateRole(publicRole.id, { permissions });
      }
    } catch (error) {
      console.error('Error updating permissions:', error);
    }
  },
};
