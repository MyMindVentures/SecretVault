import { providerTemplates } from './providerTemplates'

// Naive content classifier; can be upgraded with LLMs later
export function detectProvidersFromFiles(files) {
  const providers = new Set()
  const patterns = Object.entries(providerTemplates).map(([id, tpl]) => ({ id, detectors: tpl.detectors }))

  for (const file of files) {
    const content = (file.content || '').toString()
    for (const { id, detectors } of patterns) {
      if (providers.has(id)) continue
      if (detectors.some((re) => re.test(content))) providers.add(id)
    }
  }

  return Array.from(providers)
}

export function extractProjectMetadata(files) {
  // Try package.json name/description first
  const pkg = files.find((f) => f.path.endsWith('package.json'))
  if (pkg) {
    try {
      const json = JSON.parse(pkg.content)
      if (json?.name || json?.description) {
        return {
          title: titleCase(json.name || 'Untitled Project'),
          description: json.description || 'Project description not provided.',
        }
      }
    } catch {
      // Ignore JSON parsing errors
    }
  }
  // Fallback to README.md first header/first paragraph
  const readme = files.find((f) => /readme\.md$/i.test(f.path))
  if (readme) {
    const text = String(readme.content)
    const title = (text.match(/^#\s+(.+)$/m) || [])[1]
    const para = (text.match(/\n\n([^#\n][\s\S]*?)\n\n/) || [])[1]
    if (title || para) {
      return {
        title: title || 'Untitled Project',
        description: (para || '').trim() || 'Project description not provided.',
      }
    }
  }
  return { title: 'Untitled Project', description: 'Project description not provided.' }
}

function titleCase(str) {
  return String(str)
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ')
}



