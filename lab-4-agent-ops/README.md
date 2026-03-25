# Build-Time Evaluation of WXO Agents

Evaluate, analyze, and security-test watsonx Orchestrate agents using the WXO ADK's build-time evaluation capabilities.

| | |
|---|---|
| **Duration** | ~2 hours (in-lab) + take-home exercises |
| **ADK Version** | 2.5.1+ |

## 🚀 Getting Started

**Step 1.** Set up your environment: [PREREQS-AgentOps-Trust-Lab.md](PREREQS-AgentOps-Trust-Lab.md)


**Step 2.** Start the lab: [WXO_BUILD_TIME_EVALUATION_LAB.md](WXO_BUILD_TIME_EVALUATION_LAB.md)

---

## What You Will Learn

Validate an agent **before deploying it** using LLM-simulated users, automated metrics, and adversarial security testing. You will work with a pre-built Tax Document Assistant that manages tax documents for Individual, Small Business, and Corporate clients.

| Phase | Exercise | Question Answered |
|-------|----------|-------------------|
| Understand | 1 - Agent Evaluation Fundamentals | What does the agent do? What do benchmarks look like? |
| Measure | 2 - Evaluate | Does the agent pass or fail? |
| Diagnose | 3 - Analyze | Why did it fail? |
| Validate | 4 - Quick-Eval | Are the tool calls structurally valid? |
| Scale | 5 - Generate | How do I create benchmarks faster? |
| Secure | 6 - Red-Teaming | Can the agent be tricked? |
| Observe | 7 - Langfuse | What does it cost? Where is it slow? |
| Apply | 8 - Strategy Design | How do I put this into practice? |

---

## Lab Structure

| Exercise | Topic | Time | Session |
|----------|-------|------|---------|
| 1 | [Agent Evaluation Fundamentals](WXO_BUILD_TIME_EVALUATION_LAB.md#exercise-1-agent-evaluation-fundamentals-15-min) | 15 min | In-Lab |
| 2 | [Evaluate](WXO_BUILD_TIME_EVALUATION_LAB.md#exercise-2-run-your-first-evaluation-25-min) | 25 min | In-Lab |
| 3 | [Analyze](WXO_BUILD_TIME_EVALUATION_LAB.md#exercise-3-analyze-results-20-min) | 20 min | In-Lab |
| 4 | [Quick-Eval](WXO_BUILD_TIME_EVALUATION_LAB.md#exercise-4-quick-eval--referenceless-validation-20-min) | 20 min | In-Lab |
| 5 | [Generate Benchmarks](WXO_BUILD_TIME_EVALUATION_LAB.md#exercise-5-generate-benchmarks-from-user-stories-25-min--take-home) | 25 min | Take-Home |
| 6 | [Red-Teaming](WXO_BUILD_TIME_EVALUATION_LAB.md#exercise-6-red-teaming--security-testing-25-min--take-home) | 25 min | Take-Home |
| 7 | [Langfuse](WXO_BUILD_TIME_EVALUATION_LAB.md#exercise-7-langfuse-integration--cost-latency-and-trace-visibility-25-min) | 25 min | In-Lab |
| 8 | [Putting It Together](WXO_BUILD_TIME_EVALUATION_LAB.md#exercise-8-putting-it-all-together-15-min) | 15 min | In-Lab |

---

## Lab Assets

```
lab-4-agent-ops/
├── PREREQS-AgentOps-Trust-Lab.md              # Prerequisites and setup instructions
├── WXO_BUILD_TIME_EVALUATION_LAB.md           # Hands-on lab exercises
└── assets/
    ├── tax-document-assistant-agent/          # The agent under test
    │   ├── agent_config.yaml                  # Agent configuration (LLM, tools, KB)
    │   ├── tools/                             # client_tools.py, communication_tools.py
    │   ├── knowledge_bases/                   # KB YAML + source documents
    │   └── data/                              # CSV/TXT data files
    ├── tax_assistant_benchmarks/              # 8 pre-written benchmark scenarios
    └── stories_sample.csv                     # Sample stories for Exercise 5
```

---

## Metrics Cheat Sheet

**Agent Metrics**

| Metric | Target | What 1.0 Means |
|--------|--------|----------------|
| Journey Success | 1.0 | All goals completed |
| Journey Completion % | 100% | Fraction of goals met |
| Tool Call Precision | >= 0.5 | Every tool call was correct |
| Tool Call Recall | >= 0.9 | Every expected tool was called |
| Agent Routing F1 | >= 0.9 | Perfect tool routing |
| Text Match | 1.0 | Agent response contains all expected keywords |
| Avg Resp Time | Varies | Average response latency |

**RAG / Knowledge Base Metrics**

| Metric | Target | What 1.0 Means |
|--------|--------|----------------|
| Faithfulness | >= 0.8 | Answer fully grounded in docs |
| Answer Relevancy | >= 0.7 | Answer fully addresses question |
| Response Confidence | > 0.5 | LLM is confident in its response |
| Retrieval Confidence | > 0.5 | Retrieved docs are relevant to the query |
