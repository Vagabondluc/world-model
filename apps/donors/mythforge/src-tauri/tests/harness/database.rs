use sqlx::{sqlite::SqlitePoolOptions, SqlitePool};

pub async fn in_memory_database() -> SqlitePool {
    SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .expect("connect")
}
