**User:**

<task>
Please list all of the tools that are available to you including the function signatures and anything about the inputs and outputs.
</task>

**Assistant:**

I'll provide a comprehensive list of all available tools with their function signatures, parameters, and descriptions.

## Available Tools

### 1. read_file
**Purpose:** Read contents of one or more files (max 5 files per request)

**Parameters:**
- `args` (required): Contains file elements with:
  - `path` (required): File path relative to workspace
  - `line_range` (optional): Format "start-end" (1-based, inclusive)

**Output:** Line-numbered content for easy reference

---

### 2. fetch_instructions
**Purpose:** Fetch instructions for performing specific tasks

**Parameters:**
- `task` (required): Task name (e.g., "create_mode")

---

### 3. search_files
**Purpose:** Perform regex search across files with context-rich results

**Parameters:**
- `path` (required): Directory to search (relative to workspace)
- `regex` (required): Rust regex pattern
- `file_pattern` (optional): Glob pattern (e.g., '*.ts')

---

### 4. list_files
**Purpose:** List files and directories

**Parameters:**
- `path` (required): Directory path relative to workspace
- `recursive` (optional): true/false for recursive listing

---

### 5. list_code_definition_names
**Purpose:** List code definitions (classes, functions, methods)

**Parameters:**
- `path` (required): File or directory path relative to workspace

---

### 6. apply_diff
**Purpose:** Apply precise, targeted modifications to existing files

**Parameters:**
- `path` (required): File path relative to workspace
- `diff` (required): SEARCH/REPLACE blocks with:
  - `:start_line:` marker
  - Exact content to find
  - New replacement content

**Note:** Can include multiple SEARCH/REPLACE blocks in single request

---

### 7. write_to_file
**Purpose:** Create new files or completely rewrite existing files

**Parameters:**
- `path` (required): File path relative to workspace
- `content` (required): Complete file content (no truncation)
- `line_count` (required): Total number of lines

**Warning:** Must provide COMPLETE file content, no placeholders

---

### 8. insert_content
**Purpose:** Add new lines without modifying existing content

**Parameters:**
- `path` (required): File path relative to workspace
- `line` (required): Line number (0 = append to end, positive = insert before)
- `content` (required): Content to insert

---

### 9. browser_action
**Purpose:** Interact with Puppeteer-controlled browser

**Parameters:**
- `action` (required): One of:
  - `launch`: Start browser at URL (requires `url`)
  - `hover`: Move cursor (requires `coordinate`)
  - `click`: Click at position (requires `coordinate`)
  - `type`: Type text (requires `text`)
  - `press`: Press key/combination (requires `text`)
  - `resize`: Resize viewport (requires `size`)
  - `scroll_down`: Scroll down one page
  - `scroll_up`: Scroll up one page
  - `close`: Close browser
- `url` (optional): URL for launch action
- `coordinate` (optional): Format "x,y@widthxheight"
- `size` (optional): Format "width,height"
- `text` (optional): Text for type/press actions

**Output:** Screenshot and console logs after each action

---

### 10. execute_command
**Purpose:** Execute CLI commands on the system

**Parameters:**
- `command` (required): CLI command to execute
- `cwd` (optional): Working directory (default: workspace directory)

---

### 11. use_mcp_tool
**Purpose:** Use tools from connected MCP servers

**Parameters:**
- `server_name` (required): MCP server name
- `tool_name` (required): Tool name to execute
- `arguments` (required): JSON object with tool parameters

---

### 12. generate_description_from_diff
**Purpose:** Generate PR description from git diff

**Parameters:**
- `head` (required): Branch with changes
- `base` (required): Target branch
- `remote` (optional): Remote repository name
- `cwd` (optional): Working directory
- `template_index` (optional): PR template index (0-based)

---

### 13. create_pull_request
**Purpose:** Create a pull request

