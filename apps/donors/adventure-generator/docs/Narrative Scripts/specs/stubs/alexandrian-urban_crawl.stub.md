# Spec stub — alexandrian_urban_crawl

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


Source
- [`Alexandrian - Alternate Backbone/urban_crawl.txt:1`](Alexandrian - Alternate Backbone/urban_crawl.txt:1)

Purpose
- Produce keyed district content and investigation-resolution procedures from a city gazetteer for use in an Urban Crawl editor.

API / Inputs
- UrbanCrawlRequest {
  cityId?: string,
  districtList?: string[],
  layers?: { name: string, weight?: number }[],
  investigationMode?: "random" | "targeted",
  seeds?: string[]
}

Outputs
- UrbanCrawlResult {
  districts: { id:string, name:string, layers:{name:string,content:string[]}[] }[],
  triggeredDistricts: { id:string, content:string[] }[],
  investigationProcedure: string
}

Behavior
- Use city_gazetteer to key content per district and layer.
- investigationMode=random pulls a layer according to weights; targeted returns the specified layer content.
- Support pagination for large district sets and allow content templating with placeholders.

Edge cases
- Missing cityId → return list of available gazetteers.
- Empty districtList → return primary city districts.
- Large seeds → sanitize and truncate.

Mapping to UI
- Editor panels: Gazetteer selector, District list, Layer editor, Investigation simulator.
- Live preview: sample investigation resolution for chosen district + mode.
- Export: Markdown, JSON, printable district entries.

Tests (examples)
- Targeted investigation returns content from the requested layer.
- Random mode produces layer chosen based on weights over repeated calls.
- Gazetteer absent → helpful error and available options list.

Priority
- Medium