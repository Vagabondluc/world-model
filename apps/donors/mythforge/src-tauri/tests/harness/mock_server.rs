use httpmock::prelude::*;
use httpmock::Mock;

pub struct MockServerBuilder {
    server: MockServer,
}

impl MockServerBuilder {
    pub async fn start() -> Self {
        let server = MockServer::start_async().await;
        Self { server }
    }

    pub fn base_url(&self) -> String {
        self.server.base_url()
    }

    pub fn mock_health(&self) -> Mock<'_> {
        self.server.mock(|when, then| {
            when.method(GET).path("/api/tags");
            then.status(200)
                .header("content-type", "application/json")
                .body(r#"{"models":[{"name":"test-model"}]}"#);
        })
    }

    pub fn mock_tags(&self, body: &'static str) -> Mock<'_> {
        self.server.mock(|when, then| {
            when.method(GET).path("/api/tags");
            then.status(200)
                .header("content-type", "application/json")
                .body(body);
        })
    }
}
