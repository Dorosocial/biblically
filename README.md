# biblically

## WaveSpeed MCP server

This repo is configured to use the [wavespeed-mcp](https://pypi.org/project/wavespeed-mcp/) server for AI image/video generation via Claude Code.

Setup:

```
pip install -r requirements.txt
export WAVESPEED_API_KEY=your_api_key_here
```

The server is declared in `.mcp.json` and will be picked up automatically by Claude Code in this repo.
