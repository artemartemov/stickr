import { emit, on, showUI } from '@create-figma-plugin/utilities'

export default function () {
  showUI({ height: 720, width: 480 })

  // Listen for UI messages
  on('GENERATE_STICKER_SHEET', async (data: any) => {
    try {
      console.log('Generating sticker sheet...', data)
      await generateStickerSheet(data)
      figma.notify('Sticker sheet generated successfully!')
    } catch (error) {
      console.error('Error:', error)
      figma.notify('Error generating sticker sheet')
    }
  })

  // Function to get component data from selection or page
  function getComponentData() {
    let componentSets: any[] = []

    // Check if there's a selection
    const selection = figma.currentPage.selection

    if (selection.length > 0) {
      // Filter selection for component sets
      componentSets = selection.filter((node) => node.type === 'COMPONENT_SET')
    }

    return componentSets.map((compSet: any) => {
    const properties: any = {}
    const propDefs = compSet.componentPropertyDefinitions || {}

    // Use Object.keys to preserve order
    Object.keys(propDefs).forEach(key => {
      const propName = key.split('#')[0]
      const prop = propDefs[key]

      if (!properties[propName]) {
        properties[propName] = {
          type: prop.type,
          values: []
        }
      }

      if (prop.type === 'VARIANT' && prop.variantOptions) {
        properties[propName].values = prop.variantOptions
      } else if (prop.type === 'BOOLEAN') {
        properties[propName].values = ['true', 'false']
      }
    })

    // Sort properties: VARIANT first, then others
    const propertyOrder = Object.keys(properties).sort((a, b) => {
      const typeOrder: any = { 'VARIANT': 0, 'BOOLEAN': 1, 'INSTANCE_SWAP': 2, 'TEXT': 3 }
      const aType = properties[a].type
      const bType = properties[b].type
      const aOrder = typeOrder[aType] !== undefined ? typeOrder[aType] : 999
      const bOrder = typeOrder[bType] !== undefined ? typeOrder[bType] : 999

      if (aOrder !== bOrder) return aOrder - bOrder
      return a.localeCompare(b) // Alphabetical within same type
    })

      return {
        id: compSet.id,
        name: compSet.name,
        properties: properties,
        propertyOrder: propertyOrder,
        variantCount: compSet.children.length
      }
    })
  }

  // Send initial data to UI
  const initialData = getComponentData()
  emit('INIT_DATA', initialData)

  // Listen for selection changes
  figma.on('selectionchange', () => {
    const updatedData = getComponentData()
    emit('INIT_DATA', updatedData)
  })
}

async function generateStickerSheet(data: any) {
  const { selectedCombinations, includeLightDark } = data

  if (selectedCombinations.length === 0) {
    figma.notify('No combinations selected')
    return
  }

  // Create main frame
  const mainFrame = figma.createFrame()
  mainFrame.name = 'Sticker Sheet'
  mainFrame.layoutMode = 'VERTICAL'
  mainFrame.primaryAxisSizingMode = 'AUTO'
  mainFrame.counterAxisSizingMode = 'AUTO'
  mainFrame.itemSpacing = 0
  mainFrame.paddingTop = 32
  mainFrame.paddingBottom = 32
  mainFrame.paddingLeft = 32
  mainFrame.paddingRight = 32
  mainFrame.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98 } }]
  mainFrame.cornerRadius = 8

  // Group by component set
  const groupedByComponent: any = {}
  for (const combo of selectedCombinations) {
    if (!groupedByComponent[combo.componentSetId]) {
      groupedByComponent[combo.componentSetId] = []
    }
    groupedByComponent[combo.componentSetId].push(combo)
  }

  // Create sections for each component set
  for (const componentSetId in groupedByComponent) {
    const combos = groupedByComponent[componentSetId]
    const compSet = figma.getNodeById(componentSetId) as ComponentSetNode
    if (!compSet) continue

    // Add component name
    const nameText = figma.createText()
    await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' })
    nameText.fontName = { family: 'Inter', style: 'Semi Bold' }
    nameText.fontSize = 18
    nameText.characters = compSet.name
    nameText.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }]
    mainFrame.appendChild(nameText)

    // Add spacing
    const spacer1 = figma.createFrame()
    spacer1.resize(1, 16)
    spacer1.fills = []
    mainFrame.appendChild(spacer1)

    // Create container for light and dark sections (side by side)
    const modesContainer = figma.createFrame()
    modesContainer.name = 'Modes Container'
    modesContainer.layoutMode = 'HORIZONTAL'
    modesContainer.primaryAxisSizingMode = 'AUTO'
    modesContainer.counterAxisSizingMode = 'AUTO'
    modesContainer.itemSpacing = 24
    modesContainer.fills = []

    // Create light mode section
    const lightSection = await createModeSection(compSet, combos, false)
    modesContainer.appendChild(lightSection)

    // Create dark mode section if enabled
    if (includeLightDark) {
      const darkSection = await createModeSection(compSet, combos, true)
      modesContainer.appendChild(darkSection)
    }

    mainFrame.appendChild(modesContainer)

    // Add spacing after component set
    const spacer2 = figma.createFrame()
    spacer2.resize(1, 24)
    spacer2.fills = []
    mainFrame.appendChild(spacer2)
  }

  figma.currentPage.selection = [mainFrame]
  figma.viewport.scrollAndZoomIntoView([mainFrame])
}

