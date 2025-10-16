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

  // Create main frame
  const frame = figma.createFrame()
  frame.name = 'Component Sticker Sheet'
  frame.layoutMode = 'VERTICAL'
  frame.itemSpacing = 40
  frame.paddingTop = 40
  frame.paddingBottom = 40
  frame.paddingLeft = 40
  frame.paddingRight = 40
  frame.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.95, b: 0.95 } }]

  // Group combinations by component set
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

    // Create section for Light mode
    await createSection(frame, compSet, combos, false)

    // Create section for Dark mode if enabled
    if (includeLightDark) {
      await createSection(frame, compSet, combos, true)
    }
  }

  // Select and zoom to the created frame
  figma.currentPage.selection = [frame]
  figma.viewport.scrollAndZoomIntoView([frame])
}

async function createSection(parentFrame: FrameNode, compSet: ComponentSetNode, combinations: any[], isDark: boolean) {
  const sectionFrame = figma.createFrame()
  sectionFrame.name = `${compSet.name} - ${isDark ? 'Dark' : 'Light'}`
  sectionFrame.layoutMode = 'VERTICAL'
  sectionFrame.itemSpacing = 20
  sectionFrame.fills = []

  // Add title
  const title = figma.createText()
  await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' })
  title.characters = sectionFrame.name
  title.fontSize = 18
  title.fontName = { family: 'Inter', style: 'Semi Bold' }
  sectionFrame.appendChild(title)

  // Create grid for variants
  const grid = await createVariantGrid(compSet, combinations, isDark)
  sectionFrame.appendChild(grid)

  parentFrame.appendChild(sectionFrame)
}

async function createVariantGrid(compSet: ComponentSetNode, combinations: any[], isDark: boolean) {
  const gridContainer = figma.createFrame()
  gridContainer.name = 'Variant Grid'
  gridContainer.layoutMode = 'VERTICAL'
  gridContainer.itemSpacing = 16
  gridContainer.fills = []

  // Group by primary variant property
  const grouped: any = {}

  for (const combo of combinations) {
    // Get first property as primary
    const props = combo.properties
    const primaryValue = props[Object.keys(props)[0]] || 'default'

    if (!grouped[primaryValue]) {
      grouped[primaryValue] = []
    }
    grouped[primaryValue].push(combo)
  }

  // Create rows
  for (const rowKey in grouped) {
    const rowCombos = grouped[rowKey]
    const rowFrame = figma.createFrame()
    rowFrame.name = `Row: ${rowKey}`
    rowFrame.layoutMode = 'HORIZONTAL'
    rowFrame.itemSpacing = 16
    rowFrame.fills = []

    // Add row label
    const label = figma.createText()
    await figma.loadFontAsync({ family: 'Inter', style: 'Medium' })
    label.characters = rowKey
    label.fontSize = 12
    label.fontName = { family: 'Inter', style: 'Medium' }
    rowFrame.appendChild(label)

    // Add instances
    for (const combo of rowCombos) {
      const baseVariant = compSet.children[0] as ComponentNode
      const instance = baseVariant.createInstance()

      // Set properties
      for (const propName in combo.properties) {
        const propValue = combo.properties[propName]
        const propDefs = compSet.componentPropertyDefinitions

        for (const key in propDefs) {
          if (key.split('#')[0] === propName) {
            try {
              instance.setProperties({ [key]: propValue })
            } catch (e) {
              console.log('Could not set property:', propName, propValue)
            }
          }
        }
      }

      rowFrame.appendChild(instance)
    }

    gridContainer.appendChild(rowFrame)
  }

  return gridContainer
}
