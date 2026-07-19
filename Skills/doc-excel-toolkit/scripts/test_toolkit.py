#!/usr/bin/env python3
"""Test script for document and Excel processing toolkit."""

import os
import sys
from pathlib import Path

def test_excel_processing():
    """Test Excel file creation and reading."""
    try:
        import pandas as pd
        import openpyxl
        print("[OK] Excel libraries available")
        
        # Create test data
        test_data = {
            'Name': ['Alice', 'Bob', 'Charlie'],
            'Age': [25, 30, 35],
            'City': ['New York', 'London', 'Tokyo']
        }
        df = pd.DataFrame(test_data)
        
        # Test saving to Excel
        test_file = Path("test_excel.xlsx")
        df.to_excel(test_file, index=False)
        print(f"[OK] Created test Excel file: {test_file}")
        
        # Test reading back
        df_read = pd.read_excel(test_file)
        print(f"[OK] Read back {len(df_read)} rows")
        
        # Cleanup
        test_file.unlink()
        print("[OK] Test completed successfully")
        return True
        
    except ImportError as e:
        print(f"[FAIL] Missing library: {e}")
        return False
    except Exception as e:
        print(f"[FAIL] Test failed: {e}")
        return False

def test_document_processing():
    """Test document processing capabilities."""
    try:
        # Check if python-docx is available
        try:
            import docx
            print("[OK] python-docx available")
        except ImportError:
            print("[WARN] python-docx not available (install with: pip install python-docx)")
            
        # Check if pdfplumber is available
        try:
            import pdfplumber
            print("[OK] pdfplumber available")
        except ImportError:
            print("[WARN] pdfplumber not available (install with: pip install pdfplumber)")
            
        return True
        
    except Exception as e:
        print(f"[FAIL] Document test failed: {e}")
        return False

if __name__ == "__main__":
    print("Testing Document & Excel Processing Toolkit")
    print("=" * 40)
    
    excel_ok = test_excel_processing()
    print()
    doc_ok = test_document_processing()
    
    print()
    if excel_ok and doc_ok:
        print("All tests passed!")
        sys.exit(0)
    else:
        print("Some tests failed. Please check the output above.")
        sys.exit(1)