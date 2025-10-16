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
  Muted
} from '@create-figma-plugin/ui'
import { h, Fragment } from 'preact'
import { useState, useEffect } from 'preact/hooks'

function Plugin() {
  const [componentSets, setComponentSets] = useState<any[]>([])
  const [expandedProperties, setExpandedProperties] = useState<{ [key: string]: boolean }>({})
  const [previewCombinations, setPreviewCombinations] = useState<any[]>([])
  const [selectedCombinations, setSelectedCombinations] = useState<{ [key: string]: boolean }>({})
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [isPropertiesCollapsed, setIsPropertiesCollapsed] = useState(false)
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

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

  // Generate preview when properties change
  useEffect(() => {
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
  }, [componentSets, expandedProperties])

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

  function handleSelectAll() {
    const allChecked = Object.values(selectedCombinations).every(v => v)
    const newState: { [key: string]: boolean } = {}

    for (const key in selectedCombinations) {
      newState[key] = !allChecked
    }

    setSelectedCombinations(newState)
  }

  function handleGenerate() {
    const selected = previewCombinations.filter((_, index) => {
      const key = `${_.componentSetId}:${JSON.stringify(_.properties)}`
      return selectedCombinations[key]
    })

    emit('GENERATE_STICKER_SHEET', {
      selectedCombinations: selected,
      includeLightDark: false
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
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {componentSets.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Muted>Select a component or component set on the canvas</Muted>
        </div>
      ) : (
        <>
          {/* Properties Section */}
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

      <VerticalSpace space="medium" />

      {/* Preview Section - Takes remaining space */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <>
            <div 
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, padding: '0 12px 8px 12px', minHeight: '40px', position: 'sticky', top: 0, background: 'var(--figma-color-bg)', zIndex: 1 }}
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
              ) : (
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
                  const key = `${combo.componentSetId}:${JSON.stringify(combo.properties)}`
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
  )
}

export default render(Plugin)
