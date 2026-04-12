pub const MAX_ATTEMPTS: u32 = 3;
pub const BASE_DELAY_MS: u64 = 50;
pub const MAX_DELAY_MS: u64 = 500;

pub fn compute_delay_ms(attempt: u32) -> u64 {
    if attempt == 0 {
        return 0;
    }
    let exp = BASE_DELAY_MS.saturating_mul(2_u64.saturating_pow(attempt.saturating_sub(1)));
    exp.min(MAX_DELAY_MS)
}
