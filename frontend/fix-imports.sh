#!/bin/bash

# First, find all files that import from "@/components/ui/Button"
echo "Finding files importing Button with uppercase..."
grep -l "@/components/ui/Button" src/**/*.tsx > files_to_fix.txt

# Also find files that import from "../ui/Button" or "./ui/Button" or similar patterns
grep -l "../ui/Button" src/**/*.tsx >> files_to_fix.txt
grep -l "./ui/Button" src/**/*.tsx >> files_to_fix.txt

# Create backup of Button.tsx
cp src/components/ui/Button.tsx src/components/ui/button.tsx

# Update all imports in the found files
echo "Fixing imports in files..."
while IFS= read -r file; do
  echo "Fixing imports in $file"
  sed -i '' 's|@/components/ui/Button|@/components/ui/button|g' "$file"
  sed -i '' 's|../ui/Button|../ui/button|g' "$file"
  sed -i '' 's|./ui/Button|./ui/button|g' "$file"
done < files_to_fix.txt

# Remove the old Button.tsx file
rm src/components/ui/Button.tsx

echo "Done! You may need to rebuild your app now." 