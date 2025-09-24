# Zustand Settings Architecture Migration Guide

## Overview

This document provides a complete guide for migrating from the current prop-based settings management to a Zustand-based
state management system. This will eliminate prop drilling and make the settings system more maintainable and scalable.

## Current Architecture Problems

### Current Implementation

```javascript
// App.jsx - Current approach
const [useWebSearch, setUseWebSearch] = useState(false);

// Props passed down to SettingsModal
<SettingsModal
    isOpen={isSettingsOpen}
    onClose={handleSettingsClose}
    useWebSearch={useWebSearch} // ❌ Prop drilling
    onWebSearchChange={handleUseWebSearchChange} // ❌ Prop drilling
/>;
```

### Issues with Current Approach

- **Prop Drilling**: Settings props must be passed through multiple components
- **Scalability**: Adding new settings requires updating multiple component signatures
- **Maintenance**: Changes to settings require touching multiple files
- **No Persistence**: Settings reset on page refresh

## Proposed Zustand Architecture

### Benefits

- ✅ **No Prop Drilling**: Components access settings directly from store
- ✅ **Centralized State**: Single source of truth for all settings
- ✅ **Automatic Persistence**: Settings saved to localStorage
- ✅ **Reactive Updates**: Components automatically re-render on changes
- ✅ **Easy to Scale**: Add new settings without touching existing components
- ✅ **Type Safety**: Full TypeScript support (if using TS)

## Installation

```bash
npm install zustand
```

## Implementation Guide

### Step 1: Create Settings Store

Create `src/stores/settingsStore.js`:

```javascript
import {create} from "zustand";
import {persist} from "zustand/middleware";

const useSettingsStore = create(
    persist(
        (set, get) => ({
            // Settings state
            useWebSearch: false,
            darkMode: false,
            autoSave: true,
            maxTokens: 1000,
            temperature: 0.7,

            // Actions for individual settings
            setUseWebSearch: (value) => set({useWebSearch: value}),
            setDarkMode: (value) => set({darkMode: value}),
            setAutoSave: (value) => set({autoSave: value}),
            setMaxTokens: (value) => set({maxTokens: value}),
            setTemperature: (value) => set({temperature: value}),

            // Generic action for any setting
            updateSetting: (key, value) => set({[key]: value}),

            // Bulk update action
            updateSettings: (settings) => set(settings),

            // Reset to defaults
            resetSettings: () =>
                set({
                    useWebSearch: false,
                    darkMode: false,
                    autoSave: true,
                    maxTokens: 1000,
                    temperature: 0.7,
                }),
        }),
        {
            name: "chatbot-settings", // localStorage key
            // Optional: only persist certain keys
            partialize: (state) => ({
                useWebSearch: state.useWebSearch,
                darkMode: state.darkMode,
                autoSave: state.autoSave,
                maxTokens: state.maxTokens,
                temperature: state.temperature,
            }),
        }
    )
);

export default useSettingsStore;
```

### Step 2: Update App Component

Update `src/App.jsx`:

```javascript
import {useState} from "react";
import styles from "./App.module.css";
import {Chat} from "./components/Chat/Chat";
import {Controls} from "./components/Controls/Controls";
import {SettingsButton} from "./components/SettingsButton/SettingsButton";
import {SettingsModal} from "./components/SettingsModal/SettingsModal";
import {Assistant} from "./assistants/openAI";
import {Message} from "./assistants/messages";
import useSettingsStore from "./stores/settingsStore"; // ✅ Import store

function App() {
    const assistant = new Assistant();
    const [messages, setMessages] = useState([]);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // ✅ Subscribe to specific setting from store
    const useWebSearch = useSettingsStore((state) => state.useWebSearch);

    function addMessage(message) {
        setMessages((previousMessages) => [...previousMessages, message]);
    }

    async function handleContentSend(content) {
        const message = Message.user(content);
        addMessage(message);

        try {
            // ✅ Use setting directly from store
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
                <img src="/chat-bot.png" alt="AI Chat Bot" className={styles.Logo}/>
                <h2 className={styles.Title}>AI Chatbot</h2>
            </header>
            <div className={styles.ChatContainer}>
                <Chat messages={messages}></Chat>
            </div>
            <div className={styles.ControlsContainer}>
                <SettingsButton onClick={handleSettingsOpen}/>
                <Controls onSend={handleContentSend}></Controls>
            </div>
            {/* ✅ No more props needed! */}
            <SettingsModal isOpen={isSettingsOpen} onClose={handleSettingsClose}/>
        </div>
    );
}

export default App;
```

