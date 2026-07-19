---
name: "doc-excel-toolkit"
description: "Analyze local documents (PDF, DOCX, TXT) and process Excel spreadsheets (XLSX, XLS, CSV). Supports reading, extracting, summarizing, and creating/modifying files."
---

# Document & Excel Processing Toolkit

## Overview
This skill provides comprehensive document analysis and Excel spreadsheet processing capabilities. It supports reading, extracting, summarizing, and creating/modifying documents and spreadsheets.

## Supported File Types
- **Documents**: .pdf, .docx, .txt
- **Spreadsheets**: .xlsx, .xls, .csv

## Core Operations

### Document Analysis
1. **Text Extraction**: Extract text content from PDF, DOCX, or TXT files
2. **Content Summarization**: Generate summaries of document content
3. **Keyword Search**: Find specific terms or patterns in documents
4. **Table Extraction**: Extract tables from PDF and DOCX files

### Excel Processing
1. **Data Reading**: Read and analyze spreadsheet data
2. **Data Summarization**: Generate statistical summaries and insights
3. **Data Filtering**: Filter and sort data based on criteria
4. **File Creation**: Create new Excel files with formatted data
5. **Data Modification**: Update existing Excel files (add/modify/delete rows)

## Workflow

### For Document Analysis:
1. Identify the file type (.pdf, .docx, .txt)
2. Use appropriate extraction method:
   - PDF: Use `pdfplumber` for text extraction, `PyMuPDF` for layout analysis
   - DOCX: Use `python-docx` for paragraph and table extraction
   - TXT: Direct text reading with encoding detection
3. Process extracted content (summarize, search, analyze)
4. Return results in structured format

### For Excel Processing:
1. Identify file type (.xlsx, .xls, .csv)
2. Read data using `pandas` or `openpyxl`:
   - XLSX: Use `openpyxl` for formatting, `pandas` for data analysis
   - XLS: Use `xlrd` for reading
   - CSV: Use `pandas` with encoding detection
3. Perform operations:
   - Analysis: Statistics, filtering, sorting
   - Modification: Add/edit/delete rows, update cells
   - Creation: Generate new files with proper formatting
4. Save results and confirm operation

## Dependencies
Required Python packages:
- `pandas` - Data analysis and manipulation
- `openpyxl` - Excel file reading/writing (.xlsx)
- `xlrd` - Legacy Excel reading (.xls)
- `python-docx` - Word document processing
- `pdfplumber` - PDF text extraction
- `PyMuPDF` (optional) - Advanced PDF processing

Install if missing:
```bash
pip install pandas openpyxl xlrd python-docx pdfplumber PyMuPDF
```

## Usage Examples

### Document Analysis:
- "Extract text from this PDF: C:\path\to\document.pdf"
- "Summarize the content of this Word document"
- "Find all occurrences of revenue in this file"

### Excel Processing:
- "Analyze the data in this spreadsheet and provide statistics"
- "Create a new Excel file with sales data"
- "Add a new row to the existing spreadsheet"
- "Filter data where salary greater than 10000"

## Best Practices
1. Always verify file existence before processing
2. Handle encoding issues for text files (try UTF-8, then GBK, then Latin-1)
3. For large files, process in chunks to avoid memory issues
4. Preserve original file formatting when modifying Excel files
5. Return structured results with clear section headers
6. Clean up temporary files after processing