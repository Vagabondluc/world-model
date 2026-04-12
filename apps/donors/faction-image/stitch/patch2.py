import os
import re

path = r'D:\coding\dungeon generator\to be merged\faction-image\stitch\code.html'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add Export Dropdown Menu
export_btn = '''<button class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 border-2 border-primary bg-primary/20 hover:bg-primary/30 text-white shadow-sm shadow-primary/20 text-sm font-medium leading-normal transition-colors">
<span>Export</span>
</button>'''

export_dropdown = '''
<div class="relative inline-block text-left" id="export-container">
  <button id="btn-export" class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 border-[1.5px] border-primary bg-primary/10 hover:bg-primary/20 text-white text-sm font-medium leading-normal transition-colors gap-1">
    <span>Export</span><span class="material-symbols-outlined text-[16px]">expand_more</span>
  </button>
  <div id="export-menu" class="hidden absolute right-0 mt-2 w-48 rounded-lg border border-border-dark bg-panel-dark shadow-xl py-1 text-sm text-slate-300 z-50">
    <button class="w-full text-left px-4 py-2 hover:bg-white/10 hover:text-white flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">content_copy</span>Copy SVG</button>
    <button class="w-full text-left px-4 py-2 hover:bg-white/10 hover:text-white flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">download</span>Download SVG</button>
    <button class="w-full text-left px-4 py-2 hover:bg-white/10 hover:text-white flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">image</span>Download PNG</button>
    <button class="w-full text-left px-4 py-2 hover:bg-white/10 hover:text-white flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">data_object</span>Download JSON</button>
    <div class="h-px bg-border-dark my-1"></div>
    <button class="w-full text-left px-4 py-2 hover:bg-white/10 hover:text-white flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">code</span>Copy React Code</button>
  </div>
</div>
'''
if 'id="export-container"' not in text:
    # Handle both the original stitch styling and the styling added by our first script
    if export_btn in text:
        text = text.replace(export_btn, export_dropdown)
    else:
        # Fallback to older style if it wasn't replaced properly
        text = re.sub(r'<button class="[^"]*">[^<]*<span>Export</span>[^<]*</button>', export_dropdown, text)

# 2. Add Content to Frame and Advanced
frame_content = '''<div id="content-frame" class="hidden pb-4 px-2 space-y-4">
  <div class="flex flex-col gap-1">
    <label class="text-slate-300 text-sm font-medium">Seed</label>
    <div class="flex items-center gap-2">
      <input type="text" class="w-full rounded-lg h-9 px-3 border border-border-dark bg-background-dark text-white text-sm focus:outline-none focus:border-primary/50" placeholder="Randomize...">
      <button class="h-9 w-9 flex items-center justify-center rounded-lg border border-border-dark bg-background-dark text-text-muted hover:text-white"><span class="material-symbols-outlined text-[18px]">casino</span></button>
      <button class="h-9 w-9 flex items-center justify-center rounded-lg border border-border-dark bg-background-dark text-text-muted hover:text-white"><span class="material-symbols-outlined text-[18px]">lock_open</span></button>
    </div>
  </div>
  <div class="flex flex-col gap-1">
    <label class="text-slate-300 text-sm font-medium">Complexity</label>
    <div class="flex items-center gap-3">
        <span class="text-xs text-text-muted">Low</span>
        <div class="h-1 flex-1 bg-border-dark rounded-full"><div class="h-full bg-primary w-1/2 rounded-full relative"><div class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div></div></div>
        <span class="text-xs text-text-muted">High</span>
    </div>
  </div>
  <div class="flex flex-col gap-2 mt-2">
    <label class="flex items-center gap-2 text-slate-300 text-sm"><input type="checkbox" class="rounded border-border-dark bg-background-dark text-primary focus:ring-primary/50" checked> Ornamental Ring</label>
    <label class="flex items-center gap-2 text-slate-300 text-sm"><input type="checkbox" class="rounded border-border-dark bg-background-dark text-primary focus:ring-primary/50" checked> Halo Wash</label>
    <label class="flex items-center gap-2 text-slate-300 text-sm"><input type="checkbox" class="rounded border-border-dark bg-background-dark text-primary focus:ring-primary/50" checked> Glyph Dust</label>
  </div>
</div>'''
text = re.sub(r'<div id="content-frame".*?</div>', frame_content, text, flags=re.DOTALL)


