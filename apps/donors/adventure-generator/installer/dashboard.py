#!/usr/bin/env python3
"""
D&D Adventure Generator - Installation & Management Dashboard
A Tkinter-based GUI for managing the installation and services
"""

import tkinter as tk
from tkinter import ttk, scrolledtext, messagebox, filedialog
import subprocess
import sys
import os
import platform
import threading
import json
from pathlib import Path

class InstallationDashboard:
    def __init__(self, root):
        self.root = root
        self.root.title("D&D Adventure Generator - Setup Dashboard")
        self.root.geometry("900x700")
        
        # Variables
        self.backend_process = None
        self.frontend_process = None
        self.platform = platform.system().lower()
        
        # Setup UI
        self.setup_ui()
        self.check_prerequisites()
        
    def setup_ui(self):
        """Create the UI layout"""
        # Title
        title_frame = ttk.Frame(self.root, padding="10")
        title_frame.grid(row=0, column=0, sticky=(tk.W, tk.E))
        
        ttk.Label(
            title_frame,
            text="D&D Adventure Generator",
            font=("Arial", 20, "bold")
        ).pack()
        
        ttk.Label(
            title_frame,
            text="Installation & Management Dashboard",
            font=("Arial", 12)
        ).pack()
        
        # Notebook for tabs
        notebook = ttk.Notebook(self.root)
        notebook.grid(row=1, column=0, sticky=(tk.W, tk.E, tk.N, tk.S), padx=10, pady=10)
        
        # System Check Tab
        self.system_frame = ttk.Frame(notebook, padding="10")
        notebook.add(self.system_frame, text="System Check")
        self.setup_system_tab()
        
        # Installation Tab
        self.install_frame = ttk.Frame(notebook, padding="10")
        notebook.add(self.install_frame, text="Installation")
        self.setup_install_tab()
        
        # Service Management Tab
        self.service_frame = ttk.Frame(notebook, padding="10")
        notebook.add(self.service_frame, text="Service Management")
        self.setup_service_tab()
        
        # Configuration Tab
        self.config_frame = ttk.Frame(notebook, padding="10")
        notebook.add(self.config_frame, text="Configuration")
        self.setup_config_tab()
        
        # Log Tab
        self.log_frame = ttk.Frame(notebook, padding="10")
        notebook.add(self.log_frame, text="Logs")
        self.setup_log_tab()
        
        # Configure grid weights
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(1, weight=1)
        
    def setup_system_tab(self):
        """Setup system requirements check tab"""
        ttk.Label(
            self.system_frame,
            text="System Requirements",
            font=("Arial", 14, "bold")
        ).pack(pady=10)
        
        # Status display
        self.status_text = scrolledtext.ScrolledText(
            self.system_frame,
            height=15,
            width=80,
            wrap=tk.WORD
        )
        self.status_text.pack(padx=10, pady=10, fill=tk.BOTH, expand=True)
        
        # Check button
        ttk.Button(
            self.system_frame,
            text="🔍 Check System",
            command=self.check_prerequisites
        ).pack(pady=10)
        
    def setup_install_tab(self):
        """Setup installation tab"""
        ttk.Label(
            self.install_frame,
            text="Installation Wizard",
            font=("Arial", 14, "bold")
        ).pack(pady=10)
        
        # Progress bar
        self.install_progress = ttk.Progressbar(
            self.install_frame,
            mode='indeterminate',
            length=400
        )
        self.install_progress.pack(pady=10)
        
        # Installation buttons
        btn_frame = ttk.Frame(self.install_frame)
        btn_frame.pack(pady=20)
        
        ttk.Button(
            btn_frame,
            text="📦 Install All",
            command=self.install_all
        ).grid(row=0, column=0, padx=5)
        
        ttk.Button(
            btn_frame,
            text="🌐 Frontend Only",
            command=self.install_frontend
        ).grid(row=0, column=1, padx=5)
        
        ttk.Button(
            btn_frame,
            text="🐍 Backend Only",
            command=self.install_backend
        ).grid(row=0, column=2, padx=5)
        
        # Installation log
        ttk.Label(self.install_frame, text="Installation Log:").pack()
        self.install_log = scrolledtext.ScrolledText(
            self.install_frame,
            height=15,
            width=80
        )
        self.install_log.pack(padx=10, pady=10, fill=tk.BOTH, expand=True)
        
    def setup_service_tab(self):
        """Setup service management tab"""
        ttk.Label(
            self.service_frame,
            text="Service Management",
            font=("Arial", 14, "bold")
        ).pack(pady=10)
        
        # Backend service
        backend_frame = ttk.LabelFrame(self.service_frame, text="Python Backend", padding="10")
        backend_frame.pack(fill=tk.X, padx=10, pady=5)
        
        self.backend_status = ttk.Label(backend_frame, text="Status: Stopped", foreground="red")
        self.backend_status.grid(row=0, column=0, columnspan=2)
        
        ttk.Button(
            backend_frame,
            text="▶️ Start Backend",
            command=self.start_backend
        ).grid(row=1, column=0, padx=5, pady=5)
        
        ttk.Button(
            backend_frame,
            text="⏹️ Stop Backend",
            command=self.stop_backend
        ).grid(row=1, column=1, padx=5, pady=5)
        
        # Frontend service
        frontend_frame = ttk.LabelFrame(self.service_frame, text="React Frontend", padding="10")
        frontend_frame.pack(fill=tk.X, padx=10, pady=5)
        
        self.frontend_status = ttk.Label(frontend_frame, text="Status: Stopped", foreground="red")
        self.frontend_status.grid(row=0, column=0, columnspan=2)
        
        ttk.Button(
            frontend_frame,
            text="▶️ Start Frontend",
            command=self.start_frontend
        ).grid(row=1, column=0, padx=5, pady=5)
        
        ttk.Button(
            frontend_frame,
            text="⏹️ Stop Frontend",
            command=self.stop_frontend
        ).grid(row=1, column=1, padx=5, pady=5)
        
        # Quick launch
        ttk.Button(
            self.service_frame,
            text="🚀 Start All Services",
            command=self.start_all_services,
            style="Accent.TButton"
        ).pack(pady=20)
        
    def setup_config_tab(self):
        """Setup configuration tab"""
        ttk.Label(
            self.config_frame,
            text="Configuration Editor",
            font=("Arial", 14, "bold")
        ).pack(pady=10)
        
        # API Keys
        api_frame = ttk.LabelFrame(self.config_frame, text="API Keys", padding="10")
        api_frame.pack(fill=tk.X, padx=10, pady=5)
        
        ttk.Label(api_frame, text="Gemini API Key:").grid(row=0, column=0, sticky=tk.W)
        self.gemini_key = ttk.Entry(api_frame, width=50, show="*")
        self.gemini_key.grid(row=0, column=1, padx=5, pady=5)
        
        # Paths
        path_frame = ttk.LabelFrame(self.config_frame, text="Paths", padding="10")
        path_frame.pack(fill=tk.X, padx=10, pady=5)
        
        ttk.Label(path_frame, text="Campaign Folder:").grid(row=0, column=0, sticky=tk.W)
        self.campaign_path = ttk.Entry(path_frame, width=40)
        self.campaign_path.grid(row=0, column=1, padx=5, pady=5)
        ttk.Button(
            path_frame,
            text="Browse...",
            command=lambda: self.browse_folder(self.campaign_path)
        ).grid(row=0, column=2)
        
        # Save button
        ttk.Button(
            self.config_frame,
            text="💾 Save Configuration",
            command=self.save_config
        ).pack(pady=20)
        
        # Load existing config
        self.load_config()
        
    def setup_log_tab(self):
        """Setup logging tab"""
        ttk.Label(
            self.log_frame,
            text="Application Logs",
            font=("Arial", 14, "bold")
        ).pack(pady=10)
        
        self.log_text = scrolledtext.ScrolledText(
            self.log_frame,
            height=25,
            width=80,
            wrap=tk.WORD
        )
        self.log_text.pack(padx=10, pady=10, fill=tk.BOTH, expand=True)
        
        ttk.Button(
            self.log_frame,
            text="🗑️ Clear Logs",
            command=lambda: self.log_text.delete(1.0, tk.END)
        ).pack(pady=5)
        
    def log_message(self, message, level="INFO"):
        """Add message to log"""
        self.log_text.insert(tk.END, f"[{level}] {message}\n")
        self.log_text.see(tk.END)
        
    def check_command(self, command, name):
        """Check if a command exists"""
        try:
            result = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                timeout=5
            )
            return result.returncode == 0, result.stdout.strip()
        except:
            return False, ""
            
    def check_prerequisites(self):
        """Check system prerequisites"""
        self.status_text.delete(1.0, tk.END)
        self.status_text.insert(tk.END, "Checking system requirements...\n\n")
        
        checks = [
            ("node --version", "Node.js"),
            ("npm --version", "npm"),
            ("python --version" if self.platform == "windows" else "python3 --version", "Python"),
            ("git --version", "Git (optional)")
        ]
        
        all_ok = True
        for cmd, name in checks:
            ok, version = self.check_command(cmd, name)
            status = "✅" if ok else "❌"
            self.status_text.insert(tk.END, f"{status} {name}: ")
            if ok:
                self.status_text.insert(tk.END, f"{version}\n")
            else:
                self.status_text.insert(tk.END, "Not found\n")
                if name != "Git (optional)":
                    all_ok = False
                    
        self.status_text.insert(tk.END, "\n")
        if all_ok:
            self.status_text.insert(tk.END, "✅ All required dependencies are installed!\n")
        else:
            self.status_text.insert(tk.END, "❌ Some dependencies are missing. Please install them first.\n")
            
    def run_command_async(self, command, log_widget):
        """Run a command asynchronously and log output"""
        def run():
            try:
                self.install_progress.start()
                log_widget.insert(tk.END, f"Running: {command}\n")
                
                process = subprocess.Popen(
                    command,
                    shell=True,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT,
                    text=True,
                    bufsize=1
                )
                
                for line in process.stdout:
                    log_widget.insert(tk.END, line)
                    log_widget.see(tk.END)
                    
                process.wait()
                
                if process.returncode == 0:
                    log_widget.insert(tk.END, "\n✅ Command completed successfully\n\n")
                else:
                    log_widget.insert(tk.END, f"\n❌ Command failed with code {process.returncode}\n\n")
                    
            except Exception as e:
                log_widget.insert(tk.END, f"\n❌ Error: {str(e)}\n\n")
            finally:
                self.install_progress.stop()
                
        thread = threading.Thread(target=run, daemon=True)
        thread.start()
        
    def install_all(self):
        """Install everything"""
        if messagebox.askyesno("Confirm", "This will install all dependencies. Continue?"):
            self.run_command_async("node setup.js", self.install_log)
            
    def install_frontend(self):
        """Install frontend only"""
        self.run_command_async("npm install", self.install_log)
        
    def install_backend(self):
        """Install backend only"""
        python_cmd = "python" if self.platform == "windows" else "python3"
        cmd = f"cd python-backend && {python_cmd} -m venv venv && venv/bin/pip install -r requirements.txt"
        self.run_command_async(cmd, self.install_log)
        
    def start_backend(self):
        """Start the Python backend"""
        try:
            python_exe = "python-backend/venv/Scripts/python.exe" if self.platform == "windows" else "python-backend/venv/bin/python"
            self.backend_process = subprocess.Popen(
                [python_exe, "python-backend/main.py"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            self.backend_status.config(text="Status: Running", foreground="green")
            self.log_message("Backend started successfully")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to start backend: {str(e)}")
            
    def stop_backend(self):
        """Stop the Python backend"""
        if self.backend_process:
            self.backend_process.terminate()
            self.backend_process = None
            self.backend_status.config(text="Status: Stopped", foreground="red")
            self.log_message("Backend stopped")
            
    def start_frontend(self):
        """Start the frontend dev server"""
        try:
            self.frontend_process = subprocess.Popen(
                ["npm", "run", "dev"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            self.frontend_status.config(text="Status: Running", foreground="green")
            self.log_message("Frontend started successfully")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to start frontend: {str(e)}")
            
    def stop_frontend(self):
        """Stop the frontend"""
        if self.frontend_process:
            self.frontend_process.terminate()
            self.frontend_process = None
            self.frontend_status.config(text="Status: Stopped", foreground="red")
            self.log_message("Frontend stopped")
            
    def start_all_services(self):
        """Start all services"""
        self.start_backend()
        self.start_frontend()
        messagebox.showinfo("Success", "All services started!")
        
    def browse_folder(self, entry_widget):
        """Browse for a folder"""
        folder = filedialog.askdirectory()
        if folder:
            entry_widget.delete(0, tk.END)
            entry_widget.insert(0, folder)
            
    def load_config(self):
        """Load configuration from .env.local"""
        try:
            env_path = Path(".env.local")
            if env_path.exists():
                with open(env_path) as f:
                    for line in f:
                        if line.startswith("GEMINI_API_KEY="):
                            key = line.split("=", 1)[1].strip()
                            self.gemini_key.insert(0, key)
        except:
            pass
            
    def save_config(self):
        """Save configuration"""
        try:
            # Save .env.local
            with open(".env.local", "w") as f:
                f.write(f"GEMINI_API_KEY={self.gemini_key.get()}\n")
                
            messagebox.showinfo("Success", "Configuration saved!")
            self.log_message("Configuration saved successfully")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save config: {str(e)}")

def main():
    root = tk.Tk()
    app = InstallationDashboard(root)
    root.mainloop()

if __name__ == "__main__":
    main()
