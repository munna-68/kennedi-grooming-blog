export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'next/server') {
    return nextResolve('next/server.js', context)
  }
  if (specifier.startsWith('@/')) {
    const baseDir = new URL('./', import.meta.url).href
    const relativePath = specifier.slice(2)
    const targetUrl = new URL(relativePath, baseDir).href
    const withExt = targetUrl.endsWith('.ts') ? targetUrl : targetUrl + '.ts'
    return nextResolve(withExt, context)
  }
  return nextResolve(specifier, context)
}
