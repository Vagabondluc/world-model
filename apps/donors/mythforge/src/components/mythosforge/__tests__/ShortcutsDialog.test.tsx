/**
 * Component tests for the ShortcutsDialog
 *
 * Tests cover:
 * - Renders when open
 * - Does not render when closed
 * - Shows all shortcut sections
 * - Shows key combos
 * - Calls onOpenChange when closed
 * - Has proper dialog role
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ShortcutsDialog } from '@/components/mythosforge/ShortcutsDialog';

describe('ShortcutsDialog', () => {
  it('should render the dialog when open is true', () => {
    render(<ShortcutsDialog open={true} onOpenChange={vi.fn()} />);
    // Title appears in both h2 and as shortcut description — use getAllByText
    const titles = screen.getAllByText('Keyboard Shortcuts');
    expect(titles.length).toBeGreaterThanOrEqual(1);
    // The first one should be the heading (h2)
    expect(titles[0].tagName).toBe('H2');
  });

  it('should not render the dialog when open is false', () => {
    render(<ShortcutsDialog open={false} onOpenChange={vi.fn()} />);
    expect(screen.queryByText('Keyboard Shortcuts')).not.toBeInTheDocument();
  });

  it('should display all shortcut sections', () => {
    render(<ShortcutsDialog open={true} onOpenChange={vi.fn()} />);

    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Entity Actions')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.getByText('File')).toBeInTheDocument();
    expect(screen.getByText('Workspace')).toBeInTheDocument();
  });

  it('should display key shortcut descriptions', () => {
    render(<ShortcutsDialog open={true} onOpenChange={vi.fn()} />);

    expect(screen.getByText('Command Palette')).toBeInTheDocument();
    expect(screen.getByText('New Entity')).toBeInTheDocument();
    expect(screen.getByText('Undo')).toBeInTheDocument();
    expect(screen.getByText('Redo')).toBeInTheDocument();
    expect(screen.getByText('Save / Export World JSON')).toBeInTheDocument();
    expect(screen.getByText('Path Finder (Graph mode only)')).toBeInTheDocument();
    expect(screen.getByText('Toggle DM Screen / GM HUD')).toBeInTheDocument();
  });

  it('should display key combos (normalize whitespace)', () => {
    render(<ShortcutsDialog open={true} onOpenChange={vi.fn()} />);

    // Testing library normalizes whitespace in getByText, so match with single space
    expect(screen.getByText('⌘K / Ctrl+K')).toBeInTheDocument();
    expect(screen.getByText('? / ⌘/')).toBeInTheDocument();
    expect(screen.getByText('Escape')).toBeInTheDocument();
    expect(screen.getByText('⌘N / Ctrl+N')).toBeInTheDocument();
    expect(screen.getByText('⌘D / Ctrl+D')).toBeInTheDocument();
    expect(screen.getByText('⌘Z / Ctrl+Z')).toBeInTheDocument();
    expect(screen.getByText('⇧⌘Z / Ctrl+Shift+Z')).toBeInTheDocument();
    expect(screen.getByText('⌘S / Ctrl+S')).toBeInTheDocument();
    expect(screen.getByText('⌘P / Ctrl+P')).toBeInTheDocument();
    expect(screen.getByText('Tab')).toBeInTheDocument();
  });

  it('should display version footer with exact text', () => {
    render(<ShortcutsDialog open={true} onOpenChange={vi.fn()} />);
    expect(screen.getByText('MythosForge v1.0.0 — Dark Esoteric Edition')).toBeInTheDocument();
  });

  it('should show description text', () => {
    render(<ShortcutsDialog open={true} onOpenChange={vi.fn()} />);
    expect(screen.getByText('Quick-reference for all MythosForge hotkeys.')).toBeInTheDocument();
  });

  it('should have proper dialog role', () => {
    render(<ShortcutsDialog open={true} onOpenChange={vi.fn()} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });
});
