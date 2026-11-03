param([ValidateRange(1024, 65535)][int]$Port = 3000)
$ErrorActionPreference = 'Stop'
$projectDirectory = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
Set-Location -LiteralPath $projectDirectory
$nextCli = Join-Path $projectDirectory 'node_modules/next/dist/bin/next'
if (-not (Test-Path -LiteralPath $nextCli)) {
  throw 'Primero instalá las dependencias con pnpm install --frozen-lockfile. Consultá README.md.'
}
$env:NEXT_TELEMETRY_DISABLED = '1'
& node $nextCli dev --hostname 127.0.0.1 --port $Port
exit $LASTEXITCODE