function analyzeVaryingProperties(combinations: any[]): any[] {
  if (combinations.length === 0) return []

  const propertyValues: any = {}
  const propertyTypes: any = {}

  // Get the component set to determine property types
  const firstCombo = combinations[0]

  // Collect all unique values for each property and track types
  for (const combo of combinations) {
    for (const propName in combo.properties) {
      if (!propertyValues[propName]) {
        propertyValues[propName] = new Set()
      }
      propertyValues[propName].add(combo.properties[propName])
    }
  }

  // Return properties that have more than one value, sorted by type
  const varying = []
  for (const propName in propertyValues) {
    if (propertyValues[propName].size > 1) {
      // Determine property type based on values
      const values = Array.from(propertyValues[propName])
      let type = 'OTHER'

      // Check if all values are booleans (true/false strings)
      if (values.every(v => String(v).toLowerCase() === 'true' || String(v).toLowerCase() === 'false')) {
        type = 'BOOLEAN'
      } else {
        type = 'VARIANT'
      }

      varying.push({
        name: propName,
        values: values,
        type: type
      })
    }
  }

  // Sort: VARIANT properties first, then BOOLEAN properties
  varying.sort((a, b) => {
    if (a.type === 'VARIANT' && b.type !== 'VARIANT') return -1
    if (a.type !== 'VARIANT' && b.type === 'VARIANT') return 1
    return a.name.localeCompare(b.name)
  })

  return varying
}

async function createInstance(compSet: ComponentSetNode, properties: any) {
  const baseComponent = compSet.children[0] as ComponentNode
  const instance = baseComponent.createInstance()

  // Set properties
  const propDefs = compSet.componentPropertyDefinitions

  // Create a map of cleaned property names to actual keys
  const propNameToKey: any = {}
  for (const key in propDefs) {
    const cleanName = key.split('#')[0]
    propNameToKey[cleanName] = key
  }

  // Try to set each property from the combination
  for (const propName in properties) {
    const propValue = properties[propName]

    // Try to find matching key
    let matchingKey = propNameToKey[propName]

    if (matchingKey) {
      try {
        // Convert boolean strings to actual booleans if needed
        let valueToSet = propValue
        if (String(propValue).toLowerCase() === 'true') {
          valueToSet = true
        } else if (String(propValue).toLowerCase() === 'false') {
          valueToSet = false
        }

        instance.setProperties({ [matchingKey]: valueToSet })
        console.log('✓ Set property:', propName, '=', valueToSet)
      } catch (e) {
        console.log('✗ Could not set property:', propName, '=', propValue, 'Error:', e)
      }
    } else {
      console.log('✗ No matching key found for property:', propName, 'Available keys:', Object.keys(propNameToKey))
    }
  }

  return instance
}

async function createModeSection(compSet: ComponentSetNode, combinations: any[], isDark: boolean) {
  const sectionFrame = figma.createFrame()
  sectionFrame.name = isDark ? 'Dark Mode' : 'Light Mode'
  sectionFrame.layoutMode = 'VERTICAL'
  sectionFrame.primaryAxisSizingMode = 'AUTO'
  sectionFrame.counterAxisSizingMode = 'AUTO'
  sectionFrame.itemSpacing = 16
  sectionFrame.paddingTop = 24
  sectionFrame.paddingBottom = 24
  sectionFrame.paddingLeft = 24
  sectionFrame.paddingRight = 24
  sectionFrame.cornerRadius = 8
  sectionFrame.fills = isDark
    ? [{ type: 'SOLID', color: { r: 0.18, g: 0.18, b: 0.18 } }]
    : [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]

  // Add mode title
  const modeTitle = figma.createText()
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' })
  modeTitle.fontName = { family: 'Inter', style: 'Medium' }
  modeTitle.fontSize = 14
  modeTitle.characters = isDark ? 'Dark Mode' : 'Light Mode'
  modeTitle.fills = isDark
    ? [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]
    : [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }]
  sectionFrame.appendChild(modeTitle)

  // Create table with all combinations as columns
  const table = await createSimpleTable(compSet, combinations, isDark)
  sectionFrame.appendChild(table)

  return sectionFrame
}

