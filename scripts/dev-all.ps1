# Starts every app in the board game workspace, each in its own PowerShell window.
#
# Assumes the three repos are sibling checkouts:
#   <parent>\boardgameplayground   (this repo)      -> http://localhost:3000
#   <parent>\familyinc             server + client  -> ws :3001, http://localhost:3033
#   <parent>\high-society          client + emulators -> http://localhost:5173, emulator UI :4000
#
# Override the parent directory with -Root if the checkouts live elsewhere.
param(
  [string]$Root = (Split-Path -Parent (Split-Path -Parent $PSScriptRoot)),
  [switch]$SkipEmulators
)

$bgp = Join-Path $Root 'boardgameplayground'
$familyinc = Join-Path $Root 'familyinc'
$highSociety = Join-Path $Root 'high-society'

foreach ($dir in @($bgp, $familyinc, $highSociety)) {
  if (-not (Test-Path $dir)) {
    Write-Error "Expected a checkout at $dir"
    exit 1
  }
}

function Start-App([string]$Title, [string]$Dir, [string]$Command) {
  $script = "`$host.UI.RawUI.WindowTitle = '$Title'; Set-Location '$Dir'; $Command"
  Start-Process powershell -ArgumentList '-NoExit', '-Command', $script | Out-Null
  Write-Host "Started: $Title"
}

Start-App 'familyinc server (ws :3001)' $familyinc 'yarn start:dev:server'
Start-App 'familyinc client (:3033)' $familyinc 'yarn start:dev:client'
if (-not $SkipEmulators) {
  Start-App 'high-society firebase emulators' $highSociety 'npm --prefix functions run build; firebase emulators:start --only auth,database,functions'
}
Start-App 'high-society client (:5173)' $highSociety 'yarn dev'
Start-App 'boardgameplayground (:3000)' $bgp 'npm run dev'

Write-Host ''
Write-Host 'Landing page:   http://localhost:3000'
Write-Host 'Family Inc:     http://localhost:3033'
Write-Host 'High Society:   http://localhost:5173/high-society'
Write-Host 'No Thanks:      http://localhost:5173/no-thanks'
if (-not $SkipEmulators) {
  Write-Host 'Emulator UI:    http://localhost:4000'
}
