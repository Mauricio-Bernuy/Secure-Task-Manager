/** @type {import('next').NextConfig} */

const ContentSecurityPolicy = `
  default-src 'self' https://www.investors.com/ 'unsafe-eval' 'unsafe-inline';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  child-src 'unsafe-eval' 'unsafe-inline';
  style-src 'self' https://fonts.googleapis.com/ 'unsafe-eval' 'unsafe-inline';
  font-src 'self' https://fonts.googleapis.com/ https://fonts.gstatic.com/;
`

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, context) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300
    }
    return config
  },
  // Adding policies:
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()  
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
