// Component Organizer Plugin
// Generates organized sticker sheets from component sets with all variant combinations

figma.showUI(__html__, { width: 500, height: 700, themeColors: true });

var componentSetData = [];

// Listen for selection changes
figma.on('selectionchange', function() {
  init();
});

// Initialize plugin - analyze selected component sets
function init() {
  var selection = figma.currentPage.selection;

  if (selection.length === 0) {
    figma.ui.postMessage({
      type: 'error',
      message: 'Please select at least one component set'
    });
    return;
  }

  // Debug: Log what was selected
  var selectionTypes = [];
  for (var i = 0; i < selection.length; i++) {
    selectionTypes.push(selection[i].type);
  }

  // Filter to only component sets
  var componentSets = selection.filter(function(node) {
    return node.type === 'COMPONENT_SET';
  });

  if (componentSets.length === 0) {
    var errorMsg = 'Please select component sets (not individual components or instances). ';
    errorMsg += 'You selected: ' + selectionTypes.join(', ');
    figma.ui.postMessage({
      type: 'error',
      message: errorMsg
    });
    return;
  }

  // Analyze each component set
  componentSetData = componentSets.map(function(compSet) {
    // Load saved plugin data
    var tagsJson = compSet.getPluginData('tags') || '[]';
    var tags = [];
    try {
      tags = JSON.parse(tagsJson);
    } catch (e) {
      tags = [];
    }
    var order = parseInt(compSet.getPluginData('order') || '0');
    var includeNested = compSet.getPluginData('includeNested') === 'true';

    // Analyze variant structure
    var variantInfo = analyzeComponentSet(compSet);

    return {
      id: compSet.id,
      name: compSet.name,
      tags: tags,
      order: order,
      includeNested: includeNested,
      variantCount: variantInfo.variantCount,
      properties: variantInfo.properties,
      variantNames: variantInfo.variantNames
    };
  });

  figma.ui.postMessage({
    type: 'init',
    componentSets: componentSetData
  });
}

// Analyze a component set to extract variant structure
function analyzeComponentSet(compSet) {
  var properties = {};
  var variantCount = 0;
  var variantNames = [];

  // Get all variants (children of component set)
  var variants = compSet.children;
  variantCount = variants.length;

  console.log('Analyzing component set:', compSet.name);
  console.log('Children count:', variants.length);

  // Always use componentPropertyDefinitions (newer API) which includes all property types
  if (compSet.componentPropertyDefinitions) {
    console.log('Using componentPropertyDefinitions');
    var propDefs = compSet.componentPropertyDefinitions;
    
    console.log('All property definitions:', Object.keys(propDefs));
    
    for (var key in propDefs) {
      var prop = propDefs[key];
      console.log('Property key:', key, 'Type:', prop.type, 'Definition:', prop);

      // Extract the actual property name from the key (format is usually "propertyName#id")
      var propName = key.split('#')[0];

      if (prop.type === 'VARIANT') {
        properties[propName] = {
          type: 'VARIANT',
          values: prop.variantOptions || [],
          key: key
        };
        console.log('Added VARIANT property:', propName, 'with values:', prop.variantOptions);
      } else if (prop.type === 'BOOLEAN') {
        properties[propName] = {
          type: 'BOOLEAN',
          values: [true, false],
          key: key
        };
        console.log('Added BOOLEAN property:', propName);
      } else if (prop.type === 'TEXT') {
        // Could include text properties if user wants to vary text
        console.log('Skipping TEXT property:', propName);
      } else if (prop.type === 'INSTANCE_SWAP') {
        // Could include instance swap if needed
        console.log('Skipping INSTANCE_SWAP property:', propName);
      } else {
        console.log('Unknown property type:', prop.type, 'for', propName);
      }
    }
  }
  // Fallback to variantGroupProperties (older API) - only has VARIANT properties
  else if (compSet.variantGroupProperties) {
    console.log('Using variantGroupProperties (older API - limited to VARIANT properties only)');
    var variantProps = compSet.variantGroupProperties;
    for (var propName in variantProps) {
      properties[propName] = {
        type: 'VARIANT',
        values: variantProps[propName].values || [],
        key: propName
      };
    }
  }

  console.log('Final extracted properties:', properties);
  console.log('Property count:', Object.keys(properties).length);

  // Get variant names for reference
  for (var i = 0; i < variants.length; i++) {
    variantNames.push(variants[i].name);
  }

  return {
    variantCount: variantCount,
    properties: properties,
    variantNames: variantNames
  };
}

// Generate all combinations of variant properties
function generateVariantCombinations(properties) {
  var propNames = [];
  var propValues = [];

  for (var name in properties) {
    propNames.push(name);
    propValues.push(properties[name].values);
  }

  if (propNames.length === 0) {
    return [];
  }

  var combinations = [];

  function recurse(index, current) {
    if (index === propNames.length) {
      var combination = {};
      for (var i = 0; i < propNames.length; i++) {
        combination[propNames[i]] = current[i];
      }
      combinations.push(combination);
      return;
    }

    var values = propValues[index];
    for (var j = 0; j < values.length; j++) {
      current[index] = values[j];
      recurse(index + 1, current);
    }
  }

  recurse(0, []);
  return combinations;
}


