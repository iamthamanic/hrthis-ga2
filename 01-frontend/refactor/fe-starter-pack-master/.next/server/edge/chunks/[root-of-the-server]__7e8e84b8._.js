(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/[root-of-the-server]__7e8e84b8._.js", {

"[externals]/node:buffer [external] (node:buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}}),
"[project]/src/config/settings.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "settings": (()=>settings)
});
const settings = {
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || "Fe Starter Pack",
    siteDescription: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "Fe Starter Pack Description",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://sitename.com",
    apiBase: process.env.NEXT_PUBLIC_API_BASE || "https://backend-api.com",
    landingPage: process.env.NEXT_PUBLIC_LANDING_PAGE || "/",
    authPage: process.env.NEXT_PUBLIC_AUTH_PAGE || "/auth/login",
    accountPage: process.env.NEXT_PUBLIC_ACCOUNT_PAGE || "/account",
    dashboardPage: process.env.NEXT_PUBLIC_DASHBOARD_PAGE || "/authorized",
    adminPage: process.env.NEXT_PUBLIC_ADMIN_PAGE || "/admin",
    nextAuthSecret: process.env.AUTH_SECRET || "default-next-auth-secret",
    auth: {
        demoAccount: {
            email: "anna.admin@hrthis.de",
            password: "password",
            name: "Anna Admin",
            role: "admin"
        }
    }
};
}}),
"[project]/src/middleware.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// TODO: use exported config file instead hard coded strings
__turbopack_context__.s({
    "config": (()=>config),
    "middleware": (()=>middleware)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$jwt$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/jwt/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$settings$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/settings.ts [middleware-edge] (ecmascript)");
;
;
;
async function middleware(request) {
    // Skip Next.js internal requests
    if (request.nextUrl.pathname.startsWith("/_next")) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    const path = request.nextUrl.pathname;
    // Get the token using next-auth/jwt
    const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$jwt$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["getToken"])({
        req: request,
        secret: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$settings$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["settings"].nextAuthSecret
    });
    const isLoggedIn = !!token;
    const userRole = token?.role;
    // Handle root and auth pages for logged in users
    if (isLoggedIn) {
        // Redirect from root or auth pages to appropriate dashboard
        if (path === "/" || path.startsWith("/auth/")) {
            const url = new URL(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$settings$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["settings"].dashboardPage}`, request.url);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url);
        }
    } else {
        // Handle non-logged in users
        if (path.startsWith(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$settings$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["settings"].dashboardPage) || path.startsWith(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$settings$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["settings"].accountPage)) {
            const loginUrl = new URL(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$settings$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["settings"].authPage, request.url);
            loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(loginUrl);
        }
    }
    // Admin page protection
    if (path.startsWith(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$settings$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["settings"].adminPage)) {
        if (!isLoggedIn) {
            const loginUrl = new URL(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$settings$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["settings"].authPage, request.url);
            loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(loginUrl);
        }
        if (userRole !== "admin") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/", request.url));
        }
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)"
    ]
};
}}),
}]);

//# sourceMappingURL=%5Broot-of-the-server%5D__7e8e84b8._.js.map