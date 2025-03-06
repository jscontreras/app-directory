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
          source: '/rewrite-test',
          headers: [
            {
              key: 'x-vercel-enable-rewrite-caching',
              value: '1',
            },
            {
              // Undortuntalely forcing Cache Headers on rewrites doesn't work
              key: 'Cache-Control',
              value:
                'public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=120',
            },
            {
              key: 'X-Custom-Header-Hello',
              value: 'hello-world',
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

            destination: 'https://api.tc-vercel.dev/api/time?bk2kT23dpMY5=ok',
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
    images: {
      domains: ['www.andersenwindows.com'],
      formats: ['image/avif'],

      // This is important - it tells Next.js to use the unoptimized prop for external images
      // which will prevent the _next/image URL format issues with search engines
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'www.andersenwindows.com',
          pathname: '/**',
        },
      ],
    },
  }),
);