advanced_content = '''<div id="content-advanced" class="hidden pt-2 pb-4 px-2 space-y-4">
  <div class="flex flex-col gap-1">
    <label class="text-slate-300 text-sm font-medium">Main Symbol</label>
    <div class="relative select-menu">
        <button class="flex w-full items-center justify-between rounded-lg h-9 px-3 border border-border-dark bg-background-dark text-white text-sm"><span>None</span><span class="material-symbols-outlined text-[16px]">expand_more</span></button>
        <div class="hidden absolute left-0 right-0 mt-1 rounded-lg border border-border-dark bg-panel-dark shadow-xl py-1 z-40 max-h-48 overflow-y-auto">
            <button class="w-full text-left px-3 py-1.5 hover:bg-white/10 text-white">None</button>
            <button class="w-full text-left px-3 py-1.5 hover:bg-white/10 text-slate-300">Cross</button>
            <button class="w-full text-left px-3 py-1.5 hover:bg-white/10 text-slate-300">Star</button>
            <button class="w-full text-left px-3 py-1.5 hover:bg-white/10 text-slate-300">Crescent</button>
        </div>
    </div>
  </div>
  <div class="flex flex-col gap-1">
    <label class="text-slate-300 text-sm font-medium">Background Shape</label>
    <div class="relative select-menu">
        <button class="flex w-full items-center justify-between rounded-lg h-9 px-3 border border-border-dark bg-background-dark text-white text-sm"><span>Square</span><span class="material-symbols-outlined text-[16px]">expand_more</span></button>
        <div class="hidden absolute left-0 right-0 mt-1 rounded-lg border border-border-dark bg-panel-dark shadow-xl py-1 z-40 max-h-48 overflow-y-auto">
            <button class="w-full text-left px-3 py-1.5 hover:bg-white/10 text-slate-300">None</button>
            <button class="w-full text-left px-3 py-1.5 hover:bg-white/10 text-white">Square</button>
            <button class="w-full text-left px-3 py-1.5 hover:bg-white/10 text-slate-300">Hexagon</button>
            <button class="w-full text-left px-3 py-1.5 hover:bg-white/10 text-slate-300">Circle</button>
        </div>
    </div>
  </div>
  <div class="flex flex-col gap-1">
    <label class="text-slate-300 text-sm font-medium">Color Preset</label>
    <div class="relative select-menu">
        <button class="flex w-full items-center justify-between rounded-lg h-9 px-3 border border-border-dark bg-background-dark text-white text-sm"><span>Domain Default</span><span class="material-symbols-outlined text-[16px]">expand_more</span></button>
        <div class="hidden absolute left-0 right-0 mt-1 rounded-lg border border-border-dark bg-panel-dark shadow-xl py-1 z-40 max-h-48 overflow-y-auto">
            <button class="w-full text-left px-3 py-1.5 hover:bg-white/10 text-white">Domain Default</button>
            <button class="w-full text-left px-3 py-1.5 hover:bg-white/10 text-slate-300">Vampiric</button>
            <button class="w-full text-left px-3 py-1.5 hover:bg-white/10 text-slate-300">Celestial</button>
            <button class="w-full text-left px-3 py-1.5 hover:bg-white/10 text-slate-300">Abyssal</button>
        </div>
    </div>
  </div>
  <div class="grid grid-cols-2 gap-2 mt-2">
    <div class="flex items-center justify-between"><span class="text-text-muted text-xs">Primary</span><div class="w-5 h-5 rounded bg-primary border border-white/20"></div></div>
    <div class="flex items-center justify-between"><span class="text-text-muted text-xs">Secondary</span><div class="w-5 h-5 rounded bg-fuchsia-600 border border-white/20"></div></div>
    <div class="flex items-center justify-between"><span class="text-text-muted text-xs">Accent</span><div class="w-5 h-5 rounded bg-amber-400 border border-white/20"></div></div>
    <div class="flex items-center justify-between"><span class="text-text-muted text-xs">Background</span><div class="w-5 h-5 rounded bg-slate-900 border border-white/20"></div></div>
  </div>
</div>'''
text = re.sub(r'<div id="content-advanced".*?</div>', advanced_content, text, flags=re.DOTALL)


