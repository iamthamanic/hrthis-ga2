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
"[project]/src/features/hr/components/EmployeeCardSimple.tsx [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "EmployeeCardSimple": (()=>EmployeeCardSimple)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$badge$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Badge$3e$__ = __turbopack_context__.i("[project]/node_modules/antd/es/badge/index.js [ssr] (ecmascript) <export default as Badge>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ant$2d$design$2f$icons$2f$es$2f$icons$2f$UserOutlined$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserOutlined$3e$__ = __turbopack_context__.i("[project]/node_modules/@ant-design/icons/es/icons/UserOutlined.js [ssr] (ecmascript) <export default as UserOutlined>");
;
;
;
const EmployeeCardSimple = ({ employee, onEdit, onDelete, onSendOnboarding })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "w-full p-4 border rounded-lg shadow hover:shadow-md transition-shadow",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-between",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "flex items-center space-x-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ant$2d$design$2f$icons$2f$es$2f$icons$2f$UserOutlined$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserOutlined$3e$__["UserOutlined"], {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                    className: "font-semibold text-gray-900",
                                    children: employee.fullName
                                }, void 0, false, {
                                    fileName: "[project]/src/features/hr/components/EmployeeCardSimple.tsx",
                                    lineNumber: 33,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "flex items-center space-x-2",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2f$es$2f$badge$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Badge$3e$__["Badge"], {
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
}}),
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
"[project]/src/pages/hr/employees.tsx [ssr] (ecmascript)": (() => {{

throw new Error("An error occurred while generating the chunk item [project]/src/pages/hr/employees.tsx [ssr] (ecmascript)\n\nCaused by:\n- CJS module can't be async.\n\nDebug info:\n- An error occurred while generating the chunk item [project]/src/pages/hr/employees.tsx [ssr] (ecmascript)\n- Execution of EcmascriptChunkItemContent::new failed\n- CJS module can't be async.");

}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__45385a94._.js.map