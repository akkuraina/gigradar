module.exports = {

"[project]/.next-internal/server/app/api/external/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/src/app/api/external/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
async function GET(request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const query = searchParams.get('query');
    const limit = searchParams.get('limit') || '20';
    const offset = searchParams.get('offset') || '0';
    const page = searchParams.get('page') || '1';
    const perPage = searchParams.get('perPage') || '20';
    if (!type) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Type parameter is required'
        }, {
            status: 400
        });
    }
    try {
        let url = `${BACKEND_URL}/api/external`;
        switch(type){
            case 'spotify-artists':
                if (!query) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: 'Query parameter is required for artist search'
                    }, {
                        status: 400
                    });
                }
                url += `/spotify/artists?query=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`;
                break;
            case 'spotify-indian-hip-hop':
                url += `/spotify/indian-hip-hop?limit=${limit}&offset=${offset}`;
                break;
            case 'spotify-new-releases':
                url += `/spotify/new-releases?country=IN&limit=${limit}&offset=${offset}`;
                break;
            case 'spotify-popular-artists':
                url += `/spotify/popular-artists?limit=${limit}`;
                break;
            case 'enrich-artist':
                if (!query) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: 'Query parameter is required for artist enrichment'
                    }, {
                        status: 400
                    });
                }
                url += `/enrich/artist/profile?artistName=${encodeURIComponent(query)}`;
                break;
            case 'bandsintown-events':
                const location = searchParams.get('location') || query;
                if (!location) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: 'Location parameter is required for event search'
                    }, {
                        status: 400
                    });
                }
                url += `/bandsintown/events?location=${encodeURIComponent(location)}&page=${page}&perPage=${perPage}`;
                break;
            case 'songkick-events':
                if (!query) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: 'Query parameter is required for events search'
                    }, {
                        status: 400
                    });
                }
                url += `/songkick/events?location=${encodeURIComponent(query)}&page=${page}&perPage=${perPage}`;
                break;
            case 'songkick-artists':
                if (!query) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: 'Query parameter is required for artist search'
                    }, {
                        status: 400
                    });
                }
                url += `/songkick/artists?artistName=${encodeURIComponent(query)}&page=${page}&perPage=${perPage}`;
                break;
            case 'bandsintown-venues':
                if (!query) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: 'Query parameter is required for venue search'
                    }, {
                        status: 400
                    });
                }
                url += `/bandsintown/venues?venueName=${encodeURIComponent(query)}&page=${page}&perPage=${perPage}`;
                break;
            case 'bandsintown-venue-events':
                const venueId = searchParams.get('venueId');
                if (!venueId) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: 'Venue ID parameter is required'
                    }, {
                        status: 400
                    });
                }
                url += `/bandsintown/venues/${venueId}/events?page=${page}&perPage=${perPage}`;
                break;
            case 'bandsintown-artists':
                if (!query) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: 'Query parameter is required for artist search'
                    }, {
                        status: 400
                    });
                }
                url += `/bandsintown/artists?artistName=${encodeURIComponent(query)}&page=${page}&perPage=${perPage}`;
                break;
            case 'genius-artists':
                if (!query) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: 'Query parameter is required for artist search'
                    }, {
                        status: 400
                    });
                }
                url += `/genius/artists?query=${encodeURIComponent(query)}&page=${page}&perPage=${perPage}`;
                break;
            default:
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Invalid type parameter'
                }, {
                    status: 400
                });
        }
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Backend API error: ${response.status}`);
        }
        const data = await response.json();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(data);
    } catch (error) {
        console.error('External API error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch data from external API'
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__cafbaa9b._.js.map