async function createSimpleTable(compSet: ComponentSetNode, combinations: any[], isDark: boolean) {
  const tableFrame = figma.createFrame()
  tableFrame.name = 'Table'
  tableFrame.layoutMode = 'VERTICAL'
  tableFrame.primaryAxisSizingMode = 'AUTO'
  tableFrame.counterAxisSizingMode = 'AUTO'
  tableFrame.itemSpacing = 8
  tableFrame.fills = []

  if (combinations.length === 0) return tableFrame

  // Debug: Log what combinations we received
  console.log('=== createSimpleTable DEBUG ===')
  console.log('Number of combinations:', combinations.length)
  console.log('First combination:', combinations[0])
  console.log('All combinations:', combinations.map(c => c.properties))

  // Get a sample instance to measure dimensions
  const sampleInstance = await createInstance(compSet, combinations[0].properties)
  const instanceWidth = sampleInstance.width
  const instanceHeight = sampleInstance.height
  sampleInstance.remove()

  // Load fonts
  await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' })
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })

  // Analyze properties - determine which should be rows vs columns
  const allProps = analyzeVaryingProperties(combinations)
  console.log('Varying properties found:', allProps)
  console.log('Property types:', allProps.map(p => ({ name: p.name, type: p.type, values: p.values })))

  if (allProps.length === 0) {
    // No variation - just show all instances in a row
    const row = figma.createFrame()
    row.layoutMode = 'HORIZONTAL'
    row.itemSpacing = 12
    row.fills = []
    for (const combo of combinations) {
      const instance = await createInstance(compSet, combo.properties)
      row.appendChild(instance)
    }
    tableFrame.appendChild(row)
    return tableFrame
  }

  // Use first property for rows, remaining properties for columns
  const rowProp = allProps[0]
  const colProps = allProps.slice(1)

  console.log('Row property:', rowProp)
  console.log('Column properties:', colProps)

  // Get unique row values in the order they appear (preserve Figma's original order)
  const rowValues: string[] = []
  const seenRows = new Set<string>()

  for (const combo of combinations) {
    const rowValue = String(combo.properties[rowProp.name])
    if (!seenRows.has(rowValue)) {
      seenRows.add(rowValue)
      rowValues.push(rowValue)
    }
  }

  // Get unique column combinations
  const columnCombos: any[] = []
  const seenCols = new Set<string>()

  for (const combo of combinations) {
    const colValues: any = {}
    for (const p of colProps) {
      colValues[p.name] = combo.properties[p.name]
    }
    const colKey = JSON.stringify(colValues)
    if (!seenCols.has(colKey)) {
      seenCols.add(colKey)
      columnCombos.push(colValues)
    }
  }

  // Sort columns
  columnCombos.sort((a, b) => {
    for (const p of colProps) {
      const aVal = String(a[p.name])
      const bVal = String(b[p.name])
      if (aVal !== bVal) return aVal.localeCompare(bVal)
    }
    return 0
  })

  console.log('Column combinations:', columnCombos)
  console.log('Number of columns:', columnCombos.length)

  // Create header row
  const headerRow = figma.createFrame()
  headerRow.name = 'Header Row'
  headerRow.layoutMode = 'HORIZONTAL'
  headerRow.itemSpacing = 12
  headerRow.fills = []
  headerRow.paddingBottom = 8

  // Empty corner cell
  const cornerCell = figma.createFrame()
  cornerCell.resize(100, 1)
  cornerCell.fills = []
  headerRow.appendChild(cornerCell)

  // Column headers
  for (let i = 0; i < columnCombos.length; i++) {
    const colCombo = columnCombos[i]
    const headerContainer = figma.createFrame()
    headerContainer.layoutMode = 'VERTICAL'
    headerContainer.primaryAxisSizingMode = 'FIXED'
    headerContainer.counterAxisSizingMode = 'AUTO'
    headerContainer.primaryAxisAlignItems = 'CENTER'
    headerContainer.fills = []

    const headerText = figma.createText()
    headerText.fontName = { family: 'Inter', style: 'Semi Bold' }
    headerText.fontSize = 10
    headerText.textAlignHorizontal = 'CENTER'

    const headerLines: string[] = []

    // Always show column properties with labels
    if (colProps.length > 0) {
      for (const p of colProps) {
        const value = String(colCombo[p.name])
        // Show property name and value on same line
        headerLines.push(`${p.name}: (${i + 1}) ${value}`)
      }
    } else {
      // If no column properties, just show column number
      headerLines.push(`(${i + 1})`)
    }

    headerText.characters = headerLines.join('\n')
    headerText.fills = isDark
      ? [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }]
      : [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }]

    headerContainer.appendChild(headerText)

    // Resize container to fit text width and height
    headerContainer.resize(Math.max(instanceWidth, headerText.width + 8), headerText.height + 8)

    console.log(`Header ${i}: "${headerText.characters}" - size: ${headerContainer.width}x${headerContainer.height}`)

    headerRow.appendChild(headerContainer)
  }

  tableFrame.appendChild(headerRow)

  // Create data rows
  for (const rowValue of rowValues) {
    const dataRow = figma.createFrame()
    dataRow.name = `Row: ${rowValue}`
    dataRow.layoutMode = 'HORIZONTAL'
    dataRow.itemSpacing = 12
    dataRow.fills = []

    // Row label
    const rowLabelContainer = figma.createFrame()
    rowLabelContainer.resize(100, instanceHeight)
    rowLabelContainer.layoutMode = 'VERTICAL'
    rowLabelContainer.primaryAxisAlignItems = 'CENTER'
    rowLabelContainer.counterAxisAlignItems = 'CENTER'
    rowLabelContainer.fills = []

    const rowLabel = figma.createText()
    rowLabel.fontName = { family: 'Inter', style: 'Regular' }
    rowLabel.fontSize = 11
    rowLabel.characters = `${rowProp.name}:\n${rowValue}`
    rowLabel.textAlignHorizontal = 'CENTER'
    rowLabel.fills = isDark
      ? [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }]
      : [{ type: 'SOLID', color: { r: 0.3, g: 0.3, b: 0.3 } }]

    rowLabelContainer.appendChild(rowLabel)
    dataRow.appendChild(rowLabelContainer)

    // Add instances for each column
    for (const colCombo of columnCombos) {
      const matchingCombo = combinations.find(c => {
        if (String(c.properties[rowProp.name]) !== rowValue) return false
        for (const p of colProps) {
          if (String(c.properties[p.name]) !== String(colCombo[p.name])) return false
        }
        return true
      })

      if (matchingCombo) {
        const instanceContainer = figma.createFrame()
        instanceContainer.resize(instanceWidth, instanceHeight)
        instanceContainer.layoutMode = 'VERTICAL'
        instanceContainer.primaryAxisAlignItems = 'CENTER'
        instanceContainer.counterAxisAlignItems = 'CENTER'
        instanceContainer.fills = []

        const instance = await createInstance(compSet, matchingCombo.properties)
        instanceContainer.appendChild(instance)
        dataRow.appendChild(instanceContainer)
      } else {
        // Empty cell
        const emptyCell = figma.createFrame()
        emptyCell.resize(instanceWidth, instanceHeight)
        emptyCell.fills = []
        dataRow.appendChild(emptyCell)
      }
    }

    tableFrame.appendChild(dataRow)
  }

  return tableFrame
}

