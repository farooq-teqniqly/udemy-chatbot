# Settings Management Architecture Decision Record (ADR)

## Overview

This document serves as an Architecture Decision Record (ADR) for the settings management system and a developer reference guide for adding new settings. The application uses Zustand for centralized state management with custom hooks, runtime validation, and automatic persistence.

## Architecture Decision

**Decision**: Use Zustand with custom hooks pattern for settings management  
**Status**: Implemented  
**Date**: 2025-09-25  
**Deciders**: Development Team

## Context

The application required a scalable settings management system that could:

- Eliminate prop drilling between components
- Provide automatic persistence across sessions
- Support runtime validation of setting keys
- Enable easy addition of new settings without refactoring existing code
- Maintain type safety and performance optimization

## Decision Drivers

- **Scalability**: Need to add new settings without touching multiple files
- **Developer Experience**: Clean, intuitive API for accessing and updating settings
- **Performance**: Selective subscriptions to prevent unnecessary re-renders
- **Maintainability**: Centralized state management with validation
- **User Experience**: Automatic persistence and consistent behavior

## Considered Options

1. **React Context + useReducer**: Built-in React solution
2. **Redux Toolkit**: Full-featured state management
3. **Zustand**: Lightweight state management with hooks
4. **Jotai**: Atomic state management

## Decision Outcome

**Chosen Option**: Zustand with custom hooks pattern

### Rationale

- **Minimal boilerplate**: Less code than Redux, more powerful than Context
- **Excellent TypeScript support**: Built-in type inference and safety
- **Automatic persistence**: Built-in middleware for localStorage
- **Performance**: Selective subscriptions prevent unnecessary re-renders
- **Developer-friendly**: Intuitive hooks-based API
- **Bundle size**: Lightweight (~2.5kb gzipped)

## Implementation Architecture

### Benefits

- ✅ **No Prop Drilling**: Components access settings directly from store
- ✅ **Centralized State**: Single source of truth for all settings
- ✅ **Automatic Persistence**: Settings saved to localStorage
- ✅ **Reactive Updates**: Components automatically re-render on changes
- ✅ **Easy to Scale**: Add new settings without touching existing components
- ✅ **Type Safety**: Full TypeScript support (if using TS)
- ✅ **Key Validation**: Runtime validation ensures only valid settings are used
- ✅ **Custom Hooks**: Clean, reusable hooks for each setting type
- ✅ **Performance Optimized**: Selective subscriptions prevent unnecessary re-renders

### Key Architectural Features

#### 1. Setting Key Constants

```javascript
export const SETTING_KEYS = {
  USE_WEB_SEARCH: "useWebSearch",
  // Future settings added here
};
```

#### 2. Runtime Validation

```javascript
const ensureKeyExists = (key) => {
  if (!Object.values(SETTING_KEYS).includes(key)) {
    throw new Error(`${key} is not a valid setting.`);
  }
};
```

#### 3. Custom Hooks Pattern

```javascript
export const useWebSearchTool = () => {
  const value = useSettingsStore(selectUseWebSearch);
  const updateSetting = useSettingsStore((state) => state.updateSetting);

  return [
    value,
    (newValue) => updateSetting(SETTING_KEYS.USE_WEB_SEARCH, newValue),
  ];
};
```

#### 4. Optimized Selectors

```javascript
const selectUseWebSearch = (state) => state[SETTING_KEYS.USE_WEB_SEARCH];
```

## Installation

```bash
npm install zustand
```

## Implementation Guide

### Step 1: Create Settings Store

Create `src/stores/settingsStore.js`:

```javascript
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const SETTING_KEYS = {
  USE_WEB_SEARCH: "useWebSearch",
};

const getDefaultSettings = () => {
  return {
    [SETTING_KEYS.USE_WEB_SEARCH]: false,
  };
};

const ensureKeyExists = (key) => {
  if (!Object.values(SETTING_KEYS).includes(key)) {
    const error = `${key} is not a valid setting.`;
    console.error(error);
    throw new Error(error);
  }
};

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      // Initialize with default settings
      ...getDefaultSettings(),

      // Generic action for any setting
      updateSetting: (key, value) => {
        ensureKeyExists(key);

        const currentState = get();

        if (currentState[key] === value) {
          return;
        }

        set({ [key]: value });
      },

      getSetting: (key) => {
        ensureKeyExists(key);
        return get()[key];
      },

      // Reset to defaults
      resetSettings: () => set(getDefaultSettings()),
    }),
    {
      name: "chatbot-settings", // localStorage key
    }
  )
);

const selectUseWebSearch = (state) => state[SETTING_KEYS.USE_WEB_SEARCH];

export const useWebSearchTool = () => {
  const value = useSettingsStore(selectUseWebSearch);
  const updateSetting = useSettingsStore((state) => state.updateSetting);

  return [
    value,
    (newValue) => updateSetting(SETTING_KEYS.USE_WEB_SEARCH, newValue),
  ];
};
```

