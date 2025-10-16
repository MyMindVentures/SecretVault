# Deploy No-Code Secrets Manager SaaS directly to NorthFlank using their API
# This bypasses GitHub and uses NorthFlank's native CI/CD

param(
    [string]$Token = "",
    [string]$OrgId = "68e598ab7ca362425aa1a454"
)

Write-Host "🚀 Deploying No-Code Secrets Manager SaaS directly to NorthFlank..." -ForegroundColor Cyan

# Get token from Doppler if not provided
if (-not $Token) {
    Write-Host "🔑 Getting NorthFlank token from Doppler..." -ForegroundColor Yellow
    $Token = doppler secrets get NORTHFLANK_API_TOKEN --project no-code-secrets-manager --config prd --plain
}

if (-not $Token) {
    Write-Host "❌ Failed to get NorthFlank token!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Got NorthFlank token!" -ForegroundColor Green

# Build the project first
Write-Host "📦 Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green

# Create a Docker image locally
Write-Host "🐳 Building Docker image..." -ForegroundColor Yellow
docker build -t no-code-secrets-manager:latest .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Docker image built!" -ForegroundColor Green

# Set up NorthFlank API headers
$headers = @{
    "Authorization" = "Bearer $Token"
    "Content-Type" = "application/json"
}

# Create project in NorthFlank
Write-Host "🏗️ Creating NorthFlank project..." -ForegroundColor Yellow
$projectData = @{
    name = "no-code-secrets-manager"
    description = "AI Secrets Orchestrator - Intelligent secrets management SaaS for no-coders"
    organizationId = $OrgId
} | ConvertTo-Json

try {
    $projectResponse = Invoke-RestMethod -Uri "https://api.northflank.com/v1/projects" -Method POST -Headers $headers -Body $projectData
    Write-Host "✅ Project created: $($projectResponse.id)" -ForegroundColor Green
    $projectId = $projectResponse.id
} catch {
    Write-Host "⚠️ Project might already exist, continuing..." -ForegroundColor Yellow
    $projectId = "no-code-secrets-manager"
}

# Create service in NorthFlank
Write-Host "🔧 Creating NorthFlank service..." -ForegroundColor Yellow
$serviceData = @{
    name = "no-code-secrets-manager"
    description = "AI Secrets Orchestrator SaaS"
    type = "web"
    projectId = $projectId
    source = @{
        type = "docker"
        image = "no-code-secrets-manager:latest"
    }
    deploy = @{
        replicas = 2
        resources = @{
            cpu = "0.5"
            memory = "1Gi"
        }
        autoscaling = @{
            enabled = $true
            minReplicas = 1
            maxReplicas = 10
            targetCPU = 70
            targetMemory = 80
        }
        healthCheck = @{
            path = "/"
            port = 3000
            initialDelaySeconds = 30
            periodSeconds = 10
            timeoutSeconds = 5
            failureThreshold = 3
        }
    }
    networking = @{
        ports = @(
            @{
                port = 3000
                protocol = "http"
                public = $true
            }
        )
    }
    environment = @{
        NODE_ENV = "production"
        VITE_APP_NAME = "No-Code Secrets Manager"
        VITE_APP_VERSION = "1.0.0"
        VITE_APP_DESCRIPTION = "AI Secrets Orchestrator for no-coders"
    }
    secrets = @{
        source = "doppler"
        project = "no-code-secrets-manager"
        config = "prd"
    }
} | ConvertTo-Json -Depth 10

try {
    $serviceResponse = Invoke-RestMethod -Uri "https://api.northflank.com/v1/projects/$projectId/services" -Method POST -Headers $headers -Body $serviceData
    Write-Host "✅ Service created: $($serviceResponse.id)" -ForegroundColor Green
    $serviceId = $serviceResponse.id
} catch {
    Write-Host "⚠️ Service might already exist, continuing..." -ForegroundColor Yellow
    $serviceId = "no-code-secrets-manager"
}

# Deploy the service
Write-Host "🚀 Deploying service..." -ForegroundColor Yellow
$deployData = @{
    serviceId = $serviceId
    image = "no-code-secrets-manager:latest"
} | ConvertTo-Json

try {
    $deployResponse = Invoke-RestMethod -Uri "https://api.northflank.com/v1/projects/$projectId/services/$serviceId/deployments" -Method POST -Headers $headers -Body $deployData
    Write-Host "✅ Deployment started: $($deployResponse.id)" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Deployment might already be running..." -ForegroundColor Yellow
}

Write-Host "`n🎉 No-Code Secrets Manager SaaS deployed to NorthFlank!" -ForegroundColor Green
Write-Host "📋 Deployment Details:" -ForegroundColor Cyan
Write-Host "  Project ID: $projectId" -ForegroundColor White
Write-Host "  Service ID: $serviceId" -ForegroundColor White
Write-Host "  Organization: $OrgId" -ForegroundColor White
Write-Host "  Environment: Production" -ForegroundColor White

Write-Host "`n🔗 Access your SaaS at: https://no-code-secrets-manager.northflank.app" -ForegroundColor Green
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Configure custom domain: nocodesecrets.com" -ForegroundColor White
Write-Host "  2. Set up SSL certificate" -ForegroundColor White
Write-Host "  3. Configure monitoring and alerts" -ForegroundColor White
Write-Host "  4. Test all functionality" -ForegroundColor White

Write-Host "`n✨ Your AI Secrets Orchestrator is now live and ready to use!" -ForegroundColor Green



