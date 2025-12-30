import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/admin/', // Disallow crawling admin pages
        },
        sitemap: 'https://cacmtz.org/sitemap.xml',
    }
}
