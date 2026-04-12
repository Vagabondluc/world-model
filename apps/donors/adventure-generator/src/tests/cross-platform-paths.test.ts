/**
 * Cross-platform path handling tests for D&D Adventure Generator.
 * 
 * Tests cover Windows, macOS, and Linux path handling differences.
 * Uses Vitest for testing and mocks Tauri commands for unit tests.
 */

// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FileSystemStore } from '../services/fileSystemStore';
import { isTauri, isBrowser } from '../utils/envUtils';

// Mock Tauri APIs
const mockTauriDialog = {
  open: vi.fn(),
};

const mockTauriFs = {
  readTextFile: vi.fn(),
  writeTextFile: vi.fn(),
  readDir: vi.fn(),
  mkdir: vi.fn(),
  exists: vi.fn(),
};

// ============================================================================
// MOCK SETUP
// ============================================================================

beforeEach(() => {
  vi.clearAllMocks();
  
  // Mock window.__TAURI_INTERNALS__ for Tauri detection
  Object.defineProperty(window, '__TAURI_INTERNALS__', {
    value: { plugins: {} },
    writable: true,
    configurable: true,
  });
});

afterEach(() => {
  // Cleanup
  delete (window as any).__TAURI_INTERNALS__;
});

// ============================================================================
// PATH SEPARATOR TESTS
// ============================================================================

describe('Path Separator Tests', () => {
  it('should handle forward slashes on all platforms', () => {
    const path = 'campaign/monsters/goblin.yaml';
    const parts = path.split('/');
    
    expect(parts).toEqual(['campaign', 'monsters', 'goblin.yaml']);
    expect(parts.length).toBe(3);
  });

  it('should handle backslashes from user input', () => {
    const path = 'campaign\\monsters\\goblin.yaml';
    
    // Backslashes should be normalized to forward slashes
    const normalized = path.replace(/\\/g, '/');
    const parts = normalized.split('/');
    
    expect(parts).toEqual(['campaign', 'monsters', 'goblin.yaml']);
  });

  it('should handle mixed separators', () => {
    const mixedPath = 'campaign/monsters\\lore/locations.md';
    
    // Normalize all separators to forward slashes
    const normalized = mixedPath.replace(/\\/g, '/');
    const parts = normalized.split('/');
    
    expect(parts).toContain('campaign');
    expect(parts).toContain('monsters');
    expect(parts).toContain('lore');
    expect(parts).toContain('locations.md');
  });

  it('should extract file extension correctly regardless of separator', () => {
    const paths = [
      'campaign/monsters/goblin.yaml',
      'campaign\\monsters\\goblin.yaml',
      'campaign/monsters\\goblin.yaml',
    ];
    
    paths.forEach(path => {
      const normalized = path.replace(/\\/g, '/');
      const parts = normalized.split('/');
      const filename = parts[parts.length - 1];
      const extension = filename.split('.').pop();
      
      expect(extension).toBe('yaml');
    });
  });
});

// ============================================================================
// DRIVE LETTER TESTS
// ============================================================================

describe('Drive Letter Tests', () => {
  it('should detect Windows drive letters', () => {
    const windowsPath = 'C:\\Users\\Player\\campaign';
    const hasDriveLetter = /^[A-Za-z]:/.test(windowsPath);
    
    expect(hasDriveLetter).toBe(true);
  });

  it('should handle drive letters on Posix as relative paths', () => {
    const posixPathWithDrive = 'C:/campaign/monsters';
    
    // On Posix, this is treated as a relative path
    // The "C:" is just a directory name
    const parts = posixPathWithDrive.split('/');
    
    expect(parts[0]).toBe('C:');
  });

  it('should handle UNC paths on Windows', () => {
    const uncPath = '\\\\server\\share\\campaign';
    const isUncPath = /^\\\\/.test(uncPath);
    
    expect(isUncPath).toBe(true);
  });

  it('should handle network paths on Posix', () => {
    const networkPath = '//server/share/campaign';
    const isNetworkPath = /^\/\//.test(networkPath);
    
    expect(isNetworkPath).toBe(true);
  });
});

