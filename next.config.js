const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withVercelToolbar = require('@vercel/toolbar/plugins/next')();

// Adding Vercel Toolbar to Local dev
module.exports = withBundleAnalyzer(
  withVercelToolbar({
    async redirects() {
      return [
        {
          source: '/cache-headers',
          destination: '/isr-cache-headers',
          permanent: true,
        },
      ];
    },
    headers: async () => {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'Access-Control-Allow-Credentials',
              value: 'true',
            },
            {
              key: 'Access-Control-Allow-Origin',
              value: 'htts://www.example.com',
            },
            {
              key: 'Access-Control-Allow-Methods',
              value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
            },
            { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
            {
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin',
            },
            {
              key: 'Access-Control-Allow-Headers',
              value:
                'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
            },
          ],
        },
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
          ],
        },
      ];
    },
    rewrites: async () => {
      const devRewrites =
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
              {
                source: '/pages/timestamp',
                destination: 'https://www.tc-vercel.dev/pages/timestamp',
              },
            ]
          : [];
      return {
        beforeFiles: [
          {
            source: '/pages/isr-cache-headers',
            destination: '/isr-cache-headers/pages-router',
          },
          {
            source: '/test_0/:path*',
            destination: '/ssg/:path',
          },
          {
            source: '/rewrite-test',
            destination:
              'https://app-directory-git-main-success-tc-vtest314.vercel.app/context/electronics',
          },
          ...devRewrites,
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
