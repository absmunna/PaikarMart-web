# PAIKARMART ECOSYSTEM — PRODUCTION DEPLOYMENT & SYSTEMIZATION CONSTITUTION
*(Phase 7.0 - Production Deployment & Infrastructure)*

This constitution governs the deployment architecture, release pipelines, cloud infrastructure mapping, observability strategy, and infrastructure-level security models for the Paikar Mart Super App ecosystem in production.

---

## 1. DEPLOYMENT ARCHITECTURE & CONTEXT

To support millions of physical wholesalers, retailers, and service providers securely, Paikar Mart transitions from single-container runtimes to a highly modular, decoupled service topography.

### A. Core Containerization Strategy
*   **Docker Containerization**: Standardize the application stack inside minimal Alpine-based Docker images.
    ```dockerfile
    # Multi-stage production build example
    FROM node:20-alpine AS builder
    WORKDIR /app
    COPY package*.json ./
    RUN npm ci
    COPY . .
    RUN npm run build

    FROM node:20-alpine AS runner
    WORKDIR /app
    ENV NODE_ENV=production
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/package*.json ./
    COPY --from=builder /app/node_modules ./node_modules
    EXPOSE 3000
    CMD ["npm", "start"]
    ```
*   **Runtimes**: Server components run in a container fabric (such as Google Cloud Run, AWS ECS, or Kubernetes), configured with horizontal autoscaling responding to real-time Request-Per-Second (RPS) thresholds.

### B. High-Load Traffic Routing
*   An Edge Proxy (such as Cloudflare or Nginx) shields all API routes.
*   The Edge Proxy is configured with strict TLS 1.3 requirements, Web Application Firewall (WAF) parameters targeting OWASP Top 10 vectors, and rate-limiting rules.

---

## 2. CI/CD DELIVERY PIPELINES

Continuous Integration and Continuous Deployment (CI/CD) pipelines ensure high-tempo delivery with zero-downtime, fully automated rollbacks, and secure environments.

### A. Pipeline Definition
```
[Developer Push]
       │
       ▼
┌────────────────────────┐
│     Automated CI       │ ──► Linting & Diagnostic Checks
└────────────────────────┘
       │ (Passes)
       ▼
┌────────────────────────┐
│     E2E test suite     │ ──► Integrity & Regression Testing
└────────────────────────┘
       │ (Passes)
       ▼
┌────────────────────────┐
│  Artifact Preparation  │ ──► Docker Container Build & Push to Registry
└────────────────────────┘
       │
       ▼
┌────────────────────────┐
│    Canary Deployment   │ ──► Route 10% traffic to revision
└────────────────────────┘
       │ (No latency spikes or 5xx errors for 5 mins)
       ▼
┌────────────────────────┐
│   Full General Rollout │ ──► Traffic routed 100% to live revision
└────────────────────────┘
```

### B. Immediate Rollback Protocol
- **Fail-Safe Gateways**: If 5xx response codes spike beyond 0.5% or P95 request latency exceeds 500ms during canary, traffic triggers an immediate rollback to the previous active Git SHA.
- **Rollback Sequence**:
  1. Instant redirect at the Edge Routing layer.
  2. Automated alerting dispatched to the Engineering response channel.
  3. Preservation of the failed container session in dry-run status for post-mortem forensics.

---

## 3. CLOUD INFRASTRUCTURE & SCALABILITY MAPPING

Our multi-phase cloud architecture handles state replication, cache hierarchy, and database scalability safely without altering the database schema.

### A. Multi-Region Replication Topography
- **Primary Database Cluster**: PostgreSQL deployed within Supabase Enterprise or AWS RDS Multi-AZ, featuring automated switchover standby replica targets.
- **Read-Replica Pool**: Decouple intensive read workloads (such as social feeds, analytics compilation) to high-throughput read-only replica endpoints.
- **In-Memory Cache Clustering**: Redis Enterprise Cluster layer handling shared user sessions, hot-spot marketplace product catalogs, and rate-limiting counters.

### B. High-Volume Event Bus Load Strategies
- **Decoupled Queue Buffer**: During high-frequency promotional periods, replace the inline process event emitters with robust messaging queues (like Google Cloud Pub/Sub or RabbitMQ).
- **Graceful Backpressure**: Event subscribers pull payloads in tunable micro-batches. If downstream processors degrade, memory is protected via durable disk storage.

---

## 4. SYSTEM OBSERVABILITY & RUNTIME TELEMETRY

Observability turns deep runtime states into clean, readable signals, giving complete system transparency.

### A. Logging Pipeline & Schema Standards
- Every log emitted MUST be structured in clean JSON formatting with standard header payloads:
  ```json
  {
    "timestamp": "2026-05-26T18:31:00Z",
    "level": "INFO",
    "domain": "ORDER_PROCESSING",
    "correlationId": "tx-889d-22fa-9a",
    "userId": "usr_902",
    "message": "Fulfillment event successfully emitted to queue",
    "metadata": { "orderId": "ord_102", "durationMs": 14.5 }
  }
  ```

### B. Production Metrics Dashboard Blueprint
- **Core Indicators Checklist**:
  - **Latency (P50, P90, P99)**: Measured on all critical API controllers (`/api/v1/feed`, `/api/v1/order`).
  - **Traffic Velocity**: Requests per second (RPS) metrics grouped by routes.
  - **Error Rate**: Ratio of HTTP 5xx codes vs successful requests.
  - **Event Bus Queue Depth**: Back-log delay counter on key processor pools.
- **Proactive Alerts**: Triggers pager alerts on P99 latency > 1000ms over a 2-minute rolling window, or sustained errors > 1%.

---

## 5. ROBUST DEPLOYMENT SECURITY DESIGN

We apply security control structures strictly at the infrastructure level, maintaining clean application separation.

### A. Robust Infrastructure Access Model
- **Virtual Private Cloud (VPC)**: The database instances and cache networks live behind custom private subnets, allowing no inbound physical routes from the public internet.
- **IAM Authorization**: Production workloads adhere to the Principal of Least Privilege (PoLP). Container executors only receive write-access to essential tables.

### B. Intelligent Rate-Limiting & Abuse Shield
- **Cloud-Level Throttling**: Integrate rate-limiting logic on the API gateway layer, before it hits the application server.
- **Shield Rules**:
  - Web guests limit: 60 requests/minute per IP.
  - Authorized merchant accounts limit: 1000 requests/minute per client Token identifier.
  - Login/Register paths: Strict threshold of 5 requests/minute to completely prevent credential stuffing.