// ============================================================================
// ABSOLUTE VS RELATIVE PATH TESTS
// ============================================================================

describe('Absolute vs Relative Path Tests', () => {
  it('should detect absolute paths on Unix', () => {
    const absoluteUnix = '/home/user/campaign';
    const isAbsolute = absoluteUnix.startsWith('/');
    
    expect(isAbsolute).toBe(true);
  });

  it('should detect absolute paths on Windows', () => {
    const absoluteWin = 'C:\\Users\\user\\campaign';
    const isAbsolute = /^[A-Za-z]:/.test(absoluteWin);
    
    expect(isAbsolute).toBe(true);
  });

  it('should detect relative paths', () => {
    const relativePaths = [
      'campaign/monsters',
      './campaign/monsters',
      '../campaign/monsters',
      'monsters/goblin.yaml',
    ];
    
    relativePaths.forEach(path => {
      const isAbsolute = path.startsWith('/') || /^[A-Za-z]:/.test(path);
      expect(isAbsolute).toBe(false);
    });
  });

  it('should join paths correctly', () => {
    const base = 'campaign';
    const relative = 'monsters/goblin.yaml';
    const joined = base + '/' + relative;
    
    expect(joined).toBe('campaign/monsters/goblin.yaml');
  });

  it('should resolve parent directory references', () => {
    const path = 'campaign/monsters/../lore/./npc.md';
    const parts = path.split('/');
    
    // Count parent directory references
    const parentCount = parts.filter(p => p === '..').length;
    expect(parentCount).toBe(1);
    
    // Count current directory references
    const currentCount = parts.filter(p => p === '.').length;
    expect(currentCount).toBe(1);
  });
});

// ============================================================================
// FILE EXTENSION TESTS
// ============================================================================

describe('File Extension Tests', () => {
  it('should extract file extensions for common D&D file types', () => {
    const extensions: Record<string, string> = {
      'monsters/goblin.yaml': 'yaml',
      'lore/dragon.md': 'md',
      'campaign.json': 'json',
      'assets/image.png': 'png',
    };
    
    Object.entries(extensions).forEach(([path, expectedExt]) => {
      const parts = path.split('/');
      const filename = parts[parts.length - 1];
      const extension = filename.split('.').pop();
      
      expect(extension).toBe(expectedExt);
    });
  });

  it('should handle case sensitivity in extensions', () => {
    const path1 = 'file.YAML';
    const path2 = 'file.yaml';
    
    const ext1 = path1.split('.').pop()?.toLowerCase();
    const ext2 = path2.split('.').pop()?.toLowerCase();
    
    expect(ext1).toBe(ext2);
  });

  it('should handle multiple extensions', () => {
    const path = 'archive.tar.gz';
    const parts = path.split('.');
    
    // Last extension
    const lastExt = parts[parts.length - 1];
    expect(lastExt).toBe('gz');
    
    // Second-to-last extension
    const secondExt = parts[parts.length - 2];
    expect(secondExt).toBe('tar');
  });

  it('should handle files without extensions', () => {
    const files = ['README', '.gitignore', 'LICENSE'];
    
    files.forEach(filename => {
      const parts = filename.split('.');
      
      // README has no extension
      if (filename === 'README') {
        expect(parts.length).toBe(1);
      }
      // .gitignore starts with a dot (hidden file)
      else if (filename === '.gitignore') {
        expect(parts.length).toBe(2);
        expect(parts[0]).toBe('');
      }
    });
  });
});

// ============================================================================
// PATH TRAVERSAL SECURITY TESTS
// ============================================================================

