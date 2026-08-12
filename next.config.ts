import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn2.cellphones.com.vn',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'img.youtube.com',
                port: '',
            },
        ]
    }
};

export default nextConfig;