### Step 2: Update App Component

Update `src/App.jsx`:

```javascript
import { useState } from "react";
import styles from "./App.module.css";
import { Chat } from "./components/Chat/Chat";
import { Controls } from "./components/Controls/Controls";
import { SettingsButton } from "./components/SettingsButton/SettingsButton";
import { SettingsModal } from "./components/SettingsModal/SettingsModal";
import { Assistant } from "./assistants/openAI";
import { Message } from "./assistants/messages";
import { useWebSearchTool, SETTING_KEYS } from "./stores/settingsStore"; // ✅ Import custom hook

function App() {
  const assistant = new Assistant();
  const [messages, setMessages] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // ✅ Use custom hook for web search setting
  const [useWebSearch, setUseWebSearch] = useWebSearchTool();

  function addMessage(message) {
    setMessages((previousMessages) => [...previousMessages, message]);
  }

  async function handleContentSend(content) {
    const message = Message.user(content);
    addMessage(message);

    try {
      // ✅ Use setting directly from custom hook
      const response = await assistant.sendMessage(message, useWebSearch);
      addMessage(Message.assistant(response));
    } catch (error) {
      addMessage(Message.system(content));
      console.log(error);
    }
  }

  function handleSettingsOpen() {
    setIsSettingsOpen(true);
  }

  function handleSettingsClose() {
    setIsSettingsOpen(false);
  }

  return (
    <div className={styles.App}>
      <header className={styles.Header}>
        <img src="/chat-bot.png" alt="AI Chat Bot" className={styles.Logo} />
        <h2 className={styles.Title}>AI Chatbot</h2>
      </header>
      <div className={styles.ChatContainer}>
        <Chat messages={messages}></Chat>
      </div>
      <div className={styles.ControlsContainer}>
        <SettingsButton onClick={handleSettingsOpen} />
        <Controls onSend={handleContentSend}></Controls>
      </div>
      {/* ✅ No more props needed! */}
      <SettingsModal isOpen={isSettingsOpen} onClose={handleSettingsClose} />
    </div>
  );
}

export default App;
```

### Step 3: Update SettingsModal Component

Update `src/components/SettingsModal/SettingsModal.jsx`:

```javascript
import styles from "./SettingsModal.module.css";
import { useWebSearchTool, useSettingsStore } from "../../stores/settingsStore"; // ✅ Import custom hook and store

export function SettingsModal({ isOpen, onClose }) {
  // ✅ Use custom hook for web search setting
  const [useWebSearch, setUseWebSearch] = useWebSearchTool();

  // ✅ Access store methods for reset functionality
  const resetSettings = useSettingsStore((state) => state.resetSettings);

  if (!isOpen) return null;

  return (
    <div className={styles.Backdrop}>
      <div className={styles.Modal}>
        <div className={styles.Header}>
          <h3 className={styles.Title}>Settings</h3>
        </div>
        <div className={styles.Content}>
          {/* Web Search Setting */}
          <label className={styles.CheckboxLabel}>
            <input
              type="checkbox"
              checked={useWebSearch}
              onChange={(e) => setUseWebSearch(e.target.checked)}
              className={styles.Checkbox}
            />
            Use web search tool
          </label>

          {/* Future settings can be added here using similar custom hooks */}
          {/* Example:
          const [darkMode, setDarkMode] = useDarkModeTool();
          const [autoSave, setAutoSave] = useAutoSaveTool();
          */}
        </div>
        <div className={styles.Footer}>
          <button className={styles.ResetButton} onClick={resetSettings}>
            Reset to Defaults
          </button>
          <button className={styles.CloseButton} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Step 4: Update SettingsModal Styles

Add new styles to `src/components/SettingsModal/SettingsModal.module.css`:

```css
/* Existing styles... */

