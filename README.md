# Polaris

An AI-powered web development IDE that lets you create, edit, and deploy web projects through AI-assisted coding — all in the browser.

## Features

- **AI Agent-Based Code Generation** — Autonomous Claude AI agent that creates, reads, updates, and deletes files based on natural language instructions
- **Browser-Based IDE** — Full code editor powered by CodeMirror 6 with syntax highlighting, minimap, and smart quick-edit mode
- **WebContainer Preview** — Run dev servers and terminals directly in the browser without any local setup
- **GitHub Integration** — Import any GitHub repository into a project or export your project to a new GitHub repo
- **Multi-Conversation Projects** — Maintain multiple AI conversations per project with full history persistence
- **Real-Time File System** — Live file tree updates backed by Convex real-time database
- **Web Scraping Context** — Provide URLs as context for AI code generation via Firecrawl

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript |
| AI | Anthropic Claude (via Vercel AI SDK + Inngest agent-kit) |
| Backend | Convex (real-time database + serverless functions) |
| Background Jobs | Inngest |
| Auth | Clerk |
| Code Editor | CodeMirror 6 |
| Terminal | xterm.js + WebContainer API |
| Styling | TailwindCSS v4 + Radix UI + shadcn/ui |
| Error Tracking | Sentry |
| Web Scraping | Firecrawl |
| GitHub API | Octokit |

## Getting Started

### Prerequisites

- Node.js 18+
- Accounts for: Convex, Clerk, Anthropic, Inngest, Firecrawl, Sentry (optional)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file at the project root:

```bash
# Convex
CONVEX_DEPLOYMENT=<your-convex-deployment>
NEXT_PUBLIC_CONVEX_URL=<your-convex-url>
POLARIS_CONVEX_INTERNAL_KEY=<your-internal-key>

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
CLERK_SECRET_KEY=<your-clerk-secret-key>
CLERK_JWT_ISSUER_DOMAIN=<your-clerk-domain>

# AI Models
ANTHROPIC_API_KEY=<your-anthropic-key>
GOOGLE_GENERATIVE_AI_API_KEY=<your-google-ai-key>

# Web Scraping
FIRECRAWL_API_KEY=<your-firecrawl-key>

# Error Tracking (optional)
SENTRY_AUTH_TOKEN=<your-sentry-token>
```

### Development

```bash
# Start the Next.js dev server
npm run dev

# In a separate terminal, start the Convex backend
npx convex dev
```

Open [http://localhost:3000](http://localhost:3000) to access the app.

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Lint with Biome
npm run format    # Format with Biome
```

## Project Structure

```
src/
├── app/
│   ├── api/                  # API routes (messages, github, inngest)
│   └── projects/[projectId]/ # Project workspace page
├── features/
│   ├── auth/                 # Authentication components
│   ├── conversations/        # AI conversation UI + Inngest jobs
│   │   └── inngest/
│   │       └── tools/        # AI agent tools (file operations)
│   ├── editor/               # CodeMirror editor + extensions
│   ├── preview/              # WebContainer preview + terminal
│   └── projects/             # Project management + GitHub integration
├── components/ui/            # shadcn/ui components
└── lib/                      # Convex client, Firecrawl, utilities
convex/                       # Database schema + backend functions
```

## AI Agent Tools

The AI agent has access to the following file system tools:

| Tool | Description |
|------|-------------|
| `create_files` | Create one or more files with content |
| `create_folder` | Create a new directory |
| `read_files` | Read file contents |
| `update_file` | Update an existing file |
| `delete_files` | Delete files or folders (recursive) |
| `rename_file` | Rename or move a file |
| `list_files` | List files with folder hierarchy |
| `scrape_urls` | Scrape web pages for context |

## Database Schema

### Projects
- `name`, `ownerId`, `updatedAt`
- `importStatus`, `exportStatus`, `exportRepoUrl`
- `settings` — `installCommand`, `devCommand`

### Files
- `projectId`, `parentId`, `name`, `type` (`file` | `folder`)
- `content` (text) or `storageId` (binary)

### Conversations
- `projectId`, `title`, `updatedAt`

### Messages
- `conversationId`, `projectId`, `role`, `content`
- `status` — `pending` | `completed` | `failed`

## License

MIT
