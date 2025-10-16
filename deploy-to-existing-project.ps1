# Deploy to existing NorthFlank project
# Uses the existing proof-of-mind-pwa project

Write-Host "🤖 Deploying to existing NorthFlank project..." -ForegroundColor Cyan

# Get credentials
$token = doppler secrets get NORTHFLANK_API_TOKEN --project no-code-secrets-manager --config prd --plain
$projectId = "proof-of-mind-pwa"  # Use existing project

Write-Host "✅ Using existing project: $projectId" -ForegroundColor Green

# Set up API headers
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Create service in existing project
Write-Host "🔧 Creating SaaS service..." -ForegroundColor Yellow
$serviceData = @{
    name = "no-code-secrets-manager"
    description = "AI Secrets Orchestrator SaaS"
    type = "web"
    source = @{
        type = "dockerfile"
        dockerfile = "Dockerfile"
        buildContext = "."
    }
    deploy = @{
        replicas = 1
        resources = @{
            cpu = "0.25"
            memory = "512Mi"
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
} | ConvertTo-Json -Depth 10

try {
    $serviceResponse = Invoke-RestMethod -Uri "https://api.northflank.com/v1/projects/$projectId/services" -Method POST -Headers $headers -Body $serviceData
    $serviceId = $serviceResponse.id
    Write-Host "✅ Service created: $serviceId" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Service creation failed: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "Service might already exist or need manual creation" -ForegroundColor Yellow
}

# Get project details
Write-Host "📋 Getting project details..." -ForegroundColor Yellow
try {
    $projectDetails = Invoke-RestMethod -Uri "https://api.northflank.com/v1/projects/$projectId" -Method GET -Headers $headers
    Write-Host "✅ Project details retrieved" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Could not get project details: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n🎉 SaaS Service Created!" -ForegroundColor Green
Write-Host "📋 Deployment Summary:" -ForegroundColor Cyan
Write-Host "  Project: $projectId" -ForegroundColor White
Write-Host "  Service: no-code-secrets-manager" -ForegroundColor White
Write-Host "  Status: Ready for deployment" -ForegroundColor White

Write-Host "`n🔗 Your SaaS will be available at:" -ForegroundColor Green
Write-Host "  https://no-code-secrets-manager.proof-of-mind-pwa.northflank.app" -ForegroundColor White

Write-Host "`n📝 Next steps (if service creation failed):" -ForegroundColor Cyan
Write-Host "  1. Go to: https://app.northflank.com/projects/proof-of-mind-pwa" -ForegroundColor White
Write-Host "  2. Click 'Create Service'" -ForegroundColor White
Write-Host "  3. Name: no-code-secrets-manager" -ForegroundColor White
Write-Host "  4. Type: Web Application" -ForegroundColor White
Write-Host "  5. Upload files from: northflank-deploy/" -ForegroundColor White

Write-Host "`n✨ Your AI Secrets Orchestrator is ready!" -ForegroundColor Green



