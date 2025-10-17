import { emit, on } from '@create-figma-plugin/utilities'
import {
  Button,
  Checkbox,
  Container,
  render,
  VerticalSpace,
  SelectableItem,
  Text,
  IconBoolean16,
  IconInstance16,
  IconComponentProperty16,
  IconChevronDown16,
  Muted,

  LoadingIndicator
} from '@create-figma-plugin/ui'
import { h, Fragment } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import * as yaml from 'js-yaml'
import type { AnovaSpec } from './types/anova'
import { filterValidVariants } from './types/anova'

type DataSource = 'figma-direct' | 'anova'

function Plugin() {
  // Data source mode
  const [dataSource, setDataSource] = useState<DataSource>('figma-direct')

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
  const [isPropertiesCollapsed, setIsPropertiesCollapsed] = useState(false)
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  // Listen for initial data from backend - set up handler immediately
  on('INIT_DATA', (data: any[]) => {
    console.log('INIT_DATA received:', data.length, 'component sets')
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
    console.log('Received previews:', Object.keys(data).length, 'images')
    setPreviews(data)
    setPreviewsLoading(false)
    setPreviewsError(null)
  })

  on('PREVIEWS_ERROR', (data: { error: string }) => {
    console.log('Preview error:', data.error)
    setPreviewsError(data.error)
    setPreviewsLoading(false)
  })

  // Auto-continue import after component is selected
  useEffect(() => {
    console.log('useEffect check:', {
      waitingForAutoSelect,
      componentSetsLength: componentSets.length,
      hasAnovaSpec: !!anovaSpec,
      previewCombinationsLength: previewCombinations.length
    })

    if (waitingForAutoSelect && componentSets.length > 0 && anovaSpec && previewCombinations.length > 0) {
      console.log('Auto-select complete, requesting previews...')
      setWaitingForAutoSelect(false)
      // Request previews now that component is selected
      // Add small delay to ensure selection is fully registered in Figma
      setTimeout(() => {
        console.log('Emitting GENERATE_PREVIEWS with', previewCombinations.length, 'combinations')
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

    console.log('Regenerating Figma Direct combinations')

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
        combinations.push({
          componentSetId: compSet.id,
          componentSetName: compSet.name,
          properties: combo
        })
        selected[key] = false // Default unchecked
      })
    })

    setPreviewCombinations(combinations)
    setSelectedCombinations(selected)
  }, [componentSets, expandedProperties, dataSource])

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

  function handlePropertyToggle(propName: string) {
    setExpandedProperties(prev => ({
      ...prev,
      [propName]: !prev[propName]
    }))
  }

  function handleCombinationToggle(key: string) {
    setSelectedCombinations(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  function getCombinationKey(combo: any): string {
    if (dataSource === 'anova') {
      return `anova:${combo.variantName}`
    }
    return `${combo.componentSetId}:${JSON.stringify(combo.properties)}`
  }

  function handleSelectAll() {
    const allChecked = Object.values(selectedCombinations).every(v => v)
    const newState: { [key: string]: boolean } = {}

    for (const key in selectedCombinations) {
      newState[key] = !allChecked
    }

    setSelectedCombinations(newState)
  }

  function handleGenerate() {
    const selected = previewCombinations.filter((combo) => {
      const key = getCombinationKey(combo)
      return selectedCombinations[key]
    })

    emit('GENERATE_STICKER_SHEET', {
      dataSource: dataSource,
      selectedCombinations: selected,
      includeLightDark: true,
      anovaComponentName: anovaSpec?.title
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

      // Extract boolean properties
      const booleanProps: string[] = []
      for (const [propName, prop] of Object.entries(spec.props)) {
        if (prop.type === 'boolean') {
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

  // Sort combinations if a column is selected
  const sortedCombinations = sortColumn
    ? [...previewCombinations].sort((a, b) => {
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
    : previewCombinations

  return (
    <>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Mode Toggle */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--figma-color-border)', flexShrink: 0 }}>
        <div
          onClick={() => handleModeChange('figma-direct')}
          style={{
            flex: 1,
            padding: '12px',
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
        <div
          onClick={() => handleModeChange('anova')}
          style={{
            flex: 1,
            padding: '12px',
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
      </div>

      {/* Anova Input Section */}
      {dataSource === 'anova' && (
        <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0, borderBottom: '1px solid var(--figma-color-border)' }}>
          <div style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {anovaSpec && (
              <>
                <div style={{
                  fontFamily: 'var(--text-body-large-strong-font-family)',
                  fontSize: 'var(--text-body-large-strong-font-size)',
                  fontWeight: 600,
                  letterSpacing: 'var(--text-body-large-strong-letter-spacing)',
                  lineHeight: 'var(--text-body-large-strong-line-height)',
                  color: 'var(--figma-color-text)'
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
                padding: '6px 8px',
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
          style={{ padding: '12px 12px 8px 12px', minHeight: '40px', cursor: 'pointer', position: 'sticky', top: 0, background: 'var(--figma-color-bg)', zIndex: 1 }}
          onClick={() => setIsPropertiesCollapsed(!isPropertiesCollapsed)}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                fontFamily: 'var(--text-body-large-strong-font-family)',
                fontSize: 'var(--text-body-large-strong-font-size)',
                fontWeight: 600,
                letterSpacing: 'var(--text-body-large-strong-letter-spacing)',
                lineHeight: 'var(--text-body-large-strong-line-height)',
                color: 'var(--figma-color-text)'
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
          <div style={{ marginBottom: '16px', textAlign: 'center', paddingTop: '40px' }}>
            <Muted>No properties found</Muted>
          </div>
        ) : (
          <div style={{ marginBottom: '16px' }}>
            {propertyOrder.map(propName => {
              const prop = allProperties[propName]
              const isVariant = prop.type === 'VARIANT'
              const isChecked = expandedProperties[propName] || false

              // Build the icon element
              let icon
              if (prop.type === 'BOOLEAN') icon = <IconBoolean16 />
              else if (prop.type === 'VARIANT') icon = <IconInstance16 />
              else if (prop.type === 'INSTANCE_SWAP') icon = <IconComponentProperty16 />
              else icon = <IconBoolean16 />

              return (
                <SelectableItem
                  key={propName}
                  disabled={isVariant}
                  value={isChecked}
                  onValueChange={(value) => !isVariant && handlePropertyToggle(propName)}
                  style={{ cursor: isVariant ? 'not-allowed' : 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <div style={{ marginRight: '8px', display: 'flex', alignItems: 'center', opacity: 0.6 }}>
                      {icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span>{propName}</span>
                      {prop.values && prop.values.length > 0 && (
                        <span style={{ color: 'var(--figma-color-text-tertiary)', marginLeft: '4px' }}>
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

      {dataSource === 'figma-direct' && <VerticalSpace space="medium" />}

      {/* Preview Section - Takes remaining space */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, padding: '12px 12px 8px 12px', minHeight: '40px', position: 'sticky', top: 0, background: 'var(--figma-color-bg)', zIndex: 1 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  fontFamily: 'var(--text-body-large-strong-font-family)',
                  fontSize: 'var(--text-body-large-strong-font-size)',
                  fontWeight: 600,
                  letterSpacing: 'var(--text-body-large-strong-letter-spacing)',
                  lineHeight: 'var(--text-body-large-strong-line-height)',
                  color: 'var(--figma-color-text)'
                }}>
                  Preview
                </div>
                <div style={{ fontSize: '11px', color: 'var(--figma-color-text-tertiary)' }}>·</div>
                <div style={{ fontSize: '11px', color: 'var(--figma-color-text)' }}>
                  {Object.values(selectedCombinations).filter(v => v).length} / {previewCombinations.length} selected
                </div>
                {(waitingForAutoSelect || previewsLoading || previewsError) && dataSource === 'anova' && (
                  <>
                    <div style={{ fontSize: '11px', color: 'var(--figma-color-text-tertiary)' }}>·</div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 8px',
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
              <Button secondary onClick={handleSelectAll}>
                {Object.values(selectedCombinations).every(v => v) ? 'Deselect All' : 'Select All'}
              </Button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto', padding: '0 12px' }}>
              {previewCombinations.length === 0 ? (
                <div style={{ textAlign: 'center', paddingTop: '40px' }}>
                  <Muted>No combinations to show</Muted>
                </div>
              ) : dataSource === 'anova' ? (
                /* Anova Mode - List view with thumbnails */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {sortedCombinations.map((combo, index) => {
                    const key = getCombinationKey(combo)
                    const isSelected = selectedCombinations[key] || false
                    const isHovered = hoveredRow === key
                    const previewImage = previews[combo.variantName]

                    // Debug logging for first few items
                    if (index < 3) {
                      console.log(`Combo ${index}:`, {
                        variantName: combo.variantName,
                        hasPreview: !!previewImage,
                        previewKeys: Object.keys(previews).slice(0, 5),
                        previewsLoading
                      })
                    }

                    let bgColor = 'transparent'
                    if (isSelected) {
                      bgColor = 'var(--figma-color-bg-selected)'
                    } else if (isHovered) {
                      bgColor = 'var(--figma-color-bg-hover)'
                    }

                    return (
                      <div
                        key={index}
                        style={{
                          cursor: 'pointer',
                          background: bgColor,
                          borderRadius: '6px',
                          padding: '12px',
                          border: '1px solid var(--figma-color-border)',
                          display: 'flex',
                          gap: '12px',
                          alignItems: 'flex-start'
                        }}
                        onMouseEnter={() => setHoveredRow(key)}
                        onMouseLeave={() => setHoveredRow(null)}
                        onClick={() => handleCombinationToggle(key)}
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
                        <div style={{ flex: 1, minWidth: 0, display: 'flex', gap: '12px' }}>
                          {combo.properties && Object.keys(combo.properties).length > 0 && (() => {
                            // Separate boolean and variant properties
                            const boolProps: [string, any][] = []
                            const variantProps: [string, any][] = []

                            Object.entries(combo.properties).forEach(([key, value]) => {
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
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: '0 0 auto' }}>
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
                                          padding: '2px 8px',
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
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginLeft: 'auto', alignItems: 'flex-end' }}>
                                    {boolProps.map(([key, value]) => {
                                      const strValue = String(value).toLowerCase()
                                      const boolValue = strValue === 'true'

                                      return (
                                        <div
                                          key={key}
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            fontSize: '11px'
                                          }}
                                        >
                                          <span style={{
                                            color: 'var(--figma-color-text-tertiary)'
                                          }}>
                                            {key}
                                          </span>
                                          <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            padding: '2px 6px',
                                            borderRadius: '3px',
                                            background: boolValue
                                              ? 'var(--figma-color-bg-success)'
                                              : 'var(--figma-color-bg-secondary)',
                                            fontSize: '10px',
                                            opacity: boolValue ? 1 : 0.5,
                                            color: boolValue ? 'var(--figma-color-text-onbrand)' : 'var(--figma-color-text)',
                                            fontWeight: 600
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
                    )
                  })}
                </div>
              ) : (
                /* Figma Direct Mode - Table view */
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: '11px' }}>
              <thead>
                <tr style={{ height: '40px' }}>
                  {propertyOrder.map((prop, index) => {
                    const isActive = sortColumn === prop
                    const isAscending = isActive && sortDirection === 'asc'
                    const isFirstColumn = index === 0

                    return (
                      <th
                        key={prop}
                        style={{
                          padding: isFirstColumn ? '8px 8px 8px 0' : '8px',
                          textAlign: 'left',
                          fontWeight: 600,
                          cursor: 'pointer',
                          userSelect: 'none',
                          width: prop === 'Type' ? '30%' : 'auto'
                        }}
                        onClick={() => handleSort(prop)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Text>{prop}</Text>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            opacity: isActive ? 1 : 0.3,
                            transform: isAscending ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease'
                          }}>
                            <IconChevronDown16 />
                          </div>
                        </div>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {sortedCombinations.map((combo, index) => {
                  const key = getCombinationKey(combo)
                  const isSelected = selectedCombinations[key] || false
                  const isHovered = hoveredRow === key
                  
                  let bgColor = 'transparent'
                  if (isSelected) {
                    bgColor = 'var(--figma-color-bg-selected)'
                  } else if (isHovered) {
                    bgColor = 'var(--figma-color-bg-hover)'
                  }
                  
                  return (
                    <tr
                      key={index}
                      style={{
                        cursor: 'pointer',
                        height: '40px'
                      }}
                      onMouseEnter={() => setHoveredRow(key)}
                      onMouseLeave={() => setHoveredRow(null)}
                      onClick={() => handleCombinationToggle(key)}
                    >
                      <td colSpan={propertyOrder.length} style={{ padding: 0 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          height: '40px',
                          background: bgColor,
                          borderRadius: '6px',
                          padding: '0 8px',
                          marginBottom: '8px'
                        }}>
                          {propertyOrder.map((propName, colIndex) => (
                            <div key={propName} style={{ 
                              flex: propName === 'Type' ? '0 0 30%' : '1',
                              padding: colIndex === 0 ? '0 8px 0 0' : '0 8px'
                            }}>
                              <Text>
                                {combo.properties[propName] !== undefined
                                  ? formatPropertyValue(combo.properties[propName])
                                  : '—'}
                              </Text>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
              )}
            </div>
          </>
      </div>
        </>
      )}

      {/* Sticky Generate Button */}
      <div style={{
        padding: '12px',
        background: 'var(--figma-color-bg)',
        borderTop: '1px solid var(--figma-color-border)',
        flexShrink: 0
      }}>
        <Button fullWidth onClick={handleGenerate} disabled={!hasSelection}>
          Generate Sticker Sheet
        </Button>
      </div>
      </div>
    </>
  )
}

export default render(Plugin)
