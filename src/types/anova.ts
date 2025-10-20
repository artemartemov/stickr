// Anova data structure types based on analysis of real component data

export interface AnovaSpec {
  title: string
  anatomy: Record<string, AnovaElement>
  props: Record<string, AnovaProp>
  default: AnovaVariantSpec
  variants: AnovaVariantSpec[]
  invalidConfigurations: InvalidConfiguration[]
}

export interface AnovaElement {
  type: 'container' | 'text' | 'instance' | 'vector'
  instanceOf?: string
  detectedIn?: string
  parent?: string
  children?: string[]
  styles?: Record<string, any>
  propConfigurations?: Record<string, string>
  propReferences?: Record<string, any>
}

export interface AnovaProp {
  type: 'string' | 'boolean'
  default: any
  enum?: string[]  // Present for VARIANT properties (e.g., size, State, Type)
}

export interface AnovaVariantSpec {
  name: string
  baseline?: string
  configuration?: Record<string, any>
  invalid?: boolean
  elements?: Record<string, Partial<AnovaElement>>
}

export interface InvalidConfiguration {
  [propName: string]: any
}

// Helper type to represent a valid, renderable variant combination
export interface AnovaVariantCombination {
  name: string
  configuration: Record<string, any>
  isValid: boolean
}

// Plugin state types
export type DataSource = 'figma-direct' | 'anova'

export interface FigmaDirectData {
  componentSets: ComponentSet[]
  expandedProperties: { [key: string]: boolean }
}

export interface AnovaData {
  raw: AnovaSpec
  importedAt: number
  componentName: string
  variants: AnovaVariantCombination[]  // Pre-filtered valid variants
}

export interface PluginState {
  dataSource: DataSource
  figmaData?: FigmaDirectData
  anovaData?: AnovaData
}

// Existing Figma Direct types (for compatibility)
export interface ComponentSet {
  id: string
  name: string
  properties: Record<string, Property>
  propertyOrder: string[]
  variantCount: number
}

export interface Property {
  type: string
  values: string[]
}

// Helper functions to work with Anova data

/**
 * Determines if a property is a VARIANT property (has enum values)
 */
export function isVariantProp(prop: AnovaProp): boolean {
  return prop.enum !== undefined && prop.enum.length > 0
}

/**
 * Filters out invalid variant combinations based on invalidConfigurations
 */
export function filterValidVariants(
  spec: AnovaSpec
): AnovaVariantCombination[] {
  const validVariants: AnovaVariantCombination[] = []

  // Add default variant - parse configuration from name
  const defaultConfig: Record<string, any> = {}

  // Parse default variant name to extract properties (e.g., "Type=Primary" -> {Type: "Primary"})
  if (spec.default.name) {
    const parts = spec.default.name.split(/,\s*/)
    for (const part of parts) {
      const [key, value] = part.split('=')
      if (key && value) {
        defaultConfig[key.trim()] = value.trim()
      }
    }
  }

  validVariants.push({
    name: spec.default.name || 'default',
    configuration: defaultConfig,
    isValid: true
  })

  // Process each variant
  for (const variant of spec.variants) {
    // Skip variants explicitly marked as invalid
    if (variant.invalid === true) {
      continue
    }

    // Check if variant matches any invalid configuration
    const isInvalid = spec.invalidConfigurations.some(invalidConfig => {
      // Check if all properties in invalidConfig match the variant's configuration
      return Object.keys(invalidConfig).every(key => {
        return variant.configuration && variant.configuration[key] === invalidConfig[key]
      })
    })

    if (!isInvalid && variant.configuration) {
      validVariants.push({
        name: variant.name,
        configuration: variant.configuration,
        isValid: true
      })
    }
  }

  return validVariants
}

/**
 * Gets only the VARIANT properties (properties with enum values)
 */
export function getVariantProps(spec: AnovaSpec): Record<string, AnovaProp> {
  const variantProps: Record<string, AnovaProp> = {}

  for (const [propName, prop] of Object.entries(spec.props)) {
    if (isVariantProp(prop)) {
      variantProps[propName] = prop
    }
  }

  return variantProps
}

/**
 * Gets only the BOOLEAN properties
 */
export function getBooleanProps(spec: AnovaSpec): Record<string, AnovaProp> {
  const booleanProps: Record<string, AnovaProp> = {}

  for (const [propName, prop] of Object.entries(spec.props)) {
    if (prop.type === 'boolean') {
      booleanProps[propName] = prop
    }
  }

  return booleanProps
}