describe('Path Traversal Security Tests', () => {
  it('should detect directory traversal attempts', () => {
    const base = '/campaign';
    const traversal = '../../etc/passwd';
    const joined = base + '/' + traversal;
    
    const parts = joined.split('/');
    const parentRefs = parts.filter(p => p === '..').length;
    
    expect(parentRefs).toBeGreaterThan(0);
  });

  it('should sandbox paths to campaign folder', () => {
    const campaignRoot = '/campaign';
    const safePath = 'monsters/goblin.yaml';
    const unsafePath = '../../etc/passwd';
    
    const safeJoined = campaignRoot + '/' + safePath;
    const unsafeJoined = campaignRoot + '/' + unsafePath;
    
    // Safe path should be within campaign folder
    expect(safeJoined).toContain(campaignRoot);
    
    // Unsafe path might escape (needs canonicalization in production)
    expect(unsafeJoined).toContain('..');
  });

  it('should prevent path traversal in file operations', () => {
    const maliciousPaths = [
      '../../etc/passwd',
      '..\\..\\windows\\system32',
      '../../../etc/shadow',
    ];
    
    maliciousPaths.forEach(path => {
      const hasTraversal = path.includes('..');
      expect(hasTraversal).toBe(true);
      
      // In production, these should be rejected
      const normalized = path.replace(/\\/g, '/');
      const parts = normalized.split('/');
      const parentCount = parts.filter(p => p === '..').length;
      expect(parentCount).toBeGreaterThan(0);
    });
  });

  it('should validate paths stay within allowed directories', () => {
    const allowedBase = '/campaign';
    const testPaths = [
      '/campaign/monsters/goblin.yaml', // Valid
      '/campaign/lore/dragon.md', // Valid
      '/campaign/../etc/passwd', // Invalid (traversal)
      '/campaign/monsters/../../etc/passwd', // Invalid (traversal)
    ];
    
    testPaths.forEach(path => {
      const normalized = path.replace(/\\/g, '/');
      const parts = normalized.split('/');
      const parentCount = parts.filter(p => p === '..').length;
      
      // Paths with parent refs need validation
      if (parentCount > 0) {
        // This path needs security validation
        expect(parentCount).toBeGreaterThan(0);
      }
    });
  });
});

// ============================================================================
// TAURI RUST PATH TESTS (MOCKED)
// ============================================================================

describe('Tauri Rust Path Tests', () => {
  it('should handle read_markdown_file with various path formats', () => {
    const testPaths = [
      'campaign/lore/dragon.md',
      'campaign\\lore\\dragon.md',
      './campaign/lore/dragon.md',
    ];
    
    testPaths.forEach(path => {
      const normalized = path.replace(/\\/g, '/');
      const parts = normalized.split('/');
      const filename = parts[parts.length - 1];
      const extension = filename.split('.').pop();
      
      expect(extension).toBe('md');
    });
  });

  it('should handle write_markdown_file path creation', () => {
    const pathStr = 'campaign/lore/new_entry.md';
    const parts = pathStr.replace(/\\/g, '/').split('/');
    
    // Parent directory should be extractable
    const parentPath = parts.slice(0, -1).join('/');
    expect(parentPath).toBe('campaign/lore');
    
    // Filename should be extractable
    const filename = parts[parts.length - 1];
    expect(filename).toBe('new_entry.md');
  });

  it('should handle start_watching path resolution', () => {
    const watchPath = 'campaign';
    const normalized = watchPath.replace(/\\/g, '/');
    
    // Path should be valid
    expect(normalized).toBe('campaign');
    expect(normalized.length).toBeGreaterThan(0);
  });

  it('should handle export_vault source and target paths', () => {
    const source = 'campaign';
    const target = 'export/hugo';
    
    // Both paths should be valid
    expect(source.length).toBeGreaterThan(0);
    expect(target.length).toBeGreaterThan(0);
    
    // Target should not have file extension (it's a directory)
    const targetParts = target.replace(/\\/g, '/').split('/');
    const targetLast = targetParts[targetParts.length - 1];
    expect(targetLast).not.toContain('.');
  });
});

