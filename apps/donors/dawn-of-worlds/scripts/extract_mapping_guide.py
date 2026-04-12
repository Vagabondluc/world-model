
import fitz  # pymupdf
import os
import re

def clean_and_reformat_text(text):
    """
    Cleans up extracted text:
    1. Removes headers/footers/page numbers (basic heuristic).
    2. Merges split lines to restore paragraphs.
    3. Splits text into one sentence per line.
    """
    lines = text.splitlines()
    cleaned_lines = []
    
    # 1. Basic filtering of obviously garbage lines (pure numbers)
    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
        if re.match(r'^\d+$', stripped): # Page numbers
            continue
        cleaned_lines.append(stripped)
        
    # 2. Merge paragraphs
    # Heuristic: If a line ends with a hyphen, remove hyphen and join.
    # If a line does NOT end with sentence-ending punctuation, join with space.
    # If it ends with punctuation, likely end of sentence/paragraph, so keep newline.
    
    merged_text = ""
    for i, line in enumerate(cleaned_lines):
        if i == 0:
            merged_text = line
            continue
        
        prev_line = cleaned_lines[i-1]
        
        # Check if previous line looks like it continues
        # e.g. doesn't end in . ! ? " or is very short (header?)
        
        if merged_text.endswith("-"):
            # Hyphenated word split
            merged_text = merged_text[:-1] + line
        elif not re.search(r'[.!?]["\']?$', prev_line) and len(prev_line) > 30: # arbitrary length check to avoid merging headers
            # Continues
            merged_text += " " + line
        else:
            # New paragraph/sentence
            merged_text += "\n" + line
            
    # 3. Sentence Splitting
    # Regex to find sentence boundaries: Punctuation followed by space and capital letter
    # This is a simple approximation.
    
    # "Hello. World." -> "Hello.\nWorld."
    # (?<=[.!?])\s+(?=[A-Z])
    
    sentences = re.split(r'(?<=[.!?])\s+(?=[A-Z])', merged_text)
    
    # Clean up each sentence
    final_output = []
    for s in sentences:
        s = s.strip()
        if s:
            final_output.append(s)
            
    return "\n".join(final_output)

def find_header_on_page(page_text, title):
    """
    Finds the start index of the title in the page text.
    """
    # Try exact match
    idx = page_text.find(title)
    if idx != -1:
        return idx
    
    # Try case-insensitive
    idx = page_text.lower().find(title.lower())
    if idx != -1:
        return idx
        
    # Try with normalized whitespace
    escaped_title = re.escape(title)
    pattern = escaped_title.replace(r'\ ', r'\s+')
    match = re.search(pattern, page_text, re.IGNORECASE)
    if match:
        return match.start()
        
    return -1

def extract_pdf_to_markdown(pdf_path, output_dir):
    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(f"Error opening PDF: {e}")
        return

    toc = doc.get_toc()
    if not toc:
        print("No TOC found.")
        return

    print(f"Found {len(toc)} TOC entries.")
    
    # We will accumulate RAW text first, maintaining the section splitting logic,
    # and THEN clean/reformat each section's content.
    
    output_sections = {} # index -> raw_text
    current_section_idx = -1
    raw_current_content = []
    
    page_to_sections = {}
    for i, (level, title, page_num) in enumerate(toc):
        if page_num not in page_to_sections:
            page_to_sections[page_num] = []
        page_to_sections[page_num].append((i, level, title))

    # Preamble content
    
    for p_num in range(1, doc.page_count + 1):
        page_text = doc[p_num - 1].get_text()
        remaining_page_text = page_text
        
        if p_num in page_to_sections:
            sections_on_page = page_to_sections[p_num]
            sections_on_page.sort(key=lambda x: x[0])
            
            for i, level, title in sections_on_page:
                split_idx = find_header_on_page(remaining_page_text, title)
                
                if split_idx != -1:
                    # Close OLD section
                    pre_slice = remaining_page_text[:split_idx]
                    raw_current_content.append(pre_slice)
                    
                    if current_section_idx != -1:
                        output_sections[current_section_idx] = "".join(raw_current_content)
                    
                    # Start NEW section
                    current_section_idx = i
                    raw_current_content = []
                    remaining_page_text = remaining_page_text[split_idx:]
                else:
                    # If not found, minimal fallback (rare case logic from before)
                    # For simplicity, if we really can't find it, we might just assume it starts at page top?
                    if len(sections_on_page) == 1 and remaining_page_text == page_text:
                         if current_section_idx != -1:
                             output_sections[current_section_idx] = "".join(raw_current_content)
                         current_section_idx = i
                         raw_current_content = []

        raw_current_content.append(remaining_page_text)

    # Save final section
    if current_section_idx != -1:
        output_sections[current_section_idx] = "".join(raw_current_content)

    # Now PROCESS and WRITE each section
    
    # Also create Consolidated file
    consolidated_text = []

    for i in sorted(output_sections.keys()):
        level, title, _ = toc[i]
        raw_text = output_sections[i]
        
        # Clean and Format
        # Remove the title from the start if it exists to avoid duplication in "sentence per line"
        # (Since we add MD header)
        # But `raw_text` starts with the header string usually.
        # Let's clean the whole thing.
        
        formatted_text = clean_and_reformat_text(raw_text)
        
        # Write File
        safe_title = re.sub(r'[\\/*?:"<>|]', "", title)
        filename = f"{i + 1:02d} - {safe_title.strip()}.md"
        
        full_md = f"# {title}\n\n{formatted_text}\n"
        with open(os.path.join(output_dir, filename), "w", encoding="utf-8") as f:
            f.write(full_md)
        print(f"Wrote {filename}")
        
        # Add to consolidated
        consolidated_text.append(f"# {title}\n\n{formatted_text}\n\n")

    # Write Consolidated
    with open(os.path.join(output_dir, "00 - Complete Guide to Mapping.md"), "w", encoding="utf-8") as f:
        f.write("# A Magical Society Guide to Mapping\n\n")
        f.write("".join(consolidated_text))
    print("Wrote 00 - Complete Guide to Mapping.md")

if __name__ == "__main__":
    pdf_file = os.path.join("docs", "pdf", "A Magical Society Guide to Mapping.pdf")
    out_dir = os.path.join("docs", "guide_to_mapping")
    
    if not os.path.exists(pdf_file):
        print(f"File not found: {pdf_file}")
    else:
        if not os.path.exists(out_dir):
            os.makedirs(out_dir)
        extract_pdf_to_markdown(pdf_file, out_dir)
