#!/usr/bin/env python3
"""
Build script for creating standalone executables of the D&D Backend
"""
from __future__ import annotations

import os
import sys
import platform
import subprocess
import shutil
from pathlib import Path

def get_platform_info() -> tuple[str, str]:
    """Get current platform information"""
    system = platform.system().lower()
    arch = platform.machine().lower()
    return system, arch

def install_pyinstaller() -> None:
    """Ensure PyInstaller is installed"""
    print("📦 Installing PyInstaller...")
    subprocess.run([sys.executable, "-m", "pip", "install", "pyinstaller"], check=True)
    print("✅ PyInstaller installed\n")

def build_executable() -> None:
    """Build the executable using PyInstaller"""
    system, arch = get_platform_info()
    
    print(f"🏗️  Building for {system} ({arch})...\n")
    
    # Ensure we're in the python-backend directory
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)
    
    # Clean previous builds
    if Path("dist").exists():
        print("🧹 Cleaning previous builds...")
        shutil.rmtree("dist")
    if Path("build").exists():
        shutil.rmtree("build")
    
    # Run PyInstaller
    print("🔨 Running PyInstaller...\n")
    subprocess.run([
        sys.executable,
        "-m",
        "PyInstaller",
        "--clean",
        "--noconfirm",
        "backend.spec"
    ], check=True)
    
    # Get the output executable name
    exe_name = "dnd-backend.exe" if system == "windows" else "dnd-backend"
    exe_path = Path("dist") / exe_name
    
    if exe_path.exists():
        size_mb = exe_path.stat().st_size / (1024 * 1024)
        print(f"\n✅ Build successful!")
        print(f"📍 Executable: {exe_path}")
        print(f"📊 Size: {size_mb:.2f} MB")
        
        # Determine Tauri target triple
        try:
            target_triple = subprocess.check_output(["rustc", "-vV"], text=True)
            target_triple = [line for line in target_triple.split('\n') if line.startswith('host:')][0].split(': ')[1]
        except Exception:
            # Fallback for common development targets
            if system == "windows":
                target_triple = "x86_64-pc-windows-msvc"
            elif system == "darwin":
                target_triple = "x86_64-apple-darwin" if arch == "x86_64" else "aarch64-apple-darwin"
            else:
                target_triple = "x86_64-unknown-linux-gnu"
        
        # Copy to binaries folder for Tauri with sidecar naming
        binaries_dir = Path("..") / "src-tauri" / "binaries"
        binaries_dir.mkdir(exist_ok=True, parents=True)
        
        sidecar_name = f"dnd-backend-{target_triple}"
        if system == "windows":
            sidecar_name += ".exe"
            
        dest_path = binaries_dir / sidecar_name
        shutil.copy2(exe_path, dest_path)
        print(f"📦 Copied to sidecar: {dest_path}")
    else:
        print("❌ Build failed - executable not found")
        sys.exit(1)

def main() -> None:
    """Main build process"""
    print("=" * 60)
    print("D&D Backend - Executable Builder")
    print("=" * 60)
    print()
    
    try:
        install_pyinstaller()
        build_executable()
        
        print("\n" + "=" * 60)
        print("🎉 Build Complete!")
        print("=" * 60)
        print("\nTo test the executable:")
        print("  ./dist/dnd-backend (or .exe on Windows)")
        print("\nTo use with Tauri:")
        print("  The executable has been copied to src-tauri/binaries/")
        
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Build failed: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
