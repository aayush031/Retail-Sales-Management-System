# System Architecture Documentation

## Backend Architecture

The backend implements a **layered architecture** following MVC principles with an additional service abstraction layer.

**Entry Point:** `src/index.js` - Initializes the Express application, establishes MongoDB connection, configures middleware (CORS, JSON parsing), and registers route handlers.

**Architectural Layers:**
- **Routes** (`routes/`) - API endpoint definitions that delegate to controller methods
- **Controllers** (`controllers/`) - Process HTTP requests, extract parameters, invoke services, format responses
- **Services** (`services/`) - Contains business logic, constructs database queries, performs data transformations
- **Models** (`models/`) - Mongoose schema definitions that map to database collections
- **Utils** (`utils/`) - Utility scripts for data operations (CSV import, data validation)

**Technical Stack:**
- Express.js server running on port 5000
- MongoDB database named `retail_sales`
- REST API endpoints prefixed with `/api/sales`
- CORS middleware configured for cross-origin requests

## Frontend Architecture

The frontend is built using **React's component-based design pattern**.

**Entry Point:** `src/main.jsx` - Bootstraps the React application, configures routing, and loads Tailwind CSS styles.

**Project Organization:**
- **Components** (`components/`) - Modular UI components (App, Sidebar, Table, Filters, etc.)
- **Services** (`services/`) - HTTP client functions that communicate with the backend API
- **Styles** (`styles/`) - Tailwind CSS setup and custom styling
- **Utils** (`utils/`) - Shared utility functions

**State Management Approach:** Uses React's built-in hooks (useState, useEffect) for component-level state. The main App component centralizes application state including search terms, filter selections, sorting preferences, and pagination.

**Development Environment:** Vite serves as the build tool and development server for rapid iteration and efficient production bundling.

## Data Flow Architecture

1. **User Interaction** → User performs action in frontend component (search, apply filter, change sort)
2. **State Mutation** → React state is updated in the App component
3. **Service Invocation** → Frontend service module constructs query parameters
4. **Network Request** → Axios HTTP client sends GET request to `/api/sales` endpoint with parameters
5. **Route Processing** → Express router matches the request to appropriate handler
6. **Controller Execution** → Controller extracts and validates query parameters, invokes service layer
7. **Service Logic** → Service constructs MongoDB query object and executes database operations
8. **Data Retrieval** → MongoDB returns filtered, sorted, and paginated document set
9. **Response Transmission** → JSON payload flows back through controller → route → HTTP response
10. **UI Re-render** → React components update to reflect new data

**Filter Options Retrieval Process:**
- Frontend makes request to `/api/sales/filter-options` endpoint
- Backend service queries MongoDB using distinct() aggregation
- Response contains unique values for each filterable field
- Frontend components populate filter dropdowns with available options

## Folder Structure

```
Retail Sales Management System/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── salesController.js      # Request handlers
│   │   ├── services/
│   │   │   └── salesService.js        # Business logic & DB queries
│   │   ├── models/
│   │   │   └── Sales.js                # Mongoose schema
│   │   ├── routes/
│   │   │   └── salesRoutes.js         # API route definitions
│   │   ├── utils/
│   │   │   ├── importData.js           # CSV import script
│   │   │   └── checkData.js            # Data verification script
│   │   └── index.js                    # Server entry point
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── App.jsx                 # Main app component
│   │   │   ├── Sidebar.jsx             # Navigation sidebar
│   │   │   ├── SearchBar.jsx           # Search input
│   │   │   ├── FilterPanel.jsx         # Filter controls
│   │   │   ├── MultiSelectDropdown.jsx # Reusable dropdown
│   │   │   ├── SortDropdown.jsx        # Sort selector
│   │   │   ├── SalesTable.jsx          # Data table
│   │   │   ├── SummaryCards.jsx        # Statistics cards
│   │   │   └── Pagination.jsx          # Page navigation
│   │   ├── services/
│   │   │   ├── salesService.js         # Sales API calls
│   │   │   └── filterService.js        # Filter options API
│   │   ├── styles/
│   │   │   └── tailwind.css            # Tailwind imports
│   │   └── main.jsx                    # App entry point
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── docs/
│   └── architecture.md                 # This file
│
└── README.md                           # Project overview
```

## Module Responsibilities

### Backend Modules

**index.js**
- Starts Express server
- Connects to MongoDB
- Sets up middleware (CORS, JSON parser)
- Registers routes

**salesController.js**
- Handles `/api/sales` GET requests
- Parses query parameters (search, filters, sort, pagination)
- Calls salesService
- Returns JSON responses
- Handles errors

**salesService.js**
- Builds MongoDB queries from parameters
- Executes database operations (find, count)
- Implements search, filter, sort, pagination logic
- Returns data to controller
- Provides filter options (unique values)

**Sales.js (Model)**
- Defines Mongoose schema for sales data
- Maps CSV columns to database fields
- Validates data types

**salesRoutes.js**
- Defines API endpoints
- Maps routes to controller methods
- `/api/sales` → getSales
- `/api/sales/filter-options` → getFilterOptions

**importData.js**
- Reads CSV file
- Parses and transforms data
- Batch inserts into MongoDB
- Shows progress

### Frontend Modules

**App.jsx**
- Main application component
- Manages global state (search, filters, sort, page, sales data)
- Fetches data from API on state changes
- Renders layout (Sidebar + Main content)
- Coordinates all child components

**Sidebar.jsx**
- Navigation menu
- User info display
- Static UI component

**SearchBar.jsx**
- Search input field
- Handles user input
- Triggers search on Enter key

**FilterPanel.jsx**
- Multi-select filter dropdowns
- Age and date range inputs
- Fetches filter options from API
- Updates filter state
- Refresh button to clear filters

**MultiSelectDropdown.jsx**
- Reusable dropdown component
- Shows selected count
- Checkbox-based selection
- Click outside to close

**SalesTable.jsx**
- Displays sales data in table format
- Shows Transaction ID, Date, Customer info, Product, Quantity
- Handles empty state

**SummaryCards.jsx**
- Calculates statistics (total units, amount, discount)
- Displays summary cards
- Updates based on current sales data

**Pagination.jsx**
- Shows page numbers
- Previous/Next buttons
- Highlights active page
- Disables buttons at boundaries

**salesService.js**
- Makes API calls to `/api/sales`
- Builds query string from parameters
- Returns sales data

**filterService.js**
- Fetches unique filter options
- Calls `/api/sales/filter-options`
- Returns filter dropdown values

