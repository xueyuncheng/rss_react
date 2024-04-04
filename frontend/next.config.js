module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:10000/api/:path*',
        },
      ]
    },
  }
