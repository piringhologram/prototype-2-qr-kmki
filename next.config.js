// next.config.js

module.exports = {
    async headers() {
      return [
        {
          source: '/(.*)', // Apply the middleware to all routes
          headers: [
            {
              key: 'Access-Control-Allow-Origin',
              value: '*', // Allow requests from any origin
            },
            {
              key: 'Access-Control-Allow-Methods',
              value: 'GET, POST, PUT, DELETE, OPTIONS', // Specify allowed HTTP methods
            },
            {
              key: 'Access-Control-Allow-Headers',
              value: 'Origin, X-Requested-With, Content-Type, Accept', // Specify allowed headers
            },
          ],
        },
      ];
    },
  };
  