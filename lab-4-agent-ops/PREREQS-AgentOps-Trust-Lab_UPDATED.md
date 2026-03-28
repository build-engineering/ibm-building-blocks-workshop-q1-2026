# Lab Prerequisites

Before running the build-time evaluation lab, make sure you have the following three things installed and verified.

---

## 0. Start Clean (recommended for all participants)

If you have any previous Developer Edition installation or virtual environment from an earlier attempt, purge everything to avoid stale state. **Skip this step only if this is your very first time setting up.**

**What this does:**
- `orchestrate server purge` deletes the Developer Edition VM and all its data (deployed agents, Langfuse traces, container images). It does **not** remove the CLI itself, your Python installation, your `.env` file, or any files on your host filesystem.
- Removing the old virtual environment clears out any previously installed Python packages that may have version conflicts.

```bash
# Stop and purge the Developer Edition server (removes VM + all server data)
orchestrate server purge

# Remove the old virtual environment (if it exists)
deactivate 2>/dev/null   # exit venv if currently active
rm -rf wxo-eval-lab      # delete the old venv folder
```

> **Note:** If `orchestrate` is not installed yet (first-time setup), the purge command will fail — that's fine, just skip it and proceed to Step 1.

**Verify clean slate after purge:**
```bash
env | grep -i -E "LANGFUSE|WO_|WATSONX"
# Should return nothing — if you see leftover variables, close and reopen your terminal
```

**Optional: reclaim disk space from old virtual environments**

If you've installed the ADK in other virtual environments before, each one can take **500 MB – 1 GB+** of disk space. To find and remove them:

```bash
# Find all venvs that have the orchestrate CLI installed
find ~ -maxdepth 5 -name "orchestrate" -path "*/bin/*" 2>/dev/null
```

> **Caution:** Review the list before deleting — skip any paths that are full Python installations (e.g., `.pyenv/versions/...`) rather than project venvs. Those should be removed with `pyenv uninstall` instead.

