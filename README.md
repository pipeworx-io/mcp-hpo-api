# @pipeworx/hpo-api

[Human Phenotype Ontology (HPO)](https://hpo.jax.org) MCP — clinical phenotype terms + gene/disease annotations. Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `term(id)` — HPO term by HP id (e.g. `HP:0001250`)
- `search(query, limit?, page?)` — text search across HPO terms
- `term_children(id)` — direct children of a term
- `term_parents(id)` — direct parents of a term
- `term_descendants(id)` — full descendant subtree (paginated)
- `gene_diseases(id)` — diseases associated with a gene id (NCBIGene)
- `disease_phenotypes(id)` — HPO terms annotated to a disease (OMIM/ORPHA/MONDO id)

## Data source

`https://ontology.jax.org/api/hp/` (newer HPO REST) with fallback to `https://hpo.jax.org/api/hpo/`.

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "hpo-api": {
      "url": "https://gateway.pipeworx.io/hpo-api/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Hpo Api data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
