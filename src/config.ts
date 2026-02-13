import type {
	ExpressiveCodeConfig,
	GitHubEditConfig,
	ImageFallbackConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
	UmamiConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "XieGao Blog",
	
	subtitle: "技术分享与实践",
	description:
		"分享刷机技术、网络技术、服务器部署、静态网站搭建等技术教程与实践经验的个人技术博客。",

	keywords: [
		// 核心技术领域
		"IT技术",
		"网络技术",
		"服务器部署",
		"内网穿透",
		"静态网站",
		"技术博客",
		"CDN技术",
		"无服务器",
		"前后端逆向",
		"Serverless",
		"云原生",
		"容器化",
		"Docker",
		"性能优化",
		"网站优化",

		// 博客品牌
		"Blog",
		"博客",
		"XieGao",
		"XieGao Blog",
		"雪xie高",

		// 云服务平台
		"Cloudflare",
		"Cloudflare Tunnel",
		"Cloudflare Workers",
		"Cloudflare Pages",
		"Cloudflare R2",
		"EdgeOne CDN",
		"SecBit MCDN",
		"Netlify",
		"Vercel",
		"IPFS",
		"Fleek",

		// 开发框架工具
		"Next.js",
		"Hugo",
		"Fuwari",
		"React",
		"Vue",
		"Docker Compose",
		"Umami",
		"GitHub",
		"GitHub Pages",

		// 网络技术
		"STUN",
		"NAT",
		"NAT1",
		"Tailscale",
		"Zerotier",
		"反向代理",
		"负载均衡",
		"SSL证书",
		"域名解析",

		// 服务器相关
		"NAS",
		"对象存储",
		"云存储",
		"图床",
		"文件存储",
		"数据备份",

		// 自动化工具
		"QQBot",
		"Koishi",
		"ChatBot",
		"自动化部署",
		"CI/CD",
		"GitHub Actions",

		// 实用工具
		"域名邮箱",
		"短链接",
		"在线工具",
		"meme-generator",
		"表情包生成",
		"AI工具",

		// 安全相关
		"网站安全",
		"防火墙",
		"访问控制",
		"DDoS防护",
		"Web安全",

		// 监控分析
		"网站统计",
		"访问分析",
		"监控告警",
		"性能监控",
		"日志分析",

		// 开发相关
		"前端开发",
		"后端开发",
		"全栈开发",
		"API开发",
		"微服务",
		"REST API",

		// 教程类型
		"技术教程",
		"部署指南",
		"配置教程",
		"实践经验",
		"开发笔记",
		"踩坑记录",

		// 热门技术
		"Kubernetes",
		"k8s",
		"微服务架构",
		"分布式系统",
		"负载均衡",
		"高可用",
		"弹性伸缩",

		// 存储相关
		"MinIO",
		"S3",
		"对象存储",
		"文件系统",
		"数据库",
		"Redis",

		// 网络优化
		"CDN加速",
		"缓存优化",
		"带宽优化",
		"延迟优化",
		"边缘计算",

		// 移动开发
		"PWA",
		"响应式设计",
		"移动端优化",
		"跨平台开发",
	],
	lang: "zh_CN", // 'en', 'zh_CN', 'zh_TW', 'ja', 'ko', 'es', 'th'
	themeColor: {
		hue: 210, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: false, // Hide the theme color picker for visitors
		forceDarkMode: false, // Force dark mode and hide theme switcher
	},
	banner: {
		enable: false,
		src: "/xinghui.avif", // Relative to the /src directory. Relative to the /public directory if it starts with '/'

		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: true, // Display the credit text of the banner image
			text: "Pixiv @chokei", // Credit text to be displayed

			url: "https://www.pixiv.net/artworks/122782209", // (Optional) URL link to the original artwork or artist's page
		},
	},
	background: {
		enable: true, // Enable background image
		src: "https://p.2x.nz/r/i/h", // Background image URL (supports HTTPS)
		position: "center", // Background position: 'top', 'center', 'bottom'
		size: "cover", // Background size: 'cover', 'contain', 'auto'
		repeat: "no-repeat", // Background repeat: 'no-repeat', 'repeat', 'repeat-x', 'repeat-y'
		attachment: "fixed", // Background attachment: 'fixed', 'scroll', 'local'
		opacity: 1, // Background opacity (0-1)
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		// Leave this array empty to use the default favicon
		{
			src: "https://q2.qlogo.cn/headimg_dl?dst_uin=3764350108&spec=0", // Path of the favicon, relative to the /public directory
			//   theme: 'light',              // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
			//   sizes: '32x32',              // (Optional) Size of the favicon, set only if you have favicons of different sizes
		},
	],
	officialSites: [
		{ url: "https://xiegao.top", alias: "CN" },
		{ url: "https://xiegao.top", alias: "Global" },
	],
	server: [
		{ url: "", text: "Blog" },
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		{
			name: "友链",
			url: "/friends/", // Internal links should not include the base path, as it is automatically added
			external: false, // Show an external link icon and will open in a new tab
		},
		{
			name: "赞助",
			url: "/sponsors/", // Internal links should not include the base path, as it is automatically added
			external: false, // Show an external link icon and will open in a new tab
		},
		{
			name: "云盘",
			url: "https://pan.xiegao.top", // Internal links should not include the base path, as it is automatically added
			external: true, // Show an external link icon and will open in a new tab
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "https://q2.qlogo.cn/headimg_dl?dst_uin=3764350108&spec=0", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "雪xie高",
	bio: "Protect What You Love.",
	links: [
		{
			name: "QQ",
			icon: "qq", // Local icon
			url: "https://qm.qq.com/q/vnq8axQlPy",
		},
		{
			name: "Telegram",
			icon: "telegram", // Local icon
			url: "https://t.me/zihang518",
		},
		{
			name: "Bilibli",
			icon: "bilibili", // Local icon
			url: "https://space.bilibili.com/2083649546",
		},
		{
			name: "GitHub",
			icon: "github", // Local icon
			url: "https://github.com/XuexGao",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const imageFallbackConfig: ImageFallbackConfig = {
	enable: false,
	originalDomain: "https://eopfapi.acofork.com/pic?img=ua",
	fallbackDomain: "https://eopfapi.acofork.com/pic?img=ua",
};

export const umamiConfig: UmamiConfig = {
	enable: true,
	baseUrl: "https://cloud.umami.is",
	shareId: "gR4yWp3kIRIKyBB7",
	timezone: "Asia/Shanghai",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	theme: "github-dark",
};

export const gitHubEditConfig: GitHubEditConfig = {
	enable: true,
	baseUrl: "https://github.com/XuexGao/Fuwari/blob/main/src/content/posts",
};

// todoConfig removed from here
