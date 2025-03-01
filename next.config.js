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
