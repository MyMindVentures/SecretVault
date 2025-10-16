// A minimal Integration Graph representation derived from detected providers

export function buildIntegrationGraph({ providers = [], metadata = {} }) {
  const nodes = []
  const edges = []

  // Project node
  nodes.push({ id: 'project', type: 'project', label: metadata.title || 'Project', data: metadata })

  // Provider nodes
  providers.forEach((p) => nodes.push({ id: `prov:${p}`, type: 'provider', label: p }))

  // Secrets edges (project -> provider)
  providers.forEach((p) => edges.push({ from: 'project', to: `prov:${p}`, type: 'requires' }))

  return { nodes, edges }
}

export function diffIntegrationGraphs(prevGraph, nextGraph) {
  const prevIds = new Set(prevGraph.nodes.map((n) => n.id))
  const nextIds = new Set(nextGraph.nodes.map((n) => n.id))

  const addedNodes = nextGraph.nodes.filter((n) => !prevIds.has(n.id))
  const removedNodes = prevGraph.nodes.filter((n) => !nextIds.has(n.id))

  const prevEdges = new Set(prevGraph.edges.map((e) => `${e.from}->${e.to}:${e.type}`))
  const nextEdges = new Set(nextGraph.edges.map((e) => `${e.from}->${e.to}:${e.type}`))

  const addedEdges = nextGraph.edges.filter((e) => !prevEdges.has(`${e.from}->${e.to}:${e.type}`))
  const removedEdges = prevGraph.edges.filter((e) => !nextEdges.has(`${e.from}->${e.to}:${e.type}`))

  return { addedNodes, removedNodes, addedEdges, removedEdges }
}



