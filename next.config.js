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
        // Redirect for SAML Authentication
        {
          source: '/:path*',
          has: [
            {
              type: 'header',
              key: 'host',
              // value: '(.*preview\\.tc-vercel\\.dev.*)',
              value: '(.*vercel\\.app.*)',
            },
            {
              type: 'header',
              key: 'referer',
              // value: '(.*preview\\.tc-vercel\\.dev.*)',
              value: '(.*vercel\\.com.*)',
            },
          ],
          destination: 'https://preview.tc-vercel.dev/:path*',
          permanent: false,
        },
        // Redirect for Password Authentication
        {
          source: '/:path*',
          has: [
            {
              type: 'header',
              key: 'referer',
              value: '(.*vercel\\.app.*)',
            },
          ],
          missing: [
            {
              type: 'host',
              value: 'preview.tc-vercel.dev',
            },
          ],
          destination: 'https://preview.tc-vercel.dev/:path*',
          permanent: false,
        },
      ];
    },
    headers: async () => {
      return [
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
                source: '/isr-cache-headers/timestamp',
                destination:
                  'https://www.tc-vercel.dev/isr-cache-headers/timestamp',
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