// Extract actual variant combinations from component set children
// This avoids generating invalid/duplicate combinations
function extractActualVariants(compSet) {
  var variants = compSet.children;
  var actualCombinations = [];
  
  console.log('Extracting actual variants from', variants.length, 'children');
  
  // First, identify which properties are boolean (non-variant properties)
  var booleanProps = [];
  var componentProps = compSet.componentPropertyDefinitions || {};
  
  for (var key in componentProps) {
    var prop = componentProps[key];
    var propName = key.split('#')[0];
    
    if (prop.type === 'BOOLEAN') {
      booleanProps.push({name: propName, key: key});
      console.log('Found BOOLEAN property:', propName);
    }
  }
  
  // Build a map of which boolean properties are available on each variant
  var variantBooleanMap = {};
  
  for (var i = 0; i < variants.length; i++) {
    var variant = variants[i];
    var variantName = variant.name;
    
    // Check which boolean properties this variant actually has
    var availableBoolProps = [];
    
    for (var bp = 0; bp < booleanProps.length; bp++) {
      var boolProp = booleanProps[bp];
      
      // Check if this variant's componentProperties includes this boolean key
      if (variant.componentProperties && variant.componentProperties[boolProp.key] !== undefined) {
        availableBoolProps.push(boolProp);
        console.log('Variant "' + variantName + '" has boolean property:', boolProp.name);
      } else {
        console.log('Variant "' + variantName + '" does NOT have boolean property:', boolProp.name);
      }
    }
    
    variantBooleanMap[variantName] = availableBoolProps;
  }
  
  // Now generate combinations based on what's actually available
  for (var i = 0; i < variants.length; i++) {
    var variant = variants[i];
    var variantName = variant.name;
    
    console.log('Parsing variant:', variantName);
    
    // Parse variant name (format: "Property1=Value1, Property2=Value2")
    var baseCombo = {};
    var pairs = variantName.split(',');
    
    for (var j = 0; j < pairs.length; j++) {
      var pair = pairs[j].trim();
      var parts = pair.split('=');
      
      if (parts.length === 2) {
        var propName = parts[0].trim();
        var propValue = parts[1].trim();
        
        // Convert string boolean values to actual booleans
        if (propValue === 'true') {
          propValue = true;
        } else if (propValue === 'false') {
          propValue = false;
        }
        
        baseCombo[propName] = propValue;
      }
    }
    
    console.log('  Base combination:', JSON.stringify(baseCombo));
    
    // Get available boolean properties for this variant
    var availableBoolProps = variantBooleanMap[variantName] || [];
    
    if (availableBoolProps.length > 0 && Object.keys(baseCombo).length > 0) {
      // Generate combinations only with available boolean properties
      var boolCount = availableBoolProps.length;
      var boolCombos = Math.pow(2, boolCount);
      
      for (var b = 0; b < boolCombos; b++) {
        var expandedCombo = {};
        
        // Copy base combo
        for (var prop in baseCombo) {
          expandedCombo[prop] = baseCombo[prop];
        }
        
        // Add boolean property values
        for (var bp = 0; bp < availableBoolProps.length; bp++) {
          var boolProp = availableBoolProps[bp];
          var value = ((b >> bp) & 1) === 1;
          expandedCombo[boolProp.name] = value;
        }
        
        actualCombinations.push(expandedCombo);
        console.log('  Valid combination with available booleans:', JSON.stringify(expandedCombo));
      }
    } else if (Object.keys(baseCombo).length > 0) {
      // No available boolean props for this variant, just add the base combo
      actualCombinations.push(baseCombo);
      console.log('  Added as-is (no boolean props available for this variant)');
    }
  }
  
  console.log('Extracted', actualCombinations.length, 'valid variant combinations');
  return actualCombinations;
}


// Generate combinations based on user's property expansion settings
function generateCombinationsWithSettings(compSet, properties, expansionSettings) {
  var variants = compSet.children;
  var combinations = [];
  
  console.log('Generating combinations with expansion settings:', expansionSettings);
  
  // Separate properties into those to expand and those not to expand
  var propsToExpand = [];
  var componentProps = compSet.componentPropertyDefinitions || {};
  
  for (var propName in properties) {
    var prop = properties[propName];
    
    // Check if this property should be expanded
    if (expansionSettings[propName] === true) {
      propsToExpand.push({
        name: propName,
        type: prop.type,
        values: prop.values,
        key: prop.key
      });
      console.log('Will expand property:', propName, 'with values:', prop.values);
    }
  }
  
  // Start with actual variants as base
  for (var i = 0; i < variants.length; i++) {
    var variant = variants[i];
    var variantName = variant.name;
    
    // Parse variant name to get base properties
    var baseCombo = {};
    var pairs = variantName.split(',');
    
    for (var j = 0; j < pairs.length; j++) {
      var pair = pairs[j].trim();
      var parts = pair.split('=');
      
      if (parts.length === 2) {
        var propName = parts[0].trim();
        var propValue = parts[1].trim();
        
        // Convert string boolean values
        if (propValue === 'true') {
          propValue = true;
        } else if (propValue === 'false') {
          propValue = false;
        }
        
        baseCombo[propName] = propValue;
      }
    }
    
    // If no properties to expand, just add the base combo
    if (propsToExpand.length === 0) {
      combinations.push(baseCombo);
      console.log('No expansion, added base combo:', JSON.stringify(baseCombo));
      continue;
    }
    
    // Filter propsToExpand to only include those available on this variant
    var availablePropsToExpand = [];
    
    for (var p = 0; p < propsToExpand.length; p++) {
      var prop = propsToExpand[p];
      
      // Check if this property exists on the variant
      if (variant.componentProperties && variant.componentProperties[prop.key] !== undefined) {
        availablePropsToExpand.push(prop);
      }
    }
    
    console.log('Available props to expand for', variantName, ':', availablePropsToExpand.map(function(p) { return p.name; }));
    
    // Generate all combinations of the properties to expand
    if (availablePropsToExpand.length > 0) {
      var expandedCombos = generatePropertyCombinations(availablePropsToExpand);
      
      for (var c = 0; c < expandedCombos.length; c++) {
        var expandedCombo = {};
        
        // Copy base combo
        for (var prop in baseCombo) {
          expandedCombo[prop] = baseCombo[prop];
        }
        
        // Add expanded properties
        for (var prop in expandedCombos[c]) {
          expandedCombo[prop] = expandedCombos[c][prop];
        }
        
        combinations.push(expandedCombo);
      }
    } else {
      // No expandable props available for this variant, just use base
      combinations.push(baseCombo);
    }
  }
  
  console.log('Total combinations generated:', combinations.length);
  return combinations;
}

