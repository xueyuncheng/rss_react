# Personal Management Hub

A full-stack personal management application that combines RSS feed reading, podcast management, meal planning, drawing, and investment tracking in one unified platform.

## Features

- **RSS Feeds & Stories**: Subscribe to and read RSS feeds with automatic updates
- **Podcast Management**: Track podcast shows and episodes with RSS feed integration
- **Night Snacks (Dinner Picker)**: Weighted random selection system for deciding what to eat
- **Drawings**: Integrated Excalidraw for creating and storing sketches
- **Investments & Assets**: Track financial investments across different domains and asset categories
- **Encouragements**: Generate personalized encouragement messages
- **Authentication**: Secure JWT-based authentication with cookie storage

## Architecture

### Backend
- **Framework**: Go with Gin web framework
- **Database**: PostgreSQL with GORM ORM
- **Object Storage**: MinIO for file and image storage
- **Authentication**: JWT tokens with cookie-based sessions
- **Job Scheduling**: Cron jobs for RSS feed updates
- **API**: RESTful JSON APIs at `/api/*` endpoints

### Frontend
- **Framework**: Next.js 16 with React 19 and TypeScript
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom theming
- **Data Fetching**: SWR for client-side data management
- **Forms**: react-hook-form with Zod validation
- **Charts**: Chart.js and Recharts for data visualization
- **Tables**: TanStack Table for advanced data grids

## Project Structure

```
rss_react/
├── cmd/backend/          # Main application entry point
│   ├── backend.go        # Server bootstrap
│   └── backend.yaml      # Configuration file
├── internal/
│   ├── app/backend/      # Core backend logic
│   │   ├── router.go     # API route definitions
│   │   ├── auth.go       # Authentication handlers
│   │   ├── podcast_*.go  # Podcast management
│   │   ├── night_snack.go # Dinner picker logic
│   │   ├── draw.go       # Drawing storage
│   │   ├── investment.go # Investment tracking
│   │   └── ...
│   └── pkg/              # Shared packages
│       ├── database/     # Database connection
│       ├── jwt/          # JWT utilities
│       └── table/        # GORM models
├── web/                  # Next.js frontend
│   ├── app/              # App router pages
│   ├── components/       # React components
│   ├── types/            # TypeScript types
│   └── util/             # API client utilities
├── api/                  # Bruno API collection for testing
├── deployment/           # Docker compose configuration
│   └── docker-compose.yaml
└── build/                # Docker build files
```

## Getting Started

### Prerequisites

- Go 1.22 or higher
- Node.js 20 or higher
- Docker and Docker Compose
- PostgreSQL 16
- MinIO

### Backend Setup

1. Start dependencies with Docker Compose:
```bash
cd deployment
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- MinIO on port 9000 (API) and 9001 (Console)

2. Configure backend settings in `cmd/backend/backend.yaml`:
```yaml
env: "dev"
port: "10000"

database:
  host: 127.0.0.1
  port: 5432
  username: postgres
  password: your_password
  db_name: rss

minio:
  endpoint: 127.0.0.1:9000
  access_key_id: admin
  secret_access_key: your_secret
```

3. Run the backend server:
```bash
go run cmd/backend/backend.go -f cmd/backend/backend.yaml
```

The backend will be available at `http://localhost:10000`

### Frontend Setup

1. Install dependencies:
```bash
cd web
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Building for Production

Build backend Docker image:
```bash
make build-image
```

Build frontend Docker image:
```bash
make build-frontend-image
```

## API Documentation

The backend exposes RESTful APIs under the `/api` prefix. All responses follow the format:

```json
{
  "err": "error message or empty string",
  "data": { ... }
}
```

### Authentication
- `POST /api/login` - User login (returns JWT in cookie)
- `POST /api/password/modify` - Change password

### RSS & Stories
- `GET /api/stories` - List stories with pagination
- `GET /api/channels` - List RSS channels
- `POST /api/channels` - Subscribe to new channel
- `DELETE /api/channels/:id` - Unsubscribe from channel

### Podcasts
- `GET /api/podcasts/shows` - List podcast shows
- `POST /api/podcasts/shows` - Add new podcast show
- `GET /api/podcasts/episodes` - List episodes
- `PUT /api/podcasts/episodes/:id` - Update episode status

### Night Snacks
- `GET /api/night_snack` - List all dinner options
- `POST /api/night_snack` - Add new dinner option
- `GET /api/night_snack/what_to_eat` - Get weighted random suggestion
- `PUT /api/night_snack/:id` - Update dinner option

### Drawings
- `GET /api/draws` - List drawings
- `POST /api/draws` - Create new drawing
- `GET /api/draws/:id` - Get drawing details
- `PUT /api/draws/:id` - Update drawing

### Investments & Assets
- `GET /api/investments` - List investment domains
- `POST /api/investments` - Add investment domain
- `GET /api/assets` - List assets
- `POST /api/assets` - Add asset

### Files
- `POST /api/file/upload` - Upload file to MinIO storage

## API Testing

The project includes a Bruno API collection in the `api/` directory for testing endpoints:

```bash
cd api
bruno run --env debug night_snack/列表.bru
```

Configure environment variables in `api/environments/debug.bru`.

## Development Patterns

### Backend Patterns
- **Transactions**: All requests automatically run in database transactions
- **Error Handling**: Set `ctx.Set(ctxIsOK, false)` to rollback transactions
- **Validation**: Use `form` or `json` tags with gin's binding
- **Pagination**: Embed `Page` struct in request types for standardized pagination

### Frontend Patterns
- **API Calls**: Use centralized API client from `web/util/index.ts`
- **Authentication**: Automatic redirect to login on 401 responses
- **Forms**: react-hook-form with shadcn/ui components
- **Tables**: TanStack Table with manual pagination
- **State Management**: React hooks with SWR for server state

## Key Dependencies

### Backend
- `github.com/gin-gonic/gin` - Web framework
- `gorm.io/gorm` - ORM
- `github.com/minio/minio-go/v7` - MinIO client
- `github.com/golang-jwt/jwt/v5` - JWT authentication
- `github.com/mroth/weightedrand/v2` - Weighted random selection
- `github.com/mmcdole/gofeed` - RSS feed parser
- `github.com/robfig/cron/v3` - Job scheduling

### Frontend
- `next` - React framework
- `@radix-ui/*` - UI primitives
- `@tanstack/react-table` - Table component
- `react-hook-form` - Form management
- `zod` - Schema validation
- `@excalidraw/excalidraw` - Drawing component
- `chart.js` & `recharts` - Data visualization
- `swr` - Data fetching

## Configuration

### Environment Variables
Backend configuration is managed via `backend.yaml`. Key settings:

- `env`: Environment mode ("dev" or "prod")
- `port`: Server port
- `database`: PostgreSQL connection details
- `minio`: Object storage credentials

### Database Migrations
Database schema is automatically migrated on server startup via `internal/app/backend/migration.go`.

## Contributing

1. Follow existing code patterns and conventions
2. Use GORM models defined in `internal/pkg/table/table.go`
3. Register new routes in `internal/app/backend/router.go`
4. Add API tests to the Bruno collection
5. Keep frontend API client in sync with backend endpoints

## License

This is a personal project. Please contact the repository owner for usage permissions.

## Contact

Repository: [https://github.com/xueyuncheng/rss_react](https://github.com/xueyuncheng/rss_react)