**Parameters:**
- `head` (required): Source branch
- `base` (required): Target branch
- `title` (required): PR title
- `remote` (required): Remote repository name
- `body` (optional): PR description
- `draft` (optional): "true"/"false" (default: "false")
- `maintainer_can_modify` (optional): "true"/"false" (default: "true")
- `cwd` (optional): Working directory

---

### 14. obtain_git_diff
**Purpose:** Get git differences

**Parameters:**
- `path` (optional): Specific file/directory path
- `branch` (optional): Branch to compare against HEAD
- `local_changes` (optional): "true" to include uncommitted changes

**Output:** Shows working directory changes or branch comparison

---

### 15. submit_review_findings
**Purpose:** Create multiple formal review issues

**Parameters:**
- `issues` (required): JSON array of issue objects with:
  - `category` (required): "maintainability", "security", "performance", "functionality", "style"
  - `type` (required): Specific issue type (e.g., "magic-numbers-strings")
  - `severity` (required): "critical", "high", "medium", "low"
  - `title` (required): Brief title
  - `message` (required): Detailed explanation
  - `path` (required): File path
  - `line` (required): Line number
  - `issueScope` (required): "Single File" or "Multiple Files"
  - `column` (optional): Column number
  - `endLine` (optional): End line number
  - `endColumn` (optional): End column number
  - `suggestion` (optional): Fix recommendation

---

### 16. create_temporary_file
**Purpose:** Create and manage temporary files

**Parameters:**
- `action` (required): "create", "create_editor", "get_content", "cleanup", "cleanup_all", "get_info"
- `content` (optional): File content (for create actions)
- `prefix` (optional): Filename prefix (default: "roo-temp")
- `suffix` (optional): Filename suffix (default: ".tmp")
- `language` (optional): Language for syntax highlighting (default: "plaintext")
- `file_path` (optional): Path for cleanup/get_info actions

---

### 17. fetch_github_issue
**Purpose:** Fetch and analyze GitHub issues

**Parameters:**
- `issue_number` (optional): Issue number from current repo
- `issue_url` (optional): Full GitHub issue URL
- `remote` (optional): Remote name (default: "origin")
- `cwd` (optional): Working directory
- `search_assigned` (optional): "true" to search assigned issues
- `list_current_repo` (optional): "true" to list open issues

**Output:** Issue details and alignment analysis with local changes

---

### 18. ask_followup_question
**Purpose:** Ask user for clarification

**Parameters:**
- `question` (required): Clear, specific question
- `follow_up` (required): 2-4 suggested answers in `<suggest>` tags
  - Optional `mode` attribute to switch modes

---

### 19. attempt_completion
**Purpose:** Present final result to user

**Parameters:**
- `result` (required): Final result description (short, clear, no questions)

**Requirements:**
- Must confirm previous tool uses succeeded
- Keep result concise
- Focus on outcome, not steps
- No nested lists

---

### 20. switch_mode
**Purpose:** Request to switch to different mode

**Parameters:**
- `mode_slug` (required): Mode slug (e.g., "code", "ask", "plan")
- `reason` (optional): Reason for switching

---

### 21. new_task
**Purpose:** Create new task instance in chosen mode

**Parameters:**
- `mode` (required): Mode slug
- `message` (required): Initial instructions for new task

---

### 22. update_todo_list
**Purpose:** Replace entire TODO list with updated checklist

**Parameters:**
- `todos` (required): Markdown checklist with status:
  - `[ ]` = pending
  - `[x]` = completed
  - `[-]` = in progress

**Rules:**
- Single-level list only (no nesting)
- Confirm completions before updating
- Add new todos as discovered
- Keep all unfinished tasks

---

## MCP Server Tools

### wxo-docs Server
**Tool:** `search_ibm_watsonx_orchestrate_adk`

**Purpose:** Search IBM watsonx Orchestrate ADK knowledge base

**Parameters:**
- `query` (required): Search query string
- `version` (optional): Filter by version (e.g., 'v0.7')

**Output:** Contextual content with titles and documentation links