// Helper function to generate all combinations of given properties
function generatePropertyCombinations(properties) {
  if (properties.length === 0) {
    return [{}];
  }
  
  var propNames = [];
  var propValues = [];
  
  for (var i = 0; i < properties.length; i++) {
    propNames.push(properties[i].name);
    propValues.push(properties[i].values);
  }
  
  var combinations = [];
  
  function recurse(index, current) {
    if (index === propNames.length) {
      var combination = {};
      for (var i = 0; i < propNames.length; i++) {
        combination[propNames[i]] = current[i];
      }
      combinations.push(combination);
      return;
    }
    
    var values = propValues[index];
    for (var j = 0; j < values.length; j++) {
      current[index] = values[j];
      recurse(index + 1, current);
    }
  }
  
  recurse(0, []);
  return combinations;
}

// Find variant component by properties
function findVariantByProperties(compSet, properties) {
  var variants = compSet.children;

  console.log('Finding variant for properties:', properties);

  // Build expected variant name (format: "Property1=Value1, Property2=Value2")
  var nameParts = [];
  for (var propName in properties) {
    nameParts.push(propName + '=' + properties[propName]);
  }
  var expectedName = nameParts.join(', ');

  console.log('Looking for variant with name:', expectedName);

  // First try exact name match
  for (var i = 0; i < variants.length; i++) {
    var variant = variants[i];
    console.log('Checking variant:', variant.name);
    if (variant.name === expectedName) {
      console.log('Found exact match!');
      return variant;
    }
  }

  // If not found, try matching by individual properties
  for (var i = 0; i < variants.length; i++) {
    var variant = variants[i];
    var matches = true;

    // Check if variant name contains all expected property=value pairs
    for (var propName in properties) {
      var expectedPair = propName + '=' + properties[propName];
      if (variant.name.indexOf(expectedPair) === -1) {
        matches = false;
        break;
      }
    }

    if (matches) {
      console.log('Found match by property pairs:', variant.name);
      return variant;
    }
  }

  console.log('No variant found');
  return null;
}

// Message handler
figma.ui.onmessage = function(msg) {
  if (msg.type === 'init-plugin') {
    init();
  }

  if (msg.type === 'update-component-set') {
    var index = -1;
    for (var i = 0; i < componentSetData.length; i++) {
      if (componentSetData[i].id === msg.data.id) {
        index = i;
        break;
      }
    }

    if (index !== -1) {
      componentSetData[index].tags = msg.data.tags;
      componentSetData[index].order = msg.data.order;
      componentSetData[index].includeNested = msg.data.includeNested;

      // Store data in plugin data
      var node = figma.getNodeById(msg.data.id);
      if (node && node.type === 'COMPONENT_SET') {
        node.setPluginData('tags', JSON.stringify(msg.data.tags || []));
        node.setPluginData('order', String(msg.data.order || 0));
        node.setPluginData('includeNested', String(msg.data.includeNested || false));
      }
    }
  }

  if (msg.type === 'generate-sticker-sheet') {
    try {
      generateStickerSheet(msg.sortBy, msg.groupBy, msg.includeLightDark, msg.selectedCombinations);
    } catch (error) {
      figma.notify('Error: ' + error.message);
      console.error(error);
    }
  }

  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};

