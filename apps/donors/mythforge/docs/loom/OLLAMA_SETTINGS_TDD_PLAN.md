# MythosForge Ollama Settings TDD Plan

> **Status:** Draft
> **Version:** 0.1.0
> **Last Updated:** 2026-04-01
> **Related:** [Ollama Settings Spec](./OLLAMA_SETTINGS_SPEC.md) | [The Loom TDD Plan](./TDD_PLAN.md)

## Purpose

This plan defines the tests needed to implement the Ollama settings window, automatic model discovery, and Rust backend support without regressing the current Ollama generation path.

## Test Strategy

The feature should be covered at three levels:

1. **Frontend unit tests** for settings dialog rendering and state transitions
2. **Rust unit tests** for Ollama HTTP client and command behavior
3. **Contract tests** for model discovery, persistence, and event shape

## Test Matrix

```
Frontend
├── Settings dialog renders Ollama section
├── Auto discovery runs on open
├── Manual refresh reloads model list
├── Selected model persists in UI state
├── Error state is visible when discovery fails
└── Fallback state shows cached models when offline

Rust
├── /api/tags model parsing
├── /api/generate streaming event emission
├── health check behavior
├── config save/load behavior
├── command registration
└── error mapping

Contracts
├── model descriptor shape
├── ollama_chunk event payload
├── persisted config schema
└── provider-agnostic settings payload
```

## Phase 1: Frontend Settings UI

### 1.1 Render the Ollama section

**File:** `src/components/mythosforge/AboutDialogs.tsx`

```ts
describe('Preferences dialog', () => {
  it('renders an Ollama settings section', () => {
    render(<AboutDialogs openDialog="preferences" onClose={fn} />);
    expect(screen.getByText(/AI \/ Ollama/i)).toBeInTheDocument();
    expect(screen.getByText(/Auto model discovery/i)).toBeInTheDocument();
  });
});
```

### 1.2 Auto discovery on open

**File:** `src/components/mythosforge/__tests__/ollama-settings-dialog.test.tsx`

```ts
describe('Ollama settings discovery', () => {
  it('requests model discovery when the dialog opens', async () => {
    mockInvoke('ollama_list_models', [{ name: 'llama3.1:8b' }]);

    render(<OllamaSettingsDialog open />);

    await waitFor(() => {
      expect(mockInvoke).toHaveBeenCalledWith('ollama_list_models', undefined);
    });
    expect(screen.getByText('llama3.1:8b')).toBeInTheDocument();
  });
});
```

### 1.3 Manual refresh

```ts
it('refreshes the model list when Refresh is clicked', async () => {
  mockInvoke('ollama_list_models', [{ name: 'mistral:7b' }]);
  render(<OllamaSettingsDialog open />);

  await user.click(screen.getByRole('button', { name: /Refresh/i }));
  expect(mockInvoke).toHaveBeenCalledTimes(2);
});
```

### 1.4 Test connection

```ts
it('shows connection success when Ollama responds', async () => {
  mockInvoke('ollama_health_check', { ok: true });
  render(<OllamaSettingsDialog open />);

  await user.click(screen.getByRole('button', { name: /Test Connection/i }));
  expect(screen.getByText(/Online/i)).toBeInTheDocument();
});
```

### 1.5 Persist selected model

```ts
it('persists the selected model', async () => {
  mockInvoke('ollama_set_model', undefined);
  render(<OllamaSettingsDialog open />);

  await user.selectOptions(screen.getByLabelText(/Default model/i), 'mistral:7b');
  await user.click(screen.getByRole('button', { name: /Save/i }));

  expect(mockInvoke).toHaveBeenCalledWith('ollama_set_model', { model: 'mistral:7b' });
});
```

## Phase 2: Rust Ollama Client

### 2.1 Parse `/api/tags`

**File:** `src-tauri/src/ollama/__tests__/client_tests.rs`

```rs
#[test]
fn parses_model_list_from_tags_response() {
    let json = r#"
    {
      "models": [
        { "name": "llama3.1:8b", "size": 123, "modified_at": "2026-03-31T00:00:00Z" }
      ]
    }"#;

    let models = parse_models_from_tags(json).unwrap();
    assert_eq!(models[0].name, "llama3.1:8b");
}
```