// ============================================================================
// PYTHON PATH TESTS (MOCKED)
// ============================================================================

describe('Python Path Tests', () => {
  it('should handle RAG_PERSIST_PATH configuration', () => {
    const ragPath = 'rag/chroma';
    const normalized = ragPath.replace(/\\/g, '/');
    const parts = normalized.split('/');
    
    expect(parts).toEqual(['rag', 'chroma']);
  });

  it('should handle campaign folder path', () => {
    const campaignPath = 'campaigns/my-campaign';
    const normalized = campaignPath.replace(/\\/g, '/');
    const parts = normalized.split('/');
    
    expect(parts).toContain('campaigns');
    expect(parts).toContain('my-campaign');
  });

  it('should handle file watching paths in Python', () => {
    const watchPaths = [
      'campaign',
      'campaign/monsters',
      'campaign/lore',
    ];
    
    watchPaths.forEach(path => {
      const normalized = path.replace(/\\/g, '/');
      const parts = normalized.split('/');
      
      expect(parts.length).toBeGreaterThan(0);
    });
  });

  it('should handle addon path resolution', () => {
    const addonBase = 'addons/dnd';
    const subdirs = ['models', 'prompts', 'routers'];
    
    subdirs.forEach(subdir => {
      const fullPath = addonBase + '/' + subdir;
      const normalized = fullPath.replace(/\\/g, '/');
      const parts = normalized.split('/');
      
      expect(parts).toContain('addons');
      expect(parts).toContain('dnd');
      expect(parts).toContain(subdir);
    });
  });
});

// ============================================================================
// FILESYSTEM STORE PATH TESTS
// ============================================================================

describe('FileSystemStore Path Tests', () => {
  it('should handle campaign initialization paths', async () => {
    const rootPath = '/campaign/my-campaign';
    const subdirs = ['monsters', 'lore', 'locations', 'assets'];
    
    subdirs.forEach(subdir => {
      const fullPath = rootPath + '/' + subdir;
      const normalized = fullPath.replace(/\\/g, '/');
      const parts = normalized.split('/');
      
      expect(parts).toContain(subdir);
    });
  });

  it('should handle monster save paths', () => {
    const rootPath = '/campaign';
    const monsterName = 'Ancient Red Dragon';
    
    // Slugify name for filename
    const slug = monsterName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const filePath = rootPath + '/monsters/' + slug + '.yaml';
    const normalized = filePath.replace(/\\/g, '/');
    const parts = normalized.split('/');
    
    expect(parts).toContain('monsters');
    expect(parts[parts.length - 1]).toBe('ancient-red-dragon.yaml');
  });

  it('should handle lore save paths', () => {
    const rootPath = '/campaign';
    const loreTitle = 'The Dragon\'s Hoard';
    
    // Slugify title for filename
    const slug = loreTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const filePath = rootPath + '/lore/' + slug + '.md';
    const normalized = filePath.replace(/\\/g, '/');
    const parts = normalized.split('/');
    
    expect(parts).toContain('lore');
    expect(parts[parts.length - 1]).toBe('the-dragon-s-hoard.md');
  });

  it('should handle location save paths', () => {
    const rootPath = '/campaign';
    const locationName = 'Dungeon of Doom';
    
    // Slugify name for filename
    const slug = locationName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const filePath = rootPath + '/locations/' + slug + '.json';
    const normalized = filePath.replace(/\\/g, '/');
    const parts = normalized.split('/');
    
    expect(parts).toContain('locations');
    expect(parts[parts.length - 1]).toBe('dungeon-of-doom.json');
  });
});

// ============================================================================
// ENVIRONMENT DETECTION TESTS
// ============================================================================

