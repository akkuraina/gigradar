(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/app/artists/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>ArtistsPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function ArtistsPage() {
    _s();
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [genre, setGenre] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [artists, setArtists] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedArtist, setSelectedArtist] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showEvents, setShowEvents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loadingEvents, setLoadingEvents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Load popular artists by default
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ArtistsPage.useEffect": ()=>{
            loadPopularArtists();
        }
    }["ArtistsPage.useEffect"], []);
    const loadPopularArtists = async ()=>{
        setLoading(true);
        setError(null);
        try {
            // Use a simple search for popular artists instead of the new endpoint
            const popularArtistNames = [
                'Drake',
                'Taylor Swift',
                'Ed Sheeran',
                'Beyoncé',
                'The Weeknd',
                'Post Malone',
                'Ariana Grande',
                'Bad Bunny',
                'Dua Lipa',
                'Justin Bieber'
            ];
            const allArtists = [];
            for (const artistName of popularArtistNames){
                try {
                    console.log(`Searching for ${artistName}...`);
                    const response = await fetch(`/api/external?type=spotify-artists&query=${encodeURIComponent(artistName)}&limit=1`);
                    const data = await response.json();
                    console.log(`Response for ${artistName}:`, data);
                    if (data.success && data.data && data.data.length > 0) {
                        const artist = data.data[0];
                        allArtists.push({
                            id: artist.id,
                            name: artist.name,
                            genres: artist.genres || [],
                            bio: `Popularity: ${artist.popularity}/100`,
                            image: artist.images?.[0]?.url || '/globe.svg',
                            followers: artist.followers?.total,
                            popularity: artist.popularity,
                            external_urls: artist.external_urls
                        });
                        console.log(`Added ${artist.name} to list`);
                    }
                } catch (err) {
                    console.log(`Failed to load ${artistName}:`, err);
                }
            }
            console.log('Final artists list:', allArtists);
            if (allArtists.length > 0) {
                setArtists(allArtists);
            } else {
                // Fallback to mock data if API fails
                console.log('Using fallback mock data');
                const fallbackArtists = [
                    {
                        id: '1',
                        name: 'Drake',
                        genres: [
                            'Hip-Hop',
                            'Rap'
                        ],
                        bio: 'Popularity: 95/100',
                        image: '/globe.svg',
                        followers: 50000000,
                        popularity: 95,
                        external_urls: {
                            spotify: 'https://open.spotify.com/artist/3TVXtAsR1Inumwj472S9r4'
                        }
                    },
                    {
                        id: '2',
                        name: 'Taylor Swift',
                        genres: [
                            'Pop',
                            'Country'
                        ],
                        bio: 'Popularity: 98/100',
                        image: '/globe.svg',
                        followers: 55000000,
                        popularity: 98,
                        external_urls: {
                            spotify: 'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02'
                        }
                    },
                    {
                        id: '3',
                        name: 'Ed Sheeran',
                        genres: [
                            'Pop',
                            'Folk'
                        ],
                        bio: 'Popularity: 92/100',
                        image: '/globe.svg',
                        followers: 45000000,
                        popularity: 92,
                        external_urls: {
                            spotify: 'https://open.spotify.com/artist/6eUKZXaKkcviH0Ku9w2n3V'
                        }
                    },
                    {
                        id: '4',
                        name: 'Beyoncé',
                        genres: [
                            'R&B',
                            'Pop'
                        ],
                        bio: 'Popularity: 96/100',
                        image: '/globe.svg',
                        followers: 48000000,
                        popularity: 96,
                        external_urls: {
                            spotify: 'https://open.spotify.com/artist/6vWDO969PvNqNYHIOW5v0m'
                        }
                    },
                    {
                        id: '5',
                        name: 'The Weeknd',
                        genres: [
                            'R&B',
                            'Pop'
                        ],
                        bio: 'Popularity: 94/100',
                        image: '/globe.svg',
                        followers: 42000000,
                        popularity: 94,
                        external_urls: {
                            spotify: 'https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ'
                        }
                    },
                    {
                        id: '6',
                        name: 'Post Malone',
                        genres: [
                            'Hip-Hop',
                            'Pop'
                        ],
                        bio: 'Popularity: 93/100',
                        image: '/globe.svg',
                        followers: 38000000,
                        popularity: 93,
                        external_urls: {
                            spotify: 'https://open.spotify.com/artist/246dkjvS1zLTtiykXe5h60'
                        }
                    },
                    {
                        id: '7',
                        name: 'Ariana Grande',
                        genres: [
                            'Pop',
                            'R&B'
                        ],
                        bio: 'Popularity: 97/100',
                        image: '/globe.svg',
                        followers: 52000000,
                        popularity: 97,
                        external_urls: {
                            spotify: 'https://open.spotify.com/artist/66CXWjxzNUsdJxJ2JdwvnR'
                        }
                    },
                    {
                        id: '8',
                        name: 'Bad Bunny',
                        genres: [
                            'Reggaeton',
                            'Latin'
                        ],
                        bio: 'Popularity: 99/100',
                        image: '/globe.svg',
                        followers: 58000000,
                        popularity: 99,
                        external_urls: {
                            spotify: 'https://open.spotify.com/artist/4q3ewBCX7sLwd24euuV69X'
                        }
                    },
                    {
                        id: '9',
                        name: 'Dua Lipa',
                        genres: [
                            'Pop',
                            'Dance'
                        ],
                        bio: 'Popularity: 91/100',
                        image: '/globe.svg',
                        followers: 35000000,
                        popularity: 91,
                        external_urls: {
                            spotify: 'https://open.spotify.com/artist/6M2wZ9GZgrQXHCFfjv46we'
                        }
                    },
                    {
                        id: '10',
                        name: 'Justin Bieber',
                        genres: [
                            'Pop',
                            'R&B'
                        ],
                        bio: 'Popularity: 90/100',
                        image: '/globe.svg',
                        followers: 40000000,
                        popularity: 90,
                        external_urls: {
                            spotify: 'https://open.spotify.com/artist/1uNFoZAHBGtllmzznpCI3s'
                        }
                    }
                ];
                setArtists(fallbackArtists);
            }
        } catch (err) {
            console.error('Error loading popular artists:', err);
            setError('Failed to load popular artists');
        } finally{
            setLoading(false);
        }
    };
    const loadArtistEvents = async (artistName)=>{
        setLoadingEvents(true);
        try {
            // Use Bandsintown API to get artist events
            const response = await fetch(`/api/external?type=bandsintown-artists&query=${encodeURIComponent(artistName)}&limit=5`);
            const data = await response.json();
            if (data.success && data.data) {
                return data.data;
            }
            return [];
        } catch (err) {
            console.error('Failed to load artist events:', err);
            return [];
        } finally{
            setLoadingEvents(false);
        }
    };
    const handleArtistEvents = async (artist)=>{
        setSelectedArtist(artist);
        setShowEvents(true);
        // Load upcoming events for this artist
        const events = await loadArtistEvents(artist.name);
        setSelectedArtist({
            ...artist,
            upcomingEvents: events
        });
    };
    const searchArtists = async (query)=>{
        if (!query.trim()) {
            loadPopularArtists();
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/external?type=spotify-artists&query=${encodeURIComponent(query)}&limit=20`);
            const data = await response.json();
            if (data.success && data.data) {
                const formattedArtists = data.data.map((artist)=>({
                        id: artist.id,
                        name: artist.name,
                        genres: artist.genres || [],
                        bio: `Popularity: ${artist.popularity}/100`,
                        image: artist.images?.[0]?.url || '/globe.svg',
                        followers: artist.followers?.total,
                        popularity: artist.popularity,
                        external_urls: artist.external_urls
                    }));
                setArtists(formattedArtists);
            } else {
                setError(data.error || 'Failed to search artists');
            }
        } catch (err) {
            setError('Failed to search artists');
        } finally{
            setLoading(false);
        }
    };
    // Debounced search
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ArtistsPage.useEffect": ()=>{
            const timeoutId = setTimeout({
                "ArtistsPage.useEffect.timeoutId": ()=>{
                    if (search.trim()) {
                        searchArtists(search);
                    } else {
                        loadPopularArtists();
                    }
                }
            }["ArtistsPage.useEffect.timeoutId"], 500);
            return ({
                "ArtistsPage.useEffect": ()=>clearTimeout(timeoutId)
            })["ArtistsPage.useEffect"];
        }
    }["ArtistsPage.useEffect"], [
        search
    ]);
    const genres = [
        'all',
        ...Array.from(new Set(artists.flatMap((a)=>a.genres)))
    ];
    const filteredArtists = artists.filter((artist)=>{
        const matchesGenre = genre === 'all' || artist.genres.some((g)=>g.toLowerCase().includes(genre.toLowerCase()));
        const matchesSearch = artist.name.toLowerCase().includes(search.toLowerCase()) || artist.bio && artist.bio.toLowerCase().includes(search.toLowerCase());
        return matchesGenre && matchesSearch;
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-transparent premium-space",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-6xl mx-auto px-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center mb-12",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-4xl md:text-6xl font-extrabold gradient-text mb-3",
                                children: "Artists"
                            }, void 0, false, {
                                fileName: "[project]/src/app/artists/page.tsx",
                                lineNumber: 277,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-lg text-gray-500 dark:text-gray-300",
                                children: "Find and explore trending and underground artists"
                            }, void 0, false, {
                                fileName: "[project]/src/app/artists/page.tsx",
                                lineNumber: 278,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/artists/page.tsx",
                        lineNumber: 276,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col md:flex-row gap-4 mb-10 justify-center items-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            placeholder: "Search artists...",
                            className: "w-full md:w-80 px-4 py-3 glass rounded-xl focus:ring-2 focus:ring-primary text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500",
                            value: search,
                            onChange: (e)=>setSearch(e.target.value)
                        }, void 0, false, {
                            fileName: "[project]/src/app/artists/page.tsx",
                            lineNumber: 281,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/artists/page.tsx",
                        lineNumber: 280,
                        columnNumber: 9
                    }, this),
                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-12",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-center space-x-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/artists/page.tsx",
                                    lineNumber: 293,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-lg text-gray-500",
                                    children: "Loading artists..."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/artists/page.tsx",
                                    lineNumber: 294,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/artists/page.tsx",
                            lineNumber: 292,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/artists/page.tsx",
                        lineNumber: 291,
                        columnNumber: 11
                    }, this) : error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-12",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "glass rounded-2xl p-8 max-w-md mx-auto",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-lg text-red-400 mb-4",
                                    children: error
                                }, void 0, false, {
                                    fileName: "[project]/src/app/artists/page.tsx",
                                    lineNumber: 300,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>window.location.reload(),
                                    className: "bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-secondary transition-colors",
                                    children: "Try Again"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/artists/page.tsx",
                                    lineNumber: 301,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/artists/page.tsx",
                            lineNumber: 299,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/artists/page.tsx",
                        lineNumber: 298,
                        columnNumber: 11
                    }, this) : artists.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-12",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "glass rounded-2xl p-8 max-w-md mx-auto",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-3xl mb-4",
                                    children: "🎤"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/artists/page.tsx",
                                    lineNumber: 312,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-medium text-gray-800 dark:text-gray-100 mb-2",
                                    children: "No artists found"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/artists/page.tsx",
                                    lineNumber: 313,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-500 dark:text-gray-300",
                                    children: "Try a different search or check back later."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/artists/page.tsx",
                                    lineNumber: 314,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/artists/page.tsx",
                            lineNumber: 311,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/artists/page.tsx",
                        lineNumber: 310,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8",
                        children: artists.map((artist)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "glass rounded-2xl p-6 flex flex-col items-center hover-lift cursor-pointer transition-all",
                                onClick: ()=>setSelectedArtist(artist),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: artist.image || '/globe.svg',
                                        alt: artist.name,
                                        className: "w-24 h-24 object-cover rounded-full mb-4 border border-primary/10 shadow-none"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/artists/page.tsx",
                                        lineNumber: 325,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1 text-center",
                                        children: artist.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/artists/page.tsx",
                                        lineNumber: 330,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-500 dark:text-gray-300 mb-2 text-center",
                                        children: artist.genres?.join(', ')
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/artists/page.tsx",
                                        lineNumber: 331,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-400 dark:text-gray-500 text-center",
                                        children: artist.bio
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/artists/page.tsx",
                                        lineNumber: 332,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, artist.id, true, {
                                fileName: "[project]/src/app/artists/page.tsx",
                                lineNumber: 320,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/artists/page.tsx",
                        lineNumber: 318,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/artists/page.tsx",
                lineNumber: 275,
                columnNumber: 7
            }, this),
            selectedArtist && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4",
                onClick: ()=>setSelectedArtist(null),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "glass rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 relative",
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setSelectedArtist(null),
                            className: "absolute top-4 right-4 text-gray-400 hover:text-primary text-2xl font-bold",
                            "aria-label": "Close",
                            children: "×"
                        }, void 0, false, {
                            fileName: "[project]/src/app/artists/page.tsx",
                            lineNumber: 342,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col md:flex-row gap-8 items-center mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col items-center gap-2",
                                    children: [
                                        Array.isArray(selectedArtist.images) && selectedArtist.images.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-row gap-2 mb-2",
                                            children: selectedArtist.images.map((img, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: img.url,
                                                    alt: selectedArtist.name,
                                                    className: "w-24 h-24 object-cover rounded-full border border-primary/10 shadow-none"
                                                }, idx, false, {
                                                    fileName: "[project]/src/app/artists/page.tsx",
                                                    lineNumber: 355,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/artists/page.tsx",
                                            lineNumber: 353,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: selectedArtist.image || '/globe.svg',
                                            alt: selectedArtist.name,
                                            className: "w-24 h-24 object-cover rounded-full border border-primary/10 shadow-none mb-2"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/artists/page.tsx",
                                            lineNumber: 364,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: selectedArtist.external_urls?.spotify,
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            className: "inline-block mt-2 text-primary underline hover:opacity-80 text-sm",
                                            children: "Open in Spotify"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/artists/page.tsx",
                                            lineNumber: 370,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/artists/page.tsx",
                                    lineNumber: 350,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2",
                                            children: selectedArtist.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/artists/page.tsx",
                                            lineNumber: 380,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-500 dark:text-gray-300 mb-2",
                                            children: selectedArtist.genres?.join(', ')
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/artists/page.tsx",
                                            lineNumber: 381,
                                            columnNumber: 17
                                        }, this),
                                        selectedArtist.followers && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-400 dark:text-gray-500 mb-1",
                                            children: [
                                                "Followers: ",
                                                selectedArtist.followers.toLocaleString()
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/artists/page.tsx",
                                            lineNumber: 383,
                                            columnNumber: 19
                                        }, this),
                                        selectedArtist.popularity && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-400 dark:text-gray-500 mb-1",
                                            children: [
                                                "Popularity: ",
                                                selectedArtist.popularity,
                                                "/100"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/artists/page.tsx",
                                            lineNumber: 386,
                                            columnNumber: 19
                                        }, this),
                                        selectedArtist.bio && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-4 text-gray-600 dark:text-gray-300 text-base whitespace-pre-line",
                                            children: selectedArtist.bio
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/artists/page.tsx",
                                            lineNumber: 390,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/artists/page.tsx",
                                    lineNumber: 379,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/artists/page.tsx",
                            lineNumber: 349,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/artists/page.tsx",
                    lineNumber: 341,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/artists/page.tsx",
                lineNumber: 340,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/artists/page.tsx",
        lineNumber: 274,
        columnNumber: 5
    }, this);
}
_s(ArtistsPage, "XsOVI50yAqLvjTWcsUTRE3V/E94=");
_c = ArtistsPage;
var _c;
__turbopack_context__.k.register(_c, "ArtistsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_app_artists_page_tsx_ad3d083e._.js.map