module.exports = {
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
      fallback: [
        {
          source: '/_next/:file*',
          destination: `https://www.domain.com/_next/:file*`,
        },
        {
          source: '/:path*',
          destination: `https://www.domain.com/:path*/`,
        },
      ],
    };
  },
};
