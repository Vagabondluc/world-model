/**
 * Compass Calculations Utilities
 * 
 * Functions for calculating compass headings from camera orientation,
 * converting between geographic and magnetic headings, and validating
 * compass-related values.
 */

import * as THREE from 'three';

// ============================================================================
// HEADING CALCULATIONS
// ============================================================================

/**
 * Calculate the compass heading (geographic/true north) from camera orientation
 * 
 * @param camera - Three.js camera
 * @param globe - Globe mesh (for coordinate system reference)
 * @returns Geographic heading in degrees (0-360), or null if at pole
 */
export function calculateCompassHeading(
    camera: THREE.Camera,
    globe: THREE.Mesh
): number | null {
    // Get camera's forward vector (direction it's looking)
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);

    // Invert to get the direction FROM camera TO globe center
    // (cameras look in negative Z direction in Three.js)
    forward.negate();

    // Define globe's up vector (Y-axis)
    const globeUp = new THREE.Vector3(0, 1, 0);

    // Check if camera is at or near a pole (forward vector is vertical)
    const verticalAlignment = Math.abs(forward.dot(globeUp));
    if (verticalAlignment > 0.99) {
        // Camera is too close to pole, heading is undefined
        return null;
    }

    // Project forward vector onto the horizontal plane
    const horizontalForward = forward.clone();
    horizontalForward.projectOnPlane(globeUp);
    horizontalForward.normalize();

    // Calculate angle from north (positive Z axis in our coordinate system)
    // Using atan2 for proper quadrant handling
    const angle = Math.atan2(
        horizontalForward.x,
        horizontalForward.z
    );

    // Convert radians to degrees
    const degrees = THREE.MathUtils.radToDeg(angle);

    // Normalize to 0-360 range
    return normalizeHeading(degrees);
}

/**
 * Calculate magnetic heading from geographic heading and declination angle
 * 
 * @param geographicHeading - True north heading in degrees
 * @param declinationAngle - Declination angle in degrees (positive = east)
 * @returns Magnetic heading in degrees (0-360)
 */
export function calculateMagneticHeading(
    geographicHeading: number,
    declinationAngle: number
): number {
    // Magnetic North = True North + Declination
    // Positive declination means Magnetic North is east of True North
    const magneticHeading = geographicHeading + declinationAngle;
    return normalizeHeading(magneticHeading);
}

// ============================================================================
// VALIDATION & NORMALIZATION
// ============================================================================

/**
 * Normalize a heading value to 0-360 degree range
 * 
 * @param heading - Heading in degrees (can be negative or > 360)
 * @returns Normalized heading (0-360)
 */
export function normalizeHeading(heading: number): number {
    // Use modulo to handle values outside 0-360 range
    let normalized = heading % 360;

    // Handle negative values
    if (normalized < 0) {
        normalized += 360;
    }

    return normalized;
}

/**
 * Validate and clamp declination angle to valid range
 * 
 * @param angle - Declination angle in degrees
 * @returns Clamped angle (-180 to 180)
 */
export function validateDeclinationAngle(angle: number): number {
    return Math.max(-180, Math.min(180, angle));
}

/**
 * Check if camera is positioned at or near a pole
 * 
 * @param camera - Three.js camera
 * @param threshold - Alignment threshold (default: 0.99)
 * @returns True if camera is at pole
 */
export function isAtPole(
    camera: THREE.Camera,
    threshold: number = 0.99
): boolean {
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);

    const globeUp = new THREE.Vector3(0, 1, 0);
    const verticalAlignment = Math.abs(forward.dot(globeUp));

    return verticalAlignment > threshold;
}

// ============================================================================
// FORMATTING & DISPLAY
// ============================================================================

/**
 * Format declination angle for display
 * 
 * @param angle - Declination angle in degrees
 * @returns Formatted string (e.g., "12°E", "8°W")
 */
export function formatDeclinationAngle(angle: number): string {
    const absAngle = Math.abs(angle);
    const direction = angle >= 0 ? 'E' : 'W';
    return `${absAngle.toFixed(0)}°${direction}`;
}

/**
 * Format heading for display
 * 
 * @param heading - Heading in degrees
 * @param precision - Decimal places (default: 0)
 * @returns Formatted string (e.g., "045°", "180°")
 */
export function formatHeading(heading: number, precision: number = 0): string {
    const normalized = normalizeHeading(heading);
    return `${normalized.toFixed(precision).padStart(3 + (precision > 0 ? precision + 1 : 0), '0')}°`;
}

/**
 * Get cardinal direction from heading
 * 
 * @param heading - Heading in degrees (0-360)
 * @returns Cardinal direction (N, NE, E, SE, S, SW, W, NW)
 */
export function getCardinalDirection(heading: number): string {
    const normalized = normalizeHeading(heading);
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(normalized / 45) % 8;
    return directions[index];
}

// ============================================================================
// ANIMATION HELPERS
// ============================================================================

/**
 * Calculate the shortest rotation path between two headings
 * Important for smooth needle animation across the 0°/360° boundary
 * 
 * @param from - Starting heading
 * @param to - Target heading
 * @returns Delta to add to 'from' to reach 'to' via shortest path
 */
export function getShortestRotationDelta(from: number, to: number): number {
    const normalizedFrom = normalizeHeading(from);
    const normalizedTo = normalizeHeading(to);

    let delta = normalizedTo - normalizedFrom;

    // If rotation is more than 180°, go the other way
    if (delta > 180) {
        delta -= 360;
    } else if (delta < -180) {
        delta += 360;
    }

    return delta;
}

/**
 * Cubic ease-out easing function for smooth animations
 * 
 * @param t - Progress (0 to 1)
 * @returns Eased value (0 to 1)
 */
export function easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
}
