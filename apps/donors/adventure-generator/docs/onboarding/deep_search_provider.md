#  **Claude (Anthropic)**

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


**Communication:** Claude offers a JSON/REST API (base https://api.anthropic.com/v1) with endpoints like /v1/messages (chat) and /v1/models[\[1\]](https://platform.claude.com/docs/en/api/overview#:~:text=Copy%20page). You authenticate via an API key in the Authorization header. Official SDKs exist (e.g. pip install anthropic) and use the same interface.

**Models & Capabilities:** Claude’s latest family (Claude 4.5) includes *Sonnet 4.5*, *Haiku 4.5*, and *Opus 4.5*. Sonnet is “smart” (strong reasoning and coding), Haiku is the fastest, and Opus is the premium model combining power and speed. All support text and image inputs, and large context windows (up to \~200K tokens by default, with a 1M-token beta window)[\[2\]](https://openai.com/index/gpt-4-1/#:~:text=GPT%E2%80%914,or%20lots%20of%20long%20documents). Sonnet and Opus excel at coding tasks (Claude Sonnet 4.5 is rated top coding model)[\[3\]](https://claude-ai.chat/docs/api/#:~:text=a%20powerful%20coding%20assistant%20API,transformation%20of%20natural%20language%20specifications). Each model can output up to \~64K tokens. All current models are multi-modal (accepting images) and multilingual.

**Limits & Known Issues:** Claude 4.5 models have huge context windows (200K–1M tokens), but that means each request (inputs+output+internal “thinking”) must fit within that. Anthropic applies *“token accounting”* (all parts of the request count). Rate limits (requests per minute and tokens/minute) depend on your plan. In practice, even Claude models can “run out of memory” if prompts are too large. Claude also has a chain-of-thought feature: you can enable or disable its hidden “thinking” traces.

**Integration (Python):** Use Claude’s REST endpoints or the Anthropic SDK. Example in Python:

import anthropic  
 client \= anthropic.Client(api\_key="YOUR\_API\_KEY", anthropic\_version="2024-10-31")  
 response \= client.completions.create(  
 model="claude-sonnet-4-5",  
 messages=\[{"role":"system","content":"You are a helpful assistant."},  
 {"role":"user","content":"Write a Python function to ..."}\]  
 )

The response contains the generated message. Anthropic’s SDK and CLI (e.g. anthropic-cli) handle token counting and streaming. Latency is typical for large models (hundreds of ms to seconds).

## **LM Studio (Local/OSS Models)**

**Communication:** LM Studio is a local LLM hosting platform that provides **OpenAI-compatible REST endpoints** on your machine[\[4\]](https://lmstudio.ai/docs/developer/openai-compat#:~:text=Send%20requests%20to%20Responses%2C%20Chat,Completions%2C%20and%20Embeddings%20endpoints)[\[5\]](https://lmstudio.ai/docs/developer/rest/endpoints#:~:text=). By default it runs a local server (e.g. http://localhost:8080/v1/chat/completions) with the same JSON schema as OpenAI’s API. You can also use its experimental /api/v0/\* endpoints. LM Studio’s Python SDK (pip install lmstudio) wraps these local HTTP calls.

**Models & Capabilities:** LM Studio supports hundreds of open-source models (via llama.cpp, MLX, etc.), including LLaMA-derived models, GPT-OSS, Gemma, Qwen, Mistral, and many distilled/quantized variants. It provides 4-bit or 8-bit quantization to run large models on low-VRAM hardware. For example, **DeepSeek-R1-0528** (8B) runs with as little as 4 GB RAM. LM Studio also supports more complex setups (tool calling, image inputs) via its UI.

**Limits & Known Issues:** Since models run locally, limits depend on hardware. Typical context windows range 8K–32K tokens (some support 64K). Through quantization, LM Studio enables larger models on GPUs/CPUs, but inference can be slow. There are no official “rate limits” beyond your CPU/GPU speed. Quality and multi-modality depend on the chosen model (most local models are text-only, though some image-capable models exist).

**Integration (Python):** After installing LM Studio, you can use its built-in OpenAI-compatible API. For example:

import requests  
 resp \= requests.post("http://localhost:8080/v1/chat/completions",  
 headers={"Authorization": "Bearer \<API\_KEY\>"},  
 json={"model": "gpt-oss-120b",  
 "messages":\[{"role":"user","content":"Explain quicksort."}\]})  
 print(resp.json()\["choices"\]\[0\]\["message"\]\["content"\])

Alternatively use their SDK (import lmstudio). The API also supports /v1/embeddings and /v1/completions. Model downloads (via UI or CLI) and device setup (llama.cpp, MLX for Apple silicon) are documented[\[6\]](https://lmstudio.ai/docs/app#:~:text=Run%20llama,models).

## **OpenAI (ChatGPT/GPT)**

**Communication:** OpenAI offers a RESTful JSON API at https://api.openai.com/v1. Endpoints include /v1/chat/completions for chat (used by GPT-4/5), /v1/completions for legacy models, /v1/embeddings, /v1/images/generations (DALL·E), /v1/audio/transcriptions (Whisper), etc. Authenticate with Authorization: Bearer \<API\_KEY\>. The official openai Python package wraps these (example below).

**Models & Capabilities:** The GPT model family covers general, reasoning, and coding tasks. Current highlights include: \- **GPT-5.2** (Chat model; strong coding model): latest reasoning/coding leader. \- **GPT-4.1/5 (Gemini)**: high reasoning, multimodal (vision) models with up to \~1M token context[\[2\]](https://openai.com/index/gpt-4-1/#:~:text=GPT%E2%80%914,or%20lots%20of%20long%20documents). \- **GPT-4o** (“Vision”): handles image inputs, can output multi-modal content. \- **GPT-4 Turbo**: faster, optimized GPT-4 variant. \- **GPT-3.5-Turbo**: widely used, 4k/16k context variants. \- **Codex/Code models** (e.g. code-davinci): specialized for code generation (some merged into the chat models now). All support multi-turn chat, function calling (OpenAI Functions), and structured output. GPT-4+ models have context windows from 8K up to 1,000,000 tokens[\[2\]](https://openai.com/index/gpt-4-1/#:~:text=GPT%E2%80%914,or%20lots%20of%20long%20documents).

**Limits & Known Issues:** Standard GPT-4 has up to 32K context (older limit) or more in new versions, GPT-5.2 and Gemini offer \~1M[\[2\]](https://openai.com/index/gpt-4-1/#:~:text=GPT%E2%80%914,or%20lots%20of%20long%20documents). Prompt+output must fit this. GPT models are closed-source; knowledge cutoff (2021 for GPT-3, \~2024 for newer). They cannot “see” past user provided info except via function calls/plugins (or ChatGPT browsing). Known issues include occasional hallucination and safety filtering. Rate limits and pricing tiers vary by model (higher models have stricter quotas).

**Integration (Python):** Use the OpenAI SDK:

import openai  
 openai.api\_key \= "YOUR\_KEY"  
 response \= openai.ChatCompletion.create(  
 model="gpt-4o-mini",  
 messages=\[{"role":"system","content":"You are a coding assistant."},  
 {"role":"user","content":"Write a Python function to sort a list."}\],  
 temperature=0.2  
 )  
 print(response\["choices"\]\[0\]\["message"\]\["content"\])

The SDK also supports streaming, function calls, file uploads, etc. Latency is generally low (hundreds of ms for small prompts, more for large context).

## **Grok (xAI)**

**Communication:** xAI’s *Grok* API is fully OpenAI-compatible. The base URL is https://api.x.ai/v1/…. For chat, use /v1/chat/completions (or the newer /v1/responses for stateful chats) with Authorization: Bearer \<XAI\_API\_KEY\>[\[7\]](https://docs.x.ai/llms.txt#:~:text=,response%5C_id%7D.%20%60%60%60%20Method%3A%20DELETE%20Path). You can also use xAI’s Python SDK (pip install xai\_sdk) shown in examples[\[8\]](https://docs.x.ai/docs/guides/chat#:~:text=Python%20Javascript). The schema is very similar to OpenAI’s, with added Grok-specific options.

**Models & Capabilities:** xAI provides the **Grok model family**. Recent models include: \- **grok-4** (the flagship): a 256K-token context, reasoning model. Variants: grok-4-fast (cheaper/faster), grok-4-1-fast, grok-4-1 (newest with improved reasoning), and grok-4-1-fast (preview, 2M context window\!).  
 \- **grok-code-fast-1**: specialized coding model (256K context, tuned for developer/agent tasks)[\[9\]](https://x.ai/api#:~:text=grok).  
 \- **grok-2-image-1212**: image generation model.  
 All Grok 4 variants can call tools (web search, code execution, knowledge search, etc.), output chain-of-thought (“thinking”) or hidden reasoning, and process images (vision tasks). Grok 4’s context is 256K tokens[\[10\]](https://www.datastudios.org/post/grok-context-window-token-limits-memory-policy-and-2025-rules#:~:text=Grok%204%20has%20a%20256%2C000,window%2C%20confirmed%20via%20API%20specs); the newer “-1” variants even support *2M* tokens[\[11\]](https://x.ai/api#:~:text=Context%20window).

**Limits & Known Issues:** A 256K-token hard limit (per request) applies to Grok-4; if exceeded, early content is truncated[\[10\]](https://www.datastudios.org/post/grok-context-window-token-limits-memory-policy-and-2025-rules#:~:text=Grok%204%20has%20a%20256%2C000,window%2C%20confirmed%20via%20API%20specs). Grok’s rate limits are high (e.g. 2 million tokens/minute, \~480 reqs/min)[\[12\]](https://www.datastudios.org/post/grok-context-window-token-limits-memory-policy-and-2025-rules#:~:text=Each%20model%20also%20enforces%20rate,especially%20relevant%20in%20batch%20workloads). Grok does not have real-time knowledge unless you use its Live Search tools (which inject content into the prompt, consuming tokens). Like other LLMs, it can hallucinate and is limited to its training cut-off (Nov 2024 for Grok 4).

**Integration (Python):** Example using xai\_sdk:

from xai\_sdk import Client  
 from xai\_sdk.chat import user, system  
 client \= Client(api\_key="XAI\_KEY")  
 chat \= client.chat.create(model="grok-4")  
 chat.append(system("You are Grok, a helpful assistant."))  
 chat.append(user("Explain the quicksort algorithm in Python."))  
 response \= chat.sample() \# synchronous call  
 print(response.choices\[0\].message.content)

Grok also supports streaming (use stream=True) and tool-use APIs (e.g. web search, file search) via special request flags.

## **Gemini (Google)**

**Communication:** Google’s **Gemini** models are accessed through Google Cloud’s GenAI/Vertex AI API. Requests go to endpoints like https://gemini.googleapis.com/v1/… or via the Vertex AI client. Authentication is via Google OAuth or service account. Google also provides gRPC and REST interfaces in the *Gemini API*.

**Models & Capabilities:** The Gemini family includes multi-modal, high-capacity models. For coding and agentic tasks, **Gemini 3 Pro** (Preview) is the flagship: it accepts text, images, video, audio, and PDFs as input[\[13\]](https://ai.google.dev/gemini-api/docs/models#:~:text=Inputs) and outputs text. It has an enormous context (up to *1,048,576* tokens[\[14\]](https://ai.google.dev/gemini-api/docs/models#:~:text=Input%20token%20limit)) and supports code execution, file search, function calling, structured outputs, and reasoning[\[15\]](https://ai.google.dev/gemini-api/docs/models#:~:text=Audio%20generation)[\[16\]](https://ai.google.dev/gemini-api/docs/models#:~:text=Code%20execution). There are also specialized variants: *Gemini 3 Pro Image* (image+text in/out), *Gemini 3 Ultra*, *Gemini 2* series, etc. Newer models boast real-time multimodal (e.g. video, audio) via Google’s “Live API” (currently in beta). Gemini’s coding ability is very strong (billions of parameters, trained for coding); it’s described as *“vibe-coding”* with rich reasoning[\[17\]](https://ai.google.dev/gemini-api/docs/models#:~:text=Gemini%203%20Pro).

**Limits & Known Issues:** Gemini’s limits are set by context windows above (\~1M tokens in preview). Rate limits and usage quotas follow Google’s Cloud policies. Latency can be higher due to the model size. Access requires Google Cloud (and may involve cost/quotas on Vertex AI). As a closed model, knowledge is limited to its training cut-off (Jan 2025 for Gemini 3 preview[\[18\]](https://ai.google.dev/gemini-api/docs/models#:~:text=123%20Versions%20Read%20the%20model,version%20patterns%20for%20more%20details)).

**Integration (Python):** Use Google’s GenAI SDK or Vertex AI SDK. Example (pseudo-code):

from google.cloud import aiplatform  
 client \= aiplatform.GaClient()  
 response \= client.chat\_completions.create(  
 model="gemini-3-pro-preview",  
 temperature=0.2,  
 messages=\[{"author":"system","content":"You are a coding assistant."},  
 {"author":"user","content":"Write a sorting function in JavaScript."}\]  
 )  
 print(response.messages\[-1\].content)

Alternatively, one can use google-gax or REST (sending JSON with OAuth token). Google’s docs provide quickstarts and gRPC examples.

## **Z.ai (Zhipu GLM)**

**Communication:** Z.ai (Zhipu) provides a REST API at https://api.z.ai/api/paas/v4. It mimics the OpenAI chat API: send POST to /chat/completions with JSON (see example below) and Authorization: Bearer \<ZAI\_KEY\>[\[19\]](https://docs.z.ai/guides/llm/glm-4.7#:~:text=curl%20,expert%2C%20please%20create%20an%20attractive). Official SDKs exist (pip install zai-sdk for Python[\[20\]](https://docs.z.ai/guides/llm/glm-4.7#:~:text=Copy)). The API is “OpenAI-compatible” with some Zhipu extensions (e.g. thinking mode).

**Models & Capabilities:** Key models are the GLM-4 series. For coding: \- **GLM-4.7** (free, 200K context) – latest flagship (enhanced coding, reasoning, agentic capabilities)[\[21\]](https://docs.z.ai/guides/llm/glm-4.7#:~:text=Context%20Length)[\[22\]](https://docs.z.ai/guides/llm/glm-4.7#:~:text=from%20zai%20import%20ZaiClient).  
 \- **GLM-4.7-Flash** – a smaller variant optimized for speed.  
 \- **GLM-4.6** (200K context) – strong reasoning and coding (top Chinese model)[\[23\]](https://docs.z.ai/guides/llm/glm-4.6#:~:text=Input%20Modalities).  
 \- **GLM-4.6V** – vision model (text+image).  
 \- **GLM-4.5** – earlier model (128K context).  
 These models support streaming, function calls, and structured JSON output. All GLM-4.x have a **200,000-token** window and 128K output[\[21\]](https://docs.z.ai/guides/llm/glm-4.7#:~:text=Context%20Length)[\[24\]](https://docs.z.ai/guides/llm/glm-4.6#:~:text=Context%20Length). Zhipu emphasizes coding: GLM-4.7 “ranks first” in open benchmarks, matching Claude Sonnet 4.5.

**Limits & Known Issues:** GLM-4.x are closed models but multilingual. They may occasionally switch language if prompts are ambiguous (the docs note using explicit language tags to avoid this[\[25\]](https://inference-docs.cerebras.ai/resources/glm-47-migration#:~:text=Migrate%20to%20GLM%204.7%20,Add%20a)). Context is capped at 200K tokens. Because the API is free (for the open models), there may be usage throttles or authentication limits. A “thinking” chain-of-thought trace is available when thinking:{"type":"enabled"}[\[20\]](https://docs.z.ai/guides/llm/glm-4.7#:~:text=Copy). No built-in knowledge of events past cutoff (2024).

**Integration (Python):** Use the zai-sdk:

import zai  
 client \= zai.ZaiClient(api\_key="YOUR\_KEY")  
 resp \= client.chat.completions.create(  
 model="glm-4.7",  
 messages=\[{"role":"user","content":"Create a REST API in Python using Flask."}\],  
 thinking={"type":"enabled"},  
 max\_tokens=4096  
 )  
 print(resp.choices\[0\].message.content)

Or use curl as shown by Zhipu[\[19\]](https://docs.z.ai/guides/llm/glm-4.7#:~:text=curl%20,expert%2C%20please%20create%20an%20attractive). The SDK also supports streaming (iterating over the response object)[\[26\]](https://docs.z.ai/guides/llm/glm-4.7#:~:text=).

## **Perplexity**

**Communication:** Perplexity provides an LLM+search API with OpenAI-like JSON endpoints. The chat completion endpoint is /v1/chat/completions at api.perplexity.ai (OAuth Bearer). Its API and SDKs support the OpenAI Chat schema[\[27\]](https://docs.perplexity.ai/api-reference/chat-completions-post#:~:text=The%20name%20of%20the%20model,pro%20%28premier%20reasoning).

**Models & Capabilities:** The Perplexity API exposes the **Sonar model family**[\[28\]](https://www.datastudios.org/post/perplexity-ai-available-models-all-supported-models-version-differences-capabilities-comparison#:~:text=The%20developer,research): \- **sonar** – fast search/summarization (128K context)[\[29\]](https://www.datastudios.org/post/perplexity-ai-available-models-all-supported-models-version-differences-capabilities-comparison#:~:text=The%20API%20context%20lengths%20are,from%20customer%20data%20for%20privacy). \- **sonar-pro** – deeper retrieval (200K context, uses more search results). \- **sonar-reasoning-pro** – chain-of-thought reasoning (128K). \- **sonar-deep-research** – exhaustive research (128K, optimizes thoroughness).  
 Each is tailored: *sonar* for quick Q\&A, *sonar-pro* for complex queries, *reasoning* for logic, *deep-research* for long form. The API lets you pick model and search mode; it integrates web and academic search into the prompt (options like search\_mode, domain filters, etc.)[\[30\]](https://docs.perplexity.ai/api-reference/chat-completions-post#:~:text=search_mode)[\[31\]](https://docs.perplexity.ai/api-reference/chat-completions-post#:~:text=enum).

**Limits & Known Issues:** Sonar models have context up to 200K tokens (for sonar-pro; others 128K)[\[29\]](https://www.datastudios.org/post/perplexity-ai-available-models-all-supported-models-version-differences-capabilities-comparison#:~:text=The%20API%20context%20lengths%20are,from%20customer%20data%20for%20privacy). Perplexity’s strength is up-to-date search grounding, but the context includes retrieved snippets (so prompt size can grow). It is not a pure generative model; it relies on real-time web/docs search. The depth (number of search results) may be limited, and it may be slower (calls web APIs). Knowledge is always current via search, so no fixed cutoff.

**Integration (Python):** Perplexity offers SDKs and a REST API. Example using their Python client (perplexity-py or perplexityai):

from perplexity\_client import Client  
 client \= Client(api\_key="YOUR\_KEY")  
 resp \= client.chat.completions.create(  
 model="sonar-deep-research",  
 messages=\[{"role":"user","content":"Explain quantum entanglement."}\],  
 search\_mode="web",  
 reasoning\_effort="high"  
 )  
 print(resp.choices\[0\].message.content)

Or call with requests similarly. The API also supports streaming and additional params like return\_images, date filters, etc.[\[32\]](https://docs.perplexity.ai/api-reference/chat-completions-post#:~:text=,%7D)[\[33\]](https://docs.perplexity.ai/api-reference/chat-completions-post#:~:text=default%3A0).

## **OpenRouter (Multi-Provider Gateway)**

**Communication:** OpenRouter is a unified API gateway to 400+ models (OpenAI, Anthropic, HuggingFace, etc.)[\[34\]](https://openrouter.ai/docs/guides/overview/models#:~:text=One%20API%20for%20hundreds%20of,models). You make one request to OpenRouter’s endpoint (e.g. /api/v1/chat/completions) and specify the model ID (with provider prefix, e.g. openai/gpt-4o). Requests use OpenAI-compatible JSON and Bearer auth. It supports most OpenAI chat params plus OpenRouter extensions (like specifying fallback models, providers, transformations)[\[35\]](https://openrouter.ai/docs/api/reference/overview#:~:text=OpenRouter%E2%80%99s%20request%20and%20response%20schemas,only%20need%20to%20learn%20one)[\[36\]](https://openrouter.ai/docs/api/reference/overview#:~:text=1%2F%2F%20Definitions%20of%20subtypes%20are,to%20produce%20specific%20output%20format).

**Models & Capabilities:** OpenRouter does not create models but exposes many: e.g. you can call Claude, GPT, local LLaMA, etc., all via one API. It provides a Models API listing metadata (context length, supported inputs, pricing)[\[37\]](https://openrouter.ai/docs/guides/overview/models#:~:text=)[\[38\]](https://openrouter.ai/docs/guides/overview/models#:~:text=Field%20Type%20Description%20,context%20window%20size%20in%20tokens). It normalizes parameters across providers (function calls, streaming, JSON schema, etc.). Any model accessible through it will have its original capabilities (e.g. LLaMA for local use, Claude for coding, GPT-4 for reasoning).

**Limits & Known Issues:** Limits/latency depend on the chosen model and endpoint. OpenRouter itself adds a slight routing overhead but caches metadata and can select the fastest provider. It can manage fallbacks if one provider is down. The caveat is that you are bound by the policies of each underlying model (e.g. using a private OpenAI key under the hood).

**Integration (Python):** Use OpenRouter’s Python SDK (pip install openrouter) or their REST API. Example with REST:

import openai  
 openai.api\_key \= "YOUR\_OPENROUTER\_KEY"  
 openai.api\_base \= "https://api.openrouter.ai/"  
 resp \= openai.ChatCompletion.create(  
 model="anthropic/claude-sonnet-4-5", \# or any supported model  
 messages=\[{"role":"user","content":"Generate test data in JSON."}\]  
 )  
 print(resp.choices\[0\].message.content)

OpenRouter’s SDK and docs guide you through provider/model selection and advanced features (like tool-calling transformations)[\[36\]](https://openrouter.ai/docs/api/reference/overview#:~:text=1%2F%2F%20Definitions%20of%20subtypes%20are,to%20produce%20specific%20output%20format)[\[39\]](https://openrouter.ai/docs/api/reference/overview#:~:text=45%20%20%2F%2F%20OpenRouter,section). Latency will vary (some providers in OpenRouter have high throughput).

**Summary:** Each provider offers a RESTful API and Python integration. Claude, OpenAI, Grok, Gemini, Z.ai and Perplexity all follow the OpenAI-like chat schema (mostly JSON/HTTP, Bearer token). LM Studio provides an OpenAI-compatible local endpoint. OpenRouter wraps many providers under one API. Models vary by family, but key coding-specialized ones include Anthropic’s Sonnet, OpenAI’s GPT-4.1/5.2 (codex), xAI’s Grok code model, Z.ai’s GLM-4.x, and Perplexity’s Sonar. All support chat-completions, many support function/tool calling. Context limits range from 8K–256K (and up to 1M in some cases)[\[2\]](https://openai.com/index/gpt-4-1/#:~:text=GPT%E2%80%914,or%20lots%20of%20long%20documents)[\[10\]](https://www.datastudios.org/post/grok-context-window-token-limits-memory-policy-and-2025-rules#:~:text=Grok%204%20has%20a%20256%2C000,window%2C%20confirmed%20via%20API%20specs)[\[14\]](https://ai.google.dev/gemini-api/docs/models#:~:text=Input%20token%20limit). Multi-modal input (images, etc.) is supported by most (Claude, OpenAI’s GPT-4, Grok, Gemini 3, Z.ai’s V-models). For Python development, each provider offers an SDK or HTTP endpoint; for example Anthropic’s anthropic client, OpenAI’s openai client, Grok’s xai\_sdk, Z.ai’s zai-sdk, Perplexity’s perplexity (or perplexity-py), and OpenRouter’s openrouter package.

**Sources:** Official documentation and developer guides for each platform[\[1\]](https://platform.claude.com/docs/en/api/overview#:~:text=Copy%20page)[\[2\]](https://openai.com/index/gpt-4-1/#:~:text=GPT%E2%80%914,or%20lots%20of%20long%20documents)[\[10\]](https://www.datastudios.org/post/grok-context-window-token-limits-memory-policy-and-2025-rules#:~:text=Grok%204%20has%20a%20256%2C000,window%2C%20confirmed%20via%20API%20specs)[\[21\]](https://docs.z.ai/guides/llm/glm-4.7#:~:text=Context%20Length)[\[24\]](https://docs.z.ai/guides/llm/glm-4.6#:~:text=Context%20Length)[\[28\]](https://www.datastudios.org/post/perplexity-ai-available-models-all-supported-models-version-differences-capabilities-comparison#:~:text=The%20developer,research)[\[35\]](https://openrouter.ai/docs/api/reference/overview#:~:text=OpenRouter%E2%80%99s%20request%20and%20response%20schemas,only%20need%20to%20learn%20one) (see citations).

[\[1\]](https://platform.claude.com/docs/en/api/overview#:~:text=Copy%20page) API Overview \- Claude Docs

[https://platform.claude.com/docs/en/api/overview](https://platform.claude.com/docs/en/api/overview)

[\[2\]](https://openai.com/index/gpt-4-1/#:~:text=GPT%E2%80%914,or%20lots%20of%20long%20documents) Introducing GPT-4.1 in the API | OpenAI

[https://openai.com/index/gpt-4-1/](https://openai.com/index/gpt-4-1/)

[\[3\]](https://claude-ai.chat/docs/api/#:~:text=a%20powerful%20coding%20assistant%20API,transformation%20of%20natural%20language%20specifications) Claude AI API \- Claude AI

[https://claude-ai.chat/docs/api/](https://claude-ai.chat/docs/api/)

[\[4\]](https://lmstudio.ai/docs/developer/openai-compat#:~:text=Send%20requests%20to%20Responses%2C%20Chat,Completions%2C%20and%20Embeddings%20endpoints) OpenAI Compatibility Endpoints | LM Studio Docs

[https://lmstudio.ai/docs/developer/openai-compat](https://lmstudio.ai/docs/developer/openai-compat)

[\[5\]](https://lmstudio.ai/docs/developer/rest/endpoints#:~:text=) REST API v0 | LM Studio Docs

[https://lmstudio.ai/docs/developer/rest/endpoints](https://lmstudio.ai/docs/developer/rest/endpoints)

[\[6\]](https://lmstudio.ai/docs/app#:~:text=Run%20llama,models) Welcome to LM Studio Docs\! | LM Studio Docs

[https://lmstudio.ai/docs/app](https://lmstudio.ai/docs/app)

[\[7\]](https://docs.x.ai/llms.txt#:~:text=,response%5C_id%7D.%20%60%60%60%20Method%3A%20DELETE%20Path) docs.x.ai

[https://docs.x.ai/llms.txt](https://docs.x.ai/llms.txt)

[\[8\]](https://docs.x.ai/docs/guides/chat#:~:text=Python%20Javascript) Responses API | xAI

[https://docs.x.ai/docs/guides/chat](https://docs.x.ai/docs/guides/chat)

[\[9\]](https://x.ai/api#:~:text=grok) [\[11\]](https://x.ai/api#:~:text=Context%20window) API | xAI

[https://x.ai/api](https://x.ai/api)

[\[10\]](https://www.datastudios.org/post/grok-context-window-token-limits-memory-policy-and-2025-rules#:~:text=Grok%204%20has%20a%20256%2C000,window%2C%20confirmed%20via%20API%20specs) [\[12\]](https://www.datastudios.org/post/grok-context-window-token-limits-memory-policy-and-2025-rules#:~:text=Each%20model%20also%20enforces%20rate,especially%20relevant%20in%20batch%20workloads) Grok context window: token limits, memory policy, and 2025 rules

[https://www.datastudios.org/post/grok-context-window-token-limits-memory-policy-and-2025-rules](https://www.datastudios.org/post/grok-context-window-token-limits-memory-policy-and-2025-rules)

[\[13\]](https://ai.google.dev/gemini-api/docs/models#:~:text=Inputs) [\[14\]](https://ai.google.dev/gemini-api/docs/models#:~:text=Input%20token%20limit) [\[15\]](https://ai.google.dev/gemini-api/docs/models#:~:text=Audio%20generation) [\[16\]](https://ai.google.dev/gemini-api/docs/models#:~:text=Code%20execution) [\[17\]](https://ai.google.dev/gemini-api/docs/models#:~:text=Gemini%203%20Pro) [\[18\]](https://ai.google.dev/gemini-api/docs/models#:~:text=123%20Versions%20Read%20the%20model,version%20patterns%20for%20more%20details) Gemini models  |  Gemini API  |  Google AI for Developers

[https://ai.google.dev/gemini-api/docs/models](https://ai.google.dev/gemini-api/docs/models)

[\[19\]](https://docs.z.ai/guides/llm/glm-4.7#:~:text=curl%20,expert%2C%20please%20create%20an%20attractive) [\[20\]](https://docs.z.ai/guides/llm/glm-4.7#:~:text=Copy) [\[21\]](https://docs.z.ai/guides/llm/glm-4.7#:~:text=Context%20Length) [\[22\]](https://docs.z.ai/guides/llm/glm-4.7#:~:text=from%20zai%20import%20ZaiClient) [\[26\]](https://docs.z.ai/guides/llm/glm-4.7#:~:text=) GLM-4.7 \- Overview \- Z.AI DEVELOPER DOCUMENT

[https://docs.z.ai/guides/llm/glm-4.7](https://docs.z.ai/guides/llm/glm-4.7)

[\[23\]](https://docs.z.ai/guides/llm/glm-4.6#:~:text=Input%20Modalities) [\[24\]](https://docs.z.ai/guides/llm/glm-4.6#:~:text=Context%20Length) GLM-4.6 \- Overview \- Z.AI DEVELOPER DOCUMENT

[https://docs.z.ai/guides/llm/glm-4.6](https://docs.z.ai/guides/llm/glm-4.6)

[\[25\]](https://inference-docs.cerebras.ai/resources/glm-47-migration#:~:text=Migrate%20to%20GLM%204.7%20,Add%20a) Migrate to GLM 4.7 \- Cerebras Inference

[https://inference-docs.cerebras.ai/resources/glm-47-migration](https://inference-docs.cerebras.ai/resources/glm-47-migration)

[\[27\]](https://docs.perplexity.ai/api-reference/chat-completions-post#:~:text=The%20name%20of%20the%20model,pro%20%28premier%20reasoning) [\[30\]](https://docs.perplexity.ai/api-reference/chat-completions-post#:~:text=search_mode) [\[31\]](https://docs.perplexity.ai/api-reference/chat-completions-post#:~:text=enum) [\[32\]](https://docs.perplexity.ai/api-reference/chat-completions-post#:~:text=,%7D) [\[33\]](https://docs.perplexity.ai/api-reference/chat-completions-post#:~:text=default%3A0) Chat Completions \- Perplexity

[https://docs.perplexity.ai/api-reference/chat-completions-post](https://docs.perplexity.ai/api-reference/chat-completions-post)

[\[28\]](https://www.datastudios.org/post/perplexity-ai-available-models-all-supported-models-version-differences-capabilities-comparison#:~:text=The%20developer,research) [\[29\]](https://www.datastudios.org/post/perplexity-ai-available-models-all-supported-models-version-differences-capabilities-comparison#:~:text=The%20API%20context%20lengths%20are,from%20customer%20data%20for%20privacy) Perplexity AI Available Models: All Supported Models, Version Differences, Capabilities Comparison, And Access Requirements

[https://www.datastudios.org/post/perplexity-ai-available-models-all-supported-models-version-differences-capabilities-comparison](https://www.datastudios.org/post/perplexity-ai-available-models-all-supported-models-version-differences-capabilities-comparison)

[\[34\]](https://openrouter.ai/docs/guides/overview/models#:~:text=One%20API%20for%20hundreds%20of,models) [\[37\]](https://openrouter.ai/docs/guides/overview/models#:~:text=) [\[38\]](https://openrouter.ai/docs/guides/overview/models#:~:text=Field%20Type%20Description%20,context%20window%20size%20in%20tokens) OpenRouter Models | Access 400+ AI Models Through One API | OpenRouter | Documentation

[https://openrouter.ai/docs/guides/overview/models](https://openrouter.ai/docs/guides/overview/models)

[\[35\]](https://openrouter.ai/docs/api/reference/overview#:~:text=OpenRouter%E2%80%99s%20request%20and%20response%20schemas,only%20need%20to%20learn%20one) [\[36\]](https://openrouter.ai/docs/api/reference/overview#:~:text=1%2F%2F%20Definitions%20of%20subtypes%20are,to%20produce%20specific%20output%20format) [\[39\]](https://openrouter.ai/docs/api/reference/overview#:~:text=45%20%20%2F%2F%20OpenRouter,section) OpenRouter API Reference | Complete API Documentation | OpenRouter | Documentation

[https://openrouter.ai/docs/api/reference/overview](https://openrouter.ai/docs/api/reference/overview)