
Write-Host "Netrak Server Restart Script"
Write-Host "============================"

Write-Host "`n1. Stopping existing processes on ports 3000 and 4173..."
netstat -ano | findstr ":3000" | ForEach-Object {
    $parts = $_.Split(' ', [System.StringSplitOptions]::RemoveEmptyEntries)
    $procId = $parts[-1]
    if ($procId -ne '0') {
        Write-Host "Stopping process $procId on port 3000..."
        Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
    }
}
netstat -ano | findstr ":4173" | ForEach-Object {
    $parts = $_.Split(' ', [System.StringSplitOptions]::RemoveEmptyEntries)
    $procId = $parts[-1]
    if ($procId -ne '0') {
        Write-Host "Stopping process $procId on port 4173..."
        Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
    }
}
Start-Sleep -Seconds 2

Write-Host "`n2. Starting servers..."
Write-Host "- Backend gateway (port 3000)"
Write-Host "- Operations frontend (port 4173)"
Write-Host "`nNote: Servers are started in new windows."
Write-Host "Close the windows to stop the servers."

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm.cmd run dev:gateway"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm.cmd run dev:operations"

Write-Host "`nDone!"
