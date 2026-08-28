# Scheme Filtering & Assistant Module

A self-contained, integration-ready frontend module designed to help citizens filter, search, and discover eligible government schemes, coupled with a floating conversational AI Chatbot Assistant.

This module is built using **Vanilla HTML, CSS, and JavaScript**, ensuring it can be easily copied and integrated into any web application without adding framework dependencies.

---

## Folder Structure

```
scheme-filtering-module/
│
├── index.html                  # Demonstration sandbox page
├── css/
│   └── scheme-filter.css       # Scoped styling (namespaced under .scheme-filter-module)
│
├── js/
│   ├── scheme-filter.js        # Core states, filters & eligibility calculations
│   ├── scheme-results.js       # Card layout rendering, pagination, and details modal
│   └── chatbot.js              # Floating chatbot trigger & conversation assistant
│
└── data/
    └── schemes_data.js         # JavaScript serialized representation of the scheme database
```

---

## Integration Guide

### 1. Import Files
Load the module's stylesheet in your document `<head>` and the script components at the bottom of the `<body>`:

```html
<!-- Stylesheet -->
<link rel="stylesheet" href="path/to/css/scheme-filter.css">

<!-- Scheme Dataset -->
<script src="path/to/data/schemes_data.js"></script>

<!-- Module Components -->
<script src="path/to/js/scheme-results.js"></script>
<script src="path/to/js/chatbot.js"></script>
<script src="path/to/js/scheme-filter.js"></script>
```

### 2. Embed Container HTML
Add a container div to your parent layout where you want the filtering and listing elements to appear. The module's CSS is scoped under `.scheme-filter-module`, which will be rendered dynamically inside this element:

```html
<!-- The module will render dynamically inside this element -->
<div id="scheme-filter-container"></div>
```

### 3. Initialize the Module
Call the initialization function `window.initializeSchemeModule(options)` when the DOM is ready:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const schemeModule = window.initializeSchemeModule({
    // Selector or DOM node
    container: '#scheme-filter-container',
    
    // Dataset array containing scheme records
    dataset: window.SCHEMES_DATA || [],
    
    // Initial profile configuration
    profile: {
      age: 22,
      state: 'Tamil Nadu',
      gender: 'Female',
      occupation: 'Student',
      income: 150000,
      disability: false
    },
    
    // Callback: triggered whenever filters change
    onFilterChange: (data) => {
      console.log(`Showing ${data.count} filtered records.`, data.filters);
    },
    
    // Callback: triggered when a user selects "View Details" on a card
    onSchemeSelect: (scheme) => {
      console.log('User viewed details for:', scheme.name);
    }
  });
});
```

---

## Developer API Methods

The initialized module instance exposes several public methods that the parent application can call:

### `updateProfile(newProfile)`
Updates the active citizen profile data and dynamically re-evaluates scheme eligibility.
```javascript
schemeModule.updateProfile({
  age: 65,
  occupation: 'Senior Citizen',
  income: 80000
});
```

### `updateDataset(newDataset)`
Replaces the active scheme dataset.
```javascript
schemeModule.updateDataset(freshDataArray);
```

### `setFilters(filterUpdates)`
Programmatically updates one or more filters (e.g. category, search, sorting) and updates the UI controls.
```javascript
schemeModule.setFilters({
  searchQuery: 'scholarship',
  sortBy: 'personalized'
});
```

### `getFilteredResults()`
Returns the list of schemes currently matching the filter criteria.
```javascript
const activeList = schemeModule.getFilteredResults();
```

---

## Chatbot Integration Hook

By default, the floating chatbot uses a local heuristic matcher to answer questions. Another developer can connect a real conversational AI backend or LLM API using the `registerMessageSender` hook:

```javascript
schemeModule.chatbot.registerMessageSender(async (userInput, context) => {
  // context will contain:
  // - context.profile (the current active profile object)
  // - context.activeFilters (active filters state)
  // - context.visibleSchemes (schemes currently shown in the grid)
  
  // Make a network request to your LLM / Chatbot endpoint
  const response = await fetch('https://your-api.gov/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: userInput,
      citizenProfile: context.profile,
      schemesList: context.visibleSchemes.map(s => s.name)
    })
  });
  
  const result = await response.json();
  return result.textResponse; // Must return a string
});
```

---

## Required Scheme Dataset Schema
The scheme objects passed in the `dataset` array should match the following format:
```json
{
  "id": 1,
  "name": "Scheme Title",
  "details": "Full description details of the scheme.",
  "benefits": "Key benefits and financial aid provided.",
  "eligibility": "Eligibility criteria explanation text.",
  "application": "Instructions on how to apply.",
  "documents": "Required verification documents list.",
  "level": "Central" or "State",
  "category": "Education & Learning",
  "tags": ["Scholarship", "Financial Assistance"]
}
```