function generateStickerSheet(sortBy, groupBy, includeLightDark, selectedCombinations) {
  sortBy = sortBy || 'name';
  groupBy = groupBy || 'component';
  includeLightDark = includeLightDark !== false;
  selectedCombinations = selectedCombinations || [];
  
  console.log('=== GENERATE STICKER SHEET CALLED ===');
  console.log('selectedCombinations received:', selectedCombinations.length, 'combinations');

  console.log('generateStickerSheet called', {sortBy: sortBy, groupBy: groupBy, includeLightDark: includeLightDark});
  console.log('componentSetData length:', componentSetData.length);

  if (componentSetData.length === 0) {
    figma.notify('No component sets to generate sticker sheet');
    return;
  }

  // Calculate position - place next to the first selected component set
  var firstCompSet = figma.getNodeById(componentSetData[0].id);
  var startX = 0;
  var startY = 0;

  if (firstCompSet) {
    startX = firstCompSet.x + firstCompSet.width + 200;
    startY = firstCompSet.y;
  }

  console.log('Start position:', {x: startX, y: startY});

  // Load fonts first
  figma.loadFontAsync({ family: "Inter", style: "Bold" })
    .then(function() {
      return figma.loadFontAsync({ family: "Inter", style: "Regular" });
    })
    .then(function() {
      return figma.loadFontAsync({ family: "Inter", style: "Medium" });
    })
    .then(function() {
      return figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
    })
    .then(function() {
      return figma.loadFontAsync({ family: "SF Pro", style: "Semibold" });
    })
    .catch(function() {
      // Fallback if SF Pro is not available
      return figma.loadFontAsync({ family: "Inter", style: "Semibold" });
    })
    .then(function() {
      // Sort component sets
      var sortedData = componentSetData.slice();
      sortedData.sort(function(a, b) {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'order') {
          return a.order - b.order;
        }
        return 0;
      });

      // Group component sets
      var groups = {};
      if (groupBy === 'none') {
        groups['All Components'] = sortedData;
      } else {
        // Group by component set (default)
        for (var i = 0; i < sortedData.length; i++) {
          var item = sortedData[i];
          groups[item.name] = [item];
        }
      }

      // Create main container frame
      var mainContainer = figma.createFrame();
      mainContainer.name = 'Sticker Sheet';
      mainContainer.x = startX;
      mainContainer.y = startY;
      mainContainer.fills = [{type: 'SOLID', color: {r: 0.96, g: 0.96, b: 0.96}}];
      mainContainer.layoutMode = 'VERTICAL';
      mainContainer.itemSpacing = 80;
      mainContainer.paddingTop = 60;
      mainContainer.paddingBottom = 60;
      mainContainer.paddingLeft = 60;
      mainContainer.paddingRight = 60;
      mainContainer.cornerRadius = 16;
      mainContainer.primaryAxisSizingMode = 'AUTO';
      mainContainer.counterAxisSizingMode = 'AUTO';

      // Layout settings
      var componentSpacing = 48;
      var variantSpacing = 32;
      var sectionWidth = 1200;

      // Process each group
      var groupNames = Object.keys(groups);

      for (var g = 0; g < groupNames.length; g++) {
        var groupName = groupNames[g];
        var groupItems = groups[groupName];

        // Process each component set in this group
        for (var c = 0; c < groupItems.length; c++) {
          var itemData = groupItems[c];
          var compSet = figma.getNodeById(itemData.id);

          if (!compSet || compSet.type !== 'COMPONENT_SET') {
            continue;
          }

          // Use the selected combinations from the UI
          var combinations = [];
          
          // Filter selectedCombinations for this component set
          for (var sc = 0; sc < selectedCombinations.length; sc++) {
            var selectedCombo = selectedCombinations[sc];
            if (selectedCombo.componentSetId === itemData.id) {
              combinations.push(selectedCombo.properties);
            }
          }
          
          console.log('Component:', itemData.name);
          console.log('Using', combinations.length, 'selected combinations from UI');

          // Create component section container
          var componentSection = figma.createFrame();
          componentSection.name = itemData.name + ' Section';
          componentSection.fills = [];
          componentSection.layoutMode = 'VERTICAL';
          componentSection.itemSpacing = 40;
          componentSection.primaryAxisSizingMode = 'AUTO';
          componentSection.counterAxisSizingMode = 'AUTO';

          // Create styled header banner
          var headerBanner = createStyledHeader(itemData);
          componentSection.appendChild(headerBanner);

          if (includeLightDark) {
            // Create side-by-side light/dark mode sections
            var modesContainer = figma.createFrame();
            modesContainer.name = 'Light & Dark Modes';
            modesContainer.fills = [];
            modesContainer.layoutMode = 'HORIZONTAL';
            modesContainer.itemSpacing = 40;
            modesContainer.counterAxisSizingMode = 'AUTO';
            modesContainer.primaryAxisSizingMode = 'AUTO';

            // Light Mode Section
            var lightSection = createModeSection('Light Mode', combinations, compSet, false);
            modesContainer.appendChild(lightSection);

            // Dark Mode Section
            var darkSection = createModeSection('Dark Mode', combinations, compSet, true);
            modesContainer.appendChild(darkSection);

            componentSection.appendChild(modesContainer);
          } else {
            // Single section without mode separation
            var singleSection = createVariantsGrid(combinations, compSet, false);
            componentSection.appendChild(singleSection);
          }

          mainContainer.appendChild(componentSection);
        }
      }

      // Zoom to show the generated sticker sheet
      figma.viewport.scrollAndZoomIntoView([mainContainer]);
      figma.currentPage.selection = [mainContainer];

      figma.notify('Sticker sheet generated with ' + componentSetData.length + ' component sets!');
    })
    .catch(function(err) {
      figma.notify('Error: ' + err.message);
      console.error(err);
    });
}

