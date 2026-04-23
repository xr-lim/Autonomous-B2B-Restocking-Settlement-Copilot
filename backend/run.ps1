param(
    [Alias("Host")]
    [string]$BindHost = "127.0.0.1",
    [int]$Port = 8000,
    [switch]$NoReload
)

$ErrorActionPreference = "Stop"

$pythonCandidates = @(
    (Join-Path $PSScriptRoot "..\.venv\Scripts\python.exe"),
    (Join-Path $PSScriptRoot ".venv\Scripts\python.exe"),
    (Join-Path $PSScriptRoot "venv\Scripts\python.exe")
)

$python = $pythonCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $python) {
    throw "No virtualenv Python executable found. Expected one of: ..\.venv\Scripts\python.exe, .\.venv\Scripts\python.exe, .\venv\Scripts\python.exe"
}

$arguments = @(
    "-m",
    "uvicorn",
    "app.main:socket_app",
    "--host",
    $BindHost,
    "--port",
    $Port.ToString()
)

if (-not $NoReload) {
    $arguments += "--reload"
}

Push-Location $PSScriptRoot
try {
    & $python @arguments
}
finally {
    Pop-Location
}
