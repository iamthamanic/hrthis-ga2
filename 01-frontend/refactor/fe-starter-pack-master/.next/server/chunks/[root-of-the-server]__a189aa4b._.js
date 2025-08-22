module.exports = {

"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next-auth [external] (next-auth, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next-auth", () => require("next-auth"));

module.exports = mod;
}}),
"[project]/src/config/settings.ts [api] (ecmascript)": ((__turbopack_context__) => {
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
"[externals]/next-auth/providers/credentials [external] (next-auth/providers/credentials, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next-auth/providers/credentials", () => require("next-auth/providers/credentials"));

module.exports = mod;
}}),
"[project]/src/server/auth/config.ts [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "authConfig": (()=>authConfig)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$settings$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/settings.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$providers$2f$credentials__$5b$external$5d$__$28$next$2d$auth$2f$providers$2f$credentials$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/next-auth/providers/credentials [external] (next-auth/providers/credentials, cjs)");
;
;
const authConfig = {
    providers: [
        (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$providers$2f$credentials__$5b$external$5d$__$28$next$2d$auth$2f$providers$2f$credentials$2c$__cjs$29$__["default"])({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "email@example.com"
                },
                password: {
                    label: "Password",
                    type: "password"
                },
                role: {
                    label: "Role",
                    type: "text"
                }
            },
            async authorize (credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }
                if (credentials.email === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$settings$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["settings"].auth.demoAccount.email && credentials.password === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$settings$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["settings"].auth.demoAccount.password) {
                    return new Promise((resolve)=>{
                        setTimeout(()=>{
                            resolve({
                                id: "1",
                                email: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$settings$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["settings"].auth.demoAccount.email,
                                name: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$settings$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["settings"].auth.demoAccount.name,
                                role: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$settings$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["settings"].auth.demoAccount.role
                            });
                        }, 1000);
                    });
                }
            // try {
            //   const response = await axios.post('/auth/login', {
            //     email: credentials.email,
            //     password: credentials.password
            //   }, {
            //     withCredentials: true
            //   });
            //   if (response.data.status === 'success') {
            //     const userData = response.data.result;
            //     return {
            //       id: userData.id,
            //       email: userData.email,
            //       firstName: userData.firstName,
            //       lastName: userData.lastName,
            //       name: `${userData.firstName} ${userData.lastName}`,
            //       role: userData.role,
            //       token: userData.token
            //     };
            //   }
            //   return null;
            // } catch (error) {
            //   console.error('Authentication error:', error);
            //   return null;
            // }
            }
        })
    ],
    callbacks: {
        jwt: ({ token, user })=>{
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.accessToken = user.token;
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },
        session: ({ session, token })=>{
            if (token && session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.token = token.accessToken;
                session.user.name = token.name;
                session.user.email = token.email;
            }
            return session;
        }
    },
    pages: {
        signIn: "/auth/login",
        error: "/auth/error"
    },
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: "jwt"
    }
};
}}),
"[project]/src/pages/api/auth/[...nextauth].ts [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth__$5b$external$5d$__$28$next$2d$auth$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/next-auth [external] (next-auth, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$auth$2f$config$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/auth/config.ts [api] (ecmascript)");
;
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth__$5b$external$5d$__$28$next$2d$auth$2c$__cjs$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$auth$2f$config$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["authConfig"]);
}}),
"[project]/node_modules/next/dist/esm/server/route-modules/pages-api/module.compiled.js [api] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
if ("TURBOPACK compile-time falsy", 0) {
    "TURBOPACK unreachable";
} else {
    if ("TURBOPACK compile-time truthy", 1) {
        if ("TURBOPACK compile-time truthy", 1) {
            module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)");
        } else {
            "TURBOPACK unreachable";
        }
    } else {
        "TURBOPACK unreachable";
    }
} //# sourceMappingURL=module.compiled.js.map
}}),
"[project]/node_modules/next/dist/esm/server/route-kind.js [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "RouteKind": (()=>RouteKind)
});
var RouteKind = /*#__PURE__*/ function(RouteKind) {
    /**
   * `PAGES` represents all the React pages that are under `pages/`.
   */ RouteKind["PAGES"] = "PAGES";
    /**
   * `PAGES_API` represents all the API routes under `pages/api/`.
   */ RouteKind["PAGES_API"] = "PAGES_API";
    /**
   * `APP_PAGE` represents all the React pages that are under `app/` with the
   * filename of `page.{j,t}s{,x}`.
   */ RouteKind["APP_PAGE"] = "APP_PAGE";
    /**
   * `APP_ROUTE` represents all the API routes and metadata routes that are under `app/` with the
   * filename of `route.{j,t}s{,x}`.
   */ RouteKind["APP_ROUTE"] = "APP_ROUTE";
    /**
   * `IMAGE` represents all the images that are generated by `next/image`.
   */ RouteKind["IMAGE"] = "IMAGE";
    return RouteKind;
}({}); //# sourceMappingURL=route-kind.js.map
}}),
"[project]/node_modules/next/dist/esm/build/templates/helpers.js [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * Hoists a name from a module or promised module.
 *
 * @param module the module to hoist the name from
 * @param name the name to hoist
 * @returns the value on the module (or promised module)
 */ __turbopack_context__.s({
    "hoist": (()=>hoist)
});
function hoist(module, name) {
    // If the name is available in the module, return it.
    if (name in module) {
        return module[name];
    }
    // If a property called `then` exists, assume it's a promise and
    // return a promise that resolves to the name.
    if ('then' in module && typeof module.then === 'function') {
        return module.then((mod)=>hoist(mod, name));
    }
    // If we're trying to hoise the default export, and the module is a function,
    // return the module itself.
    if (typeof module === 'function' && name === 'default') {
        return module;
    }
    // Otherwise, return undefined.
    return undefined;
} //# sourceMappingURL=helpers.js.map
}}),
"[project]/node_modules/next/dist/esm/build/templates/pages-api.js { INNER_PAGE => \"[project]/src/pages/api/auth/[...nextauth].ts [api] (ecmascript)\" } [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "config": (()=>config),
    "default": (()=>__TURBOPACK__default__export__),
    "routeModule": (()=>routeModule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$modules$2f$pages$2d$api$2f$module$2e$compiled$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/route-modules/pages-api/module.compiled.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$kind$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/route-kind.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/build/templates/helpers.js [api] (ecmascript)");
// Import the userland code.
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$auth$2f5b2e2e2e$nextauth$5d2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/pages/api/auth/[...nextauth].ts [api] (ecmascript)");
;
;
;
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$api$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$auth$2f5b2e2e2e$nextauth$5d2e$ts__$5b$api$5d$__$28$ecmascript$29$__, 'default');
const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$api$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$auth$2f5b2e2e2e$nextauth$5d2e$ts__$5b$api$5d$__$28$ecmascript$29$__, 'config');
const routeModule = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$modules$2f$pages$2d$api$2f$module$2e$compiled$2e$js__$5b$api$5d$__$28$ecmascript$29$__["PagesAPIRouteModule"]({
    definition: {
        kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$kind$2e$js__$5b$api$5d$__$28$ecmascript$29$__["RouteKind"].PAGES_API,
        page: "/api/auth/[...nextauth]",
        pathname: "/api/auth/[...nextauth]",
        // The following aren't used in production.
        bundlePath: '',
        filename: ''
    },
    userland: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$auth$2f5b2e2e2e$nextauth$5d2e$ts__$5b$api$5d$__$28$ecmascript$29$__
}); //# sourceMappingURL=pages-api.js.map
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__a189aa4b._.js.map