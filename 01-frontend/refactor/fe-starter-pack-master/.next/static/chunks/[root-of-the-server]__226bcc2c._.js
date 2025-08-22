(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s({
    "connect": (()=>connect),
    "setHooks": (()=>setHooks),
    "subscribeToUpdate": (()=>subscribeToUpdate)
});
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case "turbopack-connected":
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn("[Fast Refresh] performing full reload\n\n" + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + "You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n" + "Consider migrating the non-React component export to a separate file and importing it into both files.\n\n" + "It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n" + "Fast Refresh requires at least one parent function component in your React tree.");
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error("A separate HMR handler was already registered");
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: "turbopack-subscribe",
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: "turbopack-unsubscribe",
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: "ChunkListUpdate",
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === "added" && updateB.type === "deleted" || updateA.type === "deleted" && updateB.type === "added") {
        return undefined;
    }
    if (updateA.type === "partial") {
        invariant(updateA.instruction, "Partial updates are unsupported");
    }
    if (updateB.type === "partial") {
        invariant(updateB.instruction, "Partial updates are unsupported");
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: "EcmascriptMergedUpdate",
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === "added" && updateB.type === "deleted") {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === "deleted" && updateB.type === "added") {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: "partial",
            added,
            deleted
        };
    }
    if (updateA.type === "partial" && updateB.type === "partial") {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: "partial",
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === "added" && updateB.type === "partial") {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: "added",
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === "partial" && updateB.type === "deleted") {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: "deleted",
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    "bug",
    "error",
    "fatal"
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    "bug",
    "fatal",
    "error",
    "warning",
    "info",
    "log"
];
const CATEGORY_ORDER = [
    "parse",
    "resolve",
    "code generation",
    "rendering",
    "typescript",
    "other"
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case "issues":
            break;
        case "partial":
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === "notFound") {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}}),
"[project]/src/lib/antd-theme.ts [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/**
 * Ant Design Theme Configuration
 * Provides design tokens that work with both Ant Design and Radix UI
 */ __turbopack_context__.s({
    "antdTheme": (()=>antdTheme),
    "cssVariables": (()=>cssVariables),
    "themeClasses": (()=>themeClasses)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ant$2d$design$2f$colors$2f$es$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/@ant-design/colors/es/index.js [client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ant$2d$design$2f$colors$2f$es$2f$presets$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@ant-design/colors/es/presets.js [client] (ecmascript)");
;
const antdTheme = {
    token: {
        // Primary Colors (HRthis Blue)
        colorPrimary: '#1890ff',
        colorSuccess: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ant$2d$design$2f$colors$2f$es$2f$presets$2e$js__$5b$client$5d$__$28$ecmascript$29$__["green"][6],
        colorWarning: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ant$2d$design$2f$colors$2f$es$2f$presets$2e$js__$5b$client$5d$__$28$ecmascript$29$__["orange"][6],
        colorError: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ant$2d$design$2f$colors$2f$es$2f$presets$2e$js__$5b$client$5d$__$28$ecmascript$29$__["red"][6],
        colorInfo: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ant$2d$design$2f$colors$2f$es$2f$presets$2e$js__$5b$client$5d$__$28$ecmascript$29$__["blue"][6],
        // Background Colors
        colorBgBase: '#ffffff',
        colorBgContainer: '#ffffff',
        colorBgElevated: '#ffffff',
        colorBgLayout: '#f5f5f5',
        // Text Colors
        colorText: '#000000',
        colorTextSecondary: '#666666',
        colorTextTertiary: '#999999',
        // Border & Radius
        borderRadius: 8,
        borderRadiusLG: 12,
        borderRadiusSM: 4,
        // Typography
        fontSize: 14,
        fontSizeLG: 16,
        fontSizeSM: 12,
        fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
        // Spacing
        size: 16,
        sizeStep: 4,
        sizeUnit: 4,
        // Height Controls
        controlHeight: 32,
        controlHeightLG: 40,
        controlHeightSM: 24,
        // Shadows
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        boxShadowSecondary: '0 6px 16px rgba(0, 0, 0, 0.08)',
        // Motion
        motionDurationSlow: '0.3s',
        motionDurationMid: '0.2s',
        motionDurationFast: '0.1s'
    },
    components: {
        Button: {
            borderRadius: 8,
            controlHeight: 32,
            controlHeightLG: 40,
            controlHeightSM: 24
        },
        Input: {
            borderRadius: 8,
            controlHeight: 32
        },
        Select: {
            borderRadius: 8,
            controlHeight: 32
        },
        Card: {
            borderRadius: 12,
            paddingLG: 24
        },
        Table: {
            borderRadius: 8
        },
        Modal: {
            borderRadius: 12
        },
        Drawer: {
            borderRadius: 12
        }
    }
};
const cssVariables = `
  :root {
    /* Colors */
    --color-primary: ${antdTheme.token?.colorPrimary};
    --color-success: ${antdTheme.token?.colorSuccess};
    --color-warning: ${antdTheme.token?.colorWarning};
    --color-error: ${antdTheme.token?.colorError};
    --color-text: ${antdTheme.token?.colorText};
    --color-text-secondary: ${antdTheme.token?.colorTextSecondary};
    --color-bg: ${antdTheme.token?.colorBgBase};
    --color-bg-container: ${antdTheme.token?.colorBgContainer};
    
    /* Border Radius */
    --border-radius: ${antdTheme.token?.borderRadius}px;
    --border-radius-lg: ${antdTheme.token?.borderRadiusLG}px;
    --border-radius-sm: ${antdTheme.token?.borderRadiusSM}px;
    
    /* Typography */
    --font-size: ${antdTheme.token?.fontSize}px;
    --font-size-lg: ${antdTheme.token?.fontSizeLG}px;
    --font-size-sm: ${antdTheme.token?.fontSizeSM}px;
    --font-family: ${antdTheme.token?.fontFamily};
    
    /* Control Heights */
    --control-height: ${antdTheme.token?.controlHeight}px;
    --control-height-lg: ${antdTheme.token?.controlHeightLG}px;
    --control-height-sm: ${antdTheme.token?.controlHeightSM}px;
    
    /* Shadows */
    --box-shadow: ${antdTheme.token?.boxShadow};
    --box-shadow-secondary: ${antdTheme.token?.boxShadowSecondary};
    
    /* Spacing */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    --spacing-xxl: 48px;
  }
`;
const themeClasses = {
    colors: {
        primary: 'text-[var(--color-primary)]',
        success: 'text-[var(--color-success)]',
        warning: 'text-[var(--color-warning)]',
        error: 'text-[var(--color-error)]',
        text: 'text-[var(--color-text)]',
        textSecondary: 'text-[var(--color-text-secondary)]'
    },
    backgrounds: {
        primary: 'bg-[var(--color-primary)]',
        success: 'bg-[var(--color-success)]',
        warning: 'bg-[var(--color-warning)]',
        error: 'bg-[var(--color-error)]',
        container: 'bg-[var(--color-bg-container)]'
    },
    spacing: {
        xs: 'p-[var(--spacing-xs)]',
        sm: 'p-[var(--spacing-sm)]',
        md: 'p-[var(--spacing-md)]',
        lg: 'p-[var(--spacing-lg)]',
        xl: 'p-[var(--spacing-xl)]'
    },
    borders: {
        radius: 'rounded-[var(--border-radius)]',
        radiusLg: 'rounded-[var(--border-radius-lg)]',
        radiusSm: 'rounded-[var(--border-radius-sm)]'
    },
    heights: {
        control: 'h-[var(--control-height)]',
        controlLg: 'h-[var(--control-height-lg)]',
        controlSm: 'h-[var(--control-height-sm)]'
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/features/hr/services/api.ts [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/**
 * HR API Service
 * Handles all API communication with the HRthis backend
 */ __turbopack_context__.s({
    "apiClient": (()=>apiClient),
    "authAPI": (()=>authAPI),
    "employeeAPI": (()=>employeeAPI),
    "fileAPI": (()=>fileAPI)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [client] (ecmascript)");
;
// Base API configuration
const API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:8001") || 'http://localhost:8000';
const apiClient = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});
// Request interceptor for auth token
apiClient.interceptors.request.use((config)=>{
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
// Response interceptor for error handling
apiClient.interceptors.response.use((response)=>response, (error)=>{
    if (error.response?.status === 401) {
        // Handle unauthorized - redirect to login
        localStorage.removeItem('auth_token');
        window.location.href = '/auth/login';
    }
    return Promise.reject(error);
});
const employeeAPI = {
    // Get all employees with filters
    getEmployees: async (filters = {})=>{
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value])=>{
            if (value) params.append(key, String(value));
        });
        const response = await apiClient.get(`/api/employees?${params}`);
        return response.data;
    },
    // Get employee by ID
    getEmployee: async (id)=>{
        const response = await apiClient.get(`/api/employees/${id}`);
        return response.data;
    },
    // Create new employee
    createEmployee: async (employeeData)=>{
        const response = await apiClient.post('/api/employees', employeeData);
        return response.data;
    },
    // Update employee
    updateEmployee: async (id, employeeData)=>{
        const response = await apiClient.patch(`/api/employees/${id}`, employeeData);
        return response.data;
    },
    // Delete employee (soft delete)
    deleteEmployee: async (id)=>{
        await apiClient.delete(`/api/employees/${id}`);
    },
    // Send onboarding email
    sendOnboardingEmail: async (id, preset)=>{
        const response = await apiClient.post(`/api/employees/${id}/send-onboarding-email`, {
            preset
        });
        return response.data;
    },
    // Get onboarding status
    getOnboardingStatus: async (id)=>{
        const response = await apiClient.get(`/api/employees/${id}/onboarding-status`);
        return response.data;
    }
};
const authAPI = {
    login: async (email, password)=>{
        const response = await apiClient.post('/api/auth/login', {
            email,
            password
        });
        return response.data;
    },
    logout: async ()=>{
        localStorage.removeItem('auth_token');
    // Could call backend logout endpoint if needed
    },
    getCurrentUser: async ()=>{
        const response = await apiClient.get('/api/auth/me');
        return response.data;
    }
};
const fileAPI = {
    uploadFile: async (file, category)=>{
        const formData = new FormData();
        formData.append('file', file);
        if (category) formData.append('category', category);
        const response = await apiClient.post('/api/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },
    getFile: async (fileId)=>{
        const response = await apiClient.get(`/api/files/${fileId}`);
        return response.data;
    },
    deleteFile: async (fileId)=>{
        await apiClient.delete(`/api/files/${fileId}`);
    }
};
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/features/hr/hooks/useEmployees.ts [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/**
 * Employee Hooks
 * React Query hooks for employee data management
 */ __turbopack_context__.s({
    "employeeKeys": (()=>employeeKeys),
    "useCreateEmployee": (()=>useCreateEmployee),
    "useDeleteEmployee": (()=>useDeleteEmployee),
    "useEmployee": (()=>useEmployee),
    "useEmployees": (()=>useEmployees),
    "useOnboardingStatus": (()=>useOnboardingStatus),
    "useOptimisticEmployeeUpdate": (()=>useOptimisticEmployeeUpdate),
    "usePrefetchEmployee": (()=>usePrefetchEmployee),
    "useSendOnboardingEmail": (()=>useSendOnboardingEmail),
    "useUpdateEmployee": (()=>useUpdateEmployee)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$message$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__message$3e$__ = __turbopack_context__.i("[project]/node_modules/antd/es/message/index.js [client] (ecmascript) <export default as message>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$services$2f$api$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/hr/services/api.ts [client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature(), _s8 = __turbopack_context__.k.signature();
;
;
;
const employeeKeys = {
    all: [
        'employees'
    ],
    lists: ()=>[
            ...employeeKeys.all,
            'list'
        ],
    list: (filters)=>[
            ...employeeKeys.lists(),
            filters
        ],
    details: ()=>[
            ...employeeKeys.all,
            'detail'
        ],
    detail: (id)=>[
            ...employeeKeys.details(),
            id
        ],
    onboarding: (id)=>[
            ...employeeKeys.all,
            'onboarding',
            id
        ]
};
const useEmployees = (filters = {})=>{
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: employeeKeys.list(filters),
        queryFn: {
            "useEmployees.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$services$2f$api$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["employeeAPI"].getEmployees(filters)
        }["useEmployees.useQuery"],
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000
    });
};
_s(useEmployees, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
const useEmployee = (id)=>{
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: employeeKeys.detail(id),
        queryFn: {
            "useEmployee.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$services$2f$api$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["employeeAPI"].getEmployee(id)
        }["useEmployee.useQuery"],
        enabled: !!id,
        staleTime: 5 * 60 * 1000
    });
};
_s1(useEmployee, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
const useOnboardingStatus = (id)=>{
    _s2();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: employeeKeys.onboarding(id),
        queryFn: {
            "useOnboardingStatus.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$services$2f$api$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["employeeAPI"].getOnboardingStatus(id)
        }["useOnboardingStatus.useQuery"],
        enabled: !!id,
        staleTime: 2 * 60 * 1000
    });
};
_s2(useOnboardingStatus, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
const useCreateEmployee = ()=>{
    _s3();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreateEmployee.useMutation": (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$services$2f$api$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["employeeAPI"].createEmployee(data)
        }["useCreateEmployee.useMutation"],
        onSuccess: {
            "useCreateEmployee.useMutation": (newEmployee)=>{
                // Invalidate and refetch employees list
                queryClient.invalidateQueries({
                    queryKey: employeeKeys.lists()
                });
                // Add the new employee to cache
                queryClient.setQueryData(employeeKeys.detail(newEmployee.id), newEmployee);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$message$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__message$3e$__["message"].success(`Mitarbeiter ${newEmployee.fullName} wurde erfolgreich erstellt`);
            }
        }["useCreateEmployee.useMutation"],
        onError: {
            "useCreateEmployee.useMutation": (error)=>{
                const errorMessage = error.response?.data?.detail || 'Fehler beim Erstellen des Mitarbeiters';
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$message$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__message$3e$__["message"].error(errorMessage);
            }
        }["useCreateEmployee.useMutation"]
    });
};
_s3(useCreateEmployee, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
const useUpdateEmployee = ()=>{
    _s4();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateEmployee.useMutation": ({ id, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$services$2f$api$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["employeeAPI"].updateEmployee(id, data)
        }["useUpdateEmployee.useMutation"],
        onSuccess: {
            "useUpdateEmployee.useMutation": (updatedEmployee, { id })=>{
                // Update employee in cache
                queryClient.setQueryData(employeeKeys.detail(id), updatedEmployee);
                // Invalidate lists to reflect changes
                queryClient.invalidateQueries({
                    queryKey: employeeKeys.lists()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$message$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__message$3e$__["message"].success(`Mitarbeiter ${updatedEmployee.fullName} wurde aktualisiert`);
            }
        }["useUpdateEmployee.useMutation"],
        onError: {
            "useUpdateEmployee.useMutation": (error)=>{
                const errorMessage = error.response?.data?.detail || 'Fehler beim Aktualisieren des Mitarbeiters';
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$message$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__message$3e$__["message"].error(errorMessage);
            }
        }["useUpdateEmployee.useMutation"]
    });
};
_s4(useUpdateEmployee, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
const useDeleteEmployee = ()=>{
    _s5();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeleteEmployee.useMutation": (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$services$2f$api$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["employeeAPI"].deleteEmployee(id)
        }["useDeleteEmployee.useMutation"],
        onSuccess: {
            "useDeleteEmployee.useMutation": (_, id)=>{
                // Remove from cache
                queryClient.removeQueries({
                    queryKey: employeeKeys.detail(id)
                });
                // Invalidate lists
                queryClient.invalidateQueries({
                    queryKey: employeeKeys.lists()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$message$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__message$3e$__["message"].success('Mitarbeiter wurde erfolgreich gelöscht');
            }
        }["useDeleteEmployee.useMutation"],
        onError: {
            "useDeleteEmployee.useMutation": (error)=>{
                const errorMessage = error.response?.data?.detail || 'Fehler beim Löschen des Mitarbeiters';
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$message$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__message$3e$__["message"].error(errorMessage);
            }
        }["useDeleteEmployee.useMutation"]
    });
};
_s5(useDeleteEmployee, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
const useSendOnboardingEmail = ()=>{
    _s6();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useSendOnboardingEmail.useMutation": ({ id, preset })=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$services$2f$api$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["employeeAPI"].sendOnboardingEmail(id, preset)
        }["useSendOnboardingEmail.useMutation"],
        onSuccess: {
            "useSendOnboardingEmail.useMutation": (_, { id })=>{
                // Invalidate employee data and onboarding status
                queryClient.invalidateQueries({
                    queryKey: employeeKeys.detail(id)
                });
                queryClient.invalidateQueries({
                    queryKey: employeeKeys.onboarding(id)
                });
                queryClient.invalidateQueries({
                    queryKey: employeeKeys.lists()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$message$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__message$3e$__["message"].success('Onboarding-Email wurde erfolgreich versendet');
            }
        }["useSendOnboardingEmail.useMutation"],
        onError: {
            "useSendOnboardingEmail.useMutation": (error)=>{
                const errorMessage = error.response?.data?.detail || 'Fehler beim Versenden der Onboarding-Email';
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$message$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__message$3e$__["message"].error(errorMessage);
            }
        }["useSendOnboardingEmail.useMutation"]
    });
};
_s6(useSendOnboardingEmail, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
const usePrefetchEmployee = ()=>{
    _s7();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (id)=>{
        queryClient.prefetchQuery({
            queryKey: employeeKeys.detail(id),
            queryFn: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$services$2f$api$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["employeeAPI"].getEmployee(id),
            staleTime: 5 * 60 * 1000
        });
    };
};
_s7(usePrefetchEmployee, "4R+oYVB2Uc11P7bp1KcuhpkfaTw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useQueryClient"]
    ];
});
const useOptimisticEmployeeUpdate = ()=>{
    _s8();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return {
        updateEmployee: (id, updatedData)=>{
            queryClient.setQueryData(employeeKeys.detail(id), (old)=>old ? {
                    ...old,
                    ...updatedData
                } : undefined);
        },
        rollbackEmployee: (id)=>{
            queryClient.invalidateQueries({
                queryKey: employeeKeys.detail(id)
            });
        }
    };
};
_s8(useOptimisticEmployeeUpdate, "4R+oYVB2Uc11P7bp1KcuhpkfaTw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useQueryClient"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/features/hr/components/EmployeeCardSimple.tsx [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "EmployeeCardSimple": (()=>EmployeeCardSimple)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$badge$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Badge$3e$__ = __turbopack_context__.i("[project]/node_modules/antd/es/badge/index.js [client] (ecmascript) <export default as Badge>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ant$2d$design$2f$icons$2f$es$2f$icons$2f$UserOutlined$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserOutlined$3e$__ = __turbopack_context__.i("[project]/node_modules/@ant-design/icons/es/icons/UserOutlined.js [client] (ecmascript) <export default as UserOutlined>");
;
;
;
const EmployeeCardSimple = ({ employee, onEdit, onDelete, onSendOnboarding })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full p-4 border rounded-lg shadow hover:shadow-md transition-shadow",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-between",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center space-x-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ant$2d$design$2f$icons$2f$es$2f$icons$2f$UserOutlined$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserOutlined$3e$__["UserOutlined"], {
                                className: "text-blue-600"
                            }, void 0, false, {
                                fileName: "[project]/src/features/hr/components/EmployeeCardSimple.tsx",
                                lineNumber: 30,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/features/hr/components/EmployeeCardSimple.tsx",
                            lineNumber: 29,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-semibold text-gray-900",
                                    children: employee.fullName
                                }, void 0, false, {
                                    fileName: "[project]/src/features/hr/components/EmployeeCardSimple.tsx",
                                    lineNumber: 33,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-500",
                                    children: employee.position
                                }, void 0, false, {
                                    fileName: "[project]/src/features/hr/components/EmployeeCardSimple.tsx",
                                    lineNumber: 34,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/features/hr/components/EmployeeCardSimple.tsx",
                            lineNumber: 32,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/features/hr/components/EmployeeCardSimple.tsx",
                    lineNumber: 28,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center space-x-2",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$badge$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Badge$3e$__["Badge"], {
                        status: "success",
                        text: employee.status
                    }, void 0, false, {
                        fileName: "[project]/src/features/hr/components/EmployeeCardSimple.tsx",
                        lineNumber: 38,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/features/hr/components/EmployeeCardSimple.tsx",
                    lineNumber: 37,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/features/hr/components/EmployeeCardSimple.tsx",
            lineNumber: 27,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/features/hr/components/EmployeeCardSimple.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
};
_c = EmployeeCardSimple;
var _c;
__turbopack_context__.k.register(_c, "EmployeeCardSimple");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/features/hr/types/employee.ts [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/**
 * Employee Types
 * TypeScript definitions for HR employee data
 */ // Enums
__turbopack_context__.s({
    "EmployeeStatus": (()=>EmployeeStatus),
    "EmploymentType": (()=>EmploymentType),
    "UserRole": (()=>UserRole)
});
var EmploymentType = /*#__PURE__*/ function(EmploymentType) {
    EmploymentType["FULLTIME"] = "fulltime";
    EmploymentType["PARTTIME"] = "parttime";
    EmploymentType["MINIJOB"] = "minijob";
    EmploymentType["INTERN"] = "intern";
    EmploymentType["OTHER"] = "other";
    return EmploymentType;
}({});
var EmployeeStatus = /*#__PURE__*/ function(EmployeeStatus) {
    EmployeeStatus["ACTIVE"] = "active";
    EmployeeStatus["PROBATION"] = "probation";
    EmployeeStatus["INACTIVE"] = "inactive";
    EmployeeStatus["TERMINATED"] = "terminated";
    return EmployeeStatus;
}({});
var UserRole = /*#__PURE__*/ function(UserRole) {
    UserRole["USER"] = "user";
    UserRole["ADMIN"] = "admin";
    UserRole["SUPERADMIN"] = "superadmin";
    return UserRole;
}({});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/pages/hr/employees.tsx [client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, k: __turbopack_refresh__, m: module, e: exports } = __turbopack_context__;
{
const e = new Error(`Could not parse module '[project]/src/pages/hr/employees.tsx'

Unexpected token `HRthisLayout`. Expected jsx identifier`);
e.code = 'MODULE_UNPARSEABLE';
throw e;}}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/hr/employees.tsx [client] (ecmascript)\" } [client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const PAGE_PATH = "/";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/hr/employees.tsx [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}}),
"[project]/src/pages/hr/employees.tsx (hmr-entry)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, m: module } = __turbopack_context__;
{
__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/hr/employees.tsx [client] (ecmascript)\" } [client] (ecmascript)");
}}),
}]);

//# sourceMappingURL=%5Broot-of-the-server%5D__226bcc2c._.js.map