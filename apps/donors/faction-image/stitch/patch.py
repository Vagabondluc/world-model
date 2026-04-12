import os

path = r'D:\coding\dungeon generator\to be merged\faction-image\stitch\code.html'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Add IDs to accordions
text = text.replace('<button class=\"flex items-center justify-between w-full text-text-muted hover:text-white transition-colors pb-3 mb-2 border-b border-border-dark\">\n<span class=\"text-sm font-bold\">Frame</span>',
'<button id=\"btn-frame\" class=\"flex items-center justify-between w-full text-text-muted hover:text-white transition-colors pb-3 mb-2 border-b border-border-dark\">\n<span class=\"text-sm font-bold\">Frame</span>')

text = text.replace('<button id=\"btn-frame\" class=\"', '<button id=\"btn-frame\" class=\"', 1) # just in case
if 'content-frame' not in text:
    text = text.replace('</button>\n<button class=\"flex items-center justify-between w-full text-text-muted hover:text-white transition-colors\">\n<span class=\"text-sm font-bold\">Advanced</span>',
    '</button>\n<div id=\"content-frame\" class=\"hidden pb-4 text-slate-400 text-xs px-2\">Seed, complexity, and shape controls...</div>\n<button id=\"btn-advanced\" class=\"flex items-center justify-between w-full text-text-muted hover:text-white transition-colors\">\n<span class=\"text-sm font-bold\">Advanced</span>')
    
    text = text.replace('<span class=\"text-sm font-bold\">Advanced</span>\n<span class=\"material-symbols-outlined\">chevron_right</span>\n</button>',
    '<span class=\"text-sm font-bold\">Advanced</span>\n<span class=\"material-symbols-outlined\">chevron_right</span>\n</button>\n<div id=\"content-advanced\" class=\"hidden pt-2 pb-2 text-slate-400 text-xs px-2\">Color presets, line weights...</div>')

# Right column
text = text.replace('<h3 class=\"text-white text-sm font-bold leading-tight mb-3\">Layers</h3>',
'<div class=\"flex items-center justify-between mb-3\"><h3 class=\"text-white text-sm font-bold leading-tight\">Layers</h3><button id=\"btn-settings\" class=\"text-text-muted hover:text-white relative\"><span class=\"material-symbols-outlined text-[18px]\">settings</span></button></div>')

text = text.replace('<div class=\"flex items-center justify-between rounded-lg p-2 bg-primary/10 border border-primary/30 mb-2\">',
'<div id=\"layer-item-1\" class=\"flex items-center justify-between rounded-lg p-2 bg-primary/10 border border-primary/30 mb-2 cursor-pointer\">')

text = text.replace('<button class=\"flex items-center justify-between w-full text-text-muted hover:text-white transition-colors\">\n<span class=\"text-sm font-bold\">Transform</span>',
'<button id=\"btn-transform\" class=\"flex items-center justify-between w-full text-text-muted hover:text-white transition-colors\">\n<span class=\"text-sm font-bold\">Transform</span>')

text = text.replace('<span class=\"text-sm font-bold\">Transform</span>\n<span class=\"material-symbols-outlined\">chevron_right</span>\n</button>',
'<span class=\"text-sm font-bold\">Transform</span>\n<span class=\"material-symbols-outlined\">chevron_right</span>\n</button>\n<div id=\"content-transform\" class=\"hidden pt-4 space-y-3\">\n<div class=\"flex justify-between items-center\"><span class=\"text-slate-300 text-xs\">Rotation</span><span class=\"text-white text-xs\">0°</span></div>\n<div class=\"flex justify-between items-center\"><span class=\"text-slate-300 text-xs\">Scale</span><span class=\"text-white text-xs\">100%</span></div>\n</div>')

