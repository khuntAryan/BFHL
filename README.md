# BFHL Hierarchy Analyzer

## Features
- Builds hierarchy trees
- Detects cycles
- Handles invalid inputs
- Handles duplicate edges
- Dynamic UI visualization

## Tech Stack
- Node.js
- Express
- EJS
- TailwindCSS

## API Endpoint
POST /bfhl

### Input
{
  "data": ["A->B", "B->C"]
}

### Output
- hierarchies
- summary
- invalid_entries
- duplicate_edges