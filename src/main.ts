import { emit, on, showUI } from '@create-figma-plugin/utilities'
import { UI_CONFIG, SPACING, COLORS, BORDER_RADIUS, FONTS, FONT_SIZES, FRAME_DIMENSIONS, TIMING, EXPORT_SCALE } from './constants'

export default function () {
  showUI({ height: UI_CONFIG.HEIGHT, width: UI_CONFIG.WIDTH })

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

  // Handle preview generation for Anova variants
  on('GENERATE_PREVIEWS', async (data: { combinations: any[] }) => {
    try {
      console.log('Generating previews for', data.combinations.length, 'combinations')
      const previews = await generatePreviews(data.combinations)
      emit('PREVIEWS_READY', previews)
    } catch (error) {
      console.error('Error generating previews:', error)
      emit('PREVIEWS_ERROR', { error: String(error) })
    }
  })

  // Handle auto-selecting component by name
  on('SELECT_COMPONENT_BY_NAME', async (componentName: string) => {
    try {
      // Search the current page for a component set with matching name
      const allNodes = figma.currentPage.findAll(node => 
        node.type === 'COMPONENT_SET' && node.name === componentName
      )

      if (allNodes.length > 0) {
        // Select the first matching component set
        figma.currentPage.selection = [allNodes[0] as SceneNode]
        figma.viewport.scrollAndZoomIntoView([allNodes[0] as SceneNode])
        
        // Small delay to ensure selection is registered
        await new Promise(resolve => setTimeout(resolve, TIMING.SELECTION_DELAY_MS))
        
        // Send updated selection data to UI
        const componentData = getComponentData()
        emit('INIT_DATA', componentData)
        
        console.log('Component selected:', componentName)
      } else {
        console.log('No component found with name:', componentName)
      }
    } catch (error) {
      console.error('Error selecting component:', error)
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
  const { dataSource, selectedCombinations, includeLightDark, anovaComponentName, layoutConfig } = data

  if (selectedCombinations.length === 0) {
    figma.notify('No combinations selected')
    return
  }

  // Create main container
  const mainFrame = figma.createFrame()
  mainFrame.name = 'Sticker Sheet'
  mainFrame.layoutMode = 'VERTICAL'
  mainFrame.primaryAxisSizingMode = 'AUTO'
  mainFrame.counterAxisSizingMode = 'AUTO'
  mainFrame.itemSpacing = SPACING.LARGE
  mainFrame.paddingTop = SPACING.LARGE
  mainFrame.paddingBottom = SPACING.LARGE
  mainFrame.paddingLeft = SPACING.LARGE
  mainFrame.paddingRight = SPACING.LARGE
  mainFrame.fills = [{ type: 'SOLID', color: COLORS.LIGHT_BG }]
  mainFrame.cornerRadius = BORDER_RADIUS.SMALL

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

    // Get component set based on mode
    let compSet: ComponentSetNode | null = null
    let componentName = ''

    if (dataSource === 'anova') {
      const selection = figma.currentPage.selection
      const selectedCompSet = selection.find(node => node.type === 'COMPONENT_SET') as ComponentSetNode

      if (!selectedCompSet) {
        figma.notify('Please select a component set on the canvas to generate from Anova data')
        return
      }

      compSet = selectedCompSet
      componentName = anovaComponentName || compSet.name
    } else {
      compSet = figma.getNodeById(componentSetId) as ComponentSetNode
      if (!compSet) continue
      componentName = compSet.name
    }

    if (!compSet) continue

    // Add component name
    const nameText = figma.createText()
    await figma.loadFontAsync(FONTS.SEMI_BOLD)
    nameText.fontName = FONTS.SEMI_BOLD
    nameText.fontSize = FONT_SIZES.LARGE
    nameText.characters = componentName
    nameText.fills = [{ type: 'SOLID', color: COLORS.TEXT_DARK }]
    mainFrame.appendChild(nameText)

    // Create container for light/dark modes
    const modesContainer = figma.createFrame()
    modesContainer.name = 'Modes Container'
    modesContainer.layoutMode = 'HORIZONTAL'
    modesContainer.primaryAxisSizingMode = 'AUTO'
    modesContainer.counterAxisSizingMode = 'AUTO'
    modesContainer.itemSpacing = SPACING.LARGE
    modesContainer.fills = []

    // Create light mode section
    const lightSection = await createModeSection(compSet, combos, false, layoutConfig)
    modesContainer.appendChild(lightSection)

    // Create dark mode section if enabled
    if (includeLightDark) {
      const darkSection = await createModeSection(compSet, combos, true, layoutConfig)
      modesContainer.appendChild(darkSection)

      // Apply dark mode using component set's resolved variable modes
      // This includes both local AND remote/library collections
      const resolvedModes = compSet.resolvedVariableModes

      for (const collectionId in resolvedModes) {
        try {
          const collection = figma.variables.getVariableCollectionById(collectionId)

          if (collection && collection.name.toLowerCase().includes('semantic')) {
            const darkMode = collection.modes.find(m => m.name.toLowerCase().includes('dark'))

            if (darkMode) {
              darkSection.setExplicitVariableModeForCollection(collection, darkMode.modeId)
              figma.notify('✅ Dark mode applied to ' + componentName)
              break
            }
          }
        } catch (e) {
          console.log('Could not get collection:', collectionId, e)
        }
      }
    }

    mainFrame.appendChild(modesContainer)
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
    const matchingKey = propNameToKey[propName]

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
      } catch (e) {
        // Silently continue if property can't be set
      }
    }
  }

  return instance
}

