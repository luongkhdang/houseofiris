# Cleanup script for documentation files
# This script removes the original documentation files from the root directory
# after they have been moved to the docs directory

Write-Host "Cleaning up documentation files..." -ForegroundColor Green

# List of files to remove
$files = @(
  "DOCUMENTATION.md",
  "documentation-refactor.md",
  "refactor-plan.md",
  "test-improvement-plan.md",
  "test-standards.md",
  "testrules.md"
)

# Check if files exist and remove them
foreach ($file in $files) {
  if (Test-Path $file) {
    Write-Host "Removing $file..." -ForegroundColor Yellow
    Remove-Item $file
  } else {
    Write-Host "$file not found, skipping..." -ForegroundColor Gray
  }
}

Write-Host "Documentation cleanup complete!" -ForegroundColor Green
Write-Host "All documentation is now located in the docs directory." -ForegroundColor Cyan
Write-Host "See docs/index.md for a complete list of available documentation." -ForegroundColor Cyan 