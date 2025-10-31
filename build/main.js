var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/@create-figma-plugin/utilities/lib/events.js
function on(name, handler) {
  const id = `${currentId}`;
  currentId += 1;
  eventHandlers[id] = { handler, name };
  return function() {
    delete eventHandlers[id];
  };
}
function invokeEventHandler(name, args) {
  let invoked = false;
  for (const id in eventHandlers) {
    if (eventHandlers[id].name === name) {
      eventHandlers[id].handler.apply(null, args);
      invoked = true;
    }
  }
  if (invoked === false) {
    throw new Error(`No event handler with name \`${name}\``);
  }
}
var eventHandlers, currentId, emit;
var init_events = __esm({
  "node_modules/@create-figma-plugin/utilities/lib/events.js"() {
    eventHandlers = {};
    currentId = 0;
    emit = typeof window === "undefined" ? function(name, ...args) {
      figma.ui.postMessage([name, ...args]);
    } : function(name, ...args) {
      window.parent.postMessage({
        pluginMessage: [name, ...args]
      }, "*");
    };
    if (typeof window === "undefined") {
      figma.ui.onmessage = function(args) {
        if (!Array.isArray(args)) {
          return;
        }
        const [name, ...rest] = args;
        if (typeof name !== "string") {
          return;
        }
        invokeEventHandler(name, rest);
      };
    } else {
      window.onmessage = function(event) {
        if (typeof event.data.pluginMessage === "undefined") {
          return;
        }
        const args = event.data.pluginMessage;
        if (!Array.isArray(args)) {
          return;
        }
        const [name, ...rest] = event.data.pluginMessage;
        if (typeof name !== "string") {
          return;
        }
        invokeEventHandler(name, rest);
      };
    }
  }
});

// node_modules/@create-figma-plugin/utilities/lib/ui.js
function showUI(options, data) {
  if (typeof __html__ === "undefined") {
    throw new Error("No UI defined");
  }
  const html = `<div id="create-figma-plugin"></div><script>document.body.classList.add('theme-${figma.editorType}');const __FIGMA_COMMAND__='${typeof figma.command === "undefined" ? "" : figma.command}';const __SHOW_UI_DATA__=${JSON.stringify(typeof data === "undefined" ? {} : data)};${__html__}</script>`;
  figma.showUI(html, __spreadProps(__spreadValues({}, options), {
    themeColors: typeof options.themeColors === "undefined" ? true : options.themeColors
  }));
}
var init_ui = __esm({
  "node_modules/@create-figma-plugin/utilities/lib/ui.js"() {
  }
});

// node_modules/@create-figma-plugin/utilities/lib/index.js
var init_lib = __esm({
  "node_modules/@create-figma-plugin/utilities/lib/index.js"() {
    init_events();
    init_ui();
  }
});

// src/constants.ts
var UI_CONFIG, SPACING, FONTS, FONT_SIZES, COLORS, THEME_COLORS, BORDER_RADIUS, FRAME_DIMENSIONS, TIMING, EXPORT_SCALE;
var init_constants = __esm({
  "src/constants.ts"() {
    "use strict";
    UI_CONFIG = {
      HEIGHT: 840,
      WIDTH: 600
    };
    SPACING = {
      LARGE: 32,
      MEDIUM: 24,
      NORMAL: 16,
      SMALL: 12,
      TINY: 8
    };
    FONTS = {
      SEMI_BOLD: { family: "Inter", style: "Semi Bold" },
      MEDIUM: { family: "Inter", style: "Medium" },
      REGULAR: { family: "Inter", style: "Regular" }
    };
    FONT_SIZES = {
      LARGE: 18,
      MEDIUM: 14,
      SMALL: 11,
      TINY: 10
    };
    COLORS = {
      LIGHT_BG: { r: 0.98, g: 0.98, b: 0.98 },
      DARK_BG: { r: 0.18, g: 0.18, b: 0.18 },
      WHITE: { r: 1, g: 1, b: 1 },
      TEXT_DARK: { r: 0.2, g: 0.2, b: 0.2 },
      TEXT_MEDIUM_DARK: { r: 0.3, g: 0.3, b: 0.3 },
      TEXT_LIGHT: { r: 0.5, g: 0.5, b: 0.5 },
      TEXT_LIGHTER: { r: 0.6, g: 0.6, b: 0.6 },
      TEXT_LIGHTEST: { r: 0.8, g: 0.8, b: 0.8 }
    };
    THEME_COLORS = {
      light: {
        primary: COLORS.TEXT_DARK,
        secondary: COLORS.TEXT_MEDIUM_DARK,
        tertiary: COLORS.TEXT_LIGHT,
        bg: COLORS.WHITE,
        surface: COLORS.WHITE
      },
      dark: {
        primary: COLORS.WHITE,
        secondary: COLORS.TEXT_LIGHTEST,
        tertiary: COLORS.TEXT_LIGHTER,
        bg: COLORS.DARK_BG,
        surface: COLORS.DARK_BG
      }
    };
    BORDER_RADIUS = {
      SMALL: 8
    };
    FRAME_DIMENSIONS = {
      ROW_LABEL_WIDTH: 100,
      ROW_LABEL_WIDTH_LARGE: 120,
      SPACER_HEIGHT: 1
    };
    TIMING = {
      SELECTION_DELAY_MS: 50,
      PREVIEW_DELAY_MS: 100
    };
    EXPORT_SCALE = {
      THUMBNAIL: 0.5
    };
  }
});

