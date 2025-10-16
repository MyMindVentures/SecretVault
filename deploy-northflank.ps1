# NorthFlank Direct Deployment Script
$token = doppler secrets get NORTHFLANK_API_TOKEN --project no-code-secrets-manager --config prd --plain

# Create service using direct API call
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

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

Write-Host "Creating service in NorthFlank..."
$response = Invoke-RestMethod -Uri "https://api.northflank.com/v1/projects/no-code-secrets-manager/services" -Method POST -Headers $headers -Body $serviceData

Write-Host "Service created successfully!"
Write-Host "Response: $($response | ConvertTo-Json -Depth 5)"



