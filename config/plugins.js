module.exports = {
    redis: {
        config: {
            connections: {
                default: { 
                    connection: {
                        host: '127.0.0.1',
                        port: 6379,
                        db: 0,
                    },
                    settings: {
                        debug: false, 
                    },
                },
            },
        },
    },
    "rest-cache": {
      config: {
        provider: {
          name: "redis",
          options: {
            max: 32767,
            connection: "default",
          },
        },
        strategy: {
          contentTypes: [
            // "api::connection.connection",
            // "api::bigcommerce.bigcommerce",
            // "api::accumatica.accumatica",
          ],
        },
      },
    },
  };
  