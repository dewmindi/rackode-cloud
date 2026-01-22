# Rackode Cloud - VPS Management Platform

A modern Next.js application for managing VPS instances with SolusVM integration.

## Features

✅ **SolusVM v1 Client API Integration**
- Get VPS detailed information (hostname, resources, IP addresses)
- Power management (boot, reboot, shutdown)
- Status monitoring
- VNC console access

✅ **Modern UI**
- Black and light blue theme
- Responsive design with Tailwind CSS
- Interactive test page for API endpoints

✅ **Docker Support**
- Development environment with hot reload
- Easy deployment

## Getting Started

### Prerequisites

- Node.js 20+
- Docker (optional)
- SolusVM v1 Client API credentials from your provider

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd rackode-cloud
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   # SolusVM v1 Client API Configuration
   SOLUSVM_API_URL=https://your-provider.com/api/client/command.php
   SOLUSVM_API_KEY=your_api_key
   SOLUSVM_API_HASH=your_api_hash
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Or with Docker:
   ```bash
   docker-compose up
   ```

5. **Open your browser**
   
   Navigate to: http://localhost:3000

## API Endpoints

### VPS Information
- **GET** `/api/solusvm/vps-info`
- **POST** `/api/solusvm/vps-info`
  
  Returns detailed VPS information including:
  - Server ID
  - Hostname
  - IP Address
  - Resources (CPU, RAM, Disk)
  - Template/OS
  - Status

### VPS Control
- **POST** `/api/solusvm/vps-control`
  
  Supported actions:
  - `boot` - Power on VPS
  - `reboot` - Restart VPS
  - `shutdown` - Power off VPS
  - `status` - Get power state

### Connection Test
- **GET** `/api/solusvm/test-connection`
  
  Test if API credentials are valid

## Testing

Visit the test page to try all API endpoints:

**URL**: http://localhost:3000/test-api

Features:
- Test API connection
- Get VPS information
- Check VPS status
- Power management controls
- Real-time response display

## Technology Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Framer Motion
- **Icons**: Lucide React
- **API**: SolusVM v1 Client API

## Project Structure

```
rackode-cloud/
├── app/
│   ├── api/
│   │   └── solusvm/          # SolusVM API routes
│   │       ├── test-connection/
│   │       ├── vps-info/     # VPS information endpoint
│   │       └── vps-control/  # Power management
│   ├── test-api/             # API testing page
│   └── ...                   # Other pages
├── lib/
│   ├── solusvm.ts           # SolusVM API client
│   └── constants.tsx        # App constants
├── components/
│   ├── UI.tsx               # UI components
│   ├── Navbar.tsx
│   └── Footer.tsx
└── types/
    └── types.ts             # TypeScript types
```

## SolusVM Client API

This application uses the **SolusVM v1 Client API**, which provides:

✅ **Available Features**:
- Get detailed VPS information
- Power management (boot, reboot, shutdown)
- Status monitoring
- VNC console access

❌ **Limitations**:
- Tied to ONE specific VPS per credential set
- Cannot create new VPS
- Cannot list multiple VPS
- Cannot manage other customers' servers

### Managing Multiple VPS

If you have multiple VPS instances, you need separate API credentials for each one. You can:

1. Get Client API credentials for each VPS from your provider
2. Store them in the app configuration
3. Switch between VPS or manage them all from one dashboard

### For Hosting Businesses

If you want to build a hosting platform with full automation:
- You need a dedicated server
- Install your own virtualization platform (SolusVM, Proxmox, etc.)
- Get Admin API access to your own infrastructure

## Environment Variables

```bash
# Required
SOLUSVM_API_URL=https://your-provider.com/api/client/command.php
SOLUSVM_API_KEY=your_api_key
SOLUSVM_API_HASH=your_api_hash

# Optional Docker settings
NODE_ENV=development
WATCHPACK_POLLING=true
HOSTNAME=0.0.0.0
```

## Docker Configuration

The project includes Docker support for easy deployment:

```yaml
# docker-compose.yml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - SOLUSVM_API_URL=${SOLUSVM_API_URL}
      - SOLUSVM_API_KEY=${SOLUSVM_API_KEY}
      - SOLUSVM_API_HASH=${SOLUSVM_API_HASH}
```

## Development

### Running Tests

Visit http://localhost:3000/test-api to test API endpoints interactively.

### Code Style

The project uses ESLint for code quality:

```bash
npm run lint
```

## Documentation

- **SolusVM v1 API**: https://docs.solusvm.com/v1/api/client/
- **Next.js**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

## License

[Your License Here]

## Support

For issues and questions:
- Create an issue on GitHub
- Contact your VPS provider for API access issues

---

**Built with ❤️ for efficient VPS management**
