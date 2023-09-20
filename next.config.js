module.exports = {
    async headers() {
      return [
        {
          source: '/',
          headers: [
            {
              key: 'Access-Control-Allow-Origin',
              value: '*',
            },
            {
              key: 'Referrer-Policy',
              value: 'no-referrer',
            },
            // Add other headers as needed
          ],
        },
      ];
    },
    // ...other configuration options
  };
  