async function createTable(compSet: ComponentSetNode, combinations: any[], rowProp: any, colProps: any[], isDark: boolean) {
  const tableFrame = figma.createFrame()
  tableFrame.name = 'Table'
  tableFrame.layoutMode = 'VERTICAL'
  tableFrame.primaryAxisSizingMode = 'AUTO'
  tableFrame.counterAxisSizingMode = 'AUTO'
  tableFrame.itemSpacing = 12
  tableFrame.fills = []

  // Get unique column combinations - sorted for consistency
  const columnCombos: any[] = []
  const seenCols = new Set<string>()

  for (const combo of combinations) {
    const colValues: any = {}
    for (const p of colProps) {
      colValues[p.name] = combo.properties[p.name]
    }
    const colKey = JSON.stringify(colValues)

    if (!seenCols.has(colKey)) {
      seenCols.add(colKey)
      columnCombos.push(colValues)
    }
  }

  // Sort column combinations for consistent ordering
  columnCombos.sort((a, b) => {
    for (const p of colProps) {
      const aVal = String(a[p.name])
      const bVal = String(b[p.name])
      if (aVal !== bVal) {
        return aVal.localeCompare(bVal)
      }
    }
    return 0
  })

  // Get a sample instance to measure width for column sizing
  const sampleInstance = await createInstance(compSet, combinations[0].properties)
  const instanceWidth = sampleInstance.width
  const instanceHeight = sampleInstance.height
  sampleInstance.remove()

  // Create header row
  const headerRow = figma.createFrame()
  headerRow.name = 'Header Row'
  headerRow.layoutMode = 'HORIZONTAL'
  headerRow.primaryAxisSizingMode = 'AUTO'
  headerRow.counterAxisSizingMode = 'AUTO'
  headerRow.itemSpacing = 16
  headerRow.fills = []
  headerRow.paddingBottom = 16

  // Empty corner cell for row labels
  const cornerCell = figma.createFrame()
  cornerCell.resize(120, 1)
  cornerCell.fills = []
  headerRow.appendChild(cornerCell)

  // Column headers - show property name: (count) value
  await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' })
  let colIndex = 1
  for (const colCombo of columnCombos) {
    // Container for header to match instance width
    const headerContainer = figma.createFrame()
    headerContainer.layoutMode = 'VERTICAL'
    headerContainer.resize(instanceWidth, 1)
    headerContainer.primaryAxisSizingMode = 'FIXED'
    headerContainer.counterAxisSizingMode = 'AUTO'
    headerContainer.fills = []

    const headerText = figma.createText()
    headerText.fontName = { family: 'Inter', style: 'Semi Bold' }
    headerText.fontSize = 10

    // Build header text with all column properties
    const headerLines: string[] = []
    for (const p of colProps) {
      const value = String(colCombo[p.name])
      headerLines.push(`${p.name}: (${colIndex}) ${value}`)
    }
    headerText.characters = headerLines.join('\n')
    headerText.fills = isDark
      ? [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }]
      : [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }]

    headerContainer.appendChild(headerText)
    headerRow.appendChild(headerContainer)
    colIndex++
  }

  tableFrame.appendChild(headerRow)

  // Create data rows
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })

  // Get unique row values from actual combinations - sorted
  const uniqueRowValues = Array.from(new Set(
    combinations.map(c => String(c.properties[rowProp.name]))
  )).sort()

  for (const rowValue of uniqueRowValues) {
    const dataRow = figma.createFrame()
    dataRow.name = `Row: ${rowValue}`
    dataRow.layoutMode = 'HORIZONTAL'
    dataRow.primaryAxisSizingMode = 'AUTO'
    dataRow.counterAxisSizingMode = 'AUTO'
    dataRow.itemSpacing = 16
    dataRow.fills = []

    // Row label
    const rowLabelContainer = figma.createFrame()
    rowLabelContainer.resize(120, instanceHeight)
    rowLabelContainer.layoutMode = 'VERTICAL'
    rowLabelContainer.primaryAxisAlignItems = 'CENTER'
    rowLabelContainer.counterAxisAlignItems = 'CENTER'
    rowLabelContainer.fills = []

    const rowLabel = figma.createText()
    rowLabel.fontName = { family: 'Inter', style: 'Regular' }
    rowLabel.fontSize = 11
    rowLabel.characters = rowValue
    rowLabel.fills = isDark
      ? [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }]
      : [{ type: 'SOLID', color: { r: 0.3, g: 0.3, b: 0.3 } }]

    rowLabelContainer.appendChild(rowLabel)
    dataRow.appendChild(rowLabelContainer)

    // Add component instances for each column
    for (const colCombo of columnCombos) {
      const matchingCombo = combinations.find(c => {
        // Match row property
        if (String(c.properties[rowProp.name]) !== rowValue) return false

        // Match all column properties
        for (const p of colProps) {
          if (String(c.properties[p.name]) !== String(colCombo[p.name])) return false
        }
        return true
      })

      if (matchingCombo) {
        const instanceContainer = figma.createFrame()
        instanceContainer.resize(instanceWidth, instanceHeight)
        instanceContainer.layoutMode = 'VERTICAL'
        instanceContainer.primaryAxisAlignItems = 'CENTER'
        instanceContainer.counterAxisAlignItems = 'CENTER'
        instanceContainer.fills = []

        const instance = await createInstance(compSet, matchingCombo.properties)
        instanceContainer.appendChild(instance)
        dataRow.appendChild(instanceContainer)
      } else {
        // Empty cell with same width as instances
        const emptyCell = figma.createFrame()
        emptyCell.resize(instanceWidth, instanceHeight)
        emptyCell.fills = []
        dataRow.appendChild(emptyCell)
      }
    }

    tableFrame.appendChild(dataRow)
  }

  return tableFrame
}