async function createModeSection(compSet: ComponentSetNode, combinations: any[], isDark: boolean, layoutConfig?: any) {
  // Create the Frame for the mode section
  const sectionFrame = figma.createFrame()
  sectionFrame.name = isDark ? 'Dark Mode' : 'Light Mode'
  sectionFrame.layoutMode = 'VERTICAL'
  sectionFrame.primaryAxisSizingMode = 'AUTO'
  sectionFrame.counterAxisSizingMode = 'AUTO'
  sectionFrame.itemSpacing = SPACING.NORMAL
  sectionFrame.paddingTop = SPACING.MEDIUM
  sectionFrame.paddingBottom = SPACING.MEDIUM
  sectionFrame.paddingLeft = SPACING.MEDIUM
  sectionFrame.paddingRight = SPACING.MEDIUM
  sectionFrame.cornerRadius = BORDER_RADIUS.SMALL
  sectionFrame.fills = isDark
    ? [{ type: 'SOLID', color: COLORS.DARK_BG }]
    : [{ type: 'SOLID', color: COLORS.WHITE }]

  // Add mode title
  const modeTitle = figma.createText()
  await figma.loadFontAsync(FONTS.MEDIUM)
  modeTitle.fontName = FONTS.MEDIUM
  modeTitle.fontSize = FONT_SIZES.MEDIUM
  modeTitle.characters = isDark ? 'Dark Mode' : 'Light Mode'
  modeTitle.fills = isDark
    ? [{ type: 'SOLID', color: COLORS.WHITE }]
    : [{ type: 'SOLID', color: COLORS.TEXT_DARK }]
  sectionFrame.appendChild(modeTitle)

  // Create table with all combinations
  const table = await createSimpleTable(compSet, combinations, isDark, layoutConfig)
  sectionFrame.appendChild(table)

  return sectionFrame
}

