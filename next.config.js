const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withVercelToolbar = require('@vercel/toolbar/plugins/next')();

// Adding Vercel Toolbar to Local dev
module.exports = withBundleAnalyzer(
  withVercelToolbar({
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
          // Rewrite for locally debugging Analytics (dev mode)
          {
            source: '/_vercel/insights/script.debug.js',
            destination: 'https://cdn.vercel-insights.com/v1/script.debug.js',
          },
          {
            source: '/cache-headers/test',
            destination: 'https://www.tc-vercel.dev/cache-headers/test',
          },
          // Rewrite for locally debugging Speed Insights (dev mode)
          {
            source: '/_vercel/speed-insights/script.debug.js',
            destination:
              'https://cdn.vercel-insights.com/v1/speed-insights/script.debug.js',
          },
          {
            source: '/rewrite-test',
            destination:
              'https://app-directory-git-main-success-tc-vtest314.vercel.app/context/electronics',
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
    experimental: {
      cssChunking: 'strict',
    },
  }),
);