// src/utils.ts
function parseBooleanString(value) {
  const strValue = String(value).toLowerCase();
  if (strValue === "true") return true;
  if (strValue === "false") return false;
  return value;
}
function isBooleanString(value) {
  const strValue = String(value).toLowerCase();
  return strValue === "true" || strValue === "false";
}
function cleanPropertyName(propertyKey) {
  return propertyKey.split("#")[0];
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function createAutoLayoutFrame(config) {
  var _a, _b;
  const frame = figma.createFrame();
  frame.name = config.name;
  frame.layoutMode = config.layoutMode;
  frame.clipsContent = false;
  frame.primaryAxisSizingMode = (_a = config.primaryAxisSizingMode) != null ? _a : "AUTO";
  frame.counterAxisSizingMode = (_b = config.counterAxisSizingMode) != null ? _b : "AUTO";
  if (config.itemSpacing !== void 0) frame.itemSpacing = config.itemSpacing;
  if (config.paddingTop !== void 0) frame.paddingTop = config.paddingTop;
  if (config.paddingBottom !== void 0) frame.paddingBottom = config.paddingBottom;
  if (config.paddingLeft !== void 0) frame.paddingLeft = config.paddingLeft;
  if (config.paddingRight !== void 0) frame.paddingRight = config.paddingRight;
  if (config.fills !== void 0) frame.fills = config.fills;
  if (config.cornerRadius !== void 0) frame.cornerRadius = config.cornerRadius;
  if (config.primaryAxisAlignItems !== void 0) frame.primaryAxisAlignItems = config.primaryAxisAlignItems;
  if (config.counterAxisAlignItems !== void 0) frame.counterAxisAlignItems = config.counterAxisAlignItems;
  return frame;
}
function createFrame() {
  const frame = figma.createFrame();
  frame.clipsContent = false;
  return frame;
}
async function createStyledText(config) {
  const text = figma.createText();
  await figma.loadFontAsync(config.fontName);
  text.fontName = config.fontName;
  text.fontSize = config.fontSize;
  text.characters = config.characters;
  text.fills = config.fills;
  if (config.textAlignHorizontal !== void 0) {
    text.textAlignHorizontal = config.textAlignHorizontal;
  }
  return text;
}
var init_utils = __esm({
  "src/utils.ts"() {
    "use strict";
  }
});

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => main_default
});
function main_default() {
  showUI({ height: UI_CONFIG.HEIGHT, width: UI_CONFIG.WIDTH });
  on("GENERATE_STICKER_SHEET", async (data) => {
    try {
      console.log("Generating sticker sheet...", data);
      await generateStickerSheet(data);
      figma.notify("Sticker sheet generated successfully!");
    } catch (error) {
      console.error("Error:", error);
      figma.notify("Error generating sticker sheet");
    }
  });
  on("GENERATE_PREVIEWS", async (data) => {
    try {
      console.log("Generating previews for", data.combinations.length, "combinations");
      const previews = await generatePreviews(data.combinations);
      emit("PREVIEWS_READY", previews);
    } catch (error) {
      console.error("Error generating previews:", error);
      emit("PREVIEWS_ERROR", { error: String(error) });
    }
  });
  on("SELECT_COMPONENT_BY_NAME", async (componentName) => {
    try {
      const allNodes = figma.currentPage.findAll(
        (node) => node.type === "COMPONENT_SET" && node.name === componentName
      );
      if (allNodes.length > 0) {
        figma.currentPage.selection = [allNodes[0]];
        figma.viewport.scrollAndZoomIntoView([allNodes[0]]);
        await delay(TIMING.SELECTION_DELAY_MS);
        const componentData = getComponentData();
        emit("INIT_DATA", componentData);
        console.log("Component selected:", componentName);
      } else {
        console.log("No component found with name:", componentName);
      }
    } catch (error) {
      console.error("Error selecting component:", error);
    }
  });
  function getComponentData() {
    let componentSets = [];
    const selection = figma.currentPage.selection;
    if (selection.length > 0) {
      componentSets = selection.filter((node) => node.type === "COMPONENT_SET");
    }
    return componentSets.map((compSet) => {
      const properties = {};
      const propDefs = compSet.componentPropertyDefinitions || {};
      Object.keys(propDefs).forEach((key) => {
        const propName = cleanPropertyName(key);
        const prop = propDefs[key];
        if (!properties[propName]) {
          properties[propName] = {
            type: prop.type,
            values: []
          };
        }
        if (prop.type === "VARIANT" && prop.variantOptions) {
          properties[propName].values = prop.variantOptions;
        } else if (prop.type === "BOOLEAN") {
          properties[propName].values = ["true", "false"];
        }
      });
      const propertyOrder = Object.keys(properties).sort((a, b) => {
        const typeOrder = { "VARIANT": 0, "BOOLEAN": 1, "INSTANCE_SWAP": 2, "TEXT": 3 };
        const aType = properties[a].type;
        const bType = properties[b].type;
        const aOrder = typeOrder[aType] !== void 0 ? typeOrder[aType] : 999;
        const bOrder = typeOrder[bType] !== void 0 ? typeOrder[bType] : 999;
        if (aOrder !== bOrder) return aOrder - bOrder;
        return a.localeCompare(b);
      });
      return {
        id: compSet.id,
        name: compSet.name,
        properties,
        propertyOrder,
        variantCount: compSet.children.length
      };
    });
  }
  const initialData = getComponentData();
  emit("INIT_DATA", initialData);
  figma.on("selectionchange", () => {
    const updatedData = getComponentData();
    emit("INIT_DATA", updatedData);
  });
}
async function generateStickerSheet(data) {
  const { dataSource, selectedCombinations, includeLightDark, anovaComponentName, layoutConfig } = data;
  if (selectedCombinations.length === 0) {
    figma.notify("No combinations selected");
    return;
  }
  const mainFrame = createAutoLayoutFrame({
    name: "Sticker Sheet",
    layoutMode: "VERTICAL",
    itemSpacing: SPACING.LARGE,
    paddingTop: SPACING.LARGE,
    paddingBottom: SPACING.LARGE,
    paddingLeft: SPACING.LARGE,
    paddingRight: SPACING.LARGE,
    fills: [{ type: "SOLID", color: COLORS.LIGHT_BG }],
    cornerRadius: BORDER_RADIUS.SMALL
  });
  const groupedByComponent = {};
  for (const combo of selectedCombinations) {
    if (!groupedByComponent[combo.componentSetId]) {
      groupedByComponent[combo.componentSetId] = [];
    }
    groupedByComponent[combo.componentSetId].push(combo);
  }
  for (const componentSetId in groupedByComponent) {
    const combos = groupedByComponent[componentSetId];
    let compSet = null;
    let componentName = "";
    if (dataSource === "anova") {
      const selection = figma.currentPage.selection;
      const selectedCompSet = selection.find((node) => node.type === "COMPONENT_SET");
      if (!selectedCompSet) {
        figma.notify("Please select a component set on the canvas to generate from Anova data");
        return;
      }
      compSet = selectedCompSet;
      componentName = anovaComponentName || compSet.name;
    } else {
      compSet = figma.getNodeById(componentSetId);
      if (!compSet) continue;
      componentName = compSet.name;
    }
    if (!compSet) continue;
    const nameText = await createStyledText({
      fontName: FONTS.SEMI_BOLD,
      fontSize: FONT_SIZES.LARGE,
      characters: componentName,
      fills: [{ type: "SOLID", color: COLORS.TEXT_DARK }]
    });
    mainFrame.appendChild(nameText);
    const modesContainer = createAutoLayoutFrame({
      name: "Modes Container",
      layoutMode: "HORIZONTAL",
      itemSpacing: SPACING.LARGE,
      fills: []
    });
    const lightSection = await createModeSection(compSet, combos, false, layoutConfig);
    modesContainer.appendChild(lightSection);
    if (includeLightDark) {
      const darkSection = await createModeSection(compSet, combos, true, layoutConfig);
      modesContainer.appendChild(darkSection);
      const resolvedModes = compSet.resolvedVariableModes;
      for (const collectionId in resolvedModes) {
        try {
          const collection = figma.variables.getVariableCollectionById(collectionId);
          if (collection && collection.name.toLowerCase().includes("semantic")) {
            const darkMode = collection.modes.find((m) => m.name.toLowerCase().includes("dark"));
            if (darkMode) {
              darkSection.setExplicitVariableModeForCollection(collection, darkMode.modeId);
              figma.notify("\u2705 Dark mode applied to " + componentName);
              break;
            }
          }
        } catch (e) {
          console.log("Could not get collection:", collectionId, e);
        }
      }
    }
    mainFrame.appendChild(modesContainer);
  }
  figma.currentPage.selection = [mainFrame];
  figma.viewport.scrollAndZoomIntoView([mainFrame]);
}
function analyzeVaryingProperties(combinations) {
  if (combinations.length === 0) return [];
  const propertyValues = {};
  const propertyTypes = {};
  const firstCombo = combinations[0];
  for (const combo of combinations) {
    for (const propName in combo.properties) {
      if (!propertyValues[propName]) {
        propertyValues[propName] = /* @__PURE__ */ new Set();
      }
      propertyValues[propName].add(combo.properties[propName]);
    }
  }
  const varying = [];
  for (const propName in propertyValues) {
    if (propertyValues[propName].size > 1) {
      const values = Array.from(propertyValues[propName]);
      let type = "OTHER";
      if (values.every((v) => isBooleanString(v))) {
        type = "BOOLEAN";
      } else {
        type = "VARIANT";
      }
      varying.push({
        name: propName,
        values,
        type
      });
    }
  }
  varying.sort((a, b) => {
    if (a.type === "VARIANT" && b.type !== "VARIANT") return -1;
    if (a.type !== "VARIANT" && b.type === "VARIANT") return 1;
    return a.name.localeCompare(b.name);
  });
  return varying;
}
async function createInstance(compSet, properties) {
  const baseComponent = compSet.children[0];
  const instance = baseComponent.createInstance();
  const propDefs = compSet.componentPropertyDefinitions;
  const propNameToKey = {};
  for (const key in propDefs) {
    const cleanName = cleanPropertyName(key);
    propNameToKey[cleanName] = key;
  }
  for (const propName in properties) {
    const propValue = properties[propName];
    const matchingKey = propNameToKey[propName];
    if (matchingKey) {
      try {
        const valueToSet = parseBooleanString(propValue);
        instance.setProperties({ [matchingKey]: valueToSet });
      } catch (e) {
      }
    }
  }
  return instance;
}
async function createModeSection(compSet, combinations, isDark, layoutConfig) {
  const sectionFrame = createAutoLayoutFrame({
    name: isDark ? "Dark Mode" : "Light Mode",
    layoutMode: "VERTICAL",
    itemSpacing: SPACING.NORMAL,
    paddingTop: SPACING.MEDIUM,
    paddingBottom: SPACING.MEDIUM,
    paddingLeft: SPACING.MEDIUM,
    paddingRight: SPACING.MEDIUM,
    cornerRadius: BORDER_RADIUS.SMALL,
    fills: isDark ? [{ type: "SOLID", color: COLORS.DARK_BG }] : [{ type: "SOLID", color: COLORS.WHITE }]
  });
  const modeTitle = await createStyledText({
    fontName: FONTS.MEDIUM,
    fontSize: FONT_SIZES.MEDIUM,
    characters: isDark ? "Dark Mode" : "Light Mode",
    fills: isDark ? [{ type: "SOLID", color: COLORS.WHITE }] : [{ type: "SOLID", color: COLORS.TEXT_DARK }]
  });
  sectionFrame.appendChild(modeTitle);
  const table = await createSimpleTable(compSet, combinations, isDark, layoutConfig);
  sectionFrame.appendChild(table);
  return sectionFrame;
}
async function createSimpleTable(compSet, combinations, isDark, layoutConfig) {
  const tableFrame = createAutoLayoutFrame({
    name: "Table",
    layoutMode: "VERTICAL",
    itemSpacing: SPACING.TINY,
    fills: []
  });
  if (combinations.length === 0) return tableFrame;
  const sampleInstance = await createInstance(compSet, combinations[0].properties);
  const instanceWidth = sampleInstance.width;
  const instanceHeight = sampleInstance.height;
  sampleInstance.remove();
  const allProps = analyzeVaryingProperties(combinations);
  if (allProps.length === 0) {
    const row = createAutoLayoutFrame({
      name: "Row",
      layoutMode: "HORIZONTAL",
      itemSpacing: SPACING.SMALL,
      fills: []
    });
    for (const combo of combinations) {
      const instance = await createInstance(compSet, combo.properties);
      row.appendChild(instance);
    }
    tableFrame.appendChild(row);
    return tableFrame;
  }
  let rowProp;
  let colProps;
  if (layoutConfig && layoutConfig.rowProperty && layoutConfig.columnProperties && layoutConfig.columnProperties.length > 0) {
    rowProp = allProps.find((p) => p.name === layoutConfig.rowProperty);
    colProps = layoutConfig.columnProperties.map((colName) => allProps.find((p) => p.name === colName)).filter((p) => p !== void 0);
    if (!rowProp || colProps.length === 0) {
      rowProp = allProps[0];
      colProps = allProps.slice(1);
    }
  } else {
    rowProp = allProps[0];
    colProps = allProps.slice(1);
  }
  const rowValues = [];
  const seenRows = /* @__PURE__ */ new Set();
  for (const combo of combinations) {
    const rowValue = String(combo.properties[rowProp.name]);
    if (!seenRows.has(rowValue)) {
      seenRows.add(rowValue);
      rowValues.push(rowValue);
    }
  }
  const columnCombos = [];
  const seenCols = /* @__PURE__ */ new Set();
  for (const combo of combinations) {
    const colValues = {};
    for (const p of colProps) {
      colValues[p.name] = combo.properties[p.name];
    }
    const colKey = JSON.stringify(colValues);
    if (!seenCols.has(colKey)) {
      seenCols.add(colKey);
      columnCombos.push(colValues);
    }
  }
  columnCombos.sort((a, b) => {
    for (const p of colProps) {
      const aVal = String(a[p.name]);
      const bVal = String(b[p.name]);
      if (aVal !== bVal) return aVal.localeCompare(bVal);
    }
    return 0;
  });
  const headerRow = createAutoLayoutFrame({
    name: "Header Row",
    layoutMode: "HORIZONTAL",
    itemSpacing: SPACING.SMALL,
    paddingBottom: SPACING.TINY,
    fills: []
  });
  const cornerCell = createFrame();
  cornerCell.resize(FRAME_DIMENSIONS.ROW_LABEL_WIDTH, FRAME_DIMENSIONS.SPACER_HEIGHT);
  cornerCell.fills = [];
  headerRow.appendChild(cornerCell);
  for (let i = 0; i < columnCombos.length; i++) {
    const colCombo = columnCombos[i];
    const headerContainer = createFrame();
    headerContainer.layoutMode = "VERTICAL";
    headerContainer.primaryAxisSizingMode = "FIXED";
    headerContainer.counterAxisSizingMode = "AUTO";
    headerContainer.primaryAxisAlignItems = "CENTER";
    headerContainer.fills = [];
    const headerLines = [];
    if (colProps.length > 0) {
      for (const p of colProps) {
        const value = String(colCombo[p.name]);
        headerLines.push(`${p.name}: (${i + 1}) ${value}`);
      }
    } else {
      headerLines.push(`(${i + 1})`);
    }
    const headerText = await createStyledText({
      fontName: FONTS.SEMI_BOLD,
      fontSize: FONT_SIZES.TINY,
      characters: headerLines.join("\n"),
      fills: isDark ? [{ type: "SOLID", color: COLORS.TEXT_LIGHTER }] : [{ type: "SOLID", color: COLORS.TEXT_LIGHT }],
      textAlignHorizontal: "CENTER"
    });
    headerContainer.appendChild(headerText);
    headerContainer.resize(Math.max(instanceWidth, headerText.width + SPACING.TINY), headerText.height + SPACING.TINY);
    headerRow.appendChild(headerContainer);
  }
  tableFrame.appendChild(headerRow);
  for (const rowValue of rowValues) {
    const dataRow = createAutoLayoutFrame({
      name: `Row: ${rowValue}`,
      layoutMode: "HORIZONTAL",
      itemSpacing: SPACING.SMALL,
      fills: []
    });
    const rowLabelContainer = createFrame();
    rowLabelContainer.resize(FRAME_DIMENSIONS.ROW_LABEL_WIDTH, instanceHeight);
    rowLabelContainer.layoutMode = "VERTICAL";
    rowLabelContainer.primaryAxisAlignItems = "CENTER";
    rowLabelContainer.counterAxisAlignItems = "CENTER";
    rowLabelContainer.fills = [];
    const rowLabel = await createStyledText({
      fontName: FONTS.REGULAR,
      fontSize: FONT_SIZES.SMALL,
      characters: `${rowProp.name}:
${rowValue}`,
      fills: isDark ? [{ type: "SOLID", color: COLORS.TEXT_LIGHTEST }] : [{ type: "SOLID", color: COLORS.TEXT_MEDIUM_DARK }],
      textAlignHorizontal: "CENTER"
    });
    rowLabelContainer.appendChild(rowLabel);
    dataRow.appendChild(rowLabelContainer);
    for (const colCombo of columnCombos) {
      const matchingCombo = combinations.find((c) => {
        if (String(c.properties[rowProp.name]) !== rowValue) return false;
        for (const p of colProps) {
          if (String(c.properties[p.name]) !== String(colCombo[p.name])) return false;
        }
        return true;
      });
      if (matchingCombo) {
        const instanceContainer = createFrame();
        instanceContainer.resize(instanceWidth, instanceHeight);
        instanceContainer.layoutMode = "VERTICAL";
        instanceContainer.primaryAxisAlignItems = "CENTER";
        instanceContainer.counterAxisAlignItems = "CENTER";
        instanceContainer.fills = [];
        const instance = await createInstance(compSet, matchingCombo.properties);
        instanceContainer.appendChild(instance);
        dataRow.appendChild(instanceContainer);
      } else {
        const emptyCell = createFrame();
        emptyCell.resize(instanceWidth, instanceHeight);
        emptyCell.fills = [];
        dataRow.appendChild(emptyCell);
      }
    }
    tableFrame.appendChild(dataRow);
  }
  return tableFrame;
}
async function generatePreviews(combinations) {
  const selection = figma.currentPage.selection;
  console.log("Current selection:", selection.length, "nodes");
  const compSet = selection.find((node) => node.type === "COMPONENT_SET");
  if (!compSet) {
    console.error("No component set in selection. Selection:", selection.map((n) => ({ type: n.type, name: n.name })));
    throw new Error("No component set selected");
  }
  console.log("Using component set:", compSet.name);
  const previews = {};
  for (const combo of combinations) {
    try {
      const instance = await createInstance(compSet, combo.properties);
      const imageData = await instance.exportAsync({
        format: "PNG",
        constraint: { type: "SCALE", value: EXPORT_SCALE.THUMBNAIL }
      });
      const base64 = figma.base64Encode(imageData);
      previews[combo.variantName] = base64;
      instance.remove();
    } catch (error) {
      console.error("Error generating preview for", combo.variantName, error);
    }
  }
  console.log("Generated", Object.keys(previews).length, "previews out of", combinations.length, "combinations");
  return previews;
}
var init_main = __esm({
  "src/main.ts"() {
    "use strict";
    init_lib();
    init_constants();
    init_utils();
  }
});

// <stdin>
var modules = { "src/main.ts--default": (init_main(), __toCommonJS(main_exports))["default"] };
var commandId = true ? "src/main.ts--default" : figma.command;
modules[commandId]();