async function createSimpleTable(compSet: ComponentSetNode, combinations: any[], isDark: boolean, layoutConfig?: any) {
  const tableFrame = figma.createFrame()
  tableFrame.name = 'Table'
  tableFrame.layoutMode = 'VERTICAL'
  tableFrame.primaryAxisSizingMode = 'AUTO'
  tableFrame.counterAxisSizingMode = 'AUTO'
  tableFrame.itemSpacing = SPACING.TINY
  tableFrame.fills = []

  if (combinations.length === 0) return tableFrame

  // Get a sample instance to measure dimensions
  const sampleInstance = await createInstance(compSet, combinations[0].properties)
  const instanceWidth = sampleInstance.width
  const instanceHeight = sampleInstance.height
  sampleInstance.remove()

  // Load fonts
  await figma.loadFontAsync(FONTS.SEMI_BOLD)
  await figma.loadFontAsync(FONTS.REGULAR)

  // Analyze properties - determine which should be rows vs columns
  const allProps = analyzeVaryingProperties(combinations)

  if (allProps.length === 0) {
    // No variation - just show all instances in a row
    const row = figma.createFrame()
    row.layoutMode = 'HORIZONTAL'
    row.itemSpacing = SPACING.SMALL
    row.fills = []
    for (const combo of combinations) {
      const instance = await createInstance(compSet, combo.properties)
      row.appendChild(instance)
    }
    tableFrame.appendChild(row)
    return tableFrame
  }

  // Use layout config if provided, otherwise use first property for rows, remaining for columns
  let rowProp: any
  let colProps: any[]

  if (layoutConfig && layoutConfig.rowProperty && layoutConfig.columnProperties && layoutConfig.columnProperties.length > 0) {
    // Use user-configured layout
    rowProp = allProps.find(p => p.name === layoutConfig.rowProperty)
    colProps = layoutConfig.columnProperties
      .map((colName: string) => allProps.find(p => p.name === colName))
      .filter((p: any) => p !== undefined)

    // If row property not found or no valid column properties, fall back to default
    if (!rowProp || colProps.length === 0) {
      rowProp = allProps[0]
      colProps = allProps.slice(1)
    }
  } else {
    // Default: Use first property for rows, remaining properties for columns
    rowProp = allProps[0]
    colProps = allProps.slice(1)
  }

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

  // Create header row
  const headerRow = figma.createFrame()
  headerRow.name = 'Header Row'
  headerRow.layoutMode = 'HORIZONTAL'
  headerRow.itemSpacing = SPACING.SMALL
  headerRow.fills = []
  headerRow.paddingBottom = SPACING.TINY

  // Empty corner cell
  const cornerCell = figma.createFrame()
  cornerCell.resize(FRAME_DIMENSIONS.ROW_LABEL_WIDTH, FRAME_DIMENSIONS.SPACER_HEIGHT)
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
    headerText.fontName = FONTS.SEMI_BOLD
    headerText.fontSize = FONT_SIZES.TINY
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
      ? [{ type: 'SOLID', color: COLORS.TEXT_LIGHTER }]
      : [{ type: 'SOLID', color: COLORS.TEXT_LIGHT }]

    headerContainer.appendChild(headerText)

    // Resize container to fit text width and height
    headerContainer.resize(Math.max(instanceWidth, headerText.width + SPACING.TINY), headerText.height + SPACING.TINY)

    headerRow.appendChild(headerContainer)
  }

  tableFrame.appendChild(headerRow)

  // Create data rows
  for (const rowValue of rowValues) {
    const dataRow = figma.createFrame()
    dataRow.name = `Row: ${rowValue}`
    dataRow.layoutMode = 'HORIZONTAL'
    dataRow.itemSpacing = SPACING.SMALL
    dataRow.fills = []

    // Row label
    const rowLabelContainer = figma.createFrame()
    rowLabelContainer.resize(FRAME_DIMENSIONS.ROW_LABEL_WIDTH, instanceHeight)
    rowLabelContainer.layoutMode = 'VERTICAL'
    rowLabelContainer.primaryAxisAlignItems = 'CENTER'
    rowLabelContainer.counterAxisAlignItems = 'CENTER'
    rowLabelContainer.fills = []

    const rowLabel = figma.createText()
    rowLabel.fontName = FONTS.REGULAR
    rowLabel.fontSize = FONT_SIZES.SMALL
    rowLabel.characters = `${rowProp.name}:\n${rowValue}`
    rowLabel.textAlignHorizontal = 'CENTER'
    rowLabel.fills = isDark
      ? [{ type: 'SOLID', color: COLORS.TEXT_LIGHTEST }]
      : [{ type: 'SOLID', color: COLORS.TEXT_MEDIUM_DARK }]

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
  tableFrame.itemSpacing = SPACING.SMALL
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
  headerRow.itemSpacing = SPACING.NORMAL
  headerRow.fills = []
  headerRow.paddingBottom = SPACING.NORMAL

  // Empty corner cell for row labels
  const cornerCell = figma.createFrame()
  cornerCell.resize(FRAME_DIMENSIONS.ROW_LABEL_WIDTH_LARGE, FRAME_DIMENSIONS.SPACER_HEIGHT)
  cornerCell.fills = []
  headerRow.appendChild(cornerCell)

  // Column headers - show property name: (count) value
  await figma.loadFontAsync(FONTS.SEMI_BOLD)
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
    headerText.fontName = FONTS.SEMI_BOLD
    headerText.fontSize = FONT_SIZES.TINY

    // Build header text with all column properties
    const headerLines: string[] = []
    for (const p of colProps) {
      const value = String(colCombo[p.name])
      headerLines.push(`${p.name}: (${colIndex}) ${value}`)
    }
    headerText.characters = headerLines.join('\n')
    headerText.fills = isDark
      ? [{ type: 'SOLID', color: COLORS.TEXT_LIGHTER }]
      : [{ type: 'SOLID', color: COLORS.TEXT_LIGHT }]

    headerContainer.appendChild(headerText)
    headerRow.appendChild(headerContainer)
    colIndex++
  }

  tableFrame.appendChild(headerRow)

  // Create data rows
  await figma.loadFontAsync(FONTS.REGULAR)

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
    dataRow.itemSpacing = SPACING.NORMAL
    dataRow.fills = []

    // Row label
    const rowLabelContainer = figma.createFrame()
    rowLabelContainer.resize(FRAME_DIMENSIONS.ROW_LABEL_WIDTH_LARGE, instanceHeight)
    rowLabelContainer.layoutMode = 'VERTICAL'
    rowLabelContainer.primaryAxisAlignItems = 'CENTER'
    rowLabelContainer.counterAxisAlignItems = 'CENTER'
    rowLabelContainer.fills = []

    const rowLabel = figma.createText()
    rowLabel.fontName = FONTS.REGULAR
    rowLabel.fontSize = FONT_SIZES.SMALL
    rowLabel.characters = rowValue
    rowLabel.fills = isDark
      ? [{ type: 'SOLID', color: COLORS.TEXT_LIGHTEST }]
      : [{ type: 'SOLID', color: COLORS.TEXT_MEDIUM_DARK }]

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