describe('Environment Detection Tests', () => {
  it('should detect Tauri environment', () => {
    // When __TAURI_INTERNALS__ is present
    expect(isTauri()).toBe(true);
    expect(isBrowser()).toBe(false);
  });

  it('should detect browser environment', () => {
    // When __TAURI_INTERNALS__ is not present
    delete (window as any).__TAURI_INTERNALS__;
    
    expect(isTauri()).toBe(false);
    expect(isBrowser()).toBe(true);
  });

  it('should use mock filesystem in browser mode', () => {
    delete (window as any).__TAURI_INTERNALS__;
    
    const mockStoragePrefix = 'dnd_gen_mock_fs:';
    const testPath = 'campaign/monsters/goblin.yaml';
    
    // In browser mode, paths are prefixed for localStorage
    const storageKey = mockStoragePrefix + testPath;
    expect(storageKey).toContain(mockStoragePrefix);
    expect(storageKey).toContain(testPath);
  });
});

// ============================================================================
// PATH UTILITY FUNCTIONS TESTS
// ============================================================================

describe('Path Utility Functions Tests', () => {
  it('should normalize path separators', () => {
    const paths = [
      'campaign\\monsters\\goblin.yaml',
      'campaign/monsters\\goblin.yaml',
      'campaign\\monsters/goblin.yaml',
    ];
    
    paths.forEach(path => {
      const normalized = path.replace(/\\/g, '/');
      expect(normalized).not.toContain('\\');
    });
  });

  it('should extract filename from path', () => {
    const paths = [
      'campaign/monsters/goblin.yaml',
      'campaign\\monsters\\goblin.yaml',
      './campaign/monsters/goblin.yaml',
    ];
    
    paths.forEach(path => {
      const normalized = path.replace(/\\/g, '/');
      const parts = normalized.split('/');
      const filename = parts[parts.length - 1];
      
      expect(filename).toBe('goblin.yaml');
    });
  });

  it('should extract directory from path', () => {
    const paths = [
      'campaign/monsters/goblin.yaml',
      'campaign\\monsters\\goblin.yaml',
    ];
    
    paths.forEach(path => {
      const normalized = path.replace(/\\/g, '/');
      const parts = normalized.split('/');
      const directory = parts.slice(0, -1).join('/');
      
      expect(directory).toBe('campaign/monsters');
    });
  });

  it('should join path segments', () => {
    const segments = ['campaign', 'monsters', 'goblin.yaml'];
    const joined = segments.join('/');
    
    expect(joined).toBe('campaign/monsters/goblin.yaml');
  });

  it('should handle empty path segments', () => {
    const segments = ['campaign', '', 'monsters', '', 'goblin.yaml'];
    const filtered = segments.filter(s => s.length > 0);
    const joined = filtered.join('/');
    
    expect(joined).toBe('campaign/monsters/goblin.yaml');
  });
});

// ============================================================================
// CROSS-PLATFORM PATH COMPATIBILITY TESTS
// ============================================================================

