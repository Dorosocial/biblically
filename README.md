# biblically

## WaveSpeed MCP server

This repo is configured to use the [wavespeed-mcp](https://pypi.org/project/wavespeed-mcp/) server for AI image/video generation via Claude Code.

Setup (each collaborator registers it locally, so no API key is committed):

```
pip install -r requirements.txt
claude mcp add wavespeed -e WAVESPEED_API_KEY=your_api_key_here -- wavespeed-mcp
```
