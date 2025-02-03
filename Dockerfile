ARG BASE=node:20.18.0
FROM ${BASE} AS base

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Install dependencies (this step is cached as long as the dependencies don't change)
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# Copy the rest of your app's source code
COPY . .

# Expose the port the app runs on
EXPOSE 5175

# Production image
FROM base AS bolt-ai-production

# Define environment variables with default values or let them be overridden
ARG GROQ_API_KEY
ARG HuggingFace_API_KEY
ARG OPENAI_API_KEY
ARG ANTHROPIC_API_KEY
ARG OPEN_ROUTER_API_KEY
ARG GOOGLE_GENERATIVE_AI_API_KEY
ARG OLLAMA_API_BASE_URL
ARG XAI_API_KEY
ARG TOGETHER_API_KEY
ARG TOGETHER_API_BASE_URL
ARG AWS_BEDROCK_CONFIG
ARG VITE_LOG_LEVEL=debug
ARG DEFAULT_NUM_CTX

ENV WRANGLER_SEND_METRICS=false \
    GROQ_API_KEY=${GROQ_API_KEY} \
    HuggingFace_KEY=${HuggingFace_API_KEY} \
    OPENAI_API_KEY=${OPENAI_API_KEY} \
    ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY} \
    OPEN_ROUTER_API_KEY=${OPEN_ROUTER_API_KEY} \
    GOOGLE_GENERATIVE_AI_API_KEY=${GOOGLE_GENERATIVE_AI_API_KEY} \
    OLLAMA_API_BASE_URL=${OLLAMA_API_BASE_URL} \
    XAI_API_KEY=${XAI_API_KEY} \
    TOGETHER_API_KEY=${TOGETHER_API_KEY} \
    TOGETHER_API_BASE_URL=${TOGETHER_API_BASE_URL} \
    AWS_BEDROCK_CONFIG=${AWS_BEDROCK_CONFIG} \
    VITE_LOG_LEVEL=${VITE_LOG_LEVEL} \
    DEFAULT_NUM_CTX=${DEFAULT_NUM_CTX}\
    RUNNING_IN_DOCKER=true

# Pre-configure wrangler to disable metrics
RUN mkdir -p /root/.config/.wrangler && \
    echo '{"enabled":false}' > /root/.config/.wrangler/metrics.json

RUN pnpm run build

CMD [ "pnpm", "run", "dockerstart"]

# Development image
FROM base AS bolt-ai-development

# Define environment variables with default values or let them be overridden
ARG GROQ_API_KEY
ARG HuggingFace_API_KEY
ARG OPENAI_API_KEY
ARG ANTHROPIC_API_KEY
ARG OPEN_ROUTER_API_KEY
ARG GOOGLE_GENERATIVE_AI_API_KEY
ARG OLLAMA_API_BASE_URL
ARG XAI_API_KEY
ARG TOGETHER_API_KEY
ARG TOGETHER_API_BASE_URL
ARG AWS_BEDROCK_CONFIG
ARG VITE_LOG_LEVEL=debug
ARG DEFAULT_NUM_CTX

ENV GROQ_API_KEY=${GROQ_API_KEY}
ENV HuggingFace_API_KEY=${HuggingFace_API_KEY}
ENV OPENAI_API_KEY=${OPENAI_API_KEY}
ENV ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
ENV OPEN_ROUTER_API_KEY=${OPEN_ROUTER_API_KEY}
ENV GOOGLE_GENERATIVE_AI_API_KEY=${GOOGLE_GENERATIVE_AI_API_KEY}
ENV OLLAMA_API_BASE_URL=${OLLAMA_API_BASE_URL}
ENV XAI_API_KEY=${XAI_API_KEY}
ENV TOGETHER_API_KEY=${TOGETHER_API_KEY}
ENV TOGETHER_API_BASE_URL=${TOGETHER_API_BASE_URL}
ENV AWS_BEDROCK_CONFIG=${AWS_BEDROCK_CONFIG}
ENV VITE_LOG_LEVEL=${VITE_LOG_LEVEL}
ENV DEFAULT_NUM_CTX=${DEFAULT_NUM_CTX}
ENV RUNNING_IN_DOCKER=true

# Command to run in development mode
CMD ["pnpm", "run", "dev"]
