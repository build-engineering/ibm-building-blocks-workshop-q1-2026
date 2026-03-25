# Pandas MCP Server
Data analysis tools provided through a fastmcp MCP server which safely and efficiently executes pandas code and generates visualizations using the chart.js library.
Based off [Pandas MCP Server](https://github.com/marlonluo2018/pandas-mcp-server/tree/main).

### Step 1: Running locally
```bash
uv venv myenv
source myenv/bin/activate
uv pip install -r requirements.txt
python3 server.py
```

#### Forbidden Operations
The following operations are blocked for security reasons:
- **System Access**: `os.`, `sys.`, `subprocess.` - Prevents file system and system access
- **Code Execution**: `open()`, `exec()`, `eval()` - Blocks dynamic code execution
- **Dangerous Imports**: `import os`, `import sys` - Prevents specific harmful imports
- **Browser/DOM Access**: `document.`, `window.`, `XMLHttpRequest` - Blocks browser operations
- **JavaScript/Remote**: `fetch()`, `eval()`, `Function()` - Prevents remote code execution
- **Script Injection**: `script`, `javascript:` - Blocks script injection attempts

## 📄 License

This project is based off [Pandas MCP Server](https://github.com/marlonluo2018/pandas-mcp-server/tree/main) and licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