// Create styled header banner with purple background
function createStyledHeader(itemData) {
  var headerContainer = figma.createFrame();
  headerContainer.name = 'Header';
  headerContainer.fills = [{type: 'SOLID', color: {r: 0.49, g: 0.40, b: 0.93}}]; // Purple
  headerContainer.cornerRadius = 24;
  headerContainer.layoutMode = 'HORIZONTAL';
  headerContainer.primaryAxisAlignItems = 'CENTER';
  headerContainer.counterAxisAlignItems = 'CENTER';
  headerContainer.itemSpacing = 16;
  headerContainer.paddingTop = 18;
  headerContainer.paddingBottom = 18;
  headerContainer.paddingLeft = 28;
  headerContainer.paddingRight = 28;
  headerContainer.primaryAxisSizingMode = 'AUTO';

  // Component icon/emoji
  var iconText = figma.createText();
  iconText.fontName = { family: "Inter", style: "Bold" };
  iconText.fontSize = 28;
  iconText.characters = '📱'; // iOS icon
  iconText.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}];
  headerContainer.appendChild(iconText);

  // Component name
  var nameText = figma.createText();
  nameText.fontName = { family: "Inter", style: "Bold" };
  nameText.fontSize = 22;
  nameText.characters = itemData.name;
  nameText.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}];
  nameText.textAlignHorizontal = 'LEFT';
  headerContainer.appendChild(nameText);

  // Spacer to push metadata to the right
  var spacer = figma.createFrame();
  spacer.fills = [];
  spacer.layoutMode = 'HORIZONTAL';
  spacer.primaryAxisSizingMode = 'FIXED';
  spacer.resize(40, 10);
  headerContainer.appendChild(spacer);

  // Metadata section (component count, specs count, etc.)
  var metadataContainer = figma.createFrame();
  metadataContainer.fills = [];
  metadataContainer.layoutMode = 'HORIZONTAL';
  metadataContainer.itemSpacing = 12;
  metadataContainer.primaryAxisSizingMode = 'AUTO';
  metadataContainer.counterAxisSizingMode = 'AUTO';
  metadataContainer.primaryAxisAlignItems = 'CENTER';

  // Variant count badge
  var variantBadge = createMetadataBadge(itemData.variantCount + '. Component');
  metadataContainer.appendChild(variantBadge);

  // Properties/Specs count badge
  var propCount = Object.keys(itemData.properties || {}).length;
  var specsBadge = createMetadataBadge(propCount + '. Specs');
  metadataContainer.appendChild(specsBadge);

  // Tags if present
  if (itemData.tags && itemData.tags.length > 0) {
    for (var i = 0; i < itemData.tags.length; i++) {
      var tagBadge = createMetadataBadge(itemData.tags[i]);
      metadataContainer.appendChild(tagBadge);
    }
  }

  headerContainer.appendChild(metadataContainer);

  // Apple logo
  var appleIcon = figma.createText();
  appleIcon.fontName = { family: "Inter", style: "Bold" };
  appleIcon.fontSize = 24;
  appleIcon.characters = '';
  appleIcon.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}];
  headerContainer.appendChild(appleIcon);

  return headerContainer;
}

// Create a metadata badge
function createMetadataBadge(text) {
  var badge = figma.createFrame();
  badge.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}];
  badge.opacity = 0.2;
  badge.cornerRadius = 12;
  badge.layoutMode = 'HORIZONTAL';
  badge.paddingTop = 6;
  badge.paddingBottom = 6;
  badge.paddingLeft = 12;
  badge.paddingRight = 12;
  badge.primaryAxisSizingMode = 'AUTO';
  badge.counterAxisSizingMode = 'AUTO';

  var badgeText = figma.createText();
  badgeText.fontName = { family: "Inter", style: "Medium" };
  badgeText.fontSize = 13;
  badgeText.characters = String(text);
  badgeText.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}];

  badge.appendChild(badgeText);
  return badge;
}

// Create a mode section (Light or Dark)
function createModeSection(modeName, combinations, compSet, isDark) {
  var modeFrame = figma.createFrame();
  modeFrame.name = modeName;
  modeFrame.layoutMode = 'VERTICAL';
  modeFrame.itemSpacing = 28;
  modeFrame.paddingTop = 40;
  modeFrame.paddingBottom = 40;
  modeFrame.paddingLeft = 40;
  modeFrame.paddingRight = 40;
  modeFrame.cornerRadius = 16;
  modeFrame.clipsContent = false; // Don't clip content!
  
  // Use AUTO sizing to fit content
  modeFrame.primaryAxisSizingMode = 'AUTO';
  modeFrame.counterAxisSizingMode = 'AUTO';

  // Set background color based on mode
  if (isDark) {
    modeFrame.fills = [{type: 'SOLID', color: {r: 0.11, g: 0.11, b: 0.12}}];
  } else {
    modeFrame.fills = [{type: 'SOLID', color: {r: 0.98, g: 0.98, b: 0.99}}];
  }

  // Get variable modes from the component set itself
  try {
    console.log('Component set resolved modes:', JSON.stringify(compSet.resolvedVariableModes));
    
    // Get all variable collections by iterating through the component's resolved modes
    var resolvedModes = compSet.resolvedVariableModes;
    var collectionsToSet = {};
    
    // Build a map of collections from resolved modes
    for (var collectionId in resolvedModes) {
      try {
        var collection = figma.variables.getVariableCollectionById(collectionId);
        if (collection) {
          collectionsToSet[collectionId] = collection;
          console.log('Found collection from component:', collection.name, 'with', collection.modes.length, 'modes');
          console.log('  Modes:', JSON.stringify(collection.modes));
        }
      } catch (e) {
        console.log('Could not get collection for id:', collectionId);
      }
    }
    
    var modeSet = false;
    
    // Now set the appropriate mode for each collection
    for (var collectionId in collectionsToSet) {
      var collection = collectionsToSet[collectionId];
      var targetMode = null;
      
      // Look for the appropriate mode
      for (var j = 0; j < collection.modes.length; j++) {
        var mode = collection.modes[j];
        var modeLowerCase = mode.name.toLowerCase();
        
        console.log('  Checking mode:', mode.name, '(modeId:', mode.modeId, ')');
        
        if (isDark) {
          // Look for "dark" mode
          if (modeLowerCase === 'dark' || modeLowerCase.indexOf('dark') !== -1) {
            targetMode = mode;
            console.log('  → Found dark mode:', mode.name);
            break;
          }
        } else {
          // Look for "light" mode (not "auto (light)")
          if (modeLowerCase === 'light' && modeLowerCase.indexOf('auto') === -1) {
            targetMode = mode;
            console.log('  → Found light mode:', mode.name);
            break;
          }
        }
      }
      
      // If no explicit mode found, use the current resolved mode for light, or try to find dark
      if (!targetMode && !isDark) {
        var currentModeId = resolvedModes[collectionId];
        for (var j = 0; j < collection.modes.length; j++) {
          if (collection.modes[j].modeId === currentModeId) {
            targetMode = collection.modes[j];
            console.log('  → Using current resolved mode:', targetMode.name);
            break;
          }
        }
      }
      
      if (targetMode) {
        try {
          modeFrame.setExplicitVariableModeForCollection(collection, targetMode.modeId);
          console.log('✓ Successfully set', targetMode.name, 'for collection:', collection.name);
          modeSet = true;
        } catch (error) {
          console.log('✗ Failed to set mode for collection:', collection.name, error.message);
        }
      } else {
        console.log('✗ No matching', isDark ? 'dark' : 'light', 'mode found for collection:', collection.name);
      }
    }
    
    if (!modeSet) {
      console.log('⚠ Warning: No', isDark ? 'dark' : 'light', 'mode was set for any collection');
    }
  } catch (error) {
    console.log('❌ Error setting variable modes:', error.message);
    console.error(error);
  }

  // Mode label
  var modeLabel = figma.createText();
  modeLabel.fontName = { family: "Inter", style: "Bold" };
  modeLabel.fontSize = 18;
  modeLabel.characters = modeName;
  modeLabel.fills = isDark 
    ? [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}]
    : [{type: 'SOLID', color: {r: 0.1, g: 0.1, b: 0.1}}];
  modeFrame.appendChild(modeLabel);

  // Variants grid
  var variantsGrid = createVariantsGrid(combinations, compSet, isDark);
  modeFrame.appendChild(variantsGrid);

  return modeFrame;
}