.SliderContainer {
  margin: 16px 0;
}

.SliderLabel {
  display: block;
  font-size: 14px;
  color: #0d0d0d;
  margin-bottom: 8px;
  font-weight: 500;
}

.Slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e5e5e5;
  outline: none;
  cursor: pointer;
}

.Slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #0d0d0d;
  cursor: pointer;
}

.Slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #0d0d0d;
  cursor: pointer;
  border: none;
}

.ResetButton {
  background: #f5f5f5;
  color: #0d0d0d;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  outline: none;
  margin-right: 8px;
}

.ResetButton:hover {
  background: #e5e5e5;
}

.Footer {
  padding: 16px 24px 20px 24px;
  border-top: 1px solid #e5e5e5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

## Developer Guide: Adding New Settings

### Step-by-Step Process

#### 1. Add Setting Key Constant

```javascript
// In src/stores/settingsStore.js
export const SETTING_KEYS = {
  USE_WEB_SEARCH: "useWebSearch",
  DARK_MODE: "darkMode", // ✅ Add new setting key
  AUTO_SAVE: "autoSave", // ✅ Add new setting key
};
```

#### 2. Update Default Settings

```javascript
const getDefaultSettings = () => {
  return {
    [SETTING_KEYS.USE_WEB_SEARCH]: false,
    [SETTING_KEYS.DARK_MODE]: false, // ✅ Add default value
    [SETTING_KEYS.AUTO_SAVE]: true, // ✅ Add default value
  };
};
```

#### 3. Create Custom Hook

```javascript
// Add selector
const selectDarkMode = (state) => state[SETTING_KEYS.DARK_MODE];

// Add custom hook
export const useDarkModeTool = () => {
  const value = useSettingsStore(selectDarkMode);
  const updateSetting = useSettingsStore((state) => state.updateSetting);

  return [value, (newValue) => updateSetting(SETTING_KEYS.DARK_MODE, newValue)];
};
```

#### 4. Use in Components

```javascript
// In any component
import { useDarkModeTool } from "../../stores/settingsStore";

export function MyComponent() {
  const [darkMode, setDarkMode] = useDarkModeTool();

  return (
    <label>
      <input
        type="checkbox"
        checked={darkMode}
        onChange={(e) => setDarkMode(e.target.checked)}
      />
      Dark Mode
    </label>
  );
}
```

#### 5. Add to Settings Modal

```javascript
// In SettingsModal.jsx
import {
  useWebSearchTool,
  useDarkModeTool,
  useSettingsStore,
} from "../../stores/settingsStore";

export function SettingsModal({ isOpen, onClose }) {
  const [useWebSearch, setUseWebSearch] = useWebSearchTool();
  const [darkMode, setDarkMode] = useDarkModeTool(); // ✅ Add new hook

  // ... rest of component
}
```

### Setting Types Examples

#### Boolean Settings (Checkboxes)

```javascript
// 1. Add to SETTING_KEYS
NOTIFICATIONS_ENABLED: "notificationsEnabled",

// 2. Add to defaults
[SETTING_KEYS.NOTIFICATIONS_ENABLED]: true,

// 3. Create hook
const selectNotifications = (state) => state[SETTING_KEYS.NOTIFICATIONS_ENABLED];
export const useNotificationsTool = () => {
  const value = useSettingsStore(selectNotifications);
  const updateSetting = useSettingsStore((state) => state.updateSetting);
  return [value, (newValue) => updateSetting(SETTING_KEYS.NOTIFICATIONS_ENABLED, newValue)];
};
```

#### Number Settings (Sliders/Inputs)

```javascript
// 1. Add to SETTING_KEYS
MAX_TOKENS: "maxTokens",

// 2. Add to defaults
[SETTING_KEYS.MAX_TOKENS]: 1000,

// 3. Create hook with validation
const selectMaxTokens = (state) => state[SETTING_KEYS.MAX_TOKENS];
export const useMaxTokensTool = () => {
  const value = useSettingsStore(selectMaxTokens);
  const updateSetting = useSettingsStore((state) => state.updateSetting);

  return [
    value,
    (newValue) => {
      const clampedValue = Math.max(100, Math.min(4000, newValue));
      updateSetting(SETTING_KEYS.MAX_TOKENS, clampedValue);
    }
  ];
};
```

#### String Settings (Select/Input)

```javascript
// 1. Add to SETTING_KEYS
THEME: "theme",

// 2. Add to defaults
[SETTING_KEYS.THEME]: "light",

// 3. Create hook
const selectTheme = (state) => state[SETTING_KEYS.THEME];
export const useThemeTool = () => {
  const value = useSettingsStore(selectTheme);
  const updateSetting = useSettingsStore((state) => state.updateSetting);
  return [value, (newValue) => updateSetting(SETTING_KEYS.THEME, newValue)];
};
```

### Best Practices

1. **Always use SETTING_KEYS constants** - Never use string literals
2. **Create custom hooks** - Don't access the store directly in components
3. **Add validation** - Validate values in custom hooks when needed
4. **Update defaults** - Always add new settings to `getDefaultSettings()`
5. **Test thoroughly** - Verify persistence and reset functionality
6. **Document settings** - Add comments explaining complex settings

## Advanced Patterns

### Computed Values

```javascript
// In store
const useSettingsStore = create((set, get) => ({
  // ... other state

  // Computed values
  get isAdvancedMode() {
    const state = get();
    return state.maxTokens > 2000 && state.temperature > 1.0;
  },
}));
```

### Validation

```javascript
// In store actions
setMaxTokens: (value) => {
  const clampedValue = Math.max(100, Math.min(4000, value));
  set({ maxTokens: clampedValue });
};
```

### Middleware for Logging

```javascript
import { subscribeWithSelector } from "zustand/middleware";

const useSettingsStore = create(
  subscribeWithSelector(
    persist()
    // ... store definition
  )
);

// Subscribe to changes
useSettingsStore.subscribe(
  (state) => state.useWebSearch,
  (useWebSearch) => console.log("Web search setting changed:", useWebSearch)
);
```

## TypeScript Support

If using TypeScript, create `src/stores/settingsStore.ts`:

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  // Settings
  useWebSearch: boolean;
  darkMode: boolean;
  autoSave: boolean;
  maxTokens: number;
  temperature: number;

  // Actions
  setUseWebSearch: (value: boolean) => void;
  setDarkMode: (value: boolean) => void;
  setAutoSave: (value: boolean) => void;
  setMaxTokens: (value: number) => void;
  setTemperature: (value: number) => void;
  updateSetting: (key: keyof SettingsState, value: any) => void;
  updateSettings: (settings: Partial<SettingsState>) => void;
  resetSettings: () => void;
}

