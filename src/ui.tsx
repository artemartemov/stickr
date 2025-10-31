import { emit, on } from '@create-figma-plugin/utilities'
import {
  Container,
  render,
  VerticalSpace,
  SelectableItem,
  IconBoolean16,
  IconInstance16,
  IconComponentProperty16,
  IconChevronDown16,
  Muted,
  LoadingIndicator,
  Dropdown,
  DropdownOption,
  TextboxMultiline,
  IconPlus16,
  IconClose16
} from '@create-figma-plugin/ui'
import { h, Fragment } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import * as yaml from 'js-yaml'
import type { AnovaSpec } from './types/anova'
import { filterValidVariants } from './types/anova'
import { themeStyles } from './styles/theme'
import { Button, Checkbox, IconButton, Text, Modal, Toggle, Input, TextArea, Separator, Spacer } from './components'

type DataSource = 'figma-direct' | 'anova'

function Plugin() {
  // Data source mode
  const [dataSource, setDataSource] = useState<DataSource>('figma-direct')
  const [showComponentDataTab, setShowComponentDataTab] = useState(false)

  // Figma Direct mode state
  const [componentSets, setComponentSets] = useState<any[]>([])
  const [expandedProperties, setExpandedProperties] = useState<{ [key: string]: boolean }>({})

  // Anova mode state
  const [anovaInput, setAnovaInput] = useState<string>('')
  const [anovaSpec, setAnovaSpec] = useState<AnovaSpec | null>(null)
  const [anovaError, setAnovaError] = useState<string>('')
  const [waitingForAutoSelect, setWaitingForAutoSelect] = useState(false)

  // Preview state
  const [previews, setPreviews] = useState<{ [variantName: string]: string }>({})
  const [previewsLoading, setPreviewsLoading] = useState(false)
  const [previewsError, setPreviewsError] = useState<string | null>(null)

  // Shared state
  const [previewCombinations, setPreviewCombinations] = useState<any[]>([])
  const [selectedCombinations, setSelectedCombinations] = useState<{ [key: string]: boolean }>({})
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [isPropertiesCollapsed, setIsPropertiesCollapsed] = useState(true)
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)
  const [collapsedGroups, setCollapsedGroups] = useState<{ [key: string]: boolean }>({})
  const [activeFilters, setActiveFilters] = useState<{ [propName: string]: string | null }>({})
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null)

  // Component Data filter (for Figma Direct mode)
  const [componentDataInput, setComponentDataInput] = useState<string>('')
  const [componentDataSpec, setComponentDataSpec] = useState<AnovaSpec | null>(null)
  const [componentDataError, setComponentDataError] = useState<string>('')
  const [isComponentDataModalOpen, setIsComponentDataModalOpen] = useState(false)
  const [selectedGroupingProperty, setSelectedGroupingProperty] = useState<string | null>(null)

  // Layout customization state
  const [isLayoutModalOpen, setIsLayoutModalOpen] = useState(false)
  const [layoutRowProperty, setLayoutRowProperty] = useState<string | null>(null)
  const [layoutColumnProperties, setLayoutColumnProperties] = useState<string[]>([])

  // Listen for initial data from backend - set up handler immediately
  on('INIT_DATA', (data: any[]) => {
    setComponentSets(data)

    // Auto-expand VARIANT and BOOLEAN properties
    const expanded: { [key: string]: boolean } = {}
    data.forEach(compSet => {
      for (const propName in compSet.properties) {
        const prop = compSet.properties[propName]
        if (prop.type === 'VARIANT' || prop.type === 'BOOLEAN') {
          expanded[propName] = true
        }
      }
    })
    setExpandedProperties(expanded)
  })

  // Listen for preview generation responses
  on('PREVIEWS_READY', (data: { [variantName: string]: string }) => {
    setPreviews(data)
    setPreviewsLoading(false)
    setPreviewsError(null)
  })

  on('PREVIEWS_ERROR', (data: { error: string }) => {
    setPreviewsError(data.error)
    setPreviewsLoading(false)
  })

  // Auto-continue import after component is selected
  useEffect(() => {
    if (waitingForAutoSelect && componentSets.length > 0 && anovaSpec && previewCombinations.length > 0) {
      setWaitingForAutoSelect(false)
      // Request previews now that component is selected
      // Add small delay to ensure selection is fully registered in Figma
      setTimeout(() => {
        setPreviewsLoading(true)
        setPreviewsError(null)
        emit('GENERATE_PREVIEWS', { combinations: previewCombinations })
      }, 100)
    }
  }, [componentSets, waitingForAutoSelect, anovaSpec, previewCombinations])

  // Generate preview when properties change (only for Figma Direct mode)
  useEffect(() => {
    // Skip if in Anova mode - Anova handles its own combinations
    if (dataSource === 'anova') return
    if (componentSets.length === 0) return

    const combinations: any[] = []
    const selected: { [key: string]: boolean } = {}

    componentSets.forEach(compSet => {
      // Get properties to expand
      const propsToExpand = Object.keys(expandedProperties).filter(
        key => expandedProperties[key] && compSet.properties[key]
      )

      // Generate combinations
      const combos = generateCombinations(compSet.properties, propsToExpand)

      combos.forEach(combo => {
        const key = `${compSet.id}:${JSON.stringify(combo)}`
        const variantName = Object.entries(combo)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([k, v]) => `${k}=${v}`)
          .join(', ')
        
        combinations.push({
          componentSetId: compSet.id,
          componentSetName: compSet.name,
          properties: combo,
          variantName: variantName
        })
        selected[key] = false // Default unchecked
      })
    })

    setPreviewCombinations(combinations)
    setSelectedCombinations(selected)
    
    // Request preview generation for Figma Direct mode
    if (combinations.length > 0) {
      setPreviewsLoading(true)
      setPreviewsError(null)
      
      emit('GENERATE_PREVIEWS', { combinations })
    }
  }, [componentSets, expandedProperties, dataSource])

  // Keyboard shortcut listener for Ctrl+D to toggle Component Data tab
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault()
        setShowComponentDataTab(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  function generateCombinations(properties: any, propsToExpand: string[]): any[] {
    if (propsToExpand.length === 0) return [{}]

    const result: any[] = []

    function recurse(index: number, current: any) {
      if (index === propsToExpand.length) {
        result.push({ ...current })
        return
      }

      const propName = propsToExpand[index]
      const values = properties[propName].values

      for (const value of values) {
        current[propName] = value
        recurse(index + 1, current)
      }
    }

    recurse(0, {})
    return result
  }

  function handleComponentDataParse() {
    if (!componentDataInput.trim()) {
      setComponentDataSpec(null)
      setComponentDataError('')
      return
    }

    try {
      const parsed = yaml.load(componentDataInput) as AnovaSpec

      // Validate basic structure
      if (!parsed.title || !parsed.props || !parsed.variants) {
        throw new Error('Invalid component data structure. Expected title, props, and variants.')
      }

      setComponentDataSpec(parsed)
      setComponentDataError('')
    } catch (err) {
      setComponentDataError(err instanceof Error ? err.message : 'Failed to parse YAML')
      setComponentDataSpec(null)
    }
  }

  function handlePropertyToggle(propName: string) {
    setExpandedProperties(prev => ({
      ...prev,
      [propName]: !prev[propName]
    }))
  }

  function handleCombinationToggle(key: string, index: number, isShiftClick: boolean = false) {
    if (isShiftClick && lastClickedIndex !== null) {
      // Shift-click: select range
      const start = Math.min(lastClickedIndex, index)
      const end = Math.max(lastClickedIndex, index)

      // Get the visible combinations (after filtering/sorting/grouping)
      const visibleCombinations = sortedCombinations.slice(start, end + 1)

      const newState = { ...selectedCombinations }
      visibleCombinations.forEach(combo => {
        const comboKey = getCombinationKey(combo)
        newState[comboKey] = true // Always select on shift-click
      })

      setSelectedCombinations(newState)
    } else {
      // Normal click: toggle single item
      setSelectedCombinations(prev => ({
        ...prev,
        [key]: !prev[key]
      }))
    }

    setLastClickedIndex(index)
  }

  function getCombinationKey(combo: any): string {
    if (dataSource === 'anova') {
      return `anova:${combo.variantName}`
    }
    return `${combo.componentSetId}:${JSON.stringify(combo.properties)}`
  }

  function handleSelectAll() {
    // Only select valid combinations (exclude invalid ones)
    const validCombinationKeys = sortedCombinations
      .filter((c: any) => c.isValidCombination !== false)
      .map(combo => getCombinationKey(combo))
    
    const allValidChecked = validCombinationKeys.every(key => selectedCombinations[key])
    const newState = { ...selectedCombinations }
    
    // Toggle only valid combinations
    validCombinationKeys.forEach(key => {
      newState[key] = !allValidChecked
    })

    setSelectedCombinations(newState)
  }

  function handleGroupToggle(groupKey: string) {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }))
  }

  function handleGroupSelectAll(groupCombos: any[]) {
    const groupKeys = groupCombos.map(combo => getCombinationKey(combo))
    const allSelected = groupKeys.every(key => selectedCombinations[key])

    const newState = { ...selectedCombinations }
    groupKeys.forEach(key => {
      newState[key] = !allSelected
    })

    setSelectedCombinations(newState)
  }

  function handleSelectAcrossGroups(combo: any, currentGroupingProperty: string) {
    // Find all combinations that match the same properties except the grouping property
    const matchingCombos = sortedCombinations.filter((c: any) => {
      // Skip invalid combinations
      if (c.isValidCombination === false) return false
      
      // Compare all properties except the grouping property
      for (const propName in combo.properties) {
        if (propName === currentGroupingProperty) continue // Skip the grouping property
        if (c.properties[propName] !== combo.properties[propName]) {
          return false
        }
      }
      return true
    })

    // Determine if we should select or deselect based on the current combo's state
    const currentKey = getCombinationKey(combo)
    const shouldSelect = !selectedCombinations[currentKey]

    const newState = { ...selectedCombinations }
    matchingCombos.forEach(matchingCombo => {
      const key = getCombinationKey(matchingCombo)
      if (shouldSelect) {
        newState[key] = true
      } else {
        delete newState[key]
      }
    })

    setSelectedCombinations(newState)
  }

  function handleFilterChange(propName: string, value: string | null) {
    setActiveFilters(prev => ({
      ...prev,
      [propName]: value
    }))
  }

  function handleClearFilters() {
    setActiveFilters({})
  }

  function getUniquePropertyValues(propName: string): string[] {
    const uniqueValues = new Set<string>()
    previewCombinations.forEach(combo => {
      if (combo.properties[propName] !== undefined) {
        uniqueValues.add(String(combo.properties[propName]))
      }
    })
    return Array.from(uniqueValues).sort()
  }

  function handleGenerate(explicitCombinations?: any[]) {
    const selected = explicitCombinations || previewCombinations.filter((combo) => {
      const key = getCombinationKey(combo)
      return selectedCombinations[key]
    })

    emit('GENERATE_STICKER_SHEET', {
      dataSource: dataSource,
      selectedCombinations: selected,
      includeLightDark: true,
      anovaComponentName: anovaSpec?.title,
      layoutConfig: {
        rowProperty: layoutRowProperty,
        columnProperties: layoutColumnProperties
      }
    })
  }

  function formatPropertyValue(value: any): string {
    const strValue = String(value).toLowerCase()
    if (strValue === 'true') return '✅ True'
    if (strValue === 'false') return '❌ False'
    return String(value)
  }

  function handleSort(columnName: string) {
    if (sortColumn === columnName) {
      // Toggle direction if same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // New column, default to ascending
      setSortColumn(columnName)
      setSortDirection('asc')
    }
  }

  function handleModeChange(newMode: DataSource) {
    setDataSource(newMode)
    // Don't clear any data - just switch the view
    // The data will remain available when switching back
  }

  function generateAnovaCombinations(spec: AnovaSpec, requestPreviews: boolean = true) {
    try {
      // Get base valid variants (filters out invalid ones)
      const validVariants = filterValidVariants(spec)

      // Collect properties that are already defined in variant configurations
      const variantConfiguredProps = new Set<string>()
      
      if (spec.default.configuration) {
        Object.keys(spec.default.configuration).forEach(key => variantConfiguredProps.add(key))
      }
      for (const variant of spec.variants) {
        if (variant.configuration) {
          Object.keys(variant.configuration).forEach(key => variantConfiguredProps.add(key))
        }
      }
      
      // Only expand boolean properties that are NOT already in variant configurations
      // These are instance-level properties like hasChevron, hasLeadingIcon, etc.
      const booleanProps: string[] = []
      for (const [propName, prop] of Object.entries(spec.props)) {
        if (prop.type === 'boolean' && !variantConfiguredProps.has(propName)) {
          booleanProps.push(propName)
        }
      }

      // Generate all combinations of boolean values
      const generateBooleanCombinations = (props: string[]): Record<string, boolean>[] => {
        if (props.length === 0) return [{}]

        const result: Record<string, boolean>[] = []
        const totalCombos = Math.pow(2, props.length)

        for (let i = 0; i < totalCombos; i++) {
          const combo: Record<string, boolean> = {}
          for (let j = 0; j < props.length; j++) {
            combo[props[j]] = Boolean((i >> j) & 1)
          }
          result.push(combo)
        }

        return result
      }

      const booleanCombos = generateBooleanCombinations(booleanProps)

      // Generate full combinations: base variants × boolean combinations
      const combinations: any[] = []
      const selected: { [key: string]: boolean } = {}

      for (const variant of validVariants) {
        // Find the matching variant spec to check element availability
        const variantSpec = variant.name === (spec.default.name || 'default')
          ? spec.default
          : spec.variants.find(v => v.name === variant.name)

        for (const boolCombo of booleanCombos) {
          // Check if this boolean combination is valid for this variant
          let isValidCombo = true

          if (variantSpec) {
            // Check each boolean prop
            for (const [boolProp, boolValue] of Object.entries(boolCombo)) {
              // Find elements controlled by this boolean in the default
              const controlledElements = Object.entries(spec.default.elements || {}).filter(([elemName, elem]) => {
                return elem.propReferences?.visible?.$ref === `#/props/${boolProp}`
              })

              // If boolean is true, check if the controlled elements exist in this variant
              if (boolValue === true && controlledElements.length > 0) {
                for (const [elemName] of controlledElements) {
                  const variantElem = variantSpec.elements?.[elemName]
                  if (variantElem?.propReferences?.visible === null) {
                    isValidCombo = false
                    break
                  }

                  const defaultElem = spec.default.elements?.[elemName]
                  const parentName = defaultElem?.parent

                  if (parentName) {
                    const variantParent = variantSpec.elements?.[parentName]
                    if (variantParent?.children) {
                      if (!variantParent.children.includes(elemName)) {
                        isValidCombo = false
                        break
                      }
                    }
                  }
                }
              }
            }
          }

          if (isValidCombo) {
            const fullConfig = { ...variant.configuration, ...boolCombo }

            // Check if this combination matches any invalid configuration
            const matchesInvalidConfig = spec.invalidConfigurations.some(invalidConfig => {
              return Object.keys(invalidConfig).every(key => {
                return fullConfig[key] === invalidConfig[key]
              })
            })

            if (matchesInvalidConfig) {
              continue
            }

            const configStr = Object.entries(fullConfig)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([k, v]) => `${k}=${v}`)
              .join(', ')

            const key = `anova:${configStr}`

            combinations.push({
              componentSetId: 'anova',
              componentSetName: spec.title,
              variantName: configStr,
              properties: fullConfig,
              isValid: true
            })
            selected[key] = false
          }
        }
      }

      setPreviewCombinations(combinations)
      setSelectedCombinations(selected)

      // Request preview generation for Anova variants (only if requested)
      if (requestPreviews) {
        setPreviewsLoading(true)
        setPreviewsError(null)
        emit('GENERATE_PREVIEWS', { combinations })
      }
    } catch (error: any) {
      setAnovaError(error.message || 'Failed to generate combinations')
    }
  }

  function handleAnovaImport() {
    try {
      setAnovaError('')

      // Try parsing as YAML first, then JSON
      let parsed: any
      try {
        parsed = yaml.load(anovaInput)
      } catch (yamlError) {
        // If YAML fails, try JSON
        try {
          parsed = JSON.parse(anovaInput)
        } catch (jsonError) {
          throw new Error('Invalid YAML or JSON format')
        }
      }

      // Validate structure
      if (!parsed.title || !parsed.props || !parsed.variants) {
        throw new Error('Invalid Anova format: missing required fields (title, props, variants)')
      }

      const spec = parsed as AnovaSpec
      setAnovaSpec(spec)

      // Generate combinations immediately (without previews if no component selected)
      const shouldRequestPreviews = componentSets.length > 0
      generateAnovaCombinations(spec, shouldRequestPreviews)

      // Auto-select matching component set if none is selected
      if (componentSets.length === 0) {
        // Request component selection and wait for update
        emit('SELECT_COMPONENT_BY_NAME', spec.title)
        setWaitingForAutoSelect(true)
        setPreviewsLoading(false) // Don't show loading yet
        setAnovaError('') // Clear error, will show status in preview section
        return
      }

    } catch (error: any) {
      setAnovaError(error.message || 'Failed to parse Anova data')
      setAnovaSpec(null)
      setPreviewCombinations([])
      setSelectedCombinations({})
    }
  }

  const hasSelection = Object.values(selectedCombinations).some(v => v)
  const allProperties: any = {}
  const propertyOrder: string[] = []

  // Collect all unique properties in order, excluding INSTANCE_SWAP
  componentSets.forEach(compSet => {
    if (compSet.propertyOrder) {
      compSet.propertyOrder.forEach((propName: string) => {
        if (!allProperties[propName]) {
          const prop = compSet.properties[propName]
          // Skip INSTANCE_SWAP properties as they don't generate combinations
          if (prop.type !== 'INSTANCE_SWAP') {
            allProperties[propName] = prop
            propertyOrder.push(propName)
          }
        }
      })
    }
  })

  // Apply component data validation (if in Figma Direct mode with component data)
  // Mark combinations as valid/invalid instead of filtering them out
  let componentDataFilteredCombinations = previewCombinations
  if (dataSource === 'figma-direct' && componentDataSpec) {
    const validVariants = filterValidVariants(componentDataSpec)
    
    // Determine which properties are VARIANT vs BOOLEAN
    const variantProps = new Set<string>()
    const booleanProps = new Set<string>()
    
    for (const [propName, prop] of Object.entries(componentDataSpec.props)) {
      // VARIANT properties have enum values
      if (prop.enum && prop.enum.length > 0) {
        variantProps.add(propName)
      } else if (prop.type === 'boolean') {
        booleanProps.add(propName)
      }
    }
    
    componentDataFilteredCombinations = previewCombinations.map(combo => {
      // Split combo properties into VARIANT and BOOLEAN parts
      const variantConfig: Record<string, any> = {}
      const booleanConfig: Record<string, any> = {}
      
      for (const [propName, propValue] of Object.entries(combo.properties)) {
        if (variantProps.has(propName)) {
          variantConfig[propName] = propValue
        } else if (booleanProps.has(propName)) {
          booleanConfig[propName] = propValue
        }
      }
      
      // Find validVariant(s) that match the VARIANT properties
      const matchingVariants = validVariants.filter(validVariant => {
        // Check if all VARIANT properties match
        return Object.keys(variantConfig).every(key => {
          const variantValue = String(validVariant.configuration[key] || '').toLowerCase()
          const comboValue = String(variantConfig[key]).toLowerCase()
          return variantValue === comboValue
        })
      })
      
      let isValid = false
      
      if (matchingVariants.length > 0) {
        // Check if the BOOLEAN properties are valid for ANY matching variant
        isValid = matchingVariants.some(matchingVariant => {
          // Find the variant spec for element validation
          const variantSpec = matchingVariant.name === (componentDataSpec.default.name || 'default')
            ? componentDataSpec.default
            : componentDataSpec.variants.find(v => v.name === matchingVariant.name)
          
          if (!variantSpec) return false
          
          // Validate each boolean property
          for (const [propName, propValue] of Object.entries(booleanConfig)) {
            const boolValue = String(propValue).toLowerCase() === 'true'
            
            // Find elements controlled by this boolean
            const controlledElements = Object.entries(componentDataSpec.default.elements || {}).filter(([elemName, elem]) => {
              return elem.propReferences?.visible?.$ref === `#/props/${propName}`
            })
            
            // If boolean is true, check if controlled elements exist in this variant
            if (boolValue === true && controlledElements.length > 0) {
              for (const [elemName] of controlledElements) {
                const variantElem = variantSpec.elements?.[elemName]
                if (variantElem?.propReferences?.visible === null) {
                  return false  // Boolean prop not valid for this variant
                }
                
                // Check parent-child relationships
                const defaultElem = componentDataSpec.default.elements?.[elemName]
                const parentName = defaultElem?.parent
                
                if (parentName) {
                  const variantParent = variantSpec.elements?.[parentName]
                  if (variantParent?.children) {
                    if (!variantParent.children.includes(elemName)) {
                      return false  // Element not in variant's parent children
                    }
                  }
                }
              }
            }
          }
          
          return true  // All boolean properties are valid for this variant
        })
      }
      
      // Check invalid configurations
      if (isValid) {
        const fullConfig = { ...variantConfig, ...booleanConfig }
        const matchesInvalidConfig = componentDataSpec.invalidConfigurations.some(invalidConfig => {
          return Object.keys(invalidConfig).every(key => {
            const invalidValue = String(invalidConfig[key]).toLowerCase()
            const comboValue = String(fullConfig[key]).toLowerCase()
            return invalidValue === comboValue
          })
        })
        
        if (matchesInvalidConfig) {
          isValid = false
        }
      }
      
      return { ...combo, isValidCombination: isValid }
    })
  } else {
    // No component data spec, mark all as valid
    componentDataFilteredCombinations = previewCombinations.map(combo => ({ ...combo, isValidCombination: true }))
  }

  // Apply property filters
  const filteredCombinations = componentDataFilteredCombinations.filter(combo => {
    // Check each active filter
    for (const [propName, filterValue] of Object.entries(activeFilters)) {
      if (filterValue === null || filterValue === '') continue // Skip empty filters

      const comboValue = combo.properties[propName]
      if (String(comboValue) !== filterValue) {
        return false // Combination doesn't match this filter
      }
    }
    return true // Passes all filters
  })

  // Sort combinations if a column is selected
  const sortedCombinations = sortColumn
    ? [...filteredCombinations].sort((a, b) => {
        const aVal = a.properties[sortColumn]
        const bVal = b.properties[sortColumn]

        // Handle undefined values
        if (aVal === undefined && bVal === undefined) return 0
        if (aVal === undefined) return 1
        if (bVal === undefined) return -1

        // Convert to strings for comparison
        const aStr = String(aVal).toLowerCase()
        const bStr = String(bVal).toLowerCase()

        const comparison = aStr.localeCompare(bStr)
        return sortDirection === 'asc' ? comparison : -comparison
      })
    : filteredCombinations

  // Group combinations by primary variant property (e.g., Type)
  const groupedCombinations: { [groupKey: string]: any[] } = {}
  let groupingProperty = ''

  // Determine grouping property based on user selection or default
  if (selectedGroupingProperty) {
    // Use user-selected grouping property
    groupingProperty = selectedGroupingProperty
  } else if (dataSource === 'anova' && anovaSpec) {
    // Anova mode: Find the first VARIANT property
    for (const [propName, prop] of Object.entries(anovaSpec.props)) {
      if (prop.enum && prop.enum.length > 0) {
        groupingProperty = propName
        break
      }
    }
  } else if (dataSource === 'figma-direct' && propertyOrder.length > 0) {
    // Figma Direct mode: Use the first VARIANT property with 2+ values that exists on all combinations
    console.log('🔍 Determining grouping property from propertyOrder:', propertyOrder)
    for (const propName of propertyOrder) {
      const prop = allProperties[propName]
      const valueCount = prop?.values?.length || 0
      console.log(`  - Checking "${propName}": type=${prop?.type}, values=${valueCount}`)

      if (prop && prop.type === 'VARIANT' && valueCount > 1) {
        // Verify this property exists on all combinations
        const combosWithProperty = sortedCombinations.filter(combo =>
          combo.properties && combo.properties[propName]
        ).length
        const coveragePercent = (combosWithProperty / sortedCombinations.length) * 100
        console.log(`    Coverage: ${combosWithProperty}/${sortedCombinations.length} (${coveragePercent.toFixed(0)}%)`)

        if (coveragePercent >= 100) {
          groupingProperty = propName
          console.log(`  ✓ Using "${propName}" for grouping`)
          break
        } else {
          console.log(`  ✗ Skipping "${propName}" - not present on all combinations`)
        }
      }
    }
  }

  // Group combinations by this property (for both modes)
  if (groupingProperty) {
    // Separate valid and invalid combinations
    const validCombos = sortedCombinations.filter(combo => combo.isValidCombination !== false)
    const invalidCombos = sortedCombinations.filter(combo => combo.isValidCombination === false)
    
    // Group valid combinations by the grouping property
    validCombos.forEach(combo => {
      const groupValue = combo.properties[groupingProperty]
      const groupKey = groupValue ? String(groupValue) : 'Other'

      if (!groupedCombinations[groupKey]) {
        groupedCombinations[groupKey] = []
      }
      groupedCombinations[groupKey].push(combo)
    })
    
    // Add invalid combinations as a separate group at the end
    if (invalidCombos.length > 0) {
      groupedCombinations['__INVALID__'] = invalidCombos
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .tooltip-wrapper .tooltip {
            position: absolute;
            left: calc(100% + 8px);
            top: 50%;
            transform: translateY(-50%);
            background: var(--figma-color-bg-inverse);
            color: var(--figma-color-text-onbrand);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.1s ease;
            z-index: 1000;
          }
          
          .tooltip-wrapper:hover .tooltip {
            opacity: 1;
            transition-delay: 0.1s;
          }
        `}

      </style>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Mode Toggle */}
      {showComponentDataTab && (
      <div style={{ display: 'flex', borderBottom: '1px solid var(--figma-color-border)', flexShrink: 0 }}>
        <div
          onClick={() => handleModeChange('figma-direct')}
          style={{
            flex: 1,
            padding: 'var(--spacing-lg)',
            textAlign: 'center',
            cursor: 'pointer',
            borderBottom: dataSource === 'figma-direct' ? '2px solid var(--figma-color-text-brand)' : '2px solid transparent',
            color: dataSource === 'figma-direct' ? 'var(--figma-color-text)' : 'var(--figma-color-text-secondary)',
            fontWeight: dataSource === 'figma-direct' ? 600 : 400,
            fontSize: '11px',
            transition: 'all 0.2s ease'
          }}
        >
          FIGMA CANVAS
        </div>
{showComponentDataTab && (
          <div
            onClick={() => handleModeChange('anova')}
            style={{
              flex: 1,
              padding: 'var(--spacing-lg)',
              textAlign: 'center',
              cursor: 'pointer',
              borderBottom: dataSource === 'anova' ? '2px solid var(--figma-color-text-brand)' : '2px solid transparent',
              color: dataSource === 'anova' ? 'var(--figma-color-text)' : 'var(--figma-color-text-secondary)',
              fontWeight: dataSource === 'anova' ? 600 : 400,
              fontSize: '11px',
              transition: 'all 0.2s ease'
            }}
          >
            COMPONENT DATA
          </div>
        )}
      </div>
      )}

      {/* Anova Input Section */}
      {dataSource === 'anova' && (
        <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0, borderBottom: '1px solid var(--figma-color-border)' }}>
          <div style={{ padding: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            {anovaSpec && (
              <>
                <div style={{
                  fontSize: 'var(--type-heading-section-fontSize)',
                fontWeight: 'var(--type-heading-section-fontWeight)',
                letterSpacing: 'var(--type-heading-section-letterSpacing)',
                textTransform: 'var(--type-heading-section-textTransform)',
                color: 'var(--text-primary)'
                }}>
                  {anovaSpec.title}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--figma-color-text-tertiary)' }}>·</div>
              </>
            )}
            <textarea
              value={anovaInput}
              onChange={(e: any) => setAnovaInput(e.target.value)}
              placeholder="Paste YAML/JSON..."
              style={{
                flex: 1,
                height: '30px',
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                fontFamily: 'var(--font-stack)',
                fontSize: '11px',
                border: '1px solid var(--figma-color-border)',
                borderRadius: '2px',
                background: 'var(--figma-color-bg)',
                color: 'var(--figma-color-text)',
                resize: 'none',
                lineHeight: '16px',
                overflow: 'hidden'
              }}
            />
            <Button onClick={handleAnovaImport} disabled={!anovaInput.trim()}>
              Import
            </Button>
          </div>
          {anovaError && (
            <div style={{ padding: '0 12px 12px 12px', color: 'var(--figma-color-text-danger)', fontSize: '11px' }}>
              {anovaError}
            </div>
          )}
        </div>
      )}



      {dataSource === 'figma-direct' && componentSets.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Muted>Select a component or component set on the canvas</Muted>
        </div>
      ) : dataSource === 'anova' && !anovaSpec ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Muted>Paste Anova data above to get started</Muted>
        </div>
      ) : (
        <>
          {/* Properties Section - Only show in Figma Direct mode */}
          {dataSource === 'figma-direct' && (
          <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div 
          style={{ padding: '12px 12px 4px 12px', minHeight: '40px', cursor: 'pointer', position: 'sticky', top: 0, background: 'var(--figma-color-bg)', zIndex: 1 }}
          onClick={() => setIsPropertiesCollapsed(!isPropertiesCollapsed)}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <div style={{ 
                fontSize: 'var(--type-heading-section-fontSize)',
                fontWeight: 'var(--type-heading-section-fontWeight)',
                letterSpacing: 'var(--type-heading-section-letterSpacing)',
                textTransform: 'var(--type-heading-section-textTransform)',
                color: 'var(--text-primary)'
              }}>
                Properties
              </div>
              {componentSets.length > 0 && (
                <>
                  <div style={{ fontSize: '11px', color: 'var(--figma-color-text-tertiary)' }}>·</div>
                  <div style={{ fontSize: '11px', color: 'var(--figma-color-text)' }}>
                    {componentSets[0].name}
                  </div>
                </>
              )}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              transform: isPropertiesCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
              color: 'var(--figma-color-text-secondary)'
            }}>
              <IconChevronDown16 />
            </div>
          </div>
        </div>

        {!isPropertiesCollapsed && (
          <div style={{ maxHeight: '30vh', overflowY: 'auto' }}>
        {propertyOrder.length === 0 ? (
          <div style={{ marginBottom: 'var(--spacing-xl)', textAlign: 'center', paddingTop: '40px' }}>
            <Muted>No properties found</Muted>
          </div>
        ) : (
          <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            {propertyOrder.map(propName => {
              const prop = allProperties[propName]
              // Only treat as variant if it has 3+ values
              const isVariant = prop.type === 'VARIANT' && prop.values && prop.values.length > 2
              const isChecked = expandedProperties[propName] || isVariant

              // Build the icon element
              let icon
              if (prop.type === 'BOOLEAN' || (prop.type === 'VARIANT' && prop.values && prop.values.length === 2)) {
                icon = <IconBoolean16 />
              } else if (prop.type === 'VARIANT') {
                icon = <IconInstance16 />
              } else if (prop.type === 'INSTANCE_SWAP') {
                icon = <IconComponentProperty16 />
              } else {
                icon = <IconBoolean16 />
              }

              return (
                <SelectableItem
                  key={propName}
                  disabled={isVariant}
                  value={isChecked}
                  onValueChange={(value) => !isVariant && handlePropertyToggle(propName)}
                  style={{ cursor: isVariant ? 'not-allowed' : 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <div style={{ marginRight: 'var(--spacing-sm)', display: 'flex', alignItems: 'center', opacity: 0.6 }}>
                      {icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span>{propName}</span>
                      {prop.values && prop.values.length > 0 && (
                        <span style={{ color: 'var(--figma-color-text-tertiary)', marginLeft: 'var(--spacing-xxs)' }}>
                          · {prop.values.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                </SelectableItem>
              )
            })}
          </div>
        )}
          </div>
        )}
      </div>
          )}



      {/* Preview Section - Takes remaining space */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', flexShrink: 0, padding: '12px 12px 4px 12px', minHeight: '40px', position: 'sticky', top: 0, background: 'var(--figma-color-bg)', zIndex: 1 }}
            >
              {/* First Row: Preview heading, count, status, and Select All button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <div style={{
                    fontSize: 'var(--type-heading-section-fontSize)',
                fontWeight: 'var(--type-heading-section-fontWeight)',
                letterSpacing: 'var(--type-heading-section-letterSpacing)',
                textTransform: 'var(--type-heading-section-textTransform)',
                color: 'var(--text-primary)'
                  }}>
                    Preview
                  </div>
                <div style={{ fontSize: '11px', color: 'var(--figma-color-text-tertiary)' }}>·</div>
                <div style={{ fontSize: '11px', color: 'var(--figma-color-text)' }}>
                  {Object.values(selectedCombinations).filter(v => v).length} / {sortedCombinations.filter((c: any) => c.isValidCombination !== false).length} selected
                </div>
                
                {dataSource === 'figma-direct' && componentDataSpec && sortedCombinations.some((c: any) => c.isValidCombination === false) && (
                  <>
                    <div style={{ fontSize: '11px', color: 'var(--figma-color-text-tertiary)' }}>·</div>
                    <div style={{ fontSize: '11px', color: 'var(--figma-color-text-secondary)' }}>
                      {sortedCombinations.length} total (<span
                        onClick={() => {
                          const invalidSection = document.getElementById('invalid-combinations-group')
                          if (invalidSection) {
                            invalidSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          }
                        }}
                        style={{
                          color: 'var(--figma-color-text-brand)',
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                        onMouseEnter={(e: any) => e.currentTarget.style.opacity = '0.7'}
                        onMouseLeave={(e: any) => e.currentTarget.style.opacity = '1'}
>{sortedCombinations.filter((c: any) => c.isValidCombination === false).length} invalid</span>)
                    </div>
                  </>
                )}
                
                {/* Add/Remove Component Data Button - After total count */}
                {dataSource === 'figma-direct' && componentSets.length > 0 && (
                  <>
                    <div style={{ fontSize: '11px', color: 'var(--figma-color-text-tertiary)' }}>·</div>
                    <div style={{ position: 'relative' }} className="tooltip-wrapper">
                      <IconButton
                        onClick={() => {
                          if (componentDataSpec) {
                            // Remove component data
                            setComponentDataInput('')
                            setComponentDataSpec(null)
                            setComponentDataError('')
                          } else {
                            // Add component data
                            setIsComponentDataModalOpen(true)
                          }
                        }}
                      >
                        {componentDataSpec ? (
                          <div style={{ 
                            color: 'var(--figma-color-text-danger)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <IconClose16 />
                          </div>
                        ) : (
                          <IconPlus16 />
                        )}
                      </IconButton>
                      <div className="tooltip">
                        {componentDataSpec ? 'Remove Component Data' : 'Add Component Data'}
                      </div>
                    </div>
                  </>
                )}
                
                {(waitingForAutoSelect || previewsLoading || previewsError) && dataSource === 'anova' && (
                  <>
                    <div style={{ fontSize: '11px', color: 'var(--figma-color-text-tertiary)' }}>·</div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-xs)',
                      padding: 'var(--spacing-xxs) var(--spacing-sm)',
                      borderRadius: '3px',
                      background: previewsError
                        ? 'var(--figma-color-bg-danger-tertiary)'
                        : 'var(--figma-color-bg-secondary)'
                    }}>
                      {!previewsError && (
                        <div style={{
                          width: '12px',
                          height: '12px',
                          border: '2px solid var(--figma-color-text-brand)',
                          borderTopColor: 'transparent',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite'
                        }} />
                      )}
                      <div style={{
                        fontSize: '11px',
                        fontWeight: 500,
                        color: previewsError
                          ? 'var(--figma-color-text-danger)'
                          : 'var(--figma-color-text)'
                      }}>
                        {previewsError ? 'Preview error' : waitingForAutoSelect ? 'Searching for component' : 'Generating previews'}
                      </div>
                    </div>
                  </>
                )}
                </div>
                <Toggle
                  value={(() => {
                    const validCombinationKeys = sortedCombinations
                      .filter((c: any) => c.isValidCombination !== false)
                      .map(combo => getCombinationKey(combo))
                    return validCombinationKeys.every(key => selectedCombinations[key])
                  })()}
                  onValueChange={handleSelectAll}
                >
                  Select All
                </Toggle>
              </div>

              {/* Second Row: Filtering and Sorting Controls */}
              {previewCombinations.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  {/* Grouping Property Selector - Show when there are multiple VARIANT properties */}
                  {(() => {
                  let groupableProps: string[] = []
                  
                  if (dataSource === 'anova' && anovaSpec) {
                    // Anova mode: get VARIANT properties from spec
                    groupableProps = Object.entries(anovaSpec.props)
                      .filter(([propName, prop]) => prop.enum && prop.enum.length > 0)
                      .map(([propName]) => propName)
                  } else if (dataSource === 'figma-direct' && propertyOrder.length > 0) {
                    // Figma Direct mode: get VARIANT properties with 2+ values that exist on all combinations
                    groupableProps = propertyOrder.filter(propName => {
                      const prop = allProperties[propName]
                      if (!prop || prop.type !== 'VARIANT' || !prop.values || prop.values.length <= 1) {
                        return false
                      }

                      // Check that this property exists on all combinations
                      const combosWithProperty = sortedCombinations.filter(combo =>
                        combo.properties && combo.properties[propName]
                      ).length
                      const coveragePercent = (combosWithProperty / sortedCombinations.length) * 100

                      return coveragePercent >= 100
                    })
                  }

                  // Only show if there are 2+ groupable properties
                  if (groupableProps.length < 2) return null

                  const groupOptions: DropdownOption[] = groupableProps.map(propName => ({
                    value: propName,
                    text: propName
                  }))

                  // Determine current grouping property
                  let currentGrouping = selectedGroupingProperty
                  if (!currentGrouping && groupableProps.length > 0) {
                    currentGrouping = groupableProps[0] // Default to first
                  }

                  return (
                    <div style={{ minWidth: '140px' }}>
                      <Muted style={{ fontSize: 'var(--section-label-fontSize)', fontWeight: 'var(--section-label-fontWeight)', letterSpacing: 'var(--section-label-letterSpacing)', textTransform: 'var(--section-label-textTransform)', marginBottom: 'var(--spacing-xxs)', display: 'block' }}>Group by</Muted>
                      <Dropdown
                        value={currentGrouping || ''}
                        options={groupOptions}
                        onChange={(e) => setSelectedGroupingProperty(e.currentTarget.value)}
                        style={{
                          fontSize: '11px',
                          fontWeight: 500
                        }}
                      />
                    </div>
                  )
                })()}
                
                {/* Filter Dropdowns - Show for both modes when combinations exist */}
                {(() => {
                  let filterableProps: [string, any][] = []
                  
                  if (dataSource === 'anova' && anovaSpec) {
                    // Anova mode: get VARIANT properties from spec
                    filterableProps = Object.entries(anovaSpec.props).filter(([propName, prop]) => {
                      return prop.enum && prop.enum.length > 0
                    })
                  } else if (dataSource === 'figma-direct' && propertyOrder.length > 0) {
                    // Figma Direct mode: get VARIANT properties with 3+ values from allProperties
                    filterableProps = propertyOrder
                      .filter(propName => {
                        const prop = allProperties[propName]
                        return prop && prop.type === 'VARIANT' && prop.values && prop.values.length > 2
                      })
                      .map(propName => [propName, allProperties[propName]])
                  }

                  if (filterableProps.length === 0) return null

                  return (
                    <>
                      {filterableProps.map(([propName, prop]) => {
                        const uniqueValues = getUniquePropertyValues(propName)
                        const currentFilter = activeFilters[propName]

                        const options: DropdownOption[] = [
                          { value: '', text: `All ${propName}` },
                          ...uniqueValues.map(value => ({ value, text: value }))
                        ]

                        return (
                          <div key={propName} style={{ minWidth: '100px' }}>
                            <Dropdown
                              value={currentFilter || ''}
                              options={options}
                              onChange={(newValue) => handleFilterChange(propName, newValue.currentTarget.value || null)}
                              style={{
                                fontSize: '11px',
                                borderColor: currentFilter ? 'var(--figma-color-text-brand)' : undefined,
                                fontWeight: currentFilter ? 600 : 400
                              }}
                            />
                          </div>
                        )
                      })}
                    </>
                  )
                })()}

</div>
              )}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto', padding: '0 12px' }}>
              {previewCombinations.length === 0 ? (
                <div style={{ textAlign: 'center', paddingTop: '40px' }}>
                  <Muted>No combinations to show</Muted>
                </div>
              ) : (
                /* Unified Grouped list view with thumbnails (both modes) */
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {Object.keys(groupedCombinations).length > 0 ? (
                    Object.entries(groupedCombinations).map(([groupKey, groupCombos]) => {
                      // Default invalid group to collapsed if not explicitly set
                      const isCollapsed = groupKey === '__INVALID__' 
                        ? (collapsedGroups[groupKey] !== undefined ? collapsedGroups[groupKey] : true)
                        : (collapsedGroups[groupKey] || false)
                      const groupSelectedCount = groupCombos.filter(combo =>
                        selectedCombinations[getCombinationKey(combo)]
                      ).length

                      return (
                        <div 
                          key={groupKey} 
                          id={groupKey === '__INVALID__' ? 'invalid-combinations-group' : undefined}
                          style={{ marginBottom: isCollapsed ? '8px' : '16px' }}
                        >
                          {/* Custom Minimal Disclosure Header */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 'var(--spacing-xxs)',
                              padding: '4px 0',
                              cursor: 'pointer',
                              userSelect: 'none',
                              marginLeft: '-2px'
                            }}
                            onClick={() => handleGroupToggle(groupKey)}
                          >
                            {/* Chevron Icon */}
                            <div style={{
                              transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                              transition: 'transform 0.15s ease',
                              display: 'flex',
                              alignItems: 'center',
                              color: 'var(--figma-color-text-secondary)',
                              marginRight: 'var(--spacing-xxxs)',
                              pointerEvents: 'none'
                            }}>
                              <IconChevronDown16 />
                            </div>

                            {/* Title */}
                            <Text style={{ fontWeight: 500, color: groupKey === '__INVALID__' ? 'var(--figma-color-text-secondary)' : undefined, pointerEvents: 'none' }}>
                              {groupKey === '__INVALID__' ? 'Invalid Combinations' : `${groupingProperty}: ${groupKey}`}
                            </Text>

                            {/* Count */}
                            <Muted style={{ fontSize: '11px', marginLeft: 'var(--spacing-xxxs)', pointerEvents: 'none' }}>
                              ({groupSelectedCount} / {groupCombos.length})
                            </Muted>
                            
                            {/* Select All Toggle */}
                            {groupKey !== '__INVALID__' && (
                              <div style={{ marginLeft: 'auto' }} onClick={(e: any) => e.stopPropagation()}>
                                <Toggle
                                  value={groupSelectedCount === groupCombos.length}
                                  onValueChange={(e: any) => {
                                    handleGroupSelectAll(groupCombos)
                                  }}
                                >
                                  Select {groupKey}
                                </Toggle>
                              </div>
                            )}
                          </div>
                          
                          {/* Invalid Combinations Summary - Always show for invalid group */}
                          {groupKey === '__INVALID__' && groupCombos.length > 0 && (
                              <div style={{
                                padding: 'var(--spacing-lg)',
                                background: 'var(--figma-color-bg-secondary)',
                                borderRadius: '6px',
                                border: '1px solid var(--figma-color-border)',
                                marginBottom: 'var(--spacing-xxs)'
                              }}>
                                <div style={{
                                  fontSize: '11px',
                                  fontWeight: 'var(--section-label-fontWeight)',
                                  letterSpacing: 'var(--section-label-letterSpacing)',
                                  color: 'var(--text-primary)',
                                  marginBottom: 'var(--spacing-sm)',
                                  textTransform: 'var(--section-label-textTransform)'
                                }}>
                                  Why these combinations are invalid:
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xxs)' }}>
                                  {(() => {
                                    // Group invalid combinations by their property signatures
                                    const invalidPatterns = new Map<string, { parts: string[], count: number }>()
                                    
                                    groupCombos.forEach(combo => {
                                      // Create a readable signature from ALL properties
                                      const propParts: string[] = []
                                      
                                      Object.entries(combo.properties).forEach(([key, value]) => {
                                        const strValue = String(value).toLowerCase()
                                        
                                        // For boolean properties, only show if true
                                        if (strValue === 'true') {
                                          propParts.push(key)
                                        } else if (strValue !== 'false') {
                                          // For non-boolean (VARIANT) properties, show key=value
                                          propParts.push(`${key}=${value}`)
                                        }
                                      })
                                      
                                      const sortedParts = propParts.sort()
                                      const signature = sortedParts.join(' + ')
                                      
                                      if (signature) {
                                        const existing = invalidPatterns.get(signature)
                                        if (existing) {
                                          existing.count++
                                        } else {
                                          invalidPatterns.set(signature, { parts: sortedParts, count: 1 })
                                        }
                                      }
                                    })
                                    
                                    return Array.from(invalidPatterns.entries()).map(([pattern, { parts, count }]) => (
                                      <div key={pattern} style={{
                                        fontSize: '11px',
                                        color: 'var(--figma-color-text-secondary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--spacing-xs)'
                                      }}>
                                        <span style={{
                                          width: '4px',
                                          height: '4px',
                                          borderRadius: '50%',
                                          background: 'var(--figma-color-text-tertiary)',
                                          flexShrink: 0
                                        }} />
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xxs)', flexWrap: 'wrap' }}>
                                          {parts.map((part, idx) => (
                                            <span key={idx}>
                                              <span style={{
                                                padding: 'var(--spacing-xxxs) var(--spacing-xs)',
                                                borderRadius: '3px',
                                                background: 'var(--figma-color-bg-tertiary)',
                                                fontSize: '10px',
                                                fontFamily: 'monospace',
                                                color: 'var(--figma-color-text)',
                                                whiteSpace: 'nowrap'
                                              }}>
                                                {part}
                                              </span>
                                              {idx < parts.length - 1 && (
                                                <span style={{
                                                  margin: '0 2px',
                                                  color: 'var(--figma-color-text-tertiary)',
                                                  fontSize: '10px'
                                                }}>+</span>
                                              )}
                                            </span>
                                          ))}
                                          <span style={{ color: 'var(--figma-color-text-tertiary)', whiteSpace: 'nowrap', marginLeft: 'var(--spacing-xxxs)' }}>
                                            ({count} variant{count > 1 ? 's' : ''})
                                          </span>
                                        </div>
                                      </div>
                                    ))
                                  })()}
                                </div>
                              </div>
                            )}
                          
                          {/* Group Items */}
                          {!isCollapsed && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-sm)', width: '100%' }}>
                            {groupCombos.map((combo, localIndex) => {
                    const key = getCombinationKey(combo)
                    const isSelected = selectedCombinations[key] || false
                    const isHovered = hoveredRow === key
                    const previewImage = previews[combo.variantName]
                    const isInvalid = combo.isValidCombination === false

                    // Calculate global index in sortedCombinations
                    const globalIndex = sortedCombinations.findIndex(c => getCombinationKey(c) === key)

                    let bgColor = 'transparent'
                    if (isInvalid) {
                      bgColor = 'var(--figma-color-bg-disabled)'
                    } else if (isSelected) {
                      bgColor = 'var(--figma-color-bg-selected)'
                    } else if (isHovered) {
                      bgColor = 'var(--figma-color-bg-hover)'
                    }

                    return (
                      <div
                        key={localIndex}
                        style={{
                          cursor: isInvalid ? 'not-allowed' : 'pointer',
                          background: bgColor,
                          borderRadius: '6px',
                          padding: 'var(--spacing-lg)',
                          border: isInvalid 
                            ? '1px dashed var(--figma-color-border)' 
                            : isSelected 
                              ? '1px solid var(--figma-color-text-brand)' 
                              : '1px solid transparent',
                          display: 'flex',
                          gap: 'var(--spacing-lg)',
                          alignItems: 'flex-start',
                          opacity: isInvalid ? 0.5 : 1,
                          position: 'relative'
                        }}
                        onMouseEnter={() => !isInvalid && setHoveredRow(key)}
                        onMouseLeave={() => setHoveredRow(null)}
                        onClick={(e: any) => !isInvalid && handleCombinationToggle(key, globalIndex, e.shiftKey)}
                      >
                        {/* Thumbnail */}
                        <div style={{
                          width: '96px',
                          height: '96px',
                          flexShrink: 0,
                          borderRadius: '6px',
                          overflow: 'hidden',
                          background: 'var(--figma-color-bg-tertiary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid var(--figma-color-border)'
                        }}>
                          {previewsLoading ? (
                            <LoadingIndicator />
                          ) : previewImage ? (
                            <img
                              src={`data:image/png;base64,${previewImage}`}
                              alt={combo.variantName}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain'
                              }}
                            />
                          ) : (
                            <Muted style={{ fontSize: '24px' }}>?</Muted>
                          )}
                        </div>

                        {/* Properties */}
                        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                          {/* Invalid Combination Badge */}
                          {isInvalid && (
                            <div style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 'var(--spacing-xxs)',
                              padding: 'var(--spacing-xxxs) var(--spacing-xs)',
                              borderRadius: '3px',
                              background: 'var(--figma-color-bg-tertiary)',
                              alignSelf: 'flex-start'
                            }}>
                              <span style={{
                                fontSize: '10px',
                                fontWeight: 500,
                                color: 'var(--figma-color-text-tertiary)'
                              }}>
                                Invalid
                              </span>
                            </div>
                          )}
                          
                          <div style={{ display: 'flex', gap: 'var(--spacing-lg)', alignItems: 'flex-start' }}>
                          {combo.properties && Object.keys(combo.properties).length > 0 && (() => {
                            // Separate boolean and variant properties
                            const boolProps: [string, any][] = []
                            const variantProps: [string, any][] = []

                            Object.entries(combo.properties).forEach(([key, value]) => {
                              // Skip the grouping property since it's already shown in the group header
                              if (key === groupingProperty) {
                                return
                              }
                              
                              const strValue = String(value).toLowerCase()
                              const isBool = strValue === 'true' || strValue === 'false'

                              if (isBool) {
                                boolProps.push([key, value])
                              } else {
                                variantProps.push([key, value])
                              }
                            })

                            return (
                              <>
                                {/* Variant Properties (Left) */}
                                {variantProps.length > 0 && (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xxs)', flex: '0 0 auto' }}>
                                    {variantProps.map(([key, value]) => (
                                      <div
                                        key={key}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          fontSize: '11px'
                                        }}
                                      >
                                        <span style={{
                                          color: 'var(--figma-color-text)',
                                          fontWeight: 500,
                                          padding: 'var(--spacing-xxxs) var(--spacing-sm)',
                                          borderRadius: '3px',
                                          background: 'var(--figma-color-bg-brand-tertiary)'
                                        }}>
                                          {String(value)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Boolean Properties (Right) */}
                                {boolProps.length > 0 && (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xxs)', marginLeft: 'auto', alignItems: 'flex-end' }}>
                                    {boolProps.map(([key, value]) => {
                                      const strValue = String(value).toLowerCase()
                                      const boolValue = strValue === 'true'

                                      return (
                                        <div
                                          key={key}
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--spacing-xs)',
                                            fontSize: '11px'
                                          }}
                                        >
                                          <span style={{
                                            color: 'var(--figma-color-text-secondary)'
                                          }}>
                                            {key}
                                          </span>
                                          <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            padding: 'var(--spacing-xxxs)',
                                            borderRadius: '3px',
                                            background: boolValue
                                              ? 'var(--figma-color-bg-success)'
                                              : 'var(--figma-color-bg-secondary)',
                                            fontSize: '10px',
                                            color: boolValue ? 'var(--figma-color-text-onbrand)' : 'var(--figma-color-text-tertiary)',
                                            fontWeight: 600,
                                            lineHeight: 1
                                          }}>
                                            {boolValue ? '✓' : '✗'}
                                          </span>
                                        </div>
                                      )
                                    })}
                                  </div>
                                )}
                              </>
                            )
                          })()}
                          </div>
                          
                        </div>
                        
                        {/* Select Across Groups Button - Centered absolutely, only show on hover */}
                        {!isInvalid && isHovered && groupingProperty && Object.keys(groupedCombinations).length > 1 && (
                          <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            pointerEvents: 'none'
                          }}>
                            <Button
                              secondary
                              onClick={(e: any) => {
                                e.stopPropagation()
                                handleSelectAcrossGroups(combo, groupingProperty)
                              }}
                              onMouseEnter={(e: any) => {
                                e.currentTarget.style.background = 'var(--figma-color-bg-hover)'
                                e.currentTarget.style.borderColor = 'var(--figma-color-text-brand)'
                              }}
                              onMouseLeave={(e: any) => {
                                e.currentTarget.style.background = ''
                                e.currentTarget.style.borderColor = ''
                              }}
                              style={{ 
                                fontSize: '11px', 
                                padding: 'var(--spacing-xxs) var(--spacing-sm)',
                                pointerEvents: 'auto',
                                cursor: 'pointer'
                              }}
                            >
                              Select in All Groups
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                            </div>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    /* Fallback for no grouping - render ungrouped items */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', width: '100%' }}>
                    {sortedCombinations.map((combo, index) => {
                      const key = getCombinationKey(combo)
                      const isSelected = selectedCombinations[key] || false
                      const isHovered = hoveredRow === key
                      const previewImage = previews[combo.variantName]
                      const isInvalid = combo.isValidCombination === false

                      let bgColor = 'transparent'
                      if (isInvalid) {
                        bgColor = 'var(--figma-color-bg-disabled)'
                      } else if (isSelected) {
                        bgColor = 'var(--figma-color-bg-selected)'
                      } else if (isHovered) {
                        bgColor = 'var(--figma-color-bg-hover)'
                      }

                      return (
                        <div
                          key={index}
                          style={{
                            cursor: isInvalid ? 'not-allowed' : 'pointer',
                            background: bgColor,
                            borderRadius: '6px',
                            padding: 'var(--spacing-lg)',
                            border: isInvalid
                              ? '1px dashed var(--figma-color-border)'
                              : isSelected
                                ? '1px solid var(--figma-color-text-brand)'
                                : '1px solid transparent',
                            display: 'flex',
                            gap: 'var(--spacing-lg)',
                            alignItems: 'flex-start',
                            opacity: isInvalid ? 0.5 : 1,
                            position: 'relative'
                          }}
                          onMouseEnter={() => !isInvalid && setHoveredRow(key)}
                          onMouseLeave={() => setHoveredRow(null)}
                          onClick={(e: any) => !isInvalid && handleCombinationToggle(key, index, e.shiftKey)}
                        >
                          {/* Thumbnail */}
                          <div style={{
                            width: '96px',
                            height: '96px',
                            flexShrink: 0,
                            borderRadius: '6px',
                            overflow: 'hidden',
                            background: 'var(--figma-color-bg-tertiary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid var(--figma-color-border)'
                          }}>
                            {previewsLoading ? (
                              <LoadingIndicator />
                            ) : previewImage ? (
                              <img
                                src={`data:image/png;base64,${previewImage}`}
                                alt={combo.variantName}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'contain'
                                }}
                              />
                            ) : (
                              <Muted style={{ fontSize: '24px' }}>?</Muted>
                            )}
                          </div>

                          {/* Properties */}
                          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                            {/* Invalid Combination Badge */}
                            {isInvalid && (
                              <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-xxs)',
                                padding: 'var(--spacing-xxxs) var(--spacing-xs)',
                                borderRadius: '3px',
                                background: 'var(--figma-color-bg-tertiary)',
                                alignSelf: 'flex-start'
                              }}>
                                <span style={{
                                  fontSize: '10px',
                                  fontWeight: 500,
                                  color: 'var(--figma-color-text-tertiary)'
                                }}>
                                  Invalid
                                </span>
                              </div>
                            )}

                            <div style={{ display: 'flex', gap: 'var(--spacing-lg)', alignItems: 'flex-start' }}>
                            {combo.properties && Object.keys(combo.properties).length > 0 && (() => {
                              // Separate boolean and variant properties
                              const boolProps: [string, any][] = []
                              const variantProps: [string, any][] = []

                              Object.entries(combo.properties).forEach(([key, value]) => {
                                // When ungrouped, show ALL properties (don't skip any)
                                const strValue = String(value).toLowerCase()
                                const isBool = strValue === 'true' || strValue === 'false'

                                if (isBool) {
                                  boolProps.push([key, value])
                                } else {
                                  variantProps.push([key, value])
                                }
                              })

                              return (
                                <>
                                  {/* Variant Properties (Left) */}
                                  {variantProps.length > 0 && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xxs)', flex: '0 0 auto' }}>
                                      {variantProps.map(([key, value]) => (
                                        <div
                                          key={key}
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            fontSize: '11px'
                                          }}
                                        >
                                          <span style={{
                                            color: 'var(--figma-color-text)',
                                            fontWeight: 500,
                                            padding: 'var(--spacing-xxxs) var(--spacing-sm)',
                                            borderRadius: '3px',
                                            background: 'var(--figma-color-bg-brand-tertiary)'
                                          }}>
                                            {String(value)}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* Boolean Properties (Right) */}
                                  {boolProps.length > 0 && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xxs)', marginLeft: 'auto', alignItems: 'flex-end' }}>
                                      {boolProps.map(([key, value]) => {
                                        const strValue = String(value).toLowerCase()
                                        const boolValue = strValue === 'true'

                                        return (
                                          <div
                                            key={key}
                                            style={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              gap: 'var(--spacing-xs)',
                                              fontSize: '11px'
                                            }}
                                          >
                                            <span style={{
                                              color: 'var(--figma-color-text-secondary)'
                                            }}>
                                              {key}
                                            </span>
                                            <span style={{
                                              display: 'inline-flex',
                                              alignItems: 'center',
                                              padding: 'var(--spacing-xxxs)',
                                              borderRadius: '3px',
                                              background: boolValue
                                                ? 'var(--figma-color-bg-success)'
                                                : 'var(--figma-color-bg-secondary)',
                                              fontSize: '10px',
                                              color: boolValue ? 'var(--figma-color-text-onbrand)' : 'var(--figma-color-text-tertiary)',
                                              fontWeight: 600,
                                              lineHeight: 1
                                            }}>
                                              {boolValue ? '✓' : '✗'}
                                            </span>
                                          </div>
                                        )
                                      })}
                                    </div>
                                  )}
                                </>
                              )
                            })()}
                            </div>

                          </div>
                        </div>
                      )
                    })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
      </div>
        </>
      )}

      {/* Sticky Generate Buttons */}
      <div style={{
        background: 'var(--figma-color-bg)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex' }}>
          <Button fullWidth style={{ borderRadius: 0, height: '52px', justifyContent: 'flex-start', border: 'none' }} onClick={() => setIsLayoutModalOpen(true)} disabled={!hasSelection}>
            Preview Layout
          </Button>
          <Button style={{ borderRadius: 0, height: '52px', justifyContent: 'flex-start', border: 'none' }} onClick={() => handleGenerate()} disabled={!hasSelection}>
            Generate
          </Button>
        </div>
      </div>
      </div>

      {/* Component Data Modal */}
      {isComponentDataModalOpen && (
        <Modal
          isOpen={isComponentDataModalOpen}
          title="Add Component Data"
          onClose={() => setIsComponentDataModalOpen(false)}
        >
          <div style={{ padding: 'var(--spacing-lg)' }}>
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <Muted>Paste component data (YAML) to filter variants to only valid combinations</Muted>
            </div>
            <TextboxMultiline
              value={componentDataInput}
              onValueInput={setComponentDataInput}
              placeholder="Paste Anova YAML data here..."
              rows={12}
            />
            {componentDataError && (
              <div style={{ marginTop: 'var(--spacing-sm)', color: 'var(--figma-color-text-danger)', fontSize: '11px' }}>
                {componentDataError}
              </div>
            )}
            {componentDataSpec && (
              <div style={{ marginTop: 'var(--spacing-sm)', color: 'var(--figma-color-text-success)', fontSize: '11px' }}>
                ✓ Loaded: {componentDataSpec.title}
              </div>
            )}
            <VerticalSpace space="medium" />
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end' }}>
              <Button secondary onClick={() => setIsComponentDataModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                handleComponentDataParse()
                setIsComponentDataModalOpen(false)
              }}>
                Apply Filter
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Layout Preview Modal */}
      {isLayoutModalOpen && (() => {
        // Get all varying properties from selected combinations
        const varyingProps = new Set<string>()
        const selectedCombos = previewCombinations.filter((combo) => {
          const key = getCombinationKey(combo)
          return selectedCombinations[key] && combo.isValidCombination !== false
        })

        selectedCombos.forEach(combo => {
          Object.keys(combo.properties).forEach(prop => varyingProps.add(prop))
        })

        const propArray = Array.from(varyingProps)

        // Get unique values for each property IN THE ORDER THEY APPEAR (matches backend)
        const propValues: { [key: string]: string[] } = {}
        propArray.forEach(prop => {
          const values: string[] = []
          const seen = new Set<string>()
          selectedCombos.forEach(combo => {
            if (combo.properties[prop]) {
              const val = String(combo.properties[prop])
              if (!seen.has(val)) {
                seen.add(val)
                values.push(val)
              }
            }
          })
          propValues[prop] = values
        })

        // Set defaults if not already set
        const currentRowProp = layoutRowProperty || (propArray.length > 0 ? propArray[0] : null)
        const currentColProps = layoutColumnProperties.length > 0
          ? layoutColumnProperties
          : propArray.filter(p => p !== currentRowProp)

        const rowOptions: DropdownOption[] = propArray.map(prop => ({ value: prop, text: prop }))
        const availableColProps = propArray.filter(p => p !== currentRowProp)

        const handleColumnToggle = (prop: string) => {
          if (currentColProps.includes(prop)) {
            setLayoutColumnProperties(currentColProps.filter(p => p !== prop))
          } else {
            setLayoutColumnProperties([...currentColProps, prop])
          }
        }

        // State for excluded cells
        const [excludedCells, setExcludedCells] = useState<Set<string>>(new Set())

        // Create a unique key for a cell based on row + column combination
        const getCellKey = (rowValue: string, colCombo: any[]) => {
          return `${currentRowProp}:${rowValue}|${currentColProps.map((prop, idx) => `${prop}:${colCombo[idx]}`).join('|')}`
        }

        // Toggle cell exclusion
        const toggleCellExclusion = (rowValue: string, colCombo: any[]) => {
          const key = getCellKey(rowValue, colCombo)
          const newExcluded = new Set(excludedCells)
          if (newExcluded.has(key)) {
            newExcluded.delete(key)
          } else {
            newExcluded.add(key)
          }
          setExcludedCells(newExcluded)
        }

        return (
          <Modal
            isOpen={isLayoutModalOpen}
          title="Layout Preview & Cell Exclusion"
          onClose={() => setIsLayoutModalOpen(false)}
          >
            <div style={{
              padding: '16px',
              maxWidth: '568px',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              {propArray.length < 2 ? (
                <div>
                  <Muted>Need at least 2 varying properties to customize layout</Muted>
                </div>
              ) : (
                <>
                  <Muted style={{ fontSize: '11px', marginBottom: 'var(--spacing-lg)', display: 'block' }}>
                    Assign each property to Row or Column
                  </Muted>

                  <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                    {/* Property Assignment List */}
                    {propArray.map(prop => {
                      const isRowProp = currentRowProp === prop
                      const isColProp = currentColProps.includes(prop)

                      return (
                        <div
                          key={prop}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px 0',
                            borderBottom: '1px solid var(--figma-color-border)'
                          }}
                        >
                          {/* Property Name & Info */}
                          <div style={{ flex: 1 }}>
                            <Text style={{ fontSize: '11px', display: 'block', marginBottom: 'var(--spacing-xxxs)' }}>
                              {prop}
                            </Text>
                            {propValues[prop] && (
                              <Muted style={{ fontSize: '10px' }}>
                                {propValues[prop].length} values: {propValues[prop].slice(0, 3).join(', ')}
                                {propValues[prop].length > 3 ? '...' : ''}
                              </Muted>
                            )}
                          </div>

                          {/* Row/Column Buttons */}
                          <div style={{ display: 'flex', gap: 'var(--spacing-xxs)', marginLeft: 'var(--spacing-lg)' }}>
                            <Button
                              secondary={!isRowProp}
                              onClick={() => {
                                setLayoutRowProperty(prop)
                                // Remove from columns if selected as row
                                if (isColProp) {
                                  setLayoutColumnProperties(currentColProps.filter(p => p !== prop))
                                }
                              }}
                              style={{
                                minWidth: '50px',
                                padding: 'var(--spacing-xxs) var(--spacing-sm)',
                                fontSize: '10px'
                              }}
                            >
                              Row
                            </Button>
                            <Button
                              secondary={!isColProp}
                              disabled={isRowProp}
                              onClick={() => handleColumnToggle(prop)}
                              style={{
                                minWidth: '50px',
                                padding: 'var(--spacing-xxs) var(--spacing-sm)',
                                fontSize: '10px'
                              }}
                            >
                              Column
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                    {/* Visual Matrix Preview - More Context Rich */}
                    {currentRowProp && currentColProps.length > 0 && (
                      <div style={{
                        padding: '16px',
                        background: 'var(--figma-color-bg-secondary)',
                        borderRadius: '6px',
                        border: '1px solid var(--figma-color-border)'
                      }}>
                        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                          <Text style={{ fontSize: '11px', fontWeight: 'var(--section-label-fontWeight)', display: 'block', textTransform: 'var(--section-label-textTransform)', letterSpacing: 'var(--section-label-letterSpacing)', marginBottom: 'var(--spacing-xxs)' }}>
                            Layout Preview
                          </Text>
                          <Muted style={{ fontSize: '10px' }}>
                            {propValues[currentRowProp]?.length || 0} rows × {
                              currentColProps.reduce((sum, prop) =>
                                sum * (propValues[prop]?.length || 1), 1)
                            } columns = {(propValues[currentRowProp]?.length || 0) *
                            currentColProps.reduce((sum, prop) =>
                              sum * (propValues[prop]?.length || 1), 1)} total cells
                            {excludedCells.size > 0 && (
                              <span style={{ color: 'var(--figma-color-text-danger)' }}>
                                {' '}({excludedCells.size} excluded)
                              </span>
                            )}
                          </Muted>
                        </div>

                        {/* Exclusion hint */}
                        <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                          <Muted style={{ fontSize: '10px' }}>
                            💡 Click any cell to exclude it from generation
                          </Muted>
                        </div>

                        {/* Scrollable container with shadow hints */}
                        <div style={{
                          position: 'relative',
                          borderRadius: '4px',
                          border: '1px solid var(--figma-color-border)',
                          background: 'var(--figma-color-bg)',
                          width: '100%',
                          maxWidth: '536px'
                        }}>
                          {/* Scroll hint overlay - right side */}
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            bottom: '30px',
                            width: '40px',
                            background: 'linear-gradient(to left, var(--figma-color-bg-secondary) 0%, transparent 100%)',
                            pointerEvents: 'none',
                            zIndex: 3,
                            borderRadius: '0 4px 0 0'
                          }} />

                          {/* Grid visualization with actual values */}
                          <div style={{
                            fontSize: '10px',
                            overflowX: 'scroll',
                            overflowY: 'scroll',
                            maxHeight: '350px',
                            width: '100%',
                            WebkitOverflowScrolling: 'touch',
                            position: 'relative'
                          }}>
                          <table style={{
                            width: 'auto',
                            borderCollapse: 'separate',
                            borderSpacing: 0,
                            tableLayout: 'auto'
                          }}>
                            <thead>
                              <tr>
                                <th style={{
                                  padding: '8px 12px',
                                  textAlign: 'left',
                                  fontWeight: 600,
                                  fontSize: '11px',
                                  color: 'var(--figma-color-text)',
                                  background: 'var(--figma-color-bg-secondary)',
                                  position: 'sticky',
                                  top: 0,
                                  left: 0,
                                  zIndex: 3,
                                  borderBottom: '2px solid var(--figma-color-border)',
                                  borderRight: '2px solid var(--figma-color-border)',
                                  minWidth: '100px'
                                }}>
                                  ↓ {currentRowProp}
                                </th>
                                {(() => {
                                  // Generate all column combinations
                                  const getColumnCombinations = (props: string[], index: number, current: any[]): any[][] => {
                                    if (index >= props.length) return [current]
                                    const results: any[][] = []
                                    const values = propValues[props[index]] || []
                                    for (const val of values) {
                                      results.push(...getColumnCombinations(props, index + 1, [...current, val]))
                                    }
                                    return results
                                  }

                                  const colCombos = getColumnCombinations(currentColProps, 0, [])

                                  // Sort columns the same way the backend does
                                  colCombos.sort((a, b) => {
                                    for (let i = 0; i < currentColProps.length; i++) {
                                      const aVal = String(a[i])
                                      const bVal = String(b[i])
                                      if (aVal !== bVal) return aVal.localeCompare(bVal)
                                    }
                                    return 0
                                  })

                                  return colCombos.map((combo, idx) => (
                                    <th key={idx} style={{
                                      padding: '8px 12px',
                                      textAlign: 'left',
                                      fontWeight: 600,
                                      fontSize: '10px',
                                      color: 'var(--figma-color-text)',
                                      background: 'var(--figma-color-bg)',
                                      position: 'sticky',
                                      top: 0,
                                      zIndex: 1,
                                      borderBottom: '2px solid var(--figma-color-border)',
                                      borderLeft: idx === 0 ? 'none' : '1px solid var(--figma-color-border)',
                                      minWidth: '100px',
                                      maxWidth: '200px',
                                      whiteSpace: 'normal',
                                      verticalAlign: 'top'
                                    }}>
                                      {currentColProps.map((prop, propIdx) => (
                                        <div key={propIdx} style={{
                                          marginBottom: propIdx < currentColProps.length - 1 ? '4px' : 0,
                                          fontSize: '9px',
                                          color: 'var(--figma-color-text-secondary)',
                                          lineHeight: '1.3'
                                        }}>
                                          <span style={{ fontWeight: 600, color: 'var(--figma-color-text)' }}>{prop}:</span> {combo[propIdx]}
                                        </div>
                                      ))}
                                    </th>
                                  ))
                                })()}
                              </tr>
                            </thead>
                            <tbody>
                              {propValues[currentRowProp]?.map((rowValue, rowIdx) => (
                                <tr key={rowIdx}>
                                  <td style={{
                                    padding: '8px 12px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    color: 'var(--figma-color-text)',
                                    background: 'var(--figma-color-bg-secondary)',
                                    position: 'sticky',
                                    left: 0,
                                    zIndex: 1,
                                    borderRight: '2px solid var(--figma-color-border)',
                                    borderBottom: '1px solid var(--figma-color-border)',
                                    minWidth: '100px'
                                  }}>
                                    {rowValue}
                                  </td>
                                  {(() => {
                                    // Generate all column combinations
                                    const getColumnCombinations = (props: string[], index: number, current: any[]): any[][] => {
                                      if (index >= props.length) return [current]
                                      const results: any[][] = []
                                      const values = propValues[props[index]] || []
                                      for (const val of values) {
                                        results.push(...getColumnCombinations(props, index + 1, [...current, val]))
                                      }
                                      return results
                                    }

                                    const colCombos = getColumnCombinations(currentColProps, 0, [])

                                    // Sort columns the same way the backend does
                                    colCombos.sort((a, b) => {
                                      for (let i = 0; i < currentColProps.length; i++) {
                                        const aVal = String(a[i])
                                        const bVal = String(b[i])
                                        if (aVal !== bVal) return aVal.localeCompare(bVal)
                                      }
                                      return 0
                                    })

                                    return colCombos.map((combo, colIdx) => {
                                      // Check if this combination actually exists in selected combinations
                                      const comboExists = selectedCombos.some(c => {
                                        if (String(c.properties[currentRowProp]) !== rowValue) return false
                                        for (let i = 0; i < currentColProps.length; i++) {
                                          if (String(c.properties[currentColProps[i]]) !== String(combo[i])) return false
                                        }
                                        return true
                                      })

                                      if (!comboExists) {
                                        // Empty cell - combination doesn't exist
                                        return (
                                          <td key={colIdx} style={{
                                            padding: '4px',
                                            fontSize: '10px',
                                            textAlign: 'center',
                                            background: 'var(--figma-color-bg-secondary)',
                                            borderBottom: '1px solid var(--figma-color-border)',
                                            borderLeft: colIdx === 0 ? 'none' : '1px solid var(--figma-color-border)',
                                            opacity: 0.3
                                          }}>
                                            <div style={{
                                              padding: '8px 12px',
                                              fontSize: '10px',
                                              color: 'var(--figma-color-text-disabled)'
                                            }}>
                                              —
                                            </div>
                                          </td>
                                        )
                                      }

                                      const cellKey = getCellKey(rowValue, combo)
                                      const isExcluded = excludedCells.has(cellKey)

                                      return (
                                        <td key={colIdx} style={{
                                          padding: '4px',
                                          fontSize: '10px',
                                          textAlign: 'center',
                                          background: 'var(--figma-color-bg)',
                                          borderBottom: '1px solid var(--figma-color-border)',
                                          borderLeft: colIdx === 0 ? 'none' : '1px solid var(--figma-color-border)',
                                          cursor: 'pointer'
                                        }}
                                        onClick={() => toggleCellExclusion(rowValue, combo)}
                                        >
                                          <div style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '8px 12px',
                                            background: isExcluded
                                              ? 'var(--figma-color-bg-secondary)'
                                              : 'var(--figma-color-bg-brand-tertiary)',
                                            borderRadius: '3px',
                                            fontSize: '10px',
                                            fontWeight: 500,
                                            color: isExcluded
                                              ? 'var(--figma-color-text-disabled)'
                                              : 'var(--figma-color-text-brand)',
                                            opacity: isExcluded ? 0.5 : 1,
                                            transition: 'all 0.15s ease',
                                            minWidth: '40px',
                                            textDecoration: isExcluded ? 'line-through' : 'none'
                                          }}
                                          onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.05)'
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)'
                                          }}
                                          >
                                            {isExcluded ? '✗' : '✓'}
                                          </div>
                                        </td>
                                      )
                                    })
                                  })()}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          </div>
                          {/* End scroll container */}

                          {/* Scroll hint text */}
                          <div style={{
                            marginTop: 'var(--spacing-sm)',
                            textAlign: 'center'
                          }}>
                            <Muted style={{ fontSize: '9px' }}>
                              ← Scroll to see all columns →
                            </Muted>
                          </div>
                        </div>
                      </div>
                    )}

                  <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end' }}>
                    <Button secondary onClick={() => setIsLayoutModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => {
                      if (!currentRowProp) return

                      // Filter out excluded combinations before generating
                      const combinationsToGenerate = selectedCombos.filter(combo => {
                        // Build the cell key for this combination
                        const rowValue = String(combo.properties[currentRowProp])
                        const colCombo = currentColProps.map(prop => String(combo.properties[prop]))
                        const cellKey = getCellKey(rowValue, colCombo)

                        // Include if not excluded
                        return !excludedCells.has(cellKey)
                      })

                      console.log('🎨 Generating with exclusions:', {
                        total: selectedCombos.length,
                        excluded: excludedCells.size,
                        toGenerate: combinationsToGenerate.length
                      })

                      // Generate directly with filtered combinations
                      handleGenerate(combinationsToGenerate)
                      setIsLayoutModalOpen(false)
                    }} disabled={!currentRowProp || currentColProps.length === 0}>
                      Generate Sticker Sheet
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Modal>
        )
      })()}
    </>
  )
}

export default render(Plugin)