# 3. JS for custom dropdowns
js_additions = '''
    // Export Menu
    const btnExport = document.getElementById('btn-export');
    const exportMenu = document.getElementById('export-menu');
    if(btnExport && exportMenu) {
        btnExport.addEventListener('click', (e) => {
            e.stopPropagation();
            exportMenu.classList.toggle('hidden');
        });
        document.addEventListener('click', () => exportMenu.classList.add('hidden'));
    }

    // Custom Select Menus
    document.querySelectorAll('.select-menu').forEach(menu => {
        const btn = menu.querySelector('button');
        const list = menu.querySelector('div');
        const label = btn.querySelector('span:first-child');
        
        if (btn && list) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                // Close others
                document.querySelectorAll('.select-menu div').forEach(d => {
                    if (d !== list) d.classList.add('hidden');
                });
                list.classList.toggle('hidden');
            });
            
            list.querySelectorAll('button').forEach(option => {
                option.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    label.textContent = option.textContent.trim();
                    list.classList.add('hidden');
                    
                    // Update active styling
                    list.querySelectorAll('button').forEach(b => {
                        b.classList.remove('text-white');
                        b.classList.add('text-slate-300');
                    });
                    option.classList.remove('text-slate-300');
                    option.classList.add('text-white');
                });
            });
        }
    });

    // Close all menus on document click
    document.addEventListener('click', () => {
        document.querySelectorAll('.select-menu div').forEach(d => d.classList.add('hidden'));
    });
'''
if 'Export Menu' not in text:
    text = text.replace('});\n</script>', js_additions + '\n});\n</script>')

# Replace static dropdowns in Look & Feel with interactive ones
look_and_feel = '''<div class="flex flex-col gap-1">
<label class="text-slate-300 text-sm font-medium">Mood</label>
<div class="relative select-menu">
<button class="flex w-full items-center justify-between rounded-lg h-9 px-3 border border-border-dark bg-background-dark text-white text-sm"><span>Ethereal</span><span class="material-symbols-outlined text-[16px]">expand_more</span></button>
<div class="hidden absolute left-0 right-0 mt-1 rounded-lg border border-border-dark bg-panel-dark shadow-xl py-1 z-40">
<button class="w-full text-left px-3 py-1.5 hover:bg-white/10 text-white">Ethereal</button>
<button class="w-full text-left px-3 py-1.5 hover:bg-white/10 text-slate-300">Stark</button>
<button class="w-full text-left px-3 py-1.5 hover:bg-white/10 text-slate-300">Vibrant</button>
<button class="w-full text-left px-3 py-1.5 hover:bg-white/10 text-slate-300">Muted</button>
</div></div></div>'''
text = re.sub(r'<div class="flex flex-col gap-1">\s*<label class="text-slate-300 text-sm font-medium">Mood</label>.*?</div>\s*</div>', look_and_feel, text, flags=re.DOTALL)

# Add full context menu options back
menu_updated = '''<div id="context-menu" class="hidden absolute z-50 w-48 rounded-lg border border-border-dark bg-panel-dark shadow-xl py-1 text-sm text-slate-300">
  <button class="w-full text-left px-4 py-2 hover:bg-white/10 hover:text-white flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">file_copy</span>Duplicate <span class="ml-auto text-xs text-text-muted">Ctrl+D</span></button>
  <button class="w-full text-left px-4 py-2 hover:bg-white/10 hover:text-white flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">folder</span>Group <span class="ml-auto text-xs text-text-muted">Ctrl+G</span></button>
  <button class="w-full text-left px-4 py-2 hover:bg-white/10 hover:text-white flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">edit</span>Rename</button>
  <button class="w-full text-left px-4 py-2 hover:bg-white/10 hover:text-white flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">visibility_off</span>Hide</button>
  <div class="h-px bg-border-dark my-1"></div>
  <button class="w-full text-left px-4 py-2 hover:bg-white/10 hover:text-white flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">opacity</span>Set 50% Opacity</button>
  <button class="w-full text-left px-4 py-2 hover:bg-white/10 hover:text-white flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">layers</span>Set Blend Overlay</button>
  <div class="h-px bg-border-dark my-1"></div>
  <button class="w-full text-left px-4 py-2 hover:bg-white/10 hover:text-white flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">vertical_align_bottom</span>Merge Down</button>
  <div class="h-px bg-border-dark my-1"></div>
  <button class="w-full text-left px-4 py-2 hover:bg-red-500/20 text-red-400 hover:text-red-300 flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">delete_forever</span>Delete Selected</button>
</div>'''

if 'Merge Down' not in text:
    text = re.sub(r'<div id="context-menu".*?</div>\s*</div>', menu_updated, text, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated menus successfully.')
