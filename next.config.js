module.exports = {
  headers: async () => {
    return [
      {
        source: '/revalidate',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=31536000, public, stale-while-revalidate=40',
          },
          {
            key: 'x-custom-header',
            value: 'my custom header value',
          },
        ],
      },
    ];
  },
  rewrites: async () => {
    return {
      beforeFiles: [
        {
          source: '/test_0/:path*',
          destination: '/ssg/:path',
        },
      ],
      afterFiles: [
        {
          source: '/test_1/:path*',
          destination: '/ssg/:path',
        },
      ],
    };
  },
};
