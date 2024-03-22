module.exports = {
  headers: async () => {
    return [
      {
        source: '/revalidate',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=31536000, public, stale-while-revalidate=120',
          },
          {
            key: 'x-custom-header',
            value: 'my custom header value',
          },
        ],
      },
      {
        source: '/rewrite-test',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=31536000, public, stale-while-revalidate=120',
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
        {
          source: '/rewrite-test',
          destination: 'https://www.cornerstoneondemand.com/company',
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
