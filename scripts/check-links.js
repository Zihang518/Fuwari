import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DATA_DIR = path.join(__dirname, '../src/data');
const CONFIG_PATH = path.join(__dirname, '../astro.config.mjs');
const TIMEOUT = 10000; // 10 seconds timeout

// Helper to get site URL from config
function getSiteUrl() {
    try {
        const configContent = fs.readFileSync(CONFIG_PATH, 'utf8');
        const match = configContent.match(/site:\s*["']([^"']+)["']/);
        if (match && match[1]) {
            return match[1].replace(/\/$/, ''); // Remove trailing slash
        }
    } catch (err) {
        console.error('Failed to read astro.config.mjs:', err.message);
    }
    return null;
}

const SITE_URL = getSiteUrl();

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
};

// Statistics
const stats = {
    total: 0,
    success: 0,
    failed: 0,
    errors: []
};

function checkUrl(url, redirectCount = 0) {
    return new Promise((resolve) => {
        if (!url) {
            resolve({ ok: false, status: 'Missing URL', redirectCount });
            return;
        }

        if (redirectCount > 5) {
            resolve({ ok: false, status: 'Too many redirects', redirectCount });
            return;
        }

        // Handle local paths
        if (url.startsWith('/')) {
            if (!SITE_URL) {
                resolve({ ok: false, status: 'No Site URL', redirectCount });
                return;
            }
            url = SITE_URL + url;
        }

        // Invalid URL check
        if (!url.startsWith('http')) {
             resolve({ ok: false, status: 'Invalid URL', redirectCount });
             return;
        }

        const client = url.startsWith('https') ? https : http;
        const options = {
            method: 'GET', // Change HEAD to GET to mimic browser better
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"Windows"',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                'Upgrade-Insecure-Requests': '1'
            },
            timeout: TIMEOUT
        };

        const req = client.request(url, options, (res) => {
            // Consume response data to free up memory (since we switched to GET)
            res.resume();
            
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                const redirectUrl = new URL(res.headers.location, url).href;
                checkUrl(redirectUrl, redirectCount + 1).then(resolve);
                return;
            }

            // Consider 2xx as success (redirects handled above)
            if (res.statusCode >= 200 && res.statusCode < 300) {
                resolve({ ok: true, status: res.statusCode, redirectCount });
            } else {
                resolve({ ok: false, status: res.statusCode, redirectCount });
            }
        });

        req.on('error', (err) => {
            resolve({ ok: false, status: err.message, redirectCount });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({ ok: false, status: 'Timeout', redirectCount });
        });

        req.end();
    });
}

