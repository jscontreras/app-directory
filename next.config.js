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
      const devRedirects =
        process.env.NODE_ENV == 'development'
          ? [
              // Rewrite for locally debugging Analytics (dev mode)
              {
                source: '/_vercel/insights/script.debug.js',
                destination:
                  'https://cdn.vercel-insights.com/v1/script.debug.js',
              },
              // Rewrite for locally debugging Speed Insights (dev mode)
              {
                source: '/_vercel/speed-insights/script.debug.js',
                destination:
                  'https://cdn.vercel-insights.com/v1/speed-insights/script.debug.js',
              },
              {
                source: '/cache-headers/timestamp',
                destination:
                  'https://www.tc-vercel.dev/cache-headers/timestamp',
              },
            ]
          : [];
      return {
        beforeFiles: [
          {
            source: '/test_0/:path*',
            destination: '/ssg/:path',
          },
          {
            source: '/rewrite-test',
            destination:
              'https://app-directory-git-main-success-tc-vtest314.vercel.app/context/electronics',
          },
          ...devRedirects,
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