### Step 3: Update SettingsModal Component

Update `src/components/SettingsModal/SettingsModal.jsx`:

```javascript
import styles from "./SettingsModal.module.css";
import useSettingsStore from "../../stores/settingsStore"; // ✅ Import store

export function SettingsModal({isOpen, onClose}) {
    // ✅ Access settings and actions directly from store
    const {
        useWebSearch,
        darkMode,
        autoSave,
        maxTokens,
        temperature,
        setUseWebSearch,
        setDarkMode,
        setAutoSave,
        setMaxTokens,
        setTemperature,
        resetSettings,
    } = useSettingsStore();

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

                    {/* Dark Mode Setting */}
                    <label className={styles.CheckboxLabel}>
                        <input
                            type="checkbox"
                            checked={darkMode}
                            onChange={(e) => setDarkMode(e.target.checked)}
                            className={styles.Checkbox}
                        />
                        Dark mode
                    </label>

                    {/* Auto Save Setting */}
                    <label className={styles.CheckboxLabel}>
                        <input
                            type="checkbox"
                            checked={autoSave}
                            onChange={(e) => setAutoSave(e.target.checked)}
                            className={styles.Checkbox}
                        />
                        Auto-save conversations
                    </label>

                    {/* Max Tokens Setting */}
                    <div className={styles.SliderContainer}>
                        <label className={styles.SliderLabel}>
                            Max Tokens: {maxTokens}
                        </label>
                        <input
                            type="range"
                            min="100"
                            max="4000"
                            value={maxTokens}
                            onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                            className={styles.Slider}
                        />
                    </div>

                    {/* Temperature Setting */}
                    <div className={styles.SliderContainer}>
                        <label className={styles.SliderLabel}>
                            Temperature: {temperature}
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="2"
                            step="0.1"
                            value={temperature}
                            onChange={(e) => setTemperature(parseFloat(e.target.value))}
                            className={styles.Slider}
                        />
                    </div>
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

## Migration Steps

### Phase 1: Setup

1. Install Zustand: `npm install zustand`
2. Create the settings store file
3. Test the store in isolation

### Phase 2: Migrate App Component

1. Import the settings store
2. Replace `useState` for settings with store subscriptions
3. Remove setting-related props from SettingsModal
4. Test that web search functionality still works

### Phase 3: Migrate SettingsModal

1. Import the settings store
2. Remove props from component signature
3. Use store state and actions directly
4. Test all settings functionality

### Phase 4: Cleanup

1. Remove unused prop types/interfaces
2. Remove unused handler functions
3. Update any other components that might use settings

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
    set({maxTokens: clampedValue});
}
```

### Middleware for Logging

```javascript
import {subscribeWithSelector} from "zustand/middleware";

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
import {create} from "zustand";
import {persist} from "zustand/middleware";

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
import {renderHook, act} from "@testing-library/react";
import useSettingsStore from "../stores/settingsStore";

describe("Settings Store", () => {
    beforeEach(() => {
        useSettingsStore.getState().resetSettings();
    });

    it("should update web search setting", () => {
        const {result} = renderHook(() => useSettingsStore());

        act(() => {
            result.current.setUseWebSearch(true);
        });

        expect(result.current.useWebSearch).toBe(true);
    });
});
```

## Troubleshooting

### Common Issues

#### 1. Settings not persisting**

- Check localStorage in browser dev tools
- Verify `persist` middleware is configured correctly
- Ensure `partialize` includes the settings you want to persist

#### 2. Components not re-rendering**

- Make sure you're subscribing to the specific state slice you need
- Use the selector pattern: `useSettingsStore((state) => state.useWebSearch)`

#### 3. Performance issues**

- Avoid subscribing to the entire store if you only need specific values
- Use shallow comparison for object selections

### Debugging

```javascript
// Add to store for debugging
const useSettingsStore = create(
    devtools(
        persist(),
        // ... store definition
        {name: "settings-store"}
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