async function processFile(filePath, type) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        const name = data.name || path.basename(filePath, '.json');
        
        let urlResult = { status: 'N/A', redirectCount: 0 };
        let avatarResult = { status: 'N/A', redirectCount: 0 };
        let hasError = false;

        // Check URL (for friends)
        if (data.url) {
            stats.total++;
            urlResult = await checkUrl(data.url);
            if (urlResult.ok) {
                stats.success++;
            } else {
                // If failed, and site URL is available, try prepending site URL if it wasn't a local path originally
                // BUT only if it is NOT already a standard HTTP/HTTPS URL. If it is standard, don't retry with prefix.
                if (!data.url.startsWith('/') && !data.url.startsWith('http') && SITE_URL) {
                     const retryUrl = SITE_URL + '/' + data.url.replace(/^\/+/, '');
                     const retryResult = await checkUrl(retryUrl);
                     if (retryResult.ok) {
                         urlResult = retryResult;
                         stats.success++;
                     } else {
                         stats.failed++;
                         hasError = true;
                         stats.errors.push({ type, name, field: 'url', value: data.url, error: urlResult.status });
                     }
                } else {
                    stats.failed++;
                    hasError = true;
                    stats.errors.push({ type, name, field: 'url', value: data.url, error: urlResult.status });
                }
            }
        }

        // If URL check failed (and not just N/A), skip avatar check and return early
        // BUT wait, requirements say "if url failed, directly exit". Assuming this means exit checking THIS item.
        if (data.url && !urlResult.ok && urlResult.status !== 'N/A') {
             // Print output for failed URL
             let output = `${colors.cyan}${name}${colors.reset}：`;
             output += `url：${colors.red}${urlResult.status}${colors.reset}`;
             console.log(output);
             return;
        }

        // Check Avatar
        if (data.avatar) {
            stats.total++;
            avatarResult = await checkUrl(data.avatar);
            if (avatarResult.ok) {
                stats.success++;
            } else {
                  // Try fallback with site URL if it fails and doesn't start with http
                  if (!data.avatar.startsWith('/') && !data.avatar.startsWith('http') && SITE_URL) {
                      const retryUrl = SITE_URL + '/' + data.avatar.replace(/^\/+/, '');
                      const retryResult = await checkUrl(retryUrl);
                      if (retryResult.ok) {
                          avatarResult = retryResult;
                          stats.success++;
                      } else {
                          stats.failed++;
                          hasError = true;
                          stats.errors.push({ type, name, field: 'avatar', value: data.avatar, error: avatarResult.status });
                      }
                 } else {
                     stats.failed++;
                     hasError = true;
                     stats.errors.push({ type, name, field: 'avatar', value: data.avatar, error: avatarResult.status });
                 }
            }
        }

        // Format output
        // abc的博客：url：200， avatar: 200（重定向共X次）
        let output = `${colors.cyan}${name}${colors.reset}：`;
        
        if (data.url) {
            const statusColor = urlResult.ok ? colors.green : colors.red;
            output += `url：${statusColor}${urlResult.status}${colors.reset}`;
        }

        if (data.avatar) {
            const statusColor = avatarResult.ok ? colors.green : colors.red;
            output += `， avatar: ${statusColor}${avatarResult.status}${colors.reset}`;
        }

        const totalRedirects = (urlResult.redirectCount || 0) + (avatarResult.redirectCount || 0);
        if (totalRedirects > 0) {
            output += `（重定向共${totalRedirects}次）`;
        }

        console.log(output);

    } catch (err) {
        console.error(`${colors.red}Error processing file ${filePath}: ${err.message}${colors.reset}`);
    }
}

async function scanDirectory(dirName, type) {
    const dirPath = path.join(DATA_DIR, dirName);
    if (!fs.existsSync(dirPath)) {
        console.log(`${colors.yellow}Directory ${dirName} not found, skipping.${colors.reset}`);
        return;
    }

    const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.json'));
    console.log(`\n${colors.blue}Scanning ${type} (${files.length} files)...${colors.reset}\n`);

    for (const file of files) {
        await processFile(path.join(dirPath, file), type);
    }
}

async function main() {
    console.log(`${colors.magenta}=== Starting Link Checker ===${colors.reset}`);
    
    await scanDirectory('friends', 'Friend');
    await scanDirectory('sponsors', 'Sponsor');

    console.log(`\n${colors.magenta}=== Summary ===${colors.reset}`);
    console.log(`Total checks: ${stats.total}`);
    console.log(`Successful: ${colors.green}${stats.success}${colors.reset}`);
    console.log(`Failed: ${colors.red}${stats.failed}${colors.reset}`);

    if (stats.errors.length > 0) {
        console.log(`\n${colors.red}=== Failures Details ===${colors.reset}`);
        stats.errors.forEach(err => {
            console.log(`[${err.type}] ${err.name} - ${err.field}: ${err.error} (${err.value})`);
        });
        
        // Output for GitHub Actions Summary
        if (process.env.GITHUB_STEP_SUMMARY) {
            const summaryPath = process.env.GITHUB_STEP_SUMMARY;
            let summary = '## ❌ Link Check Failures\n\n';
            summary += '| Type | Name | Field | Error | URL |\n';
            summary += '|------|------|-------|-------|-----|\n';
            stats.errors.forEach(err => {
                summary += `| ${err.type} | ${err.name} | ${err.field} | ${err.error} | ${err.value} |\n`;
            });
            fs.appendFileSync(summaryPath, summary);
        }
        
        process.exit(1); // Exit with error code to notify GitHub Actions
    } else {
        if (process.env.GITHUB_STEP_SUMMARY) {
            const summaryPath = process.env.GITHUB_STEP_SUMMARY;
            fs.appendFileSync(summaryPath, '## ✅ All Links are Healthy!\n');
        }
        process.exit(0);
    }
}

main();
