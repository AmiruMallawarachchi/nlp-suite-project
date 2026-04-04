# 🔖 Introduction

## About the project

The **Multi-Task NLP Intelligence Suite** is a unified neural computing platform designed for developers and AI enthusiasts in the **Software & AI Research** industry. The project aims to centralize five core NLP operations—Summarization, Sentiment Analysis, Zero-Shot Classification, Named Entity Recognition, and Question Answering—into a single, high-performance interface. I built this suite to bridge the gap between complex backend transformer models and a developer-centric user experience. The result is a "DevKit" styled dashboard that allows for rapid inference testing, code-snippet generation, and rich data visualization, significantly reducing the friction of localizing and testing SOTA NLP models.

![DevKit Interface Preview](https://github.com/AmiruMallawarachchi/nlp-suite-project/raw/main/public/preview.png)
*\[Describe the image: 'Main dashboard view showing the terminal-inspired input area and the glowing inference report panel'\]*

---

# 🤔 Problem space

## Problems to solve/Requirements to Create

The current landscape of NLP model testing is often fragmented, requiring developers to switch between disparate tools or write custom scripts for even simple inference checks.

### 👉 Fragmented Inference Workflows
Developers often need to interact with multiple HuggingFace models separately, leading to a disconnected workflow when building multi-task AI pipelines.

**Current solution**
Users typically resort to a mix of Python scripts, Jupyter Notebooks, or the HuggingFace web playground, which lacks a unified interface for custom multi-task testing.

*\[📸 Desktop view of a developer running five different scripts for different NLP tasks\]*

**How do we know it is a problem**
- Excessive context-switching between model playgrounds.
- High barrier to entry for non-technical stakeholders to "see" the model performance.

### 👉 Lack of "Code-First" Visualization
Most NLP playgrounds are designed for general users, missing the technical metadata (like confidence scores, compression ratios, and probability matrices) that developers need for debugging.

**Current solution**
Console logs or raw JSON blobs are the standard way developers inspect model outputs, which are difficult to parse visually for patterns.

*\[📸 Screenshot of raw, unformatted JSON output from a sentiment analysis API\]*

**How do we know it is a problem**
- Developer feedback on the difficulty of visualizing NER entity spans in raw text.
- Speed of debugging is hindered by manual mapping of "LABEL_0" to human-readable sentiment.

---

## Why solve these problems?

Addressing these friction points is critical for accelerating the prototyping phase of AI-driven applications.

- **Speed of Prototyping:** Allows engineers to validate model suitability for specific datasets in seconds.
- **Improved Collaboration:** Provides a visual "Ground Truth" that can be shared with non-developer team members.

---

## Goals

### Company objective 🎯
To establish a leading developer-focused AI toolset that simplifies the integration of Large Language Models (LLMs) and Transformers into production environments.

### Project goals
- **Unified Interface:** Built a single-page application (SPA) that seamlessly switches between 5 complex NLP engines without reloading.
- **DevKit Aesthetic:** Crafted a minimalist, high-contrast UI that mirrors a code editor, making it feel native to a developer’s workflow.
- **Low-Latency Feedback:** Optimized the FastAPI backend to handle multi-task inference with minimal overhead, utilizing GPU acceleration where available.

---

## User Stories

**AI Engineer**
A technical user who needs to quickly verify if `facebook/bart-large-cnn` is suitable for their specific technical documentation datasets.
- **Goals:** Validate summarization quality and compression ratios.
- **Needs:** Access to raw inference metrics and easy cURL export for integration tests.

**Product Manager**
A non-technical user who wants to "feel" the model's performance on customer feedback before approving a feature roadmap.
- **Goals:** See sentiment analysis trends and NER entity extractions.
- **Needs:** A clean, understandable UI that visually highlights entities and positive/negative scores without looking at code.

---

# 🌟 Design space 

## UI Design
The design follows a "Side-by-Side Editor" flow. The left panel serves as the **Terminal/Editor** where users input raw text (mocked as a TypeScript constant), and the right panel serves as the **Inference Report**, mimicking an IDE’s output window.

## High-fidelity design
The interface utilizes a sleek dark mode with neon accents—green for success/summarization, purple for classification, and orange for Q&A. This color coding provides instant categorical recognition.

*\[✍️ Final high-fidelity mockup of the NER engine highlighting person and location entities in a news article\]*

## Design system 🎨
We utilized **Tailwind CSS 4** and **Lucide React** icons to build a custom design system focused on:
- **Consistency:** Uniform border-radius and "glassmorphism" effects across all tool modules.
- **Modularity:** Each NLP tool is a standalone script simulation, making it easy to add new "files" to the sidebar explorer.
- **Responsiveness:** Recently updated to support a mobile sidebar and stacked panel architecture for use on the go.

---

# Development Phase 

## Technology Stack Selection

### **1. Backend - FastAPI & HuggingFace Transformers**
### **Why FastAPI?**
- **Performance:** Highly asynchronous, allowing multiple inference requests to be queued efficiently.
- **Auto-Documentation:** Automatic Swagger/OpenAPI generation for the 5 NLP endpoints.
  
### **Why HuggingFace Transformers?**
- **SOTA Accuracy:** Access to industry-leading models like BART for summarization and RoBERTa for sentiment.
- **Unified Pipeline API:** Allows the backend to switch between different model tasks with a consistent implementation pattern.

### **2. Frontend - Next.js 15 (App Router)**
- **Reusable UI Components:** Used for building modular tool views.
- **TypeScript First:** Ensures type-safety between the complex backend schemas and the frontend state.

---

## High-Level Architecture Diagram
The system uses a **decoupled client-server architecture**. The Next.js frontend communicates with the FastAPI neural engine via structured JSON POST requests. 

*\[Architecture Diagram: UI (Next.js) --> API Gateway (FastAPI) --> Pipeline Controller (Transformers) --> GPU/CPU Inference\]*

## Key Features of the Software

### 1. Adaptive Summarization Engine
**Decision:** Chose `facebook/bart-large-cnn` for its high compression quality but faced a 1024-token limit.
**Implementation:** Developed a **recursive chunking algorithm** that splits long documents into 900-word segments, summarizes them individually, and then re-summarizes the combined fragments to ensure a coherent final output.

### 2. NER Token Visualizer
**Decision:** Standard text output was insufficient for identifying entities.
**Implementation:** Built a custom regex-based **annotation parser** that injects Tailwind-styled components into the text stream, allowing users to "see" entities (PER, ORG, LOC) inline with vivid color coding.

---

# Challenges Faced and Solutions 

### **Problem: 1024 Token Window Constraint**
Most SOTA transformer models (like BART) have a hard input limit of 1024 tokens. When users pasted long articles, the model would fail or truncate the most important data.

### **Solution: Recursive Sliding Window Summarization**
Instead of simple truncation, we implemented a chunking logic:
1. **Split:** Data is split into manageable chunks (approx. 900 words).
2. **Batch Process:** Each chunk is summarized by the neural engine.
3. **Consolidate:** The results are combined and if they still exceed the limit, a second-pass "Meta-Summarization" is triggered to produce the final brief.

---

# Future Vision / next steps

**Long-term vision**
- **V2: Custom Model Uploads:** Allow developers to provide their own HuggingFace model IDs to test on the suite.
- **V3: Batch File Processing:** Enable drag-and-drop for .txt and .pdf files to process massive datasets in one click.
- **UI Enhancement:** Adding interactive "Confidence Tuning" sliders to filter NER and Sentiment results in real-time.
