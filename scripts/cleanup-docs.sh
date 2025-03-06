#!/bin/bash

# Cleanup script for documentation files
# This script removes the original documentation files from the root directory
# after they have been moved to the docs directory

echo "Cleaning up documentation files..."

# List of files to remove
files=(
  "DOCUMENTATION.md"
  "documentation-refactor.md"
  "refactor-plan.md"
  "test-improvement-plan.md"
  "test-standards.md"
  "testrules.md"
)

# Check if files exist and remove them
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Removing $file..."
    rm "$file"
  else
    echo "$file not found, skipping..."
  fi
done

echo "Documentation cleanup complete!"
echo "All documentation is now located in the docs directory."
echo "See docs/index.md for a complete list of available documentation." 