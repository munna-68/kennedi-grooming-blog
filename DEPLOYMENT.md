# Deployment

Deploy this folder as a separate Next.js project. The app is configured with `basePath: '/blog'`, so its public routes and assets are served under `/blog`.

After deployment, add the standalone deployment URL to the main Kennedi Vite site's `vercel.json` rewrite destination for `/blog` and `/blog/:path*`. The existing site should keep its current build command, output directory, API rewrites, sitemap, robots file, and SPA fallback unchanged.

The expected public webhook URL is:

`https://www.kennedigroomingstudio.com/blog/api/revalidate`
