# Lab 5: Retail Product Insights with Building Blocks

## Data for AI Lab's goal

In this Lab, you will learn how to use IBM Building Blocks to create a simple retail insight solution.

The main goal is to show how a retail application can be enriched with unstructured product content, stored in a vector database, and used to generate useful insights.

By the end of the lab, you will understand how to:
- use the **RAG Ingestion SSE MCP Server** to ingest unstructured content from IBM Cloud Object Storage (COS)
- create embeddings using **watsonx.ai**
- store vectors in **Milvus**, which is part of **watsonx.data**
- connect the ingestion MCP server to **Bob**
- use a separate **FastAPI** service to retrieve relevant content from Milvus and generate retail insights
- understand how these blocks fit into a broader retail application pattern

---

## What you are building

You will work with a retail application scenario.

In this scenario:
- product documents, brochures, FAQs, markdown files, and other unstructured content are stored in **IBM Cloud Object Storage (COS)**
- the **RAG Ingestion SSE MCP Server** reads that content from COS
- the server chunks the documents, creates embeddings using **watsonx.ai**, and stores them in **Milvus** on **watsonx.data**
- **Milvus** acts as the vector store for the retail solution
- a separate **FastAPI** service retrieves the most relevant chunks from Milvus and generates insights for the retail application

This is the Building Blocks story you will demonstrate in the lab:

**Retail App → FastAPI Insights Service → Milvus on watsonx.data → watsonx.ai embeddings → COS unstructured data**

---

## Lab outcome

At the end of this lab, you should have:
- access to a lab-provided **Milvus** instance on **watsonx.data**
- a running **RAG Ingestion SSE MCP Server** on port `8080`
- the ingestion MCP server connected in **Bob**
- retail documents ingested from **COS** into **Milvus**
- a working **FastAPI** layer that can retrieve relevant chunks from Milvus and generate retail insights
- a clear understanding of how to combine Building Blocks into a retail solution

---

## Pre-requisites

Read this section fully before starting.

### Software required

Install the following on your machine:
- Python **3.12**
- Git
- Bob IDE
- `uvx` available locally for Bob MCP proxy setup

If you are on Windows, install **Git Bash** so you can run the shell commands as written in this guide.

### Verify your local installation

Run:

```bash
python3.12 --version
git --version
uvx --version
```

On Windows, if `python3.12` does not work, use:

```bash
py -3.12 --version
```

### Environment provisioning (TechZone instances)

The following services need to be set up on your TechZone instance:

#### 1. Setup Milvus in watsonx.data

Milvus will be configured as the vector database for this lab:
- Access your TechZone watsonx.data instance
- Milvus service should be pre-configured and running
- If not configured, enable Milvus from the Infrastructure manager
- Connection details (host, port, credentials) will be provided
- A collection named `product_insights`(or the name you choose) will be created during ingestion

#### 2. Setup watsonx.ai Runtime

**If watsonx.ai runtime is already provisioned:**
- Verify access to your TechZone watsonx.ai instance
- Confirm runtime has access to foundation models
- Verify embedding model `intfloat/multilingual-e5-large` is available

**If watsonx.ai runtime is NOT provisioned:**
1. Log in to IBM Cloud Console
2. Navigate to **Catalog** → Search for "watsonx.ai"
3. Select **watsonx.ai** service
4. Choose your region (e.g., `us-south`)
5. Select an appropriate plan (Lite or Standard)
6. Click **Create**
7. Wait for the service to provision (5-10 minutes)
8. Click **Launch watsonx.ai** to access the platform

#### 3. Setup watsonx.ai Studio Project

**If watsonx.ai project is already provisioned:**
- Access your existing project in watsonx.ai
- Verify the project is associated with Watson Machine Learning runtime
- Note the Project ID from the project settings

**If watsonx.ai project is NOT provisioned:**
1. In the watsonx.ai console, click **Projects** → **New project**
2. Select **Create an empty project**
3. Configure the project:
   - **Name**: `Retail Product Insights`
   - **Description**: "Project for retail product insights with RAG and vector search"
   - **Storage**: Select or create a Cloud Object Storage instance
