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

/**
 * Configuration options for creating an auto-layout frame
 */
export interface AutoLayoutFrameConfig {
  name: string
  layoutMode: 'HORIZONTAL' | 'VERTICAL'
  itemSpacing?: number
  paddingTop?: number
  paddingBottom?: number
  paddingLeft?: number
  paddingRight?: number
  fills?: ReadonlyArray<Paint> | typeof figma.mixed
  cornerRadius?: number
  primaryAxisSizingMode?: 'AUTO' | 'FIXED'
  counterAxisSizingMode?: 'AUTO' | 'FIXED'
  primaryAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN'
  counterAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX'
}

/**
 * Create an auto-layout frame with common configuration
 * @param config - Frame configuration options
 * @returns Configured FrameNode
 */
export function createAutoLayoutFrame(config: AutoLayoutFrameConfig): FrameNode {
  const frame = figma.createFrame()
  frame.name = config.name
  frame.layoutMode = config.layoutMode

  // Prevent content clipping
  frame.clipsContent = false

  // Default to AUTO sizing if not specified
  frame.primaryAxisSizingMode = config.primaryAxisSizingMode ?? 'AUTO'
  frame.counterAxisSizingMode = config.counterAxisSizingMode ?? 'AUTO'

  // Set spacing and padding
  if (config.itemSpacing !== undefined) frame.itemSpacing = config.itemSpacing
  if (config.paddingTop !== undefined) frame.paddingTop = config.paddingTop
  if (config.paddingBottom !== undefined) frame.paddingBottom = config.paddingBottom
  if (config.paddingLeft !== undefined) frame.paddingLeft = config.paddingLeft
  if (config.paddingRight !== undefined) frame.paddingRight = config.paddingRight

  // Set visual properties
  if (config.fills !== undefined) frame.fills = config.fills
  if (config.cornerRadius !== undefined) frame.cornerRadius = config.cornerRadius

  // Set alignment
  if (config.primaryAxisAlignItems !== undefined) frame.primaryAxisAlignItems = config.primaryAxisAlignItems
  if (config.counterAxisAlignItems !== undefined) frame.counterAxisAlignItems = config.counterAxisAlignItems

  return frame
}

/**
 * Create a frame without clipping content
 * @returns FrameNode with clipsContent set to false
 */
export function createFrame(): FrameNode {
  const frame = figma.createFrame()
  frame.clipsContent = false
  return frame
}
