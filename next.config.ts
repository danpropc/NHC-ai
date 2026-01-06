import { defineConfig } from './src/libs/next/config/define-config';

const nextConfig = defineConfig({
  // Minify code
  swcMinify: true,
  
  // Compression
  compress: true,
  
  // Tắt source maps trong production
  productionBrowserSourceMaps: false,
  
  experimental: {
    webpackBuildWorker: true,
    webpackMemoryOptimizations: true,
    
    // QUAN TRỌNG: Optimize package imports
    optimizePackageImports: [
      'antd',
      '@ant-design/icons',
      '@lobehub/ui',
      'lucide-react',
      'react-icons',
      'lodash',
      'lodash-es',
      '@icon-park/react',
      'ahooks',
    ],
  },
  
  webpack: (webpackConfig, context) => {
    const { dev, isServer } = context;
    
    if (!dev) {
      webpackConfig.cache = false;
      
      // Tối ưu code splitting
      webpackConfig.optimization = {
        ...webpackConfig.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 25,
          minSize: 20000,
          cacheGroups: {
            // Tách React và React-DOM
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              name: 'react',
              priority: 40,
              reuseExistingChunk: true,
            },
            // Tách Antd
            antd: {
              test: /[\\/]node_modules[\\/](antd|@ant-design|rc-.*)[\\/]/,
              name: 'antd',
              priority: 30,
              reuseExistingChunk: true,
            },
            // Tách LobeHub UI
            lobehub: {
              test: /[\\/]node_modules[\\/]@lobehub[\\/]/,
              name: 'lobehub',
              priority: 25,
              reuseExistingChunk: true,
            },
            // Tách vendors khác
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              priority: 20,
              reuseExistingChunk: true,
            },
            // Common code
            common: {
              minChunks: 2,
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    
    // Fallback cho client-side
    if (!isServer) {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    return webpackConfig;
  },
  
  // Headers cho caching
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
});

export default nextConfig;
