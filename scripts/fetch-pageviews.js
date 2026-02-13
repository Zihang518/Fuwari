import fs from 'node:fs';
import path from 'node:path';

// Configuration based on src/config.ts
const umamiConfig = {
    enable: true,
    baseUrl: "https://u.2x.nz",
    shareId: "CdkXbGgZr6ECKOyK",
    timezone: "Asia/Shanghai",
};

const POSTS_DIR = path.join(process.cwd(), 'src', 'content', 'posts');
const OUTPUT_FILE = path.join(process.cwd(), 'pageviews.json');

async function getAuthToken() {
    const url = `${umamiConfig.baseUrl}/api/share/${umamiConfig.shareId}`;
    console.log(`Fetching auth token from: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch auth token: ${response.status} ${response.statusText}`);
    }
    return await response.json();
}

async function getPageStats(websiteId, token, urlPath) {
    const endAt = Date.now();
    const startAt = 0; // From 1970
    const params = new URLSearchParams({
        startAt: startAt.toString(),
        endAt: endAt.toString(),
        unit: 'hour',
        timezone: umamiConfig.timezone,
        compare: 'false'
    });

    if (urlPath === '/') {
        // For root path (total site stats), do not include 'path' parameter
        // OR if user specifically meant path=/ without eq., but usually no path means total stats
        // Based on user instruction "直接不带eq参数即可" and context from swup-js.md
    } else {
        params.append('path', `eq.${urlPath}`);
    }

    const apiUrl = `${umamiConfig.baseUrl}/api/websites/${websiteId}/stats?${params.toString()}`;
    
    const response = await fetch(apiUrl, {
        headers: {
            'x-umami-share-token': token
        }
    });

    if (!response.ok) {
        console.error(`Failed to fetch stats for ${urlPath}: ${response.status}`);
        return null;
    }

    return await response.json();
}

async function main() {
    try {
        console.log('Starting pageviews fetch...');
        
        // 1. Get Auth Token
        const { websiteId, token } = await getAuthToken();
        console.log(`Website ID: ${websiteId}`);

        // 2. Get list of posts
        if (!fs.existsSync(POSTS_DIR)) {
            throw new Error(`Posts directory not found: ${POSTS_DIR}`);
        }
        
        const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'));
        console.log(`Found ${files.length} posts.`);

        const results = [];
        
        // Add root path stats
        console.log('Fetching stats for / (Total)...');
        try {
            const rootStats = await getPageStats(websiteId, token, '/');
            if (rootStats) {
                const pageviews = (rootStats.pageviews && rootStats.pageviews.value) || rootStats.pageviews || 0;
                results.push({
                    pathname: '/',
                    pageviews: pageviews
                });
                console.log(`[Total] /: ${pageviews}`);
            }
        } catch (err) {
            console.error('Error fetching /:', err);
        }

        // 3. Iterate and fetch stats
        for (const [index, file] of files.entries()) {
            // Convert slug to lowercase
            const slug = file.replace('.md', '').toLowerCase();
            const pathname = `/posts/${slug}/`;
            
            // Add a small delay to avoid rate limiting
            if (index > 0 && index % 20 === 0) {
                console.log(`Processed ${index} posts...`);
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            try {
                const stats = await getPageStats(websiteId, token, pathname);
                
                if (stats) {
                    const pageviews = (stats.pageviews && stats.pageviews.value) || stats.pageviews || 0;
                    results.push({
                        pathname: pathname,
                        pageviews: pageviews
                    });
                    process.stdout.write(`\r[${index + 1}/${files.length}] ${pathname}: ${pageviews}    `);
                } else {
                     results.push({
                        pathname: pathname,
                        pageviews: 0
                    });
                    process.stdout.write(`\r[${index + 1}/${files.length}] ${pathname}: 0 (Failed)    `);
                }
            } catch (err) {
                console.error(`\nError fetching ${pathname}:`, err);
                results.push({
                    pathname: pathname,
                    pageviews: 0
                });
            }
        }
        
        console.log('\nFetching completed.');

        // 4. Save to JSON
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
        console.log(`Successfully saved pageviews to ${OUTPUT_FILE}`);

    } catch (error) {
        console.error('Fatal Error:', error);
    }
}

main();
