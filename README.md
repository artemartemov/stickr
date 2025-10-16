# Stickr

A Figma plugin to organize component variants and generate sticker sheets.

## Features

- **Component Variant Organization**: Browse and organize all component sets in your Figma file
- **Property Inspector**: View and analyze component properties including variants, booleans, instance swaps, and text properties
- **Sortable Tables**: Click column headers to sort by property name or type
- **Collapsible Sections**: Expand/collapse individual component sets for focused viewing
- **Selection Integration**: Select components in your Figma canvas by clicking table rows
- **Type Indicators**: Visual badges showing property types (Variant, Boolean, Instance Swap, Text)

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Figma desktop app

### Installation

1. Clone the repository:
```bash
git clone https://github.com/artemartemov/stickr.git
cd stickr
```

2. Install dependencies:
```bash
npm install
```

3. Build the plugin:
```bash
npm run build
```

4. Load the plugin in Figma:
   - Open Figma desktop app
   - Go to Plugins → Development → Import plugin from manifest...
   - Select the `manifest.json` file from this project

## Development

### Watch Mode

Run the plugin in watch mode for development with hot reload:

```bash
npm run watch
```

This will automatically rebuild the plugin when you make changes to the source files.

### Project Structure

```
stickr/
├── src/
│   ├── main.ts          # Backend plugin logic (Figma API)
│   └── ui.tsx           # Frontend UI component (Preact)
├── build/               # Compiled output
├── manifest.json        # Plugin manifest
└── package.json         # Project configuration
```

### Tech Stack

- **Framework**: [@create-figma-plugin](https://github.com/yuanqing/create-figma-plugin)
- **UI Library**: Preact
- **Language**: TypeScript
- **Figma API**: Official Figma Plugin API

## Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**

2. **Create a feature branch**:
```bash
git checkout -b feature/your-feature-name
```

3. **Make your changes** and test thoroughly

4. **Commit your changes**:
```bash
git commit -m "Add your feature description"
```

5. **Push to your fork**:
```bash
git push origin feature/your-feature-name
```

6. **Open a Pull Request** with a clear description of your changes

### Guidelines

- Write clear, descriptive commit messages
- Test your changes in the Figma desktop app
- Follow the existing code style and structure
- Update documentation if you're adding new features

## License

MIT License - see LICENSE file for details

## Author

Artem Artemov