Before deleting any old venvs, **activate one and run the purge** (if you haven't already) so the Developer Edition VM is also cleaned up:

```bash
source /path/to/old-venv/bin/activate
orchestrate server purge
deactivate
```

Then delete the old venvs you no longer need:
```bash
rm -rf /path/to/old-venv
```

---

## 1. Python 3.12

**Install:**
- **macOS:** `brew install python@3.12`
- **Linux:** `sudo apt install python3.12` (or use `pyenv`/`uv`)
- **Windows:** Download from [python.org](https://www.python.org/downloads/) — check "Add Python to PATH" during install

**Verify:**
```bash
python3 --version
# Expected: Python 3.12.x
# If you see 3.11 or lower, install Python 3.12 (see above)

# List all Python 3 installations on your system:
find /opt/homebrew/bin /usr/local/bin /usr/bin ~/.pyenv/versions -name "python3.*" 2>/dev/null
# Confirm that a 3.12.x path appears before proceeding
```

> **If `python3 --version` shows something other than 3.12.x** (e.g., 3.14 from Homebrew):
> This usually means another Python installation has higher priority in your PATH. **Don't worry about fixing your global default** — you can point the virtual environment directly at 3.12 in Step 2. Just make sure 3.12 is installed, then move on.

---

## 2. WXO ADK CLI

**Recommended: use a virtual environment.** Installing in a venv avoids conflicts and is known to prevent installation issues with Developer Edition.

> **Where to create the venv:** Navigate to a convenient location (e.g., your home directory or a workspace folder) before creating the virtual environment. The venv does not need to be inside the `lab-4-agent-ops/` folder.

**Create the venv** — use the command that matches your situation:

```bash
# If python3 --version already shows 3.12.x:
python3 -m venv wxo-eval-lab

# If python3 points to a different version, create the venv with an explicit path to 3.12:
#   pyenv:  ~/.pyenv/versions/3.12.11/bin/python3 -m venv wxo-eval-lab
#   brew:   /opt/homebrew/opt/python@3.12/bin/python3 -m venv wxo-eval-lab
```

```bash
source wxo-eval-lab/bin/activate  # Windows: wxo-eval-lab\Scripts\activate
python3 --version
# Expected: Python 3.12.x — if not, recreate the venv using the explicit path above
```

```bash
pip install 'ibm-watsonx-orchestrate[agentops]'
pip install 'ibm-watsonx-orchestrate-evaluation-framework==1.2.7'
pip install 'langfuse<4'
```

> **Why the extra install steps?** The `[agentops]` extra installs the evaluation framework, but the latest version (1.3.x) has breaking changes — pinning to 1.2.7 ensures compatibility. The default install pulls in langfuse 4.x, which removed APIs that the evaluation framework depends on — constraining to `<4` fixes this.

**Verify ADK:**
```bash
orchestrate evaluations evaluate --help
# Should display evaluation command help (confirms ADK is installed and evaluation commands are available)
```

**Verify evaluation framework dependencies:**
```bash
python -c "from ibm_watsonx_orchestrate.cli.commands.evaluations.evaluations_controller import EvaluationsController, EvaluateMode, USE_LEGACY_EVAL; print('OK')"
# Must print "OK". If it fails:
#   "No module named 'agentops'" → pip install 'ibm-watsonx-orchestrate[agentops]'
#   "cannot import name" from agentops → pip install 'ibm-watsonx-orchestrate-evaluation-framework==1.2.7'
#   "No module named 'langfuse.api.resources'" → pip install 'langfuse<4'
```

---

## 3. WXO Developer Edition

Developer Edition runs the local WXO server. It bundles its own container engine — no separate Docker or Rancher installation needed.

**Requirements before installing:**
- IBM account with a valid watsonx Orchestrate (or 30-day trial)
- 8-core CPU, 16 GB RAM minimum (24 GB if using document processing)
- If on Windows and Docker is already installed: remove Docker first — the ADK bundles its own

**Install / Reinstall:**

Create a `.env` file with your watsonx Orchestrate credentials:

```bash
WO_DEVELOPER_EDITION_SOURCE=orchestrate
WO_INSTANCE=https://api.<region>.watson-orchestrate.ibm.com/instances/<id>
WO_API_KEY=<your-api-key>
```

> For other auth methods (myIBM entitlement, on-premises), see the [full install docs](https://developer.watson-orchestrate.ibm.com/developer_edition/wxOde_setup).

Then start the server with Langfuse enabled (recommended — required for Exercise 7):
```bash
orchestrate server start -e <path-to-.env-file> -l
```

> **Note:** The `-l` flag enables Langfuse. First start may take up to 7 minutes to pull container images.
>
> **Langfuse login credentials:** When the server finishes starting, the Langfuse credentials are printed in the terminal output. **Look for the line starting with `You can access the observability platform Langfuse at`** — it contains the username and password. The password may be auto-generated (e.g., `MyDevEditionPassXXXX!`) and will differ between installations. **Copy it now — you will need it to log in.**
> - **Username:** `orchestrate@ibm.com`
> - **Password:** *(check your terminal output — do not assume a default)*

> The command above already starts the server — no additional step needed. For **subsequent runs** (e.g., after a reboot or `orchestrate server stop`), always pass `-e` again:
> ```bash
> orchestrate server start -e <path-to-.env-file> -l
> ```
> Without `-e`, the server will fail with a "Missing required model access environment variables" error — credentials are not saved between runs.

**Verify the server is running:**
```bash
curl -s http://localhost:3010/api/public/health
# Expected: {"status":"OK"} — confirms Langfuse is running

curl -s http://localhost:4321/docs | head -5
# Expected: HTML output — confirms the WXO server is up
```

**Set Langfuse environment variables** (required for `evaluate --with-langfuse`):

The Langfuse API keys are auto-generated during server setup. To find them:

1. Open the Langfuse UI at `http://localhost:3010`
2. Log in with `orchestrate@ibm.com` and the password from your terminal output (see above)
3. Go to **Settings** → **API Keys**, generate new API keys, and copy the Public Key and Secret Key

Then export them in your terminal:
```bash
export LANGFUSE_BASE_URL='http://localhost:3010'
export LANGFUSE_SECRET_KEY='<secret-key-from-langfuse-settings>'
export LANGFUSE_PUBLIC_KEY='<public-key-from-langfuse-settings>'
```
> These environment variables are session-scoped — you must re-export them each time you open a new terminal.


> **Model pricing note:** Standard models (OpenAI, Anthropic, Google) have pricing pre-configured in Langfuse. If your agent uses a non-standard model (e.g., `groq/openai/gpt-oss-120b`), you'll need to configure model pricing for token counts and cost tracking to work. See Exercise 7 for details.

---

## Notes on Evaluation Model Requirements

Most evaluation commands (including journey success) depend on **model-proxy or watsonx.ai models** provided through Developer Edition.

- **Dallas region:** All capabilities work out of the box — no extra config needed
- **Other regions:** You may need to set a `MODEL_OVERRIDE` environment variable pointing to a compatible model

If your Developer Edition is set up with the default local configuration, you won't need to worry about this.

---

## Quick Verification Checklist

> Make sure your virtual environment is activated before running these commands:
> ```bash
> source wxo-eval-lab/bin/activate  # Windows: wxo-eval-lab\Scripts\activate
> ```

Run these commands in order — if all pass, you're ready to start the lab:

```bash
python3 --version                                          # Python 3.12.x
orchestrate evaluations evaluate --help 2>&1 | head -3     # ADK installed with eval commands
curl -s http://localhost:3010/api/public/health             # Langfuse is running
echo "${LANGFUSE_PUBLIC_KEY:0:10}"                          # Langfuse env vars are set
# ↑ Should print the first 10 chars of your key. If blank, export the Langfuse vars (see step 3).
```

> **Is the server running?** There is no `orchestrate server status` command. To check, run:
> `curl -s http://localhost:4321/docs | head -5` — if you see HTML output, the server is up.
> If the server is not running, start it with: `orchestrate server start -e <path-to-.env-file> -l`

Then verify in your browser:
- `http://localhost:4321/docs` — server is up
- `http://localhost:3010` — Langfuse is running (login: `orchestrate@ibm.com` / password from your terminal output)

---

## Troubleshooting

**If you have an existing broken installation**, purge and reinstall:
```bash
orchestrate server purge
# Re-activate your venv, then:
orchestrate server start -e <path-to-.env-file> -l
```

**"Missing required model access environment variables" error:**
This happens when you run `orchestrate server start -l` without `-e`. Always pass your `.env` file: `orchestrate server start -e <path-to-.env-file> -l`. Credentials are not saved between runs.

**If Langfuse health check fails after server start:**
The Langfuse containers may still be starting (up to 7 minutes on first start). Wait and retry the health check. If it persists, check that the server was started with the `-l` flag.
