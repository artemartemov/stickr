/**
 * Utility functions for the Stickr plugin
 */

/**
 * Parse a boolean string value (case-insensitive)
 * @param value - String value to parse
 * @returns true if value is 'true', false if value is 'false', otherwise returns the original value
 */
export function parseBooleanString(value: any): any {
  const strValue = String(value).toLowerCase()
  if (strValue === 'true') return true
  if (strValue === 'false') return false
  return value
}

/**
 * Check if a value is a boolean string ('true' or 'false')
 * @param value - Value to check
 * @returns true if value is 'true' or 'false' (case-insensitive)
 */
export function isBooleanString(value: any): boolean {
  const strValue = String(value).toLowerCase()
  return strValue === 'true' || strValue === 'false'
}

/**
 * Clean property name by removing the '#' suffix added by Figma
 * @param propertyKey - Raw property key from Figma (e.g., 'State#123')
 * @returns Cleaned property name (e.g., 'State')
 */
export function cleanPropertyName(propertyKey: string): string {
  return propertyKey.split('#')[0]
}

/**
 * Create a delay promise
 * @param ms - Milliseconds to delay
 * @returns Promise that resolves after the specified delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