// Create variants grid layout
function createVariantsGrid(combinations, compSet, isDark) {
  var gridContainer = figma.createFrame();
  gridContainer.name = 'Variants Grid';
  gridContainer.fills = [];
  gridContainer.layoutMode = 'VERTICAL';
  gridContainer.itemSpacing = 32;
  gridContainer.primaryAxisSizingMode = 'AUTO';
  gridContainer.counterAxisSizingMode = 'AUTO';
  gridContainer.clipsContent = false;

  console.log('Creating grid for', combinations.length, 'combinations');

  // Group combinations by the primary variant property (usually the first one)
  var propNames = [];
  if (combinations.length > 0) {
    propNames = Object.keys(combinations[0]);
  }
  
  console.log('Property names:', propNames);
  
  // Find which property is the primary variant (not boolean)
  var primaryProp = null;
  var booleanProps = [];
  var componentProps = compSet.componentPropertyDefinitions || {};
  
  for (var i = 0; i < propNames.length; i++) {
    var propName = propNames[i];
    // Find the property definition
    for (var key in componentProps) {
      if (key.split('#')[0] === propName) {
        if (componentProps[key].type === 'VARIANT') {
          primaryProp = propName;
        } else if (componentProps[key].type === 'BOOLEAN') {
          booleanProps.push(propName);
        }
        break;
      }
    }
  }
  
  console.log('Primary variant property:', primaryProp);
  console.log('Boolean properties:', booleanProps);
  
  // Group combinations by primary variant value
  var groupedCombos = {};
  for (var v = 0; v < combinations.length; v++) {
    var combo = combinations[v];
    var groupKey = primaryProp ? combo[primaryProp] : 'default';
    
    if (!groupedCombos[groupKey]) {
      groupedCombos[groupKey] = [];
    }
    groupedCombos[groupKey].push(combo);
  }
  
  console.log('Grouped combinations:', Object.keys(groupedCombos));

  // Determine all unique boolean property combinations across ALL selected items
  // This will define our column structure
  var allBooleanCombos = {};
  var booleanComboKeys = [];
  
  if (booleanProps.length > 0) {
    for (var v = 0; v < combinations.length; v++) {
      var combo = combinations[v];
      
      // Extract just the boolean properties
      var boolCombo = {};
      for (var b = 0; b < booleanProps.length; b++) {
        var boolProp = booleanProps[b];
        if (combo.hasOwnProperty(boolProp)) {
          boolCombo[boolProp] = combo[boolProp];
        }
      }
      
      var boolKey = JSON.stringify(boolCombo);
      if (!allBooleanCombos[boolKey]) {
        allBooleanCombos[boolKey] = boolCombo;
        booleanComboKeys.push(boolKey);
      }
    }
    
    // Sort boolean combo keys for consistent column order
    booleanComboKeys.sort();
    
    console.log('Found', booleanComboKeys.length, 'unique boolean combinations for columns:', booleanComboKeys);
  }

  // Create column headers if we have boolean properties
  if (booleanComboKeys.length > 0) {
    var headerRow = figma.createFrame();
    headerRow.name = 'Column Headers';
    headerRow.fills = [];
    headerRow.layoutMode = 'HORIZONTAL';
    headerRow.itemSpacing = 20;
    headerRow.primaryAxisSizingMode = 'AUTO';
    headerRow.counterAxisSizingMode = 'AUTO';
    headerRow.clipsContent = false;
    
    // Add spacer for the row label column
    var spacer = figma.createFrame();
    spacer.name = 'Spacer';
    spacer.fills = [];
    spacer.resize(120, 1);
    headerRow.appendChild(spacer);
    
    // Create header for each unique boolean combination (column)
    for (var c = 0; c < booleanComboKeys.length; c++) {
      var boolCombo = allBooleanCombos[booleanComboKeys[c]];
      
      // Build column header text from boolean properties
      var headerParts = [];
      for (var b = 0; b < booleanProps.length; b++) {
        var boolProp = booleanProps[b];
        var value = boolCombo[boolProp];
        headerParts.push(boolProp + ': ' + (value ? 'True' : 'False'));
      }
      
      var headerText = figma.createText();
      headerText.characters = headerParts.join('\n');
      headerText.fontSize = 11;
      headerText.fontName = { family: "Inter", style: "Semi Bold" };
      headerText.fills = isDark 
        ? [{type: 'SOLID', color: {r: 0.85, g: 0.85, b: 0.85}}]
        : [{type: 'SOLID', color: {r: 0.25, g: 0.25, b: 0.25}}];
      headerText.textAlignHorizontal = 'CENTER';
      
      var headerCell = figma.createFrame();
      headerCell.name = 'Column Header';
      headerCell.fills = [];
      headerCell.layoutMode = 'VERTICAL';
      headerCell.primaryAxisAlignItems = 'CENTER';
      headerCell.counterAxisAlignItems = 'CENTER';
      headerCell.primaryAxisSizingMode = 'AUTO';
      headerCell.counterAxisSizingMode = 'AUTO';
      headerCell.paddingBottom = 12;
      headerCell.appendChild(headerText);
      
      headerRow.appendChild(headerCell);
    }
    
    gridContainer.appendChild(headerRow);
  }

  // Track the maximum width for each column across ALL rows
  var columnMaxWidths = [];
  for (var c = 0; c < booleanComboKeys.length; c++) {
    columnMaxWidths.push(0);
  }

  // Create a row for each primary variant value
  var rowIndex = 0;
  for (var groupKey in groupedCombos) {
    var rowCombos = groupedCombos[groupKey];

    console.log('Row', groupKey, 'has', rowCombos.length, 'combinations:', JSON.stringify(rowCombos));

    // Create row container
    var rowContainer = figma.createFrame();
    rowContainer.name = 'Row: ' + groupKey;
    rowContainer.fills = [];
    rowContainer.layoutMode = 'HORIZONTAL';
    rowContainer.itemSpacing = 20;
    rowContainer.primaryAxisSizingMode = 'AUTO';
    rowContainer.counterAxisSizingMode = 'AUTO';
    rowContainer.clipsContent = false;

    // Add row label
    if (primaryProp) {
      var rowLabel = figma.createText();
      rowLabel.characters = primaryProp + ':\n' + groupKey;
      rowLabel.fontSize = 11;
      rowLabel.fontName = { family: "Inter", style: "Semi Bold" };
      rowLabel.fills = isDark
        ? [{type: 'SOLID', color: {r: 0.85, g: 0.85, b: 0.85}}]
        : [{type: 'SOLID', color: {r: 0.25, g: 0.25, b: 0.25}}];
      rowLabel.textAlignHorizontal = 'RIGHT';
      rowLabel.textAlignVertical = 'CENTER';

      var rowLabelContainer = figma.createFrame();
      rowLabelContainer.name = 'Row Label';
      rowLabelContainer.fills = [];
      rowLabelContainer.layoutMode = 'VERTICAL';
      rowLabelContainer.primaryAxisAlignItems = 'CENTER';
      rowLabelContainer.counterAxisAlignItems = 'CENTER';
      rowLabelContainer.primaryAxisSizingMode = 'FIXED';
      rowLabelContainer.resize(120, 10);
      rowLabelContainer.primaryAxisSizingMode = 'AUTO';
      rowLabelContainer.counterAxisSizingMode = 'FIXED';
      rowLabelContainer.paddingRight = 16;
      rowLabelContainer.appendChild(rowLabel);

      rowContainer.appendChild(rowLabelContainer);
    }

    // Track seen property combinations to detect duplicates
    var seenCombinations = {};

    // Create a map of boolean combo -> full combo for this row
    var rowComboMap = {};
    for (var i = 0; i < rowCombos.length; i++) {
      var combo = rowCombos[i];
      
      // Extract boolean properties from this combo
      var boolCombo = {};
      for (var b = 0; b < booleanProps.length; b++) {
        var boolProp = booleanProps[b];
        if (combo.hasOwnProperty(boolProp)) {
          boolCombo[boolProp] = combo[boolProp];
        }
      }
      
      var boolKey = JSON.stringify(boolCombo);
      rowComboMap[boolKey] = combo;
    }

    // Create variants in correct column order
    // Iterate through the global column structure
    for (var colIndex = 0; colIndex < booleanComboKeys.length; colIndex++) {
      var boolKey = booleanComboKeys[colIndex];
      var combo = rowComboMap[boolKey];
      
      // If this row doesn't have a combination for this column, add a spacer
      if (!combo) {
        console.log('Row', groupKey, '- adding spacer for column', colIndex);
        var spacerFrame = figma.createFrame();
        spacerFrame.name = 'Empty Column';
        spacerFrame.fills = [];
        
        // Spacer will be resized in second pass
        spacerFrame.resize(1, 1);
        
        rowContainer.appendChild(spacerFrame);
        continue;
      }
      
      console.log('Row', groupKey, 'column', colIndex, '- processing combination:', JSON.stringify(combo));

      var baseVariant = compSet.children[0];
      
      if (!baseVariant) {
        console.log('Skipping - no base variant found');
        continue;
      }

      // Create instance from the base variant
      var instance = baseVariant.createInstance();

      // Set all the component properties on the instance
      try {
        var propertiesToSet = {};

        for (var propName in combo) {
          var propValue = combo[propName];

          // Find the property definition to get the proper key
          var propDefs = compSet.componentPropertyDefinitions;
          var propKey = null;

          for (var key in propDefs) {
            if (key.split('#')[0] === propName) {
              propKey = key;
              break;
            }
          }

          if (propKey) {
            propertiesToSet[propKey] = propValue;
          }
        }

        // Set all properties at once
        if (Object.keys(propertiesToSet).length > 0) {
          console.log('Setting properties on instance:', JSON.stringify(propertiesToSet));
          instance.setProperties(propertiesToSet);
          console.log('Properties set successfully');
        } else {
          console.log('Warning: No properties to set!');
        }
      } catch (error) {
        console.log('Error setting properties:', error.message);
      }

      // Check what properties were actually applied to detect duplicates
      var actualProps = {};
      var instanceProps = instance.componentProperties || {};

      for (var propKey in instanceProps) {
        var propName = propKey.split('#')[0];
        actualProps[propName] = instanceProps[propKey];
      }

      // Create a signature of the actual properties
      var propSignature = JSON.stringify(actualProps);

      console.log('Requested combo:', JSON.stringify(combo));
      console.log('Actual instance props after setting:', propSignature);

      // Check if we've already rendered this exact combination
      if (seenCombinations[propSignature]) {
        console.log('⚠️  DUPLICATE DETECTED - Skipping this instance');
        instance.remove();
        continue;
      }

      // Mark this combination as seen
      seenCombinations[propSignature] = true;
      console.log('✓ Unique combination - rendering');

      // Create variant card
      var variantCard = figma.createFrame();
      variantCard.name = 'Variant';
      variantCard.fills = [];
      variantCard.layoutMode = 'VERTICAL';
      variantCard.itemSpacing = 10;
      variantCard.primaryAxisSizingMode = 'AUTO';
      variantCard.counterAxisSizingMode = 'AUTO';
      variantCard.clipsContent = false;

      // Instance container
      var instanceContainer = figma.createFrame();
      instanceContainer.fills = [];
      instanceContainer.appendChild(instance);
      instanceContainer.resize(instance.width, instance.height);
      instanceContainer.clipsContent = false;

      variantCard.appendChild(instanceContainer);

      // Individual labels only needed if there are properties beyond primary + booleans
      var otherProps = [];
      for (var propName in combo) {
        var isBoolean = booleanProps.indexOf(propName) !== -1;
        var isPrimary = propName === primaryProp;
        
        if (!isBoolean && !isPrimary) {
          otherProps.push(propName);
        }
      }
      
      if (otherProps.length > 0) {
        var labelParts = [];
        for (var o = 0; o < otherProps.length; o++) {
          var propName = otherProps[o];
          var value = combo[propName];
          if (typeof value === 'boolean') {
            value = value ? 'True' : 'False';
          }
          labelParts.push(propName + ': ' + value);
        }
        
        var label = figma.createText();
        label.characters = labelParts.join('\n');
        label.fontSize = 10;
        label.fontName = { family: "Inter", style: "Medium" };
        label.fills = isDark 
          ? [{type: 'SOLID', color: {r: 0.65, g: 0.65, b: 0.65}}]
          : [{type: 'SOLID', color: {r: 0.45, g: 0.45, b: 0.45}}];
        label.textAlignHorizontal = 'CENTER';
        variantCard.appendChild(label);
      }

      rowContainer.appendChild(variantCard);
      
      // Track maximum width for this column
      if (variantCard.width > columnMaxWidths[colIndex]) {
        columnMaxWidths[colIndex] = variantCard.width;
      }
    }
    
    gridContainer.appendChild(rowContainer);
    rowIndex++;
  }
  
  console.log('Column max widths:', columnMaxWidths);
  
  // Second pass: Set all variant cards and spacers to their column's max width
  var startIndex = booleanComboKeys.length > 0 ? 1 : 0; // Skip header row if it exists
  
  for (var r = startIndex; r < gridContainer.children.length; r++) {
    var rowNode = gridContainer.children[r];
    
    // Skip the row label (first child), then process each column
    for (var c = 1; c < rowNode.children.length; c++) {
      var colIndex = c - 1;
      var cellNode = rowNode.children[c];
      var maxWidth = columnMaxWidths[colIndex];
      
      if (maxWidth > 0) {
        if (cellNode.name === 'Empty Column') {
          // Resize spacer to match column width
          cellNode.resize(maxWidth, 1);
        } else if (cellNode.name === 'Variant') {
          // Set variant card to fixed width to match column
          cellNode.primaryAxisSizingMode = 'FIXED';
          cellNode.resize(maxWidth, cellNode.height);
        }
      }
    }
  }
  
  // Fix header widths if headers exist
  if (booleanComboKeys.length > 0 && gridContainer.children.length > 0) {
    var headerRowNode = gridContainer.children[0];
    if (headerRowNode.name === 'Column Headers') {
      // Skip the spacer (first child), then set widths for column headers
      for (var h = 1; h < headerRowNode.children.length; h++) {
        var headerCell = headerRowNode.children[h];
        var colIndex = h - 1;
        var maxWidth = columnMaxWidths[colIndex];
        if (maxWidth > 0) {
          headerCell.resize(maxWidth, headerCell.height);
        }
      }
    }
  }

  return gridContainer;
}

// Initialize on load
init();