### 2.2 Handle malformed model payloads

```rs
#[test]
fn rejects_malformed_model_payloads_without_panicking() {
    let json = r#"{ "models": [ { "size": "bad" } ] }"#;
    assert!(parse_models_from_tags(json).is_err());
}
```

### 2.3 Stream generation events

```rs
#[tokio::test]
async fn emits_ollama_chunk_events_for_streamed_tokens() {
    // mock server returns NDJSON with token + done fields
    // assert the window receives token chunks in order
}
```

### 2.4 Health check

```rs
#[tokio::test]
async fn returns_not_reachable_when_ollama_is_down() {
    let client = OllamaClient::new(Some("http://127.0.0.1:65500".into()));
    let result = client.health_check().await;
    assert!(result.is_err());
}
```

### 2.5 Persist settings

```rs
#[test]
fn saves_selected_model_to_a_stable_config_location() {
    let settings = OllamaSettings { selected_model: Some("llama3.1:8b".into()), ..default() };
    save_settings(&settings).unwrap();
    let loaded = load_settings().unwrap();
    assert_eq!(loaded.selected_model.as_deref(), Some("llama3.1:8b"));
}
```

## Phase 3: Command Layer Contract

### 3.1 Command registration

**File:** `src-tauri/src/main.rs`

```rs
#[test]
fn registers_ollama_settings_commands() {
    // compile-time or integration assertion that the generated handler includes:
    // - ollama_list_models
    // - ollama_generate
    // - ollama_set_model
    // - ollama_health_check
    // - ollama_get_settings
    // - ollama_save_settings
}
```

### 3.2 Error translation

```rs
#[test]
fn translates_ollama_errors_into_user_facing_messages() {
    let err = AdapterError::new("ollama_not_reachable", "Ollama is offline", None);
    assert_eq!(err.code, "ollama_not_reachable");
}
```

## Phase 4: Contract Tests

### 4.1 Model descriptor shape

```ts
it('keeps a stable model descriptor shape', () => {
  const model = { name: 'llama3.1:8b', size: 123, modifiedAt: '2026-03-31T00:00:00Z' };
  expect(model).toMatchObject({
    name: expect.any(String),
  });
});
```

### 4.2 `ollama_chunk` event payload

```ts
it('preserves the ollama_chunk payload contract', async () => {
  // token is string, done is boolean
  expect(payload).toEqual({ token: expect.any(String), done: expect.any(Boolean) });
});
```

### 4.3 Provider-agnostic settings payload

```ts
it('serializes settings in a provider-agnostic form', () => {
  const settings = buildOllamaSettings({ provider: 'ollama', selectedModel: 'llama3.1:8b' });
  expect(settings.provider).toBe('ollama');
  expect(settings.selectedModel).toBe('llama3.1:8b');
});
```

## Phase 5: Pi / OpenClaw Compatibility Tests

These tests are intentionally lightweight. They ensure the settings contract can be reused by a future Pi/OpenClaw backend adapter without changing the user-facing shape.

### 5.1 Shared provider config

```ts
it('can be converted into a generic provider config for Pi-style backends', () => {
  const config = toProviderConfig(buildOllamaSettings());
  expect(config.provider).toBe('ollama');
  expect(config.baseUrl).toMatch(/11434/);
});
```

### 5.2 Discovery contract remains generic

```ts
it('returns model records that do not depend on the UI layer', () => {
  const models = normalizeDiscoveredModels(raw);
  expect(models[0]).toHaveProperty('name');
});
```

## Red / Green / Refactor Order

1. Write failing frontend tests for dialog rendering and auto discovery.
2. Write failing Rust tests for model parsing and persistence.
3. Implement the minimal Rust command extensions.
4. Implement the settings dialog state and bindings.
5. Add contract tests for event and provider payloads.
6. Refactor the config shape so Pi/OpenClaw can reuse it.

## Exit Criteria

The feature is ready when:

- All tests in this plan pass.
- The settings dialog auto-discovers models on open.
- The Rust backend exposes a stable settings and discovery contract.
- The persisted config survives restart.
- The current streaming `ollama_chunk` path still works.

