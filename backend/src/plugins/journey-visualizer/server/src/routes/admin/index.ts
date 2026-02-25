export default {
  type: "admin",
  routes: [
    {
      method: "GET",
      path: "/journeys",
      handler: "controller.findJourneys",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/graph/:slug",
      handler: "controller.getGraph",
      config: {
        policies: [],
      },
    },
  ],
};