async function generatePreviews(combinations: any[]) {
  const selection = figma.currentPage.selection
  console.log('Current selection:', selection.length, 'nodes')
  
  const compSet = selection.find(node => node.type === 'COMPONENT_SET') as ComponentSetNode

  if (!compSet) {
    console.error('No component set in selection. Selection:', selection.map(n => ({ type: n.type, name: n.name })))
    throw new Error('No component set selected')
  }
  
  console.log('Using component set:', compSet.name)

  const previews: { [key: string]: string } = {}

  for (const combo of combinations) {
    try {
      // Create instance with the combination's properties
      const instance = await createInstance(compSet, combo.properties)

      // Export as PNG with small size for thumbnail
      const imageData = await instance.exportAsync({
        format: 'PNG',
        constraint: { type: 'SCALE', value: EXPORT_SCALE.THUMBNAIL }
      })

      // Convert to base64
      const base64 = figma.base64Encode(imageData)

      // Use variantName as key
      previews[combo.variantName] = base64

      // Clean up
      instance.remove()
    } catch (error) {
      console.error('Error generating preview for', combo.variantName, error)
      // Continue with other previews even if one fails
    }
  }

  console.log('Generated', Object.keys(previews).length, 'previews out of', combinations.length, 'combinations')
  return previews
}
