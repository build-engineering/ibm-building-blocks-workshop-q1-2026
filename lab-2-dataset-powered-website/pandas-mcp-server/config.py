"""Configuration management for pandas-mcp-server"""
import os
from typing import List

# Security blacklist - can be extended via environment variable
DEFAULT_BLACKLIST = [
    'os.', 'sys.', 'subprocess.', 'open(', 'exec(', 'eval(',
    'import os', 'import sys', 'document.', 'window.', 'XMLHttpRequest',
    'fetch(', 'eval(', 'Function(', 'script', 'javascript:'
]
BLACKLIST = DEFAULT_BLACKLIST

# Logging configuration
LOG_LEVEL = 'INFO'
LOG_FILE = os.path.join(os.path.dirname(__file__), 'logs', 'mcp_server.log')
LOG_MAX_BYTES = 5 * 1024 * 1024  # Default: 5MB
LOG_BACKUP_COUNT = 3

# Performance settings
ENABLE_MEMORY_MONITORING = True
MEMORY_WARNING_THRESHOLD = 500  # MB

def print_config():
    """Print current configuration (useful for debugging)."""
    print("=" * 60)
    print("Pandas MCP Server Configuration")
    print("=" * 60)
    print(f"LOG_LEVEL: {LOG_LEVEL}")
    print(f"LOG_FILE: {LOG_FILE}")
    print(f"LOG_MAX_BYTES: {LOG_MAX_BYTES / (1024*1024):.2f} MB")
    print(f"LOG_BACKUP_COUNT: {LOG_BACKUP_COUNT}")
    print(f"ENABLE_MEMORY_MONITORING: {ENABLE_MEMORY_MONITORING}")
    print(f"MEMORY_WARNING_THRESHOLD: {MEMORY_WARNING_THRESHOLD} MB")
    print(f"BLACKLIST items: {len(BLACKLIST)}")
    print("=" * 60)