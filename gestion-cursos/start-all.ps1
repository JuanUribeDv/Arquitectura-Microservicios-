$root = Split-Path -Parent $MyInvocation.MyCommand.Path

$services = @(
    @{ Name = "users-service"; Path = Join-Path $root "services\users-service" },
    @{ Name = "api-gateway"; Path = Join-Path $root "services\api-gateway" },
    @{ Name = "courses-service"; Path = Join-Path $root "services\courses-service" },
    @{ Name = "enrollments-service"; Path = Join-Path $root "services\enrollments-service" },
    @{ Name = "notifications-service"; Path = Join-Path $root "services\notifications-service" },
    @{ Name = "frontend"; Path = Join-Path $root "frontend" }
)

foreach ($service in $services) {
    Write-Host "Starting $($service.Name) ..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit","-Command","Set-Location '$($service.Path)'; npm run dev" 
    Start-Sleep -Milliseconds 1000
}

Write-Host "Todos los servicios fueron iniciados." -ForegroundColor Green
Write-Host "Frontend: http://localhost:8080" -ForegroundColor Yellow
Write-Host "Gateway: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Users: http://localhost:4001" -ForegroundColor Yellow
Write-Host "Courses: http://localhost:4002" -ForegroundColor Yellow
Write-Host "Enrollments: http://localhost:4003" -ForegroundColor Yellow
Write-Host "Notifications: http://localhost:4004" -ForegroundColor Yellow