const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // ... implementation
    }),
    {
      name: "chatbot-settings",
    }
  )
);

export default useSettingsStore;
```

## Testing

### Unit Tests

```javascript
import { renderHook, act } from "@testing-library/react";
import useSettingsStore from "../stores/settingsStore";

describe("Settings Store", () => {
  beforeEach(() => {
    useSettingsStore.getState().resetSettings();
  });

  it("should update web search setting", () => {
    const { result } = renderHook(() => useSettingsStore());

    act(() => {
      result.current.setUseWebSearch(true);
    });

    expect(result.current.useWebSearch).toBe(true);
  });
});
```

## Troubleshooting

### Common Issues

#### 1. Settings not persisting

- Check localStorage in browser dev tools
- Verify `persist` middleware is configured correctly
- Ensure `partialize` includes the settings you want to persist

#### 2. Components not re-rendering

- Make sure you're subscribing to the specific state slice you need
- Use the selector pattern: `useSettingsStore((state) => state.useWebSearch)`

#### 3. Performance issues

- Avoid subscribing to the entire store if you only need specific values
- Use shallow comparison for object selections

### Debugging

```javascript
// Add to store for debugging
const useSettingsStore = create(
  devtools(
    persist(),
    // ... store definition
    { name: "settings-store" }
  )
);
```

## Future Enhancements

1. **Settings Categories**: Group related settings
2. **Import/Export**: Allow users to backup/restore settings
3. **Validation Schema**: Use Zod or similar for runtime validation
4. **Settings History**: Track changes over time
5. **Cloud Sync**: Sync settings across devices

## Conclusion

This Zustand-based architecture provides a robust, scalable foundation for managing application settings. It eliminates
prop drilling, provides automatic persistence, and makes adding new settings trivial.

The migration can be done incrementally, allowing you to test each step before proceeding to the next.
