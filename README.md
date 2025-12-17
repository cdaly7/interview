# Word Autocomplete Application

A beautiful, interactive autocomplete UI built with Next.js and TypeScript that performs word lookups against a dictionary API.

## Features

- **Real-time Autocomplete**: As you type, the app fetches matching words from the API with a 200ms debounce for optimal performance
- **Keyboard Navigation**: 
  - Use arrow keys (↑/↓) to navigate through results
  - Press Enter to select a highlighted result
  - Press Escape to close the dropdown
- **Mouse Support**: Hover over results to highlight, click to select
- **Loading State**: Visual spinner while fetching results
- **Smart Dropdown**: Closes when clicking outside the search area
- **Frequency Display**: Shows the frequency/popularity of each word
- **Responsive Design**: Works beautifully on all screen sizes

## How It Works

1. User types in the search input
2. Query is debounced to avoid excessive API calls
3. Component fetches up to 8 matching words from the autocomplete API
4. Results display in a dropdown below the input
5. User can navigate and select results using keyboard or mouse
6. Selected words are logged to the browser console

## Technical Implementation

### API Integration
- **Endpoint**: `https://autocomplete-lyart.vercel.app/api/words`
- **Query Params**: 
  - `query`: Search string
  - `limit`: Maximum results (set to 8)

### Technologies Used
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Hooks**: React hooks for state management and side effects

### Key Implementation Details
- **Debouncing**: 200ms delay to batch rapid input changes
- **Keyboard Handling**: Full support for arrow keys, Enter, and Escape
- **Click Outside Detection**: Automatically closes dropdown when clicking outside
- **Loading State**: Spinner animation during API requests
- **Error Handling**: Graceful handling of failed API requests

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

## Project Structure

```
.
├── app/
│   ├── page.tsx          # Main autocomplete component
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── tailwind.config.ts    # Tailwind CSS configuration
```

## User Experience Enhancements

- **Visual Feedback**: Color-coded results with smooth transitions
- **Accessibility**: Semantic HTML and keyboard-first design
- **Performance**: Debounced API calls reduce server load
- **Empty State**: Helpful message when no results are found
- **Tips Section**: Onscreen guidance for keyboard shortcuts

## Development Notes

- The component is a client-side component (`'use client'`) to enable interactive React features
- No external autocomplete libraries used to showcase custom implementation
- All state management handled with React hooks
- Console logging for selected results enables easy verification and debugging
