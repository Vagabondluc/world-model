# Manual TDD Update Guide for Orbis 1.0 Compatibility

## Overview

This guide provides step-by-step instructions for manually applying Orbis 1.0 compatibility updates to all TDD files in the `update/tdd/` directory.

## Files to Update

The following TDD files need to be updated with Orbis 1.0 compatibility sections:

1. `00-data-types.tdd.md`
2. `01-time-clock-system.tdd.md`
3. `02-magnetosphere.tdd.md`
4. `04-carbon-cycle.tdd.md`
5. `05-biosphere-capacity.tdd.md`
6. `07-species-modules.tdd.md`
7. `10-life-engine.tdd.md`
8. `11-deterministic-event-ordering.tdd.md`
9. `12-trophic-energy.tdd.md`
10. `19-biome-stability.tdd.md`
11. `26-erosion-sediment.tdd.md`
12. `31-simulator-dashboard.tdd.md`
13. `32-need-driven-behavior.tdd.md`
14. `35-deterministic-rng.tdd.md`
15. `39-deterministic-utility-decision.tdd.md`
16. `49-climate-solver-contract-ebm.tdd.md`
17. `50-hydrology-solver-contract.tdd.md`
18. `52-population-dynamics-predator-prey-stability.tdd.md`
19. `56-unified-parameter-registry-schema-contract.tdd.md`
20. `57-save-load-snapshot-contract.tdd.md`
21. `58-state-authority-contract.tdd.md`
22. `59-worlddelta-validation-invariant-enforcement.tdd.md`
23. `68-numerical-stability-fixed-point-math-contract.tdd.md`
24. `atmosphere-transport.tdd.md`
25. `hydrology-erosion.tdd.md`
26. `numerical-stability.tdd.md`
27. `semantic-tags.tdd.md`
28. `tectonics-crust.tdd.md`

## Compatibility Section to Add

For each TDD file, add the following section at the end of the file:

```markdown
## 3. Orbis 1.0 Compatibility Tests
- [ ] Verify type mapping to Orbis 1.0 BiomeType enum (23 values: DEEP_OCEAN=0 through ALPINE=22)
- [ ] Verify type mapping to Orbis 1.0 VoxelMaterial enum (22 values: AIR=0 through MAGMA=21)
- [ ] Verify WorldDelta format compatibility (h?: number, t?: number, m?: number, s?: SettlementType, d?: string)
- [ ] Test serialization format compatibility (Little Endian byte order)
- [ ] Verify RefinedHexHeader structure compatibility (specVersion, encodingVersion, generatorVersion, worldSeed, hexId, rasterSize, subDivN)
```

## Step-by-Step Manual Update Instructions

### Step 1: Backup Original Files

Before making any changes, create a backup of the original TDD files:

```powershell
# Create backup directory
New-Item -ItemType Directory -Path "update\tdd-backup" -Force

# Copy all TDD files to backup
Copy-Item -Path "update\tdd\*.tdd.md" -Destination "update\tdd-backup\" -Recurse
```

### Step 2: Remove Read-Only Attributes

The TDD files in `update/tdd/` are read-only. You need to remove the read-only attribute before editing:

```powershell
# Remove read-only attribute from all TDD files
Get-ChildItem -Path "update\tdd" -Filter "*.tdd.md" | ForEach-Object {
    $file = $_
    if ($file.Attributes -band "ReadOnly") {
        $file.Attributes = $file.Attributes -band "ReadOnly"
        Write-Host "Removed ReadOnly from: $($file.Name)"
    }
}
```

### Step 3: Update Each TDD File

For each file listed in the "Files to Update" section above:

1. Open the file in your editor
2. Navigate to the end of the file
3. Add the compatibility section (see "Compatibility Section to Add" above)
4. Save the file

**Important Notes:**
- Maintain the existing checkbox format (`- [ ]`)
- Keep the existing section numbering (the compatibility section becomes "## 3.")
- Ensure proper markdown formatting

### Step 4: Restore Read-Only Attributes

