# Document & Excel Processing Toolkit

A comprehensive skill for analyzing documents and processing Excel spreadsheets.

## Features

### Document Analysis
- Extract text from PDF, DOCX, and TXT files
- Summarize document content
- Search for specific terms
- Extract tables from documents

### Excel Processing
- Read and analyze spreadsheet data
- Generate statistical summaries
- Filter and sort data
- Create new Excel files
- Modify existing spreadsheets

## Installation

The skill requires the following Python packages:

```bash
pip install pandas openpyxl xlrd python-docx pdfplumber
```

## Usage

### In Codex
Simply mention the skill when working with documents or spreadsheets:
- "Analyze this Excel file: [file path]"
- "Extract text from this PDF: [file path]"
- "Create a new spreadsheet with this data"

### Programmatically
Use the provided scripts:

```bash
# Run tests
python scripts/test_toolkit.py

# Run examples
python scripts/examples.py
```

## File Structure

```
doc-excel-toolkit/
├── SKILL.md              # Main skill description
├── agents/
│   └── openai.yaml       # Agent configuration
├── assets/
│   └── icon.md           # Icon placeholder
└── scripts/
    ├── test_toolkit.py   # Test suite
    └── examples.py       # Usage examples
```

## Supported Formats

- **Documents**: PDF, DOCX, TXT
- **Spreadsheets**: XLSX, XLS, CSV

## Dependencies

| Package | Purpose |
|---------|---------|
| pandas | Data analysis and manipulation |
| openpyxl | Excel file reading/writing |
| xlrd | Legacy Excel reading |
| python-docx | Word document processing |
| pdfplumber | PDF text extraction |

## Troubleshooting

### Missing Libraries
If you see import errors, install the required packages:
```bash
pip install pandas openpyxl xlrd python-docx pdfplumber
```

### File Not Found
Always provide absolute file paths when working with documents.

### Encoding Issues
For text files, the toolkit automatically tries multiple encodings (UTF-8, GBK, Latin-1).

## Contributing

Feel free to extend this skill with additional features:
- Support for more document formats
- Advanced data visualization
- Automated report generation