4. Click **Create**
5. Once created, go to **Manage** tab → **General**
6. Copy the **Project ID** (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
7. Verify Watson Machine Learning is associated:
   - Go to **Manage** → **Services & integrations**
   - Confirm **Watson Machine Learning** is listed
   - If not, click **Associate service** and select your Watson Machine Learning instance

#### 4. Generate IBM Cloud API Key

1. From IBM Cloud Console, click **Manage** → **Access (IAM)**
2. In the left sidebar, click **API keys**
3. Click **Create an IBM Cloud API key**
4. Provide a name: `watsonx-retail-app-key`
5. Click **Create**
6. **Important**: Copy and save the API key immediately
7. Click **Download** to save a backup copy

#### 5. Collect Required Details

After completing the setup, collect the following credentials:
- **WATSONX_URL**: Based on your region (e.g., `https://us-south.ml.cloud.ibm.com`)
- **WATSONX_API_KEY**: The IBM Cloud API key you generated
- **WATSONX_PROJECT_ID**: From the watsonx.ai project settings
- **MILVUS_HOST**: From watsonx.data Milvus connection details
- **MILVUS_PORT**: Usually `19530`
- **MILVUS_USER**: From watsonx.data Milvus credentials
- **MILVUS_PASSWORD**: From watsonx.data Milvus credentials

These details will be used to configure the retail application deployment.

### Complete prerequisite lab

#### Complete [this](https://github.com/build-engineering/ibm-building-blocks-workshop-q1-2026/blob/main/lab-6-automation/docs/ansible-deployment.md) lab before starting the main workshop steps

### Access and setup needed before the lab

The following will be provided or prepared before the lab:

1. **IBM Cloud Object Storage (COS) instance**
   Details will be shared before the lab.

2. **TechZone instance credentials**
   Access to pre-configured watsonx.ai and watsonx.data services.

### Credentials you will need

#### watsonx.ai

You need:
- `WATSONX_URL`
- `WATSONX_API_KEY`
- `WATSONX_PROJECT_ID`
- `EMBEDDING_MODEL_ID`

Example:

```env
WATSONX_URL=https://us-south.ml.cloud.ibm.com
WATSONX_API_KEY=your_watsonx_api_key_here
WATSONX_PROJECT_ID=your_watsonx_project_id_here
EMBEDDING_MODEL_ID=intfloat/multilingual-e5-large
```

#### IBM Cloud Object Storage (COS)

You need:
- `COS_ENDPOINT`
- `COS_API_KEY`
- `COS_INSTANCE_CRN`
- `COS_BUCKET`
- optional `COS_PREFIX`

Example:

```env
COS_ENDPOINT=https://s3.us-south.cloud-object-storage.appdomain.cloud
COS_API_KEY=your_cos_api_key_here
COS_INSTANCE_CRN=your_cos_instance_crn_here
COS_BUCKET=retail-product-docs
COS_PREFIX=
```

#### Milvus on watsonx.data

You need:
- `MILVUS_HOST`
- `MILVUS_PORT`
- `MILVUS_USER`
- `MILVUS_PASSWORD`
- `MILVUS_COLLECTION`

Example:

```env
VECTOR_DB_TYPE=milvus
MILVUS_HOST=your_watsonx_data_milvus_host
MILVUS_PORT=19530
MILVUS_USER=your_milvus_user
MILVUS_PASSWORD=your_milvus_password
MILVUS_SECURE=true
MILVUS_COLLECTION=product_insights
MILVUS_HYBRID_SEARCH=false
MILVUS_USE_BULK_INGESTION=false
```

---

## Source asset used in this lab

This lab uses the following Building Blocks asset [here](https://github.com/ibm-self-serve-assets/building-blocks/blob/main/data-for-ai/question-and-answer/rag/assets/rag-ingestion-sse-mcp-server/README.md):
- RAG Ingestion SSE MCP Server  
  `building-blocks/data-for-ai/question-and-answer/rag/assets/rag-ingestion-sse-mcp-server`

You will use the Bob configuration pattern from the ingestion asset README when connecting the server.

---

## Recommended folder layout

Use the following local folder structure:

```text
data-for-ai/
├── building-blocks/
└── rag-ingestion-sse-mcp-server/
```

---

## Step 1: Create a working directory

```bash
mkdir -p data-for-ai
cd data-for-ai
```

---

## Step 2: Clone the Building Blocks repository

```bash
git clone https://github.com/ibm-self-serve-assets/building-blocks.git
```

---

## Step 3: Copy the ingestion asset locally

```bash
cp -r building-blocks/data-for-ai/question-and-answer/rag/assets/rag-ingestion-sse-mcp-server .
```

After this step, your folder should look like this:

```text
data-for-ai/
├── building-blocks/
└── rag-ingestion-sse-mcp-server/
```

---

## Step 4: Create a Python virtual environment

### macOS / Linux

```bash
python3.12 -m venv .venv
source .venv/bin/activate
```

### Windows

```bash
py -3.12 -m venv .venv
.venv\Scripts\activate
```

Upgrade pip and install dependencies:

```bash
python -m pip install --upgrade pip
pip install -r rag-ingestion-sse-mcp-server/app/requirements.txt
```

---

## Step 5: Configure the ingestion MCP server

Go to the ingestion folder:

```bash
cd rag-ingestion-sse-mcp-server
```

Create the environment file:

```bash
cp .env.example .env
```

Update `.env` with the values for this lab.

Use this as your starter template:

```env
HOST=0.0.0.0
PORT=8080
SERVER_NAME=rag-ingestion-mcp
SERVER_VERSION=1.0.0
SERVER_DESCRIPTION=Base MCP Server for Data for AI Building Block (with RAG ingestion)
ENVIRONMENT=development
PUBLIC_BASE_URL=
ALLOWED_HOSTS=
ALLOWED_ORIGINS=
APP_BEARER_TOKEN=
LOG_LEVEL=INFO

COS_ENDPOINT=https://s3.us-south.cloud-object-storage.appdomain.cloud
COS_API_KEY=your_cos_api_key_here
COS_INSTANCE_CRN=your_cos_instance_crn_here
COS_BUCKET=retail-product-docs
COS_PREFIX=

WATSONX_URL=https://us-south.ml.cloud.ibm.com
WATSONX_API_KEY=your_watsonx_api_key_here
WATSONX_PROJECT_ID=your_watsonx_project_id_here
EMBEDDING_MODEL_ID=intfloat/multilingual-e5-large

CHUNK_SIZE=256
CHUNK_OVERLAP=128
INCLUDE_ALL_HTML_TAGS=false

VECTOR_DB_TYPE=milvus
MILVUS_HOST=your_watsonx_data_milvus_host
MILVUS_PORT=19530
MILVUS_USER=your_milvus_user
MILVUS_PASSWORD=your_milvus_password
MILVUS_SECURE=true
MILVUS_COLLECTION=product_insights
MILVUS_HYBRID_SEARCH=false
MILVUS_USE_BULK_INGESTION=false
```

### Why chunking matters

For this lab, use:
- `CHUNK_SIZE=256`
- `CHUNK_OVERLAP=128`

This helps split retail documents into smaller overlapping pieces so embeddings remain meaningful and retrieval quality improves.

---

## Step 6: Start the ingestion MCP server

Make sure your Python virtual environment is active, then run:

```bash
python app/server.py
```

Alternative startup command:

```bash
uvicorn app.server:app --host 0.0.0.0 --port 8080
```

Expected result:
- the ingestion server starts successfully
- bootstrap checks run for COS, watsonx embeddings, and Milvus
- the server is available on `http://localhost:8080`

You can validate it with:

```bash
curl http://localhost:8080/health
curl http://localhost:8080/
```

## Step 7: Workshop - Generate Product Data Using Bob

Before ingesting data into Milvus, you need product documentation to work with. This workshop shows how to use Bob's Product Documentation Generator mode to automatically create comprehensive product documentation from a retail website.

### What you will learn

- How to use Bob's custom modes for specialized tasks
- How to extract product information from retail websites
- How to generate professional product documentation in markdown format
- How to organize product data for ingestion

### Prerequisites

- Bob IDE installed and running
- A retail application running locally (e.g., on `http://localhost:3000`)
- The Product Documentation Generator mode configured in Bob

### Step 7.1: Set up the Product Documentation Generator mode

1. Clone or pull the Building Blocks repository if you haven't already:

```bash
cd data-for-ai
git clone https://github.com/ibm-self-serve-assets/building-blocks.git
```

2. Navigate to the data-generator folder:

```bash
cd building-blocks\data-for-ai\question-and-answer\rag\bob-modes\base-modes\data-generator.zip
```
unzip the data-generator.zip 

3. Copy the `.bob` folder to your lab working directory:

```bash
cp -r .bob /path/to/your/lab/directory/
```

For example, if your lab directory is `~/data-for-ai/my-retail-lab`:

```bash
cp -r .bob ~/data-for-ai/my-retail-lab/
```

4. Open your lab directory in Bob IDE:

```bash
cd /path/to/your/lab/directory
code .
```

### Step 7.2: Switch to Product Documentation Generator mode

1. In Bob IDE, open the mode selector (usually in the bottom status bar or command palette)
2. Select **"📦 Product Documentation Generator"** mode
3. Bob will greet you and explain its capabilities

### Step 7.3: Generate product documentation

1. Start a conversation with Bob in the Product Documentation Generator mode:

```text
Hello
```

2. Bob will respond with a greeting and ask for the website URL. Provide your retail application URL:

```text
http://localhost:3000
```

3. Bob will:
   - Launch a browser and navigate to your retail site
   - Scroll through the entire page to capture all products
   - Extract product information (name, price, category, rating, description, etc.)
   - Close the browser
   - Create a `product-data` folder in your workspace
   - Generate detailed markdown documentation for each product

### Step 7.4: Review the generated documentation

After Bob completes the generation, you should have:

- A `product-data` folder in your workspace
- One markdown file per product (e.g., `iphone-15.md`, `lenovo-thinkpad-x1-carbon.md`)
- Each file containing 10 comprehensive sections:
  - Product Information
  - Product Summary
  - Key Features
  - Use Cases
  - Technical Specifications
  - Customer Sentiment
  - Recommendations
  - Frequently Asked Questions
  - Best For
  - Conclusion

### Step 7.5: Verify the generated files

List the generated files:

```bash
ls -la product-data/
```

You should see multiple `.md` files, one for each product from your retail application.

### Step 7.6: Prepare for ingestion

The generated markdown files in the `product-data` folder are now ready to be:
1. Uploaded to IBM Cloud Object Storage (COS)
2. Ingested into Milvus using the RAG Ingestion MCP Server (covered in the next steps)

### What you accomplished

✅ Used Bob's custom mode for specialized data generation  
✅ Extracted product information from a retail website automatically  
✅ Generated professional, comprehensive product documentation  
✅ Created structured markdown files ready for vector database ingestion  
✅ Learned how Bob can automate repetitive documentation tasks

### Tips for using the Product Documentation Generator

- The mode works with any retail or e-commerce website
- You can regenerate documentation anytime by switching to the mode and providing a URL
- The generated documentation follows a consistent template for easy processing
- All files are created in the `product-data` folder to keep your workspace organized

---

## Step 8: Configure the ingestion MCP server in Bob

Once the ingestion MCP server is running, configure it in **Bob**.

Open **Bob** and go to:

**Settings → MCP Servers**

Add the following configuration:

```json
{
  "mcpServers": {
    "rag-ingestion-local-mcp": {
      "command": "uvx",
      "args": [
        "mcp-proxy",
        "--transport",
        "streamablehttp",
        "http://localhost:8080/mcp"
      ],
      "description": "RAG Ingestion MCP Server (Local) - Product Insights",
      "disabled": false,
      "alwaysAllow": [
        "get_server_info",
        "get_server_time",
        "get_hostname",
        "get_ingestion_configuration",
        "ingest_from_cos"
      ],
      "timeout": 3600
    }
  }
}
```

Save the configuration and restart Bob if required.

### Verify Bob connectivity

After configuration:
- open Bob
- confirm `rag-ingestion-local-mcp` appears in the connected servers list
- confirm the status is **Connected**

---

## Step 9: Inspect available tools in Bob

Try one of the following prompts in Bob:

```text
Can you show me the available ingestion tools?
```

```text
Show me the current ingestion configuration.
```

```text
Get the ingestion server information.
```

At this stage, students should understand that Bob is not storing the data itself. Bob is acting as the MCP client and calling the ingestion server tools.

---

## Step 10: Ingest retail content from COS into Milvus

Use Bob and ask it to call the ingestion server.

Example prompt:

```text
Please use the rag-ingestion-local-mcp server to ingest retail product content from IBM Cloud Object Storage into the Milvus collection named product_insights.

Use the configured COS bucket and default settings.
After ingestion, show me:
1. the destination collection name
2. total files seen
3. total files processed
4. total chunks created
```

Expected result:
- files are discovered in COS
- documents are downloaded
- text is chunked
- embeddings are generated using watsonx.ai
- vectors are stored in Milvus

---

## Step 11: Understand what happened

During ingestion, the Building Blocks flow is:

1. list files from COS
2. download and parse supported files
3. split documents into chunks
4. generate embeddings with watsonx.ai
5. write vectors and metadata into Milvus

This is the key learning outcome of the lab: how to combine storage, embeddings, MCP tooling, and vector databases into one usable pipeline.

---

## Step 12: Use the FastAPI retrieval and insights service

Once the data is ingested into Milvus, a separate **FastAPI** service is used to:
- retrieve relevant chunks from Milvus
- combine them with the user query
- generate insights for the retail application

### Important note

The exact startup command, port, and endpoint paths for the FastAPI service will be provided as part of the automation lab.

Use the service details shared during the lab.

### What you should validate

Once the FastAPI service is running, validate the following:
- the service is healthy
- it can query the Milvus collection used during ingestion
- it returns relevant retail context
- it can generate useful retail insights from the retrieved context

### Suggested questions to test in the retail flow

Use the FastAPI service through Swagger UI, curl, Postman, or the lab UI and try prompts such as:

- `What are the key features of this product?`
- `Summarize the warranty and return policy for this item.`
- `What common customer concerns appear in the product documentation?`
- `Compare two similar retail products using the available context.`
- `Generate a short sales insight for a store associate based on the retrieved product information.`

### Expected outcome

You should see that:
- relevant chunks are retrieved from Milvus
- the FastAPI layer uses those chunks as grounding context
- the service returns an insight or answer that is tied to the ingested retail content

---

## Step 13: lab checkpoint

Before moving on, confirm all of the following:
- you have generated product documentation using Bob's Product Documentation Generator mode
- the `product-data` folder contains markdown files for all products
- the lab-provided Milvus instance on watsonx.data is reachable
- the ingestion MCP server is running on port `8080`
- Bob shows `rag-ingestion-local-mcp` as connected
- product documents were ingested from COS into Milvus
- the FastAPI service can retrieve from the same Milvus collection
- the FastAPI service can generate retail insights from the ingested data

---

## Troubleshooting

### Bob cannot connect to the ingestion MCP server

Check:
- the server is still running in the terminal
- the URL is correct: `http://localhost:8080/mcp`
- the Bob configuration was saved correctly
- `uvx` is installed and available in your path

You can test the server directly:

```bash
curl http://localhost:8080/health
curl http://localhost:8080/
```

### Ingestion fails

Check:
- watsonx credentials in `.env`
- COS credentials in `.env`
- Milvus connection details in `.env`
- the COS bucket and optional prefix are correct

### Milvus connection fails

Check:
- `MILVUS_HOST`
- `MILVUS_PORT`
- `MILVUS_USER`
- `MILVUS_PASSWORD`
- `MILVUS_SECURE=true`
- whether the provided watsonx.data Milvus endpoint is reachable from your environment

### COS access fails

Check:
- `COS_ENDPOINT`
- `COS_API_KEY`
- `COS_INSTANCE_CRN`
- `COS_BUCKET`
- whether the target files exist in the bucket

### Embedding generation fails

Check:
- `WATSONX_URL`
- `WATSONX_API_KEY`
- `WATSONX_PROJECT_ID`
- `EMBEDDING_MODEL_ID`

### If your MCP server is not showing up in the BOB UI
- Use the below command to trigger the MCP server manually to start the ingestion process
```
curl -X POST http://localhost:8080/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "ingest_from_cos",
      "arguments": {
        "prefix": "",
        "bucket": "",
        "destination_index": ""
      }
    }
  }'
```

### FastAPI service returns empty or weak insights

Check:
- ingestion completed successfully
- the FastAPI service is using the same Milvus collection name
- the service is pointed to the same Milvus host and port
- the ingested documents actually contain the product information you are querying

---

## Cleanup

Stop the ingestion server with `Ctrl + C`.

No local Milvus cleanup is required in this lab because Milvus is provided through **watsonx.data**.

---

## What students should remember

After this lab, students should be able to explain:
- why unstructured retail data matters
- how content from COS is chunked and embedded
- why Milvus is used as the vector database
- how Bob uses MCP to call the ingestion server
- why retrieval and insight generation can be separated into a FastAPI layer
- how Building Blocks can be combined to create a real retail solution

---

## References

- Building Blocks repository: `ibm-self-serve-assets/building-blocks`
- RAG Ingestion SSE MCP Server asset README
- Milvus documentation
- watsonx.ai documentation