After updating all files, restore the read-only attribute:

```powershell
# Restore read-only attribute to all TDD files
Get-ChildItem -Path "update\tdd" -Filter "*.tdd.md" | ForEach-Object {
    $file = $_
    $file.Attributes = $file.Attributes -bor "ReadOnly"
    Write-Host "Restored ReadOnly to: $($file.Name)"
}
```

## Verification Steps

After completing the updates, verify the changes:

### 1. Check File Integrity

Verify that all files were updated correctly:

```powershell
# Count files with compatibility section
$filesWithCompatibility = Get-ChildItem -Path "update\tdd" -Filter "*.tdd.md" | 
    Where-Object { 
        $content = Get-Content $_.FullName -Raw
        $content -match "## 3\. Orbis 1\.0 Compatibility Tests"
    }

Write-Host "Files with compatibility section: $($filesWithCompatibility.Count)"
Write-Host "Expected: 28"
```

### 2. Verify Content Format

Open a few updated files and verify:
- The compatibility section is present
- The checkbox format is correct
- The section numbering is sequential
- No duplicate sections exist

### 3. Cross-Reference Check

Verify the compatibility section content matches the specification in [`orbis-1.0-compatibility-layer.md`](../orbis-1.0-compatibility-layer.md):

- BiomeType enum values are correct (DEEP_OCEAN=0 through ALPINE=22)
- VoxelMaterial enum values are correct (AIR=0 through MAGMA=21)
- WorldDelta format is correct (h, t, m, s, d)
- Serialization format is mentioned (Little Endian)
- RefinedHexHeader fields are correct (specVersion, encodingVersion, generatorVersion, worldSeed, hexId, rasterSize, subDivN)

## Automated Script Alternative

Instead of manually updating files, you can use the provided PowerShell script:

```powershell
# Run the automated update script
.\scripts\update-tdds-orbis1-compatibility.ps1

# Or with custom paths
.\scripts\update-tdds-orbis1-compatibility.ps1 -TddDirectory "update\tdd" -UpdatedDirectory "update\tdd-updated"
```

The script will:
1. Remove read-only attributes from TDD files
2. Add the compatibility section to each file
3. Restore read-only attributes
4. Log all changes to `update/tdd-update-log.txt`

## Troubleshooting

### Issue: "Access Denied" when removing read-only attribute

**Solution:** Run PowerShell as Administrator

```powershell
# Open PowerShell as Administrator
Start-Process powershell -Verb runAs -ArgumentList "-File .\scripts\update-tdds-orbis1-compatibility.ps1"
```

### Issue: Files already have compatibility section

**Solution:** The script automatically skips files that already have the compatibility section. If you manually added it, the script will skip those files.

### Issue: Changes not visible after update

**Solution:** Refresh your editor or reload the files to see the updated content.

## Rollback Procedure

If you need to revert the changes:

```powershell
# Restore from backup
Copy-Item -Path "update\tdd-backup\*.tdd.md" -Destination "update\tdd\" -Force -Recurse

# Restore read-only attributes
Get-ChildItem -Path "update\tdd" -Filter "*.tdd.md" | ForEach-Object {
    $file = $_
    $file.Attributes = $file.Attributes -bor "ReadOnly"
}
```

## References

- [Orbis 1.0 Compatibility Layer Documentation](../orbis-1.0-compatibility-layer.md)
- [Orbis 1.0 Data Contracts](../Orbis%201.0/docs/08-data-contracts.md)
- [Orbis 1.0 Voxel Fundamentals](../Orbis%201.0/docs/01-voxel-fundamentals.md)
- [Orbis 2.0 Data Types](../docs/specs/00-core-foundation/00-data-types.md)

## Completion Checklist

- [ ] All 28 TDD files have been updated
- [ ] Each file has the Orbis 1.0 Compatibility Tests section
- [ ] Read-only attributes have been restored
- [ ] Verification steps completed successfully
- [ ] Backup files are preserved in `update/tdd-backup/`
