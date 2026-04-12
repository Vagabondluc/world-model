use serde_json::Value;

pub fn assert_is_ok(value: &Value) {
    assert!(value.get("ok").and_then(|v| v.as_bool()) == Some(true));
}

pub fn assert_has_error(value: &Value) {
    assert!(value.get("error").is_some());
}
