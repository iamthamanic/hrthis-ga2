module.exports = {

"[externals]/@ant-design/colors [external] (@ant-design/colors, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("@ant-design/colors", () => require("@ant-design/colors"));

module.exports = mod;
}}),
"[project]/src/lib/antd-theme.ts [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * Ant Design Theme Configuration
 * Provides design tokens that work with both Ant Design and Radix UI
 */ __turbopack_context__.s({
    "antdTheme": (()=>antdTheme),
    "cssVariables": (()=>cssVariables),
    "themeClasses": (()=>themeClasses)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f40$ant$2d$design$2f$colors__$5b$external$5d$__$2840$ant$2d$design$2f$colors$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@ant-design/colors [external] (@ant-design/colors, cjs)");
;
const antdTheme = {
    token: {
        // Primary Colors (HRthis Blue)
        colorPrimary: '#1890ff',
        colorSuccess: __TURBOPACK__imported__module__$5b$externals$5d2f40$ant$2d$design$2f$colors__$5b$external$5d$__$2840$ant$2d$design$2f$colors$2c$__cjs$29$__["green"][6],
        colorWarning: __TURBOPACK__imported__module__$5b$externals$5d2f40$ant$2d$design$2f$colors__$5b$external$5d$__$2840$ant$2d$design$2f$colors$2c$__cjs$29$__["orange"][6],
        colorError: __TURBOPACK__imported__module__$5b$externals$5d2f40$ant$2d$design$2f$colors__$5b$external$5d$__$2840$ant$2d$design$2f$colors$2c$__cjs$29$__["red"][6],
        colorInfo: __TURBOPACK__imported__module__$5b$externals$5d2f40$ant$2d$design$2f$colors__$5b$external$5d$__$2840$ant$2d$design$2f$colors$2c$__cjs$29$__["blue"][6],
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
}}),
"[externals]/axios [external] (axios, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("axios");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/src/features/hr/services/api.ts [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
/**
 * HR API Service
 * Handles all API communication with the HRthis backend
 */ __turbopack_context__.s({
    "apiClient": (()=>apiClient),
    "authAPI": (()=>authAPI),
    "employeeAPI": (()=>employeeAPI),
    "fileAPI": (()=>fileAPI)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
// Base API configuration
const API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:8001") || 'http://localhost:8000';
const apiClient = __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__["default"].create({
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
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/features/hr/hooks/useEmployees.ts [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
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
var __TURBOPACK__imported__module__$5b$externals$5d2f40$tanstack$2f$react$2d$query__$5b$external$5d$__$2840$tanstack$2f$react$2d$query$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/@tanstack/react-query [external] (@tanstack/react-query, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$message$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__message$3e$__ = __turbopack_context__.i("[project]/node_modules/antd/es/message/index.js [ssr] (ecmascript) <export default as message>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$services$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/hr/services/api.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$tanstack$2f$react$2d$query__$5b$external$5d$__$2840$tanstack$2f$react$2d$query$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$services$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f40$tanstack$2f$react$2d$query__$5b$external$5d$__$2840$tanstack$2f$react$2d$query$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$services$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
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
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$tanstack$2f$react$2d$query__$5b$external$5d$__$2840$tanstack$2f$react$2d$query$2c$__esm_import$29$__["useQuery"])({
        queryKey: employeeKeys.list(filters),
        queryFn: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$services$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["employeeAPI"].getEmployees(filters),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000
    });
};
const useEmployee = (id)=>{
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$tanstack$2f$react$2d$query__$5b$external$5d$__$2840$tanstack$2f$react$2d$query$2c$__esm_import$29$__["useQuery"])({
        queryKey: employeeKeys.detail(id),
        queryFn: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$services$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["employeeAPI"].getEmployee(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000
    });
};
const useOnboardingStatus = (id)=>{
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$tanstack$2f$react$2d$query__$5b$external$5d$__$2840$tanstack$2f$react$2d$query$2c$__esm_import$29$__["useQuery"])({
        queryKey: employeeKeys.onboarding(id),
        queryFn: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$services$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["employeeAPI"].getOnboardingStatus(id),
        enabled: !!id,
        staleTime: 2 * 60 * 1000
    });
};
const useCreateEmployee = ()=>{
    const queryClient = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$tanstack$2f$react$2d$query__$5b$external$5d$__$2840$tanstack$2f$react$2d$query$2c$__esm_import$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$tanstack$2f$react$2d$query__$5b$external$5d$__$2840$tanstack$2f$react$2d$query$2c$__esm_import$29$__["useMutation"])({
        mutationFn: (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$services$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["employeeAPI"].createEmployee(data),
        onSuccess: (newEmployee)=>{
            // Invalidate and refetch employees list
            queryClient.invalidateQueries({
                queryKey: employeeKeys.lists()
            });
            // Add the new employee to cache
            queryClient.setQueryData(employeeKeys.detail(newEmployee.id), newEmployee);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$message$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__message$3e$__["message"].success(`Mitarbeiter ${newEmployee.fullName} wurde erfolgreich erstellt`);
        },
        onError: (error)=>{
            const errorMessage = error.response?.data?.detail || 'Fehler beim Erstellen des Mitarbeiters';
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$message$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__message$3e$__["message"].error(errorMessage);
        }
    });
};
const useUpdateEmployee = ()=>{
    const queryClient = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$tanstack$2f$react$2d$query__$5b$external$5d$__$2840$tanstack$2f$react$2d$query$2c$__esm_import$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$tanstack$2f$react$2d$query__$5b$external$5d$__$2840$tanstack$2f$react$2d$query$2c$__esm_import$29$__["useMutation"])({
        mutationFn: ({ id, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$services$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["employeeAPI"].updateEmployee(id, data),
        onSuccess: (updatedEmployee, { id })=>{
            // Update employee in cache
            queryClient.setQueryData(employeeKeys.detail(id), updatedEmployee);
            // Invalidate lists to reflect changes
            queryClient.invalidateQueries({
                queryKey: employeeKeys.lists()
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$message$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__message$3e$__["message"].success(`Mitarbeiter ${updatedEmployee.fullName} wurde aktualisiert`);
        },
        onError: (error)=>{
            const errorMessage = error.response?.data?.detail || 'Fehler beim Aktualisieren des Mitarbeiters';
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$message$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__message$3e$__["message"].error(errorMessage);
        }
    });
};
const useDeleteEmployee = ()=>{
    const queryClient = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$tanstack$2f$react$2d$query__$5b$external$5d$__$2840$tanstack$2f$react$2d$query$2c$__esm_import$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$tanstack$2f$react$2d$query__$5b$external$5d$__$2840$tanstack$2f$react$2d$query$2c$__esm_import$29$__["useMutation"])({
        mutationFn: (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$services$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["employeeAPI"].deleteEmployee(id),
        onSuccess: (_, id)=>{
            // Remove from cache
            queryClient.removeQueries({
                queryKey: employeeKeys.detail(id)
            });
            // Invalidate lists
            queryClient.invalidateQueries({
                queryKey: employeeKeys.lists()
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$message$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__message$3e$__["message"].success('Mitarbeiter wurde erfolgreich gelöscht');
        },
        onError: (error)=>{
            const errorMessage = error.response?.data?.detail || 'Fehler beim Löschen des Mitarbeiters';
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$message$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__message$3e$__["message"].error(errorMessage);
        }
    });
};
const useSendOnboardingEmail = ()=>{
    const queryClient = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$tanstack$2f$react$2d$query__$5b$external$5d$__$2840$tanstack$2f$react$2d$query$2c$__esm_import$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$tanstack$2f$react$2d$query__$5b$external$5d$__$2840$tanstack$2f$react$2d$query$2c$__esm_import$29$__["useMutation"])({
        mutationFn: ({ id, preset })=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$services$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["employeeAPI"].sendOnboardingEmail(id, preset),
        onSuccess: (_, { id })=>{
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
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$message$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__message$3e$__["message"].success('Onboarding-Email wurde erfolgreich versendet');
        },
        onError: (error)=>{
            const errorMessage = error.response?.data?.detail || 'Fehler beim Versenden der Onboarding-Email';
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$message$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__message$3e$__["message"].error(errorMessage);
        }
    });
};
const usePrefetchEmployee = ()=>{
    const queryClient = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$tanstack$2f$react$2d$query__$5b$external$5d$__$2840$tanstack$2f$react$2d$query$2c$__esm_import$29$__["useQueryClient"])();
    return (id)=>{
        queryClient.prefetchQuery({
            queryKey: employeeKeys.detail(id),
            queryFn: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$services$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["employeeAPI"].getEmployee(id),
            staleTime: 5 * 60 * 1000
        });
    };
};
const useOptimisticEmployeeUpdate = ()=>{
    const queryClient = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$tanstack$2f$react$2d$query__$5b$external$5d$__$2840$tanstack$2f$react$2d$query$2c$__esm_import$29$__["useQueryClient"])();
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
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/features/hr/components/EmployeeCard.tsx [ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const e = new Error(`Could not parse module '[project]/src/features/hr/components/EmployeeCard.tsx'

Unexpected token `Card`. Expected jsx identifier`);
e.code = 'MODULE_UNPARSEABLE';
throw e;}}),
"[project]/src/features/hr/types/employee.ts [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
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
}}),
"[project]/src/pages/hr/employees.tsx [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
/**
 * Employees Page - Live API Integration Test
 * Tests the complete Frontend ↔ Backend integration
 */ __turbopack_context__.s({
    "default": (()=>EmployeesPage)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$tanstack$2f$react$2d$query__$5b$external$5d$__$2840$tanstack$2f$react$2d$query$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/@tanstack/react-query [external] (@tanstack/react-query, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$config$2d$provider$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__ConfigProvider$3e$__ = __turbopack_context__.i("[project]/node_modules/antd/es/config-provider/index.js [ssr] (ecmascript) <locals> <export default as ConfigProvider>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$button$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__Button$3e$__ = __turbopack_context__.i("[project]/node_modules/antd/es/button/index.js [ssr] (ecmascript) <locals> <export default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$message$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__message$3e$__ = __turbopack_context__.i("[project]/node_modules/antd/es/message/index.js [ssr] (ecmascript) <export default as message>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$modal$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Modal$3e$__ = __turbopack_context__.i("[project]/node_modules/antd/es/modal/index.js [ssr] (ecmascript) <export default as Modal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$form$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Form$3e$__ = __turbopack_context__.i("[project]/node_modules/antd/es/form/index.js [ssr] (ecmascript) <export default as Form>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$input$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Input$3e$__ = __turbopack_context__.i("[project]/node_modules/antd/es/input/index.js [ssr] (ecmascript) <export default as Input>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$select$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__ = __turbopack_context__.i("[project]/node_modules/antd/es/select/index.js [ssr] (ecmascript) <export default as Select>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$space$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__Space$3e$__ = __turbopack_context__.i("[project]/node_modules/antd/es/space/index.js [ssr] (ecmascript) <locals> <export default as Space>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ant$2d$design$2f$icons$2f$es$2f$icons$2f$UserAddOutlined$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserAddOutlined$3e$__ = __turbopack_context__.i("[project]/node_modules/@ant-design/icons/es/icons/UserAddOutlined.js [ssr] (ecmascript) <export default as UserAddOutlined>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ant$2d$design$2f$icons$2f$es$2f$icons$2f$ReloadOutlined$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ReloadOutlined$3e$__ = __turbopack_context__.i("[project]/node_modules/@ant-design/icons/es/icons/ReloadOutlined.js [ssr] (ecmascript) <export default as ReloadOutlined>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$antd$2d$theme$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/antd-theme.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$hooks$2f$useEmployees$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/hr/hooks/useEmployees.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$components$2f$EmployeeCard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/hr/components/EmployeeCard.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$types$2f$employee$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/hr/types/employee.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$tanstack$2f$react$2d$query__$5b$external$5d$__$2840$tanstack$2f$react$2d$query$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$hooks$2f$useEmployees$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f40$tanstack$2f$react$2d$query__$5b$external$5d$__$2840$tanstack$2f$react$2d$query$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$hooks$2f$useEmployees$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
;
;
;
;
;
;
;
// Query Client Setup
const queryClient = new __TURBOPACK__imported__module__$5b$externals$5d2f40$tanstack$2f$react$2d$query__$5b$external$5d$__$2840$tanstack$2f$react$2d$query$2c$__esm_import$29$__["QueryClient"]({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false
        }
    }
});
const CreateEmployeeModal = ({ visible, onCancel, onSuccess })=>{
    const [form] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$form$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Form$3e$__["Form"].useForm();
    const createEmployeeMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$hooks$2f$useEmployees$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useCreateEmployee"])();
    const handleSubmit = async (values)=>{
        try {
            const employeeData = {
                ...values,
                sendOnboardingEmail: values.sendOnboardingEmail || false,
                onboardingPreset: values.sendOnboardingEmail ? 'default' : undefined,
                startDate: new Date().toISOString(),
                vacationDays: 30
            };
            await createEmployeeMutation.mutateAsync(employeeData);
            form.resetFields();
            onSuccess();
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$message$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__message$3e$__["message"].success('Mitarbeiter erfolgreich erstellt!');
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$message$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__message$3e$__["message"].error(error.message || 'Fehler beim Erstellen');
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$modal$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Modal$3e$__["Modal"], {
        title: "Neuen Mitarbeiter erstellen",
        open: visible,
        onCancel: onCancel,
        footer: null,
        width: 600,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$form$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Form$3e$__["Form"], {
            form: form,
            layout: "vertical",
            onFinish: handleSubmit,
            initialValues: {
                role: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$types$2f$employee$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["UserRole"].USER,
                employmentType: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$types$2f$employee$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EmploymentType"].FULLTIME
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$form$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Form$3e$__["Form"].Item, {
                    name: "firstName",
                    label: "Vorname",
                    rules: [
                        {
                            required: true,
                            message: 'Bitte Vorname eingeben'
                        }
                    ],
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$input$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Input$3e$__["Input"], {
                        placeholder: "Max"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/hr/employees.tsx",
                        lineNumber: 80,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/pages/hr/employees.tsx",
                    lineNumber: 75,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$form$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Form$3e$__["Form"].Item, {
                    name: "lastName",
                    label: "Nachname",
                    rules: [
                        {
                            required: true,
                            message: 'Bitte Nachname eingeben'
                        }
                    ],
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$input$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Input$3e$__["Input"], {
                        placeholder: "Mustermann"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/hr/employees.tsx",
                        lineNumber: 88,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/pages/hr/employees.tsx",
                    lineNumber: 83,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$form$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Form$3e$__["Form"].Item, {
                    name: "employeeNumber",
                    label: "Mitarbeiternummer",
                    rules: [
                        {
                            required: true,
                            message: 'Bitte Mitarbeiternummer eingeben'
                        }
                    ],
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$input$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Input$3e$__["Input"], {
                        placeholder: "EMP001"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/hr/employees.tsx",
                        lineNumber: 96,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/pages/hr/employees.tsx",
                    lineNumber: 91,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$form$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Form$3e$__["Form"].Item, {
                    name: "email",
                    label: "E-Mail",
                    rules: [
                        {
                            required: true,
                            message: 'Bitte E-Mail eingeben'
                        },
                        {
                            type: 'email',
                            message: 'Ungültige E-Mail'
                        }
                    ],
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$input$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Input$3e$__["Input"], {
                        placeholder: "max.mustermann@company.com"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/hr/employees.tsx",
                        lineNumber: 107,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/pages/hr/employees.tsx",
                    lineNumber: 99,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$form$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Form$3e$__["Form"].Item, {
                    name: "password",
                    label: "Passwort",
                    rules: [
                        {
                            required: true,
                            message: 'Bitte Passwort eingeben'
                        }
                    ],
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$input$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Input$3e$__["Input"].Password, {
                        placeholder: "Mindestens 8 Zeichen"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/hr/employees.tsx",
                        lineNumber: 115,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/pages/hr/employees.tsx",
                    lineNumber: 110,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$form$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Form$3e$__["Form"].Item, {
                    name: "position",
                    label: "Position",
                    rules: [
                        {
                            required: true,
                            message: 'Bitte Position eingeben'
                        }
                    ],
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$input$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Input$3e$__["Input"], {
                        placeholder: "Developer"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/hr/employees.tsx",
                        lineNumber: 123,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/pages/hr/employees.tsx",
                    lineNumber: 118,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$form$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Form$3e$__["Form"].Item, {
                    name: "department",
                    label: "Abteilung",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$input$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Input$3e$__["Input"], {
                        placeholder: "IT"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/hr/employees.tsx",
                        lineNumber: 127,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/pages/hr/employees.tsx",
                    lineNumber: 126,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$form$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Form$3e$__["Form"].Item, {
                    name: "employmentType",
                    label: "Beschäftigungsart",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$select$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$select$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"].Option, {
                                value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$types$2f$employee$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EmploymentType"].FULLTIME,
                                children: "Vollzeit"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/hr/employees.tsx",
                                lineNumber: 132,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$select$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"].Option, {
                                value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$types$2f$employee$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EmploymentType"].PARTTIME,
                                children: "Teilzeit"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/hr/employees.tsx",
                                lineNumber: 133,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$select$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"].Option, {
                                value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$types$2f$employee$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EmploymentType"].MINIJOB,
                                children: "Minijob"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/hr/employees.tsx",
                                lineNumber: 134,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$select$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"].Option, {
                                value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$types$2f$employee$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EmploymentType"].INTERN,
                                children: "Praktikant"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/hr/employees.tsx",
                                lineNumber: 135,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$select$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"].Option, {
                                value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$types$2f$employee$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EmploymentType"].OTHER,
                                children: "Sonstige"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/hr/employees.tsx",
                                lineNumber: 136,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/hr/employees.tsx",
                        lineNumber: 131,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/pages/hr/employees.tsx",
                    lineNumber: 130,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$form$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Form$3e$__["Form"].Item, {
                    name: "role",
                    label: "Rolle",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$select$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$select$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"].Option, {
                                value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$types$2f$employee$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["UserRole"].USER,
                                children: "Mitarbeiter"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/hr/employees.tsx",
                                lineNumber: 142,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$select$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"].Option, {
                                value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$types$2f$employee$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["UserRole"].ADMIN,
                                children: "Admin"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/hr/employees.tsx",
                                lineNumber: 143,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$select$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"].Option, {
                                value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$types$2f$employee$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["UserRole"].SUPERADMIN,
                                children: "Super Admin"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/hr/employees.tsx",
                                lineNumber: 144,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/hr/employees.tsx",
                        lineNumber: 141,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/pages/hr/employees.tsx",
                    lineNumber: 140,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    style: {
                        marginBottom: 16
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                            children: "Kleidungsgrößen (optional)"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/hr/employees.tsx",
                            lineNumber: 150,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$space$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__Space$3e$__["Space"].Compact, {
                            style: {
                                width: '100%'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$form$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Form$3e$__["Form"].Item, {
                                    name: [
                                        'clothingSizes',
                                        'top'
                                    ],
                                    style: {
                                        marginBottom: 0,
                                        flex: 1
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$input$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Input$3e$__["Input"], {
                                        placeholder: "Oberteil (L)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/hr/employees.tsx",
                                        lineNumber: 153,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/hr/employees.tsx",
                                    lineNumber: 152,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$form$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Form$3e$__["Form"].Item, {
                                    name: [
                                        'clothingSizes',
                                        'pants'
                                    ],
                                    style: {
                                        marginBottom: 0,
                                        flex: 1
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$input$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Input$3e$__["Input"], {
                                        placeholder: "Hose (32)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/hr/employees.tsx",
                                        lineNumber: 156,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/hr/employees.tsx",
                                    lineNumber: 155,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$form$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Form$3e$__["Form"].Item, {
                                    name: [
                                        'clothingSizes',
                                        'shoes'
                                    ],
                                    style: {
                                        marginBottom: 0,
                                        flex: 1
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$input$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Input$3e$__["Input"], {
                                        placeholder: "Schuhe (42)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/hr/employees.tsx",
                                        lineNumber: 159,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/hr/employees.tsx",
                                    lineNumber: 158,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/hr/employees.tsx",
                            lineNumber: 151,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/hr/employees.tsx",
                    lineNumber: 149,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    style: {
                        textAlign: 'right'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$space$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__Space$3e$__["Space"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$button$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__Button$3e$__["Button"], {
                                onClick: onCancel,
                                children: "Abbrechen"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/hr/employees.tsx",
                                lineNumber: 166,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$button$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__Button$3e$__["Button"], {
                                type: "primary",
                                htmlType: "submit",
                                loading: createEmployeeMutation.isPending,
                                children: "Erstellen"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/hr/employees.tsx",
                                lineNumber: 167,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/hr/employees.tsx",
                        lineNumber: 165,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/pages/hr/employees.tsx",
                    lineNumber: 164,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/hr/employees.tsx",
            lineNumber: 66,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/pages/hr/employees.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, this);
};
const EmployeesContent = ()=>{
    const [showCreateModal, setShowCreateModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const { data: employeesData, isLoading, error, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$hooks$2f$useEmployees$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useEmployees"])();
    const handleCreateSuccess = ()=>{
        setShowCreateModal(false);
        refetch();
    };
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gray-50 flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-bold text-red-600 mb-4",
                        children: "Backend-Verbindung fehlgeschlagen"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/hr/employees.tsx",
                        lineNumber: 194,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "text-gray-600 mb-4",
                        children: "Stelle sicher, dass das Backend auf http://localhost:8001 läuft"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/hr/employees.tsx",
                        lineNumber: 197,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$button$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__Button$3e$__["Button"], {
                        type: "primary",
                        onClick: ()=>refetch(),
                        children: "Erneut versuchen"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/hr/employees.tsx",
                        lineNumber: 200,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/hr/employees.tsx",
                lineNumber: 193,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/pages/hr/employees.tsx",
            lineNumber: 192,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50 p-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                    className: "text-3xl font-bold text-gray-900",
                                    children: "Mitarbeiter Verwaltung"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/hr/employees.tsx",
                                    lineNumber: 214,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-gray-600 mt-2",
                                    children: "Live API Integration Test - Backend: http://localhost:8001"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/hr/employees.tsx",
                                    lineNumber: 217,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/hr/employees.tsx",
                            lineNumber: 213,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$space$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__Space$3e$__["Space"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$button$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__Button$3e$__["Button"], {
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ant$2d$design$2f$icons$2f$es$2f$icons$2f$ReloadOutlined$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ReloadOutlined$3e$__["ReloadOutlined"], {}, void 0, false, {
                                        fileName: "[project]/src/pages/hr/employees.tsx",
                                        lineNumber: 223,
                                        columnNumber: 21
                                    }, void 0),
                                    onClick: ()=>refetch(),
                                    loading: isLoading,
                                    children: "Aktualisieren"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/hr/employees.tsx",
                                    lineNumber: 222,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$button$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__Button$3e$__["Button"], {
                                    type: "primary",
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ant$2d$design$2f$icons$2f$es$2f$icons$2f$UserAddOutlined$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserAddOutlined$3e$__["UserAddOutlined"], {}, void 0, false, {
                                        fileName: "[project]/src/pages/hr/employees.tsx",
                                        lineNumber: 231,
                                        columnNumber: 21
                                    }, void 0),
                                    onClick: ()=>setShowCreateModal(true),
                                    children: "Mitarbeiter hinzufügen"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/hr/employees.tsx",
                                    lineNumber: 229,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/hr/employees.tsx",
                            lineNumber: 221,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/hr/employees.tsx",
                    lineNumber: 212,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg shadow p-6 mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-semibold text-gray-800 mb-4",
                            children: "Integration Status"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/hr/employees.tsx",
                            lineNumber: 241,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center space-x-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "w-3 h-3 bg-green-500 rounded-full"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/hr/employees.tsx",
                                            lineNumber: 246,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            children: "Backend: http://localhost:8001"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/hr/employees.tsx",
                                            lineNumber: 247,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/hr/employees.tsx",
                                    lineNumber: 245,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center space-x-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "w-3 h-3 bg-green-500 rounded-full"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/hr/employees.tsx",
                                            lineNumber: 250,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            children: "Frontend: http://localhost:3001"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/hr/employees.tsx",
                                            lineNumber: 251,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/hr/employees.tsx",
                                    lineNumber: 249,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center space-x-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "w-3 h-3 bg-green-500 rounded-full"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/hr/employees.tsx",
                                            lineNumber: 254,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            children: "SQLite Datenbank: ✅"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/hr/employees.tsx",
                                            lineNumber: 255,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/hr/employees.tsx",
                                    lineNumber: 253,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/hr/employees.tsx",
                            lineNumber: 244,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/hr/employees.tsx",
                    lineNumber: 240,
                    columnNumber: 9
                }, this),
                isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "text-center py-12",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "text-lg text-gray-600",
                        children: "Lade Mitarbeiter..."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/hr/employees.tsx",
                        lineNumber: 263,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/pages/hr/employees.tsx",
                    lineNumber: 262,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between mb-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-semibold text-gray-800",
                                children: [
                                    "Mitarbeiter (",
                                    employeesData?.total || 0,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/hr/employees.tsx",
                                lineNumber: 268,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/pages/hr/employees.tsx",
                            lineNumber: 267,
                            columnNumber: 13
                        }, this),
                        employeesData?.employees?.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-lg shadow p-12 text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "text-gray-500 mb-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ant$2d$design$2f$icons$2f$es$2f$icons$2f$UserAddOutlined$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserAddOutlined$3e$__["UserAddOutlined"], {
                                        style: {
                                            fontSize: 48
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/hr/employees.tsx",
                                        lineNumber: 276,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/hr/employees.tsx",
                                    lineNumber: 275,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-medium text-gray-900 mb-2",
                                    children: "Noch keine Mitarbeiter"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/hr/employees.tsx",
                                    lineNumber: 278,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-gray-600 mb-6",
                                    children: "Erstelle den ersten Mitarbeiter, um die API-Integration zu testen."
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/hr/employees.tsx",
                                    lineNumber: 281,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$button$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__Button$3e$__["Button"], {
                                    type: "primary",
                                    size: "large",
                                    onClick: ()=>setShowCreateModal(true),
                                    children: "Ersten Mitarbeiter erstellen"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/hr/employees.tsx",
                                    lineNumber: 284,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/hr/employees.tsx",
                            lineNumber: 274,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                            children: employeesData?.employees?.map((employee)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$hr$2f$components$2f$EmployeeCard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["EmployeeCard"], {
                                    employee: employee,
                                    onEdit: (emp)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$message$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__message$3e$__["message"].info(`Edit: ${emp.fullName}`),
                                    onDelete: (emp)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$message$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__message$3e$__["message"].info(`Delete: ${emp.fullName}`),
                                    onSendOnboarding: (emp)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$message$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__message$3e$__["message"].info(`Onboarding: ${emp.fullName}`)
                                }, employee.id, false, {
                                    fileName: "[project]/src/pages/hr/employees.tsx",
                                    lineNumber: 295,
                                    columnNumber: 19
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/pages/hr/employees.tsx",
                            lineNumber: 293,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/hr/employees.tsx",
                    lineNumber: 266,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(CreateEmployeeModal, {
                    visible: showCreateModal,
                    onCancel: ()=>setShowCreateModal(false),
                    onSuccess: handleCreateSuccess
                }, void 0, false, {
                    fileName: "[project]/src/pages/hr/employees.tsx",
                    lineNumber: 309,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/hr/employees.tsx",
            lineNumber: 210,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/pages/hr/employees.tsx",
        lineNumber: 209,
        columnNumber: 5
    }, this);
};
function EmployeesPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$tanstack$2f$react$2d$query__$5b$external$5d$__$2840$tanstack$2f$react$2d$query$2c$__esm_import$29$__["QueryClientProvider"], {
        client: queryClient,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$config$2d$provider$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__ConfigProvider$3e$__["ConfigProvider"], {
            theme: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$antd$2d$theme$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["antdTheme"],
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(EmployeesContent, {}, void 0, false, {
                fileName: "[project]/src/pages/hr/employees.tsx",
                lineNumber: 323,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/pages/hr/employees.tsx",
            lineNumber: 322,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/pages/hr/employees.tsx",
        lineNumber: 321,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__4273084d._.js.map