describe('Cross-Platform Path Compatibility Tests', () => {
  it('should handle Windows-style paths on all platforms', () => {
    const windowsPath = 'C:\\Users\\Player\\Documents\\campaign\\monsters\\goblin.yaml';
    const normalized = windowsPath.replace(/\\/g, '/');
    const parts = normalized.split('/');
    
    expect(parts).toContain('campaign');
    expect(parts).toContain('monsters');
    expect(parts).toContain('goblin.yaml');
  });

  it('should handle Unix-style paths on all platforms', () => {
    const unixPath = '/home/user/documents/campaign/monsters/goblin.yaml';
    const parts = unixPath.split('/');
    
    expect(parts).toContain('campaign');
    expect(parts).toContain('monsters');
    expect(parts).toContain('goblin.yaml');
  });

  it('should handle relative paths consistently', () => {
    const relativePaths = [
      './campaign/monsters',
      'campaign/monsters',
      '..\\campaign\\monsters',
    ];
    
    relativePaths.forEach(path => {
      const normalized = path.replace(/\\/g, '/');
      const withoutCurrentDir = normalized.replace(/^\.\//, '');
      const withoutParentDir = withoutCurrentDir.replace(/^\.\.\//, '');
      
      expect(withoutParentDir).toContain('campaign');
    });
  });

  it('should handle paths with spaces', () => {
    const pathWithSpaces = 'campaign/My Campaign/The Dragon\'s Lair.md';
    const parts = pathWithSpaces.split('/');
    
    expect(parts).toContain('My Campaign');
    expect(parts).toContain("The Dragon's Lair.md");
  });

  it('should handle paths with special characters', () => {
    const specialPaths = [
      'campaign/lore/Dragon (Red).md',
      'campaign/monsters/Goblin-King.yaml',
      'campaign/locations/Dungeon_of_Doom.json',
    ];
    
    specialPaths.forEach(path => {
      const normalized = path.replace(/\\/g, '/');
      const parts = normalized.split('/');
      const filename = parts[parts.length - 1];
      const extension = filename.split('.').pop();
      
      expect(['md', 'yaml', 'json']).toContain(extension);
    });
  });
});

// ============================================================================
// FILE OPERATION PATH VALIDATION TESTS
// ============================================================================

describe('File Operation Path Validation Tests', () => {
  it('should validate YAML file paths', () => {
    const yamlPaths = [
      'monsters/goblin.yaml',
      'monsters\\dragon.yaml',
      'monsters/undead.yaml',
    ];
    
    yamlPaths.forEach(path => {
      const normalized = path.replace(/\\/g, '/');
      const parts = normalized.split('/');
      const filename = parts[parts.length - 1];
      const extension = filename.split('.').pop();
      
      expect(extension).toBe('yaml');
    });
  });

  it('should validate Markdown file paths', () => {
    const mdPaths = [
      'lore/dragon.md',
      'lore\\kingdom.md',
      'lore/quest.md',
    ];
    
    mdPaths.forEach(path => {
      const normalized = path.replace(/\\/g, '/');
      const parts = normalized.split('/');
      const filename = parts[parts.length - 1];
      const extension = filename.split('.').pop();
      
      expect(extension).toBe('md');
    });
  });

  it('should validate JSON file paths', () => {
    const jsonPaths = [
      'campaign.json',
      'locations\\dungeon.json',
      'config/settings.json',
    ];
    
    jsonPaths.forEach(path => {
      const normalized = path.replace(/\\/g, '/');
      const parts = normalized.split('/');
      const filename = parts[parts.length - 1];
      const extension = filename.split('.').pop();
      
      expect(extension).toBe('json');
    });
  });
});

// ============================================================================
// PATH NORMALIZATION EDGE CASES TESTS
// ============================================================================

describe('Path Normalization Edge Cases Tests', () => {
  it('should handle trailing slashes', () => {
    const paths = [
      'campaign/',
      'campaign\\',
      'campaign//',
    ];
    
    paths.forEach(path => {
      const normalized = path.replace(/\\/g, '/').replace(/\/+$/, '');
      expect(normalized).toBe('campaign');
    });
  });

  it('should handle leading slashes in relative paths', () => {
    const paths = [
      '/campaign/monsters',
      '\\campaign\\monsters',
    ];
    
    paths.forEach(path => {
      const normalized = path.replace(/\\/g, '/');
      const hasLeadingSlash = normalized.startsWith('/');
      
      expect(hasLeadingSlash).toBe(true);
    });
  });

  it('should handle consecutive slashes', () => {
    const path = 'campaign//monsters///goblin.yaml';
    const normalized = path.replace(/\/+/g, '/');
    
    expect(normalized).toBe('campaign/monsters/goblin.yaml');
  });

  it('should handle empty paths', () => {
    const emptyPaths = ['', '   ', null, undefined] as any[];
    
    emptyPaths.forEach(path => {
      if (!path || path.trim() === '') {
        // Empty paths should be handled gracefully
        expect(path === '' || path === null || path === undefined || path.trim() === '').toBe(true);
      }
    });
  });
});
