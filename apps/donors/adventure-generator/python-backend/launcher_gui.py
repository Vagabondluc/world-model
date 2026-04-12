from __future__ import annotations

import logging
from pathlib import Path
import sys
import threading
import tkinter as tk
from tkinter import scrolledtext, ttk, messagebox, filedialog
from typing import Any, Optional
import webbrowser

import requests
import uvicorn

# Context: main.py has 'app' object
from main import app, settings


class TextHandler(logging.Handler):
    """Logging handler that writes to a Tkinter ScrolledText widget."""
    def __init__(self, text_widget: tk.Text) -> None:
        super().__init__()
        self.text_widget: tk.Text = text_widget

    def emit(self, record: logging.LogRecord) -> None:
        msg = self.format(record)
        def append():
            self.text_widget.configure(state='normal')
            self.text_widget.insert(tk.END, msg + '\n')
            self.text_widget.see(tk.END)
            self.text_widget.configure(state='disabled')
        if not self.text_widget.winfo_exists():
            return
        self.text_widget.after(0, append)


class BackendGUI:
    def __init__(self, root: tk.Tk) -> None:
        self.root: tk.Tk = root
        self.root.title("AI Backend Server")
        self.root.geometry("850x700")
        
        # Use a cleaner theme
        style = ttk.Style()
        style.theme_use('clam')
        
        # Define colors (Softer Dark Mode)
        self.bg_color: str = "#2b2b2b"
        self.fg_color: str = "#e0e0e0"
        self.accent_color: str = "#4a90e2"
        self.entry_bg: str = "#3c3c3c"
        
        self.root.configure(bg=self.bg_color)
        
        # Configure Ttk Styles
        style.configure(".", background=self.bg_color, foreground=self.fg_color, font=("Segoe UI", 10))
        style.configure("TFrame", background=self.bg_color)
        style.configure("TLabel", background=self.bg_color, foreground=self.fg_color)
        style.configure("TButton", background="#404040", foreground="#ffffff", borderwidth=1)
        style.map("TButton", background=[("active", self.accent_color)])
        
        style.configure("Header.TLabel", font=("Segoe UI", 16, "bold"), foreground=self.accent_color)
        style.configure("Section.TLabel", font=("Segoe UI", 11, "bold"), foreground="#a0a0a0")
        style.configure("Status.TLabel", font=("Segoe UI", 10, "bold"))
        
        # Input fields style
        style.configure("TEntry", fieldbackground=self.entry_bg, foreground=self.fg_color, insertcolor="white")
        style.map("TEntry", fieldbackground=[("readonly", self.entry_bg)])
        
        # Create Menu Bar
        self.create_menu()

        # Header
        header_frame = ttk.Frame(root)
        header_frame.pack(fill=tk.X, padx=15, pady=15)
        
        ttk.Label(header_frame, text="⚡ D&D AI Backend", style="Header.TLabel").pack(side=tk.LEFT)
        
        self.server_status_var: tk.StringVar = tk.StringVar(value="Stopped")
        self.server_status_label = ttk.Label(header_frame, textvariable=self.server_status_var, style="Status.TLabel", foreground="#ff5555")
        self.server_status_label.pack(side=tk.RIGHT)

        # Create notebook for tabbed interface
        notebook = ttk.Notebook(root)
        notebook.pack(fill=tk.BOTH, expand=True, padx=10, pady=(0, 10))

        # Tab 1: Configuration
        config_tab = ttk.Frame(notebook)
        notebook.add(config_tab, text="Configuration")
        self.create_config_tab(config_tab)

        # Tab 2: Knowledge Base (RAG)
        rag_tab = ttk.Frame(notebook)
        notebook.add(rag_tab, text="Knowledge Base")
        self.create_rag_tab(rag_tab)

        # Tab 3: Logs
        logs_tab = ttk.Frame(notebook)
        notebook.add(logs_tab, text="Logs")
        self.create_logs_tab(logs_tab)

        # Server state
        self.server_thread: Optional[threading.Thread] = None
        self.server_running: bool = False
        self.server: Optional[uvicorn.Server] = None
        self.base_url: str = ""
        
        # Initialize data
        self.root.after(100, self.initialize_data)

    def create_menu(self) -> None:
        menubar = tk.Menu(self.root)
        self.root.config(menu=menubar)
        
        # File Menu
        file_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="File", menu=file_menu)
        file_menu.add_command(label="Exit", command=self.root.quit)
        
        # Help Menu
        help_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="Help", menu=help_menu)
        help_menu.add_command(label="Documentation", command=self.open_docs)
        help_menu.add_separator()
        help_menu.add_command(label="About", command=self.show_about)

    def get_auth_headers(self) -> dict[str, str]:
        """Get headers with API Key if set."""
        headers: dict[str, str] = {}
        if hasattr(self, 'api_key_var'):
            key = self.api_key_var.get().strip()
            if key:
                headers["X-API-Key"] = key
        return headers

    def create_config_tab(self, parent: tk.Widget) -> None:
        """Create the configuration tab."""
        # Main container with scrolling? No, plain pack for now
        main_frame = ttk.Frame(parent, padding=15)
        main_frame.pack(fill=tk.BOTH, expand=True)

        # --- Security ---
        sec_frame = ttk.LabelFrame(main_frame, text="Security", padding=10)
        sec_frame.pack(fill=tk.X, pady=(0, 10))
        
        sec_inner = ttk.Frame(sec_frame)
        sec_inner.pack(fill=tk.X)
        ttk.Label(sec_inner, text="API Key:").pack(side=tk.LEFT)
        self.api_key_var: tk.StringVar = tk.StringVar(value=settings.API_KEY or "")
        self.api_key_entry: ttk.Entry = ttk.Entry(sec_inner, textvariable=self.api_key_var, show="*", width=30)
        self.api_key_entry.pack(side=tk.LEFT, padx=10, fill=tk.X, expand=True)
        
        self.show_key_var: tk.BooleanVar = tk.BooleanVar(value=False)
        ttk.Checkbutton(sec_inner, text="Show", variable=self.show_key_var, command=self.toggle_key_visibility).pack(side=tk.LEFT, padx=5)
        ttk.Button(sec_inner, text="Update Key", command=self.update_api_key).pack(side=tk.LEFT, padx=5)

        # --- AI Provider ---
        prov_frame = ttk.LabelFrame(main_frame, text="Provider & Model", padding=10)
        prov_frame.pack(fill=tk.X, pady=(0, 10))
        
        # Row 1: Selection
        r1 = ttk.Frame(prov_frame)
        r1.pack(fill=tk.X, pady=5)
        ttk.Label(r1, text="Provider:").pack(side=tk.LEFT, width=10)
        self.provider_var: tk.StringVar = tk.StringVar(value=settings.AI_PROVIDER)
        self.provider_combo: ttk.Combobox = ttk.Combobox(r1, textvariable=self.provider_var, state="readonly", values=["ollama", "lm_studio", "webui"])
        self.provider_combo.pack(side=tk.LEFT, fill=tk.X, expand=True)
        self.provider_combo.bind("<<ComboboxSelected>>", self.on_provider_change)
        
        ttk.Label(r1, text="   Model:").pack(side=tk.LEFT, width=8)
        self.model_var: tk.StringVar = tk.StringVar(value=settings.DEFAULT_MODEL)
        self.model_combo: ttk.Combobox = ttk.Combobox(r1, textvariable=self.model_var, width=25)
        self.model_combo.pack(side=tk.LEFT, fill=tk.X, expand=True)
        self.model_combo.bind("<<ComboboxSelected>>", self.on_model_change)
        ttk.Button(r1, text="🔄", width=3, command=self.refresh_models).pack(side=tk.LEFT, padx=(5,0))

        # Row 2: URL & Test
        r2 = ttk.Frame(prov_frame)
        r2.pack(fill=tk.X, pady=5)
        self.url_label_var: tk.StringVar = tk.StringVar(value=f"{settings.AI_PROVIDER.upper()} URL:")
        ttk.Label(r2, textvariable=self.url_label_var, width=15).pack(side=tk.LEFT)
        self.provider_url_var: tk.StringVar = tk.StringVar(value=settings.get_active_url())
        entry = ttk.Entry(r2, textvariable=self.provider_url_var)
        entry.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 10))
        ttk.Button(r2, text="Test Connection", command=self.test_provider_connection).pack(side=tk.LEFT)
        
        # Row 3: Status
        r3 = ttk.Frame(prov_frame)
        r3.pack(fill=tk.X, pady=(5,0))
        ttk.Label(r3, text="Status:").pack(side=tk.LEFT, width=10)
        self.provider_status_var: tk.StringVar = tk.StringVar(value="Unknown")
        self.provider_status_label = ttk.Label(r3, textvariable=self.provider_status_var, foreground="#888888")
        self.provider_status_label.pack(side=tk.LEFT)

        # --- Add-ons ---
        self.create_addons_section(main_frame)

        # --- Server Control ---
        ctrl_frame = ttk.LabelFrame(main_frame, text="Server Control", padding=10)
        ctrl_frame.pack(fill=tk.X, pady=10)
        
        c_inner = ttk.Frame(ctrl_frame)
        c_inner.pack(fill=tk.X)
        
        ttk.Label(c_inner, text="Port:").pack(side=tk.LEFT)
        self.port_entry = ttk.Entry(c_inner, width=8)
        self.port_entry.insert(0, "8000")
        self.port_entry.pack(side=tk.LEFT, padx=5)
        
        self.start_btn: ttk.Button = ttk.Button(c_inner, text="▶ Start Server", command=self.start_server)
        self.start_btn.pack(side=tk.LEFT, padx=10)
        
        self.stop_btn: ttk.Button = ttk.Button(c_inner, text="⏹ Stop", command=self.stop_server, state='disabled')
        self.stop_btn.pack(side=tk.LEFT, padx=5)
        
        self.restart_btn: ttk.Button = ttk.Button(c_inner, text="🔃 Restart", command=self.restart_server, state='disabled')
        self.restart_btn.pack(side=tk.LEFT, padx=5)

    def create_addons_section(self, parent: tk.Widget) -> None:
        addons_frame = ttk.LabelFrame(parent, text="Add-ons", padding=10)
        addons_frame.pack(fill=tk.BOTH, expand=True, pady=(0, 10))
        
        toolbar = ttk.Frame(addons_frame)
        toolbar.pack(fill=tk.X, pady=(0, 5))
        ttk.Button(toolbar, text="Refresh Add-ons", command=self.refresh_addons).pack(side=tk.LEFT)
        ttk.Button(toolbar, text="Apply Changes", command=self.apply_addon_changes).pack(side=tk.RIGHT)
        
        # Canvas for scrollable list
        self.addon_vars: dict[str, tk.BooleanVar] = {}
        self.addon_canvas: tk.Canvas = tk.Canvas(addons_frame, bg=self.entry_bg, highlightthickness=0, height=100)
        scrollbar = ttk.Scrollbar(addons_frame, orient="vertical", command=self.addon_canvas.yview)
        self.addon_scroll_frame: ttk.Frame = ttk.Frame(self.addon_canvas)
        # Fix: need to force style on inner frame
        style = ttk.Style()
        style.configure("Inner.TFrame", background=self.entry_bg) 
        self.addon_scroll_frame.configure(style="Inner.TFrame")

        self.addon_scroll_frame.bind(
            "<Configure>",
            lambda e: self.addon_canvas.configure(scrollregion=self.addon_canvas.bbox("all"))
        )
        
        self.addon_canvas.create_window((0, 0), window=self.addon_scroll_frame, anchor="nw")
        self.addon_canvas.configure(yscrollcommand=scrollbar.set)
        
        self.addon_canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

    def create_rag_tab(self, parent: tk.Widget) -> None:
        """Create the RAG tab."""
        # Top: Config
        cfg = ttk.Frame(parent, padding=10)
        cfg.pack(fill=tk.X)
        
        ttk.Label(cfg, text="RAG Storage Path:").pack(side=tk.LEFT)
        self.rag_path_var: tk.StringVar = tk.StringVar(value=settings.RAG_PERSIST_PATH)
        ttk.Entry(cfg, textvariable=self.rag_path_var).pack(side=tk.LEFT, fill=tk.X, expand=True, padx=5)
        ttk.Button(cfg, text="Browse", command=self.browse_rag_path).pack(side=tk.LEFT)
        ttk.Button(cfg, text="Apply", command=self.apply_rag_config).pack(side=tk.LEFT, padx=5)
        
        # Toolbar
        tool = ttk.Frame(parent, padding=(10, 0))
        tool.pack(fill=tk.X)
        ttk.Button(tool, text="📂 Index Folder", command=self.index_project_folder).pack(side=tk.LEFT, padx=(0,5))
        ttk.Button(tool, text="📄 Upload File", command=self.upload_rag_doc).pack(side=tk.LEFT)
        ttk.Button(tool, text="🔄 Refresh", command=self.refresh_rag_docs).pack(side=tk.RIGHT)
        ttk.Button(tool, text="🗑️ Delete", command=self.delete_rag_doc).pack(side=tk.RIGHT, padx=5)

        # List
        lb_frame = ttk.Frame(parent, padding=10)
        lb_frame.pack(fill=tk.BOTH, expand=True)
        
        self.doc_listbox: tk.Listbox = tk.Listbox(
            lb_frame, 
            bg=self.entry_bg, 
            fg=self.fg_color, 
            font=("Segoe UI", 10),
            selectbackground=self.accent_color,
            borderwidth=0,
            highlightthickness=1
        )
        self.doc_listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        sb = ttk.Scrollbar(lb_frame, orient=tk.VERTICAL, command=self.doc_listbox.yview)
        sb.pack(side=tk.RIGHT, fill=tk.Y)
        self.doc_listbox.config(yscrollcommand=sb.set)

    def create_logs_tab(self, parent: tk.Widget) -> None:
        self.log_area: scrolledtext.ScrolledText = scrolledtext.ScrolledText(
            parent, 
            state='disabled', 
            bg="#1e1e1e", 
            fg="#d0d0d0", 
            font=("Consolas", 9),
            borderwidth=0
        )
        self.log_area.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

        # Setup Logging
        handler = TextHandler(self.log_area)
        formatter = logging.Formatter('%(asctime)s %(levelname)s: %(message)s', datefmt='%H:%M:%S')
        handler.setFormatter(formatter)
        
        logging.getLogger("uvicorn").addHandler(handler)
        logging.getLogger("uvicorn.error").addHandler(handler)
        logging.getLogger("uvicorn.access").addHandler(handler)
        logging.getLogger("uvicorn").setLevel(logging.INFO)

    def show_about(self) -> None:
        messagebox.showinfo("About", "D&D AI Backend Server\nv0.3.0\n\nOptimized for Ollama & RAG")

    # --- Logic Methods ---

    def test_provider_connection(self) -> None:
        """Test connection with verbose errors."""
        provider = self.provider_var.get()
        url = self.provider_url_var.get()
        
        def update_status(msg: str, color: str) -> None:
            self.provider_status_var.set(msg)
            self.provider_status_label.configure(foreground=color)

        update_status("Testing...", "#aaaaaa")
        self.root.update()

        try:
            if not self.server_running:
                # Direct test
                if provider == "ollama":
                    clean_url = url.replace("/v1", "")
                    try:
                        res = requests.get(f"{clean_url}/api/version", timeout=3)
                        if res.status_code == 200:
                            update_status(f"🟢 Connected (v{res.json().get('version')})", "#55ff55")
                        else:
                            update_status(f"🔴 HTTP {res.status_code}: {res.text[:50]}", "#ff5555")
                    except requests.exceptions.ConnectionError:
                         update_status("🔴 Connection Refused", "#ff5555")
                else:
                    # Simple GET
                    res = requests.get(f"{url}/models", timeout=3)
                    if res.status_code == 200:
                        update_status("🟢 Connected", "#55ff55")
                    else:
                        update_status(f"🔴 HTTP {res.status_code}", "#ff5555")
            else:
                # Via Backend
                res = requests.get(f"{self.base_url}/provider/status", timeout=3, headers=self.get_auth_headers())
                if res.status_code == 200:
                    data = res.json()
                    if data["connected"]:
                        update_status(f"🟢 Connected ({data.get('provider')})", "#55ff55")
                    else:
                        update_status(f"🔴 {data.get('error', 'Unknown Error')}", "#ff5555")
        except Exception as e:
            update_status(f"🔴 Error: {str(e)}", "#ff5555")

    def on_provider_change(self, event: object) -> None:
        new_provider = self.provider_var.get()
        settings.update_provider(new_provider)
        self.provider_url_var.set(settings.get_active_url())
        self.url_label_var.set(f"{new_provider.upper()} URL:")
        self.test_provider_connection()
        self.refresh_models()

    def refresh_models(self) -> None:
        provider = self.provider_var.get()
        endpoint = f"{self.base_url}/provider/models"
        if provider == "lm_studio": endpoint = f"{self.base_url}/lmstudio/models"
        
        try:
            if not self.server_running: return # Can't fetch models nicely without running server logic or replicating it all
            
            res = requests.get(endpoint, timeout=5, headers=self.get_auth_headers())
            if res.status_code == 200:
                models = [m["id"] if "id" in m else m["name"] for m in res.json().get("models", [])]
                self.model_combo["values"] = models
                if models: self.model_combo.set(models[0])
            else:
                 messagebox.showerror("Error", f"Fetch failed: {res.status_code}")
        except Exception as e:
            pass # Silent fail if server off

    def on_model_change(self, event: object) -> None:
        new_model = self.model_var.get()
        if self.server_running:
             pass # Logic to update backend... 
        else:
             settings.update_model(new_model)

    def refresh_addons(self) -> None:
         # Redraw addons in self.addon_scroll_frame
         for widget in self.addon_scroll_frame.winfo_children(): widget.destroy()
         self.addon_vars.clear()
         
         if not self.server_running:
             ttk.Label(self.addon_scroll_frame, text="Start server to view add-ons").pack()
             return

         try:
             res = requests.get(f"{self.base_url}/addons/available", headers=self.get_auth_headers())
             if res.status_code == 200:
                 for addon in res.json().get("addons", []):
                     var = tk.BooleanVar(value=addon["enabled"])
                     self.addon_vars[addon["id"]] = var
                     # Style the checkbutton
                     s = ttk.Style()
                     s.configure("Dark.TCheckbutton", background=self.entry_bg, foreground=self.fg_color)
                     cb = ttk.Checkbutton(self.addon_scroll_frame, text=f"{addon['name']} - {addon['description']}", variable=var, style="Dark.TCheckbutton")
                     cb.pack(anchor="w", pady=2, padx=5)
         except: pass

    def apply_addon_changes(self) -> None:
        if not self.server_running: return
        try:
            for aid, var in self.addon_vars.items():
                requests.post(f"{self.base_url}/addons/toggle", json={"addon_id": aid, "enabled": var.get()}, headers=self.get_auth_headers())
            messagebox.showinfo("Done", "Changes applied. Restart server to take full effect.")
        except Exception as e:
            messagebox.showerror("Error", str(e))

    def start_server(self) -> None:
        try:
            port = int(self.port_entry.get())
            self.server_running = True
            self.start_btn.config(state="disabled")
            self.stop_btn.config(state="normal")
            self.restart_btn.config(state="normal")
            self.server_status_var.set("Running")
            self.server_status_label.config(foreground="#55ff55")
            
            self.base_url = f"http://localhost:{port}"
            config = uvicorn.Config(app, host="0.0.0.0", port=port, log_config=None)
            self.server = uvicorn.Server(config)
            
            def run():
                self.server.run()
                self.server_running = False
                self.root.after(0, lambda: self.server_status_var.set("Stopped"))
                self.root.after(0, lambda: self.start_btn.config(state="normal"))
                self.root.after(0, lambda: self.stop_btn.config(state="disabled"))
                
            self.server_thread = threading.Thread(target=run, daemon=True)
            self.server_thread.start()
            self.root.after(2000, self.initialize_data)
        except ValueError: pass

    def stop_server(self, restart: bool = False) -> None:
        if hasattr(self, 'server'): self.server.should_exit = True
    
    def restart_server(self) -> None:
        self.stop_server(True)
        self.root.after(2000, self.start_server)

    def initialize_data(self) -> None:
        self.test_provider_connection()
        self.refresh_models()
        self.refresh_addons()
        self.refresh_rag_docs()

    # RAG Wrappers
    def refresh_rag_docs(self) -> None:
        self.doc_listbox.delete(0, tk.END)
        self.rag_docs: list[dict[str, Any]] = []
        if not self.server_running: return
        try:
            res = requests.get(f"{self.base_url}/rag/documents", headers=self.get_auth_headers())
            if res.status_code == 200:
                self.rag_docs = res.json().get("documents", [])
                for d in self.rag_docs: self.doc_listbox.insert(tk.END, f"{d['filename']} ({d['chunks']})")
        except: pass

    def upload_rag_doc(self) -> None:
        if not self.server_running: return
        path = filedialog.askopenfilename()
        if path:
            with open(path, 'rb') as f:
                requests.post(f"{self.base_url}/rag/upload", files={'file': f}, headers=self.get_auth_headers())
            self.refresh_rag_docs()

    def delete_rag_doc(self) -> None:
        sel = self.doc_listbox.curselection()
        if sel:
            fn = self.rag_docs[sel[0]]['filename']
            requests.delete(f"{self.base_url}/rag/documents/{fn}", headers=self.get_auth_headers())
            self.refresh_rag_docs()
            
    def browse_rag_path(self) -> None:
        p = filedialog.askdirectory()
        if p: self.rag_path_var.set(p)

    def apply_rag_config(self) -> None:
        # Update path logic
        pass 

    def index_project_folder(self) -> None:
        p = filedialog.askdirectory()
        if p and self.server_running:
             requests.post(f"{self.base_url}/rag/index-directory", json={"directory_path": p}, headers=self.get_auth_headers())
             messagebox.showinfo("Success", "Indexing started (async). Check Logs.")

    def toggle_key_visibility(self) -> None:
        if self.show_key_var.get(): self.api_key_entry.config(show="")
        else: self.api_key_entry.config(show="*")

    def update_api_key(self) -> None:
        # Logic to update key
        pass
    
    def open_docs(self) -> None:
        webbrowser.open(f"http://localhost:{self.port_entry.get()}/docs")

if __name__ == "__main__":
    root = tk.Tk()
    gui = BackendGUI(root)
    root.mainloop()
