
import fitz
import os

pdf_path = os.path.join("docs", "pdf", "A Magical Society Guide to Mapping.pdf")
output_path = "debug_toc.txt"

try:
    doc = fitz.open(pdf_path)
    print(f"Total Pages: {doc.page_count}")
    
    toc = doc.get_toc()
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(f"Total Pages: {doc.page_count}\n")
        f.write("--- TOC ---\n")
        for item in toc:
            f.write(f"{item}\n")
            
    print(f"TOC written to {output_path}")

except Exception as e:
    print(e)
