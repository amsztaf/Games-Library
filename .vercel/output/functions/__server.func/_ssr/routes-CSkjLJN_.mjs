import { T as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as Heart } from "../_libs/lucide-react.mjs";
import { _ as cn, a as CoverArt, d as isPlatinum, f as sortGames, h as Button, i as FilterBar, l as achievementRatio, o as DiscArt, r as AppShell, s as useLibrary, u as applyLibraryFilters } from "./router-BEQdWJ5f.mjs";
import { t as Progress } from "./progress-CDjcpnz_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CSkjLJN_.js
var import_jsx_runtime = require_jsx_runtime();
function GameCard({ game, view }) {
	const toggleFavorite = useLibrary((s) => s.toggleFavorite);
	const ratio = achievementRatio(game);
	const platinum = isPlatinum(game);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "group relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/gra/$id",
			params: { id: game.id },
			className: "block rounded-xl p-1.5 transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[var(--shadow-border-hover)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-lg bg-card shadow-[var(--shadow-border)]",
				children: view === "discs" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-center bg-surface p-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiscArt, {
						game,
						className: "w-full max-w-[220px]"
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoverArt, { game })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 space-y-1.5 px-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "line-clamp-2 font-display text-[15px] leading-snug font-medium tracking-tight text-fg",
						children: game.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-2 text-xs text-muted tabular-nums",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: game.year ?? "—" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-subtle",
								children: "·"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: game.rating != null ? game.rating.toFixed(1) : "brak oceny" })
						]
					}),
					game.achievementsTotal > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: ratio * 100 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-[11px] text-subtle tabular-nums",
							children: [
								game.achievementsUnlocked,
								"/",
								game.achievementsTotal,
								platinum ? " · 100%" : ""
							]
						})]
					}) : null
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: (event) => {
				event.preventDefault();
				event.stopPropagation();
				toggleFavorite(game.id);
			},
			className: cn("absolute top-3 left-3 z-10 inline-flex size-11 items-center justify-center rounded-full bg-bg/70 text-fg backdrop-blur-sm transition-colors", game.favorite ? "text-primary" : "text-fg/80 hover:text-fg"),
			"aria-label": game.favorite ? "Usuń z ulubionych" : "Dodaj do ulubionych",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("size-4", game.favorite && "fill-primary text-primary") })
		})]
	});
}
function Home() {
	const games = useLibrary((s) => s.games);
	const filters = useLibrary((s) => s.filters);
	const prefs = useLibrary((s) => s.prefs);
	const openCreate = useLibrary((s) => s.openCreate);
	const restoreSamples = useLibrary((s) => s.restoreSamples);
	const visible = sortGames(applyLibraryFilters(games, filters), prefs.sort);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterBar, {}), visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-20 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-2xl",
				children: "Półka jest pusta"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-sm text-sm text-muted",
				children: games.length === 0 ? "Dodaj pierwszą grę albo wczytaj przykładową kolekcję." : "Żadna gra nie pasuje do wyszukiwania i filtrów."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-wrap justify-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					onClick: openCreate,
					children: "Dodaj grę"
				}), games.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "secondary",
					onClick: restoreSamples,
					children: "Wczytaj przykłady"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "secondary",
					onClick: () => useLibrary.getState().setFilters({
						query: "",
						favoritesOnly: false,
						completeOnly: false,
						incompleteOnly: false,
						status: "all"
					}),
					children: "Wyczyść filtry"
				})]
			})
		]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
		children: visible.map((game) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameCard, {
			game,
			view: prefs.view
		}, game.id))
	})] });
}
//#endregion
export { Home as component };
