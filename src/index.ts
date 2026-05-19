interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * HPO API MCP.
 *
 * Docs: https://ontology.jax.org/
 */


const BASE = 'https://ontology.jax.org/api/hp';
const UA = 'pipeworx-mcp-hpo-api/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  { name: 'term', description: 'HPO term by id.', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
  { name: 'search', description: 'Text search.', inputSchema: { type: 'object', properties: { query: { type: 'string' }, limit: { type: 'number' }, page: { type: 'number' } }, required: ['query'] } },
  { name: 'term_children', description: 'Direct children.', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
  { name: 'term_parents', description: 'Direct parents.', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
  { name: 'term_descendants', description: 'Full descendant subtree.', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
  { name: 'gene_diseases', description: 'Diseases for a gene id (NCBIGene).', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
  { name: 'disease_phenotypes', description: 'HPO terms for a disease (OMIM/ORPHA/MONDO).', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'term':
      return hpoGet(`/terms/${encodeURIComponent(reqStr(args, 'id', '"HP:0001250"'))}`);
    case 'search': {
      const p = new URLSearchParams({
        q: reqStr(args, 'query', '"seizure"'),
        max: String(Math.min(500, Math.max(1, (args.limit as number) ?? 25))),
        page: String(Math.max(0, (args.page as number) ?? 0)),
      });
      return hpoGet(`/search?${p}`);
    }
    case 'term_children':
      return hpoGet(`/terms/${encodeURIComponent(reqStr(args, 'id', '"HP:0001250"'))}/children`);
    case 'term_parents':
      return hpoGet(`/terms/${encodeURIComponent(reqStr(args, 'id', '"HP:0001250"'))}/parents`);
    case 'term_descendants':
      return hpoGet(`/terms/${encodeURIComponent(reqStr(args, 'id', '"HP:0001250"'))}/descendants`);
    case 'gene_diseases':
      return hpoGet(`/genes/${encodeURIComponent(reqStr(args, 'id', '"NCBIGene:7157"'))}/diseases`);
    case 'disease_phenotypes':
      return hpoGet(`/diseases/${encodeURIComponent(reqStr(args, 'id', '"OMIM:154700"'))}/phenotypes`);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function hpoGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (res.status === 404) throw new Error('HPO: not found');
  if (!res.ok) throw new Error(`HPO: ${res.status}`);
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
