# Simple deployment to NorthFlank without Docker
# This creates a deployment package and provides instructions

Write-Host "🚀 Preparing No-Code Secrets Manager SaaS for NorthFlank deployment..." -ForegroundColor Cyan

# Build the project
Write-Host "📦 Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green

# Create deployment package
Write-Host "📦 Creating deployment package..." -ForegroundColor Yellow
$deployDir = "northflank-deploy"
if (Test-Path $deployDir) {
    Remove-Item $deployDir -Recurse -Force
}
New-Item -ItemType Directory -Path $deployDir

# Copy necessary files
Copy-Item "dist" -Destination "$deployDir/dist" -Recurse
Copy-Item "Dockerfile" -Destination "$deployDir/"
Copy-Item "nginx.conf" -Destination "$deployDir/"
Copy-Item "northflank-service.json" -Destination "$deployDir/"
Copy-Item "package.json" -Destination "$deployDir/"

Write-Host "✅ Deployment package created in: $deployDir" -ForegroundColor Green

# Get NorthFlank credentials
Write-Host "🔑 Getting NorthFlank credentials..." -ForegroundColor Yellow
$token = doppler secrets get NORTHFLANK_API_TOKEN --project no-code-secrets-manager --config prd --plain
$orgId = doppler secrets get NORTHFLANK_ORG_ID --project proof-of-mind-pwa --config production --plain

Write-Host "✅ Got credentials!" -ForegroundColor Green

Write-Host "`n🎉 No-Code Secrets Manager SaaS is ready for deployment!" -ForegroundColor Green
Write-Host "📋 Manual Deployment Steps:" -ForegroundColor Cyan
Write-Host "  1. Go to: https://app.northflank.com" -ForegroundColor White
Write-Host "  2. Login with your account" -ForegroundColor White
Write-Host "  3. Create new project: 'no-code-secrets-manager'" -ForegroundColor White
Write-Host "  4. Create new service: 'no-code-secrets-manager'" -ForegroundColor White
Write-Host "  5. Use the files in: $deployDir" -ForegroundColor White

Write-Host "`n📝 Service Configuration:" -ForegroundColor Cyan
Write-Host "  Type: Web Application" -ForegroundColor White
Write-Host "  Build: Dockerfile" -ForegroundColor White
Write-Host "  Port: 3000" -ForegroundColor White
Write-Host "  Environment: Production" -ForegroundColor White

Write-Host "`n🔧 Environment Variables to set in NorthFlank:" -ForegroundColor Cyan
Write-Host "  NODE_ENV=production" -ForegroundColor White
Write-Host "  VITE_APP_NAME=No-Code Secrets Manager" -ForegroundColor White
Write-Host "  VITE_APP_VERSION=1.0.0" -ForegroundColor White
Write-Host "  VITE_APP_DESCRIPTION=AI Secrets Orchestrator for no-coders" -ForegroundColor White

Write-Host "`n🔗 After deployment, your SaaS will be available at:" -ForegroundColor Green
Write-Host "  https://no-code-secrets-manager.northflank.app" -ForegroundColor White

Write-Host "`n✨ Ready to deploy! Upload the $deployDir folder to NorthFlank." -ForegroundColor Green