# Append UI components and JS before </body>
ui_additions = """
<!-- Absolute overlays -->
<div id="context-menu" class="hidden absolute z-50 w-48 rounded-lg border border-border-dark bg-panel-dark shadow-xl py-1 text-sm text-slate-300">
  <button class="w-full text-left px-4 py-2 hover:bg-white/10 hover:text-white flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">file_copy</span>Duplicate</button>
  <button class="w-full text-left px-4 py-2 hover:bg-white/10 hover:text-white flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">folder</span>Group</button>
  <div class="h-px bg-border-dark my-1"></div>
  <button class="w-full text-left px-4 py-2 hover:bg-red-500/20 text-red-400 hover:text-red-300 flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">delete</span>Delete Empty</button>
  <button class="w-full text-left px-4 py-2 hover:bg-red-500/20 text-red-400 hover:text-red-300 flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">delete_forever</span>Delete Selected</button>
</div>

<div id="settings-popover" class="hidden absolute z-50 right-[300px] top-[100px] w-64 rounded-lg border border-border-dark bg-panel-dark shadow-xl p-4 text-sm">
  <h4 class="text-white font-bold mb-3">Sidebar Settings</h4>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <div class="flex justify-between items-center"><label class="text-slate-300">Sidebar Width</label><span class="text-white text-xs">280px</span></div>
      <div class="flex items-center gap-2"><span class="text-xs text-text-muted">220</span><div class="h-1 flex-1 bg-border-dark rounded-full"><div class="h-full bg-primary w-1/3 rounded-full relative"><div class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div></div></div><span class="text-xs text-text-muted">520</span></div>
    </div>
    <div class="flex justify-between items-center">
      <span class="text-slate-300">Auto-hide Sidebar</span>
      <div class="w-8 h-4 rounded-full bg-border-dark relative"><div class="w-4 h-4 rounded-full bg-slate-400 absolute left-0"></div></div>
    </div>
    <div class="flex justify-between items-center">
      <span class="text-slate-300">Show Templates</span>
      <div class="w-8 h-4 rounded-full bg-primary relative"><div class="w-4 h-4 rounded-full bg-white absolute right-0"></div></div>
    </div>
  </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    // Context menu
    const layerItem = document.getElementById('layer-item-1');
    const ctxMenu = document.getElementById('context-menu');
    
    if(layerItem) {
        layerItem.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            ctxMenu.style.left = e.pageX + 'px';
            ctxMenu.style.top = e.pageY + 'px';
            ctxMenu.classList.remove('hidden');
        });
    }

    document.addEventListener('click', () => {
        if(ctxMenu) ctxMenu.classList.add('hidden');
    });

    // Accordions
    const sections = [
        { btnId: 'btn-frame', contentId: 'content-frame' },
        { btnId: 'btn-advanced', contentId: 'content-advanced' },
        { btnId: 'btn-transform', contentId: 'content-transform' }
    ];

    sections.forEach(s => {
        const btn = document.getElementById(s.btnId);
        const content = document.getElementById(s.contentId);
        if(btn && content) {
            btn.addEventListener('click', () => {
                content.classList.toggle('hidden');
                const icon = btn.querySelector('.material-symbols-outlined');
                if(content.classList.contains('hidden')) {
                    icon.textContent = 'chevron_right';
                } else {
                    icon.textContent = 'expand_more';
                }
            });
        }
    });

    // Settings popover
    const gearBtn = document.getElementById('btn-settings');
    const settingsPop = document.getElementById('settings-popover');
    if(gearBtn && settingsPop) {
        gearBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsPop.classList.toggle('hidden');
            
            // basic positioning right near the button
            const rect = gearBtn.getBoundingClientRect();
            settingsPop.style.top = (rect.bottom + 10) + 'px';
            settingsPop.style.left = (rect.left - 200) + 'px';
        });
        settingsPop.addEventListener('click', (e) => e.stopPropagation());
        document.addEventListener('click', () => settingsPop.classList.add('hidden'));
    }
});
</script>
"""

if 'id="context-menu"' not in text:
    text = text.replace('</body>', ui_additions + '\n</body>')

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print('JS and menus added.')
