import { i as __toESM } from "../_runtime.mjs";
import { E as require_react, T as require_jsx_runtime, a as Overlay2, c as Title2, i as Description2, n as Cancel, o as Portal2, r as Content2, s as Root2, t as Action } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Minus, d as Heart, m as ArrowLeft, o as Plus, r as Trash2, s as Pencil } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as cn, a as CoverArt, c as STATUS_LABEL, d as isPlatinum, g as buttonVariants, h as Button, l as achievementRatio, m as Label, n as Route, o as DiscArt, p as Input, r as AppShell, s as useLibrary, v as formatHours } from "./router-BEQdWJ5f.mjs";
import { t as Progress } from "./progress-CDjcpnz_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gra._id-DCIabYst.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AchievementControl({ game }) {
	const bumpAchievement = useLibrary((s) => s.bumpAchievement);
	const setAchievements = useLibrary((s) => s.setAchievements);
	const markPlatinum = useLibrary((s) => s.markPlatinum);
	const ratio = achievementRatio(game);
	const platinum = isPlatinum(game);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg",
					children: "Osiągnięcia"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Zmieniaj liczbę tutaj, bez wchodzenia w pełną edycję."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-display text-2xl tabular-nums",
					children: [game.achievementsUnlocked, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-base text-muted",
						children: ["/", game.achievementsTotal || "—"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
				value: ratio * 100,
				className: "h-2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "secondary",
						size: "icon",
						onClick: () => bumpAchievement(game.id, -1),
						"aria-label": "Minus jedno osiągnięcie",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "secondary",
						size: "icon",
						onClick: () => bumpAchievement(game.id, 1),
						"aria-label": "Plus jedno osiągnięcie",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: platinum ? "default" : "outline",
						onClick: () => markPlatinum(game.id),
						children: "Oznacz 100%"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Odblokowane" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: 0,
						value: game.achievementsUnlocked,
						onChange: (e) => setAchievements(game.id, Math.max(0, Number(e.target.value) || 0), game.achievementsTotal)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Łącznie" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: 0,
						value: game.achievementsTotal,
						onChange: (e) => setAchievements(game.id, game.achievementsUnlocked, Math.max(0, Number(e.target.value) || 0))
					})]
				})]
			})
		]
	});
}
var AlertDialog = Root2;
var AlertDialogPortal = Portal2;
function AlertDialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, {
		className: cn("fixed inset-0 z-50 bg-bg/70", className),
		...props
	});
}
function AlertDialogContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
		className: cn("fixed top-1/2 left-1/2 z-50 w-[min(420px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-surface p-5 text-fg shadow-[var(--shadow-border-hover)]", className),
		...props
	})] });
}
function AlertDialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("space-y-2", className),
		...props
	});
}
function AlertDialogFooter({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
		...props
	});
}
function AlertDialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
		className: cn("font-display text-lg font-medium", className),
		...props
	});
}
function AlertDialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
		className: cn("text-sm text-muted", className),
		...props
	});
}
function AlertDialogAction({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
		className: cn(buttonVariants(), className),
		...props
	});
}
function AlertDialogCancel({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
		className: cn(buttonVariants({ variant: "outline" }), className),
		...props
	});
}
function Badge({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full bg-card px-2.5 py-1 text-[11px] font-medium tracking-wide text-muted shadow-[var(--shadow-border)]", className),
		...props
	});
}
function parseYouTubeId(input) {
	const value = input.trim();
	if (!value) return null;
	if (/^[\w-]{11}$/.test(value)) return value;
	try {
		const url = new URL(value);
		const host = url.hostname.replace(/^www\./, "");
		if (host === "youtu.be") {
			const id = url.pathname.split("/").filter(Boolean)[0];
			return id && /^[\w-]{11}$/.test(id) ? id : null;
		}
		if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
			const v = url.searchParams.get("v");
			if (v && /^[\w-]{11}$/.test(v)) return v;
			const parts = url.pathname.split("/").filter(Boolean);
			if ((parts[0] === "embed" || parts[0] === "shorts" || parts[0] === "live") && parts[1] && /^[\w-]{11}$/.test(parts[1])) return parts[1];
		}
	} catch {
		return null;
	}
	return null;
}
function youtubeEmbedUrl(id) {
	return `https://www.youtube-nocookie.com/embed/${id}`;
}
function GameDetail({ id }) {
	const game = useLibrary((s) => s.games.find((item) => item.id === id));
	const touchOpened = useLibrary((s) => s.touchOpened);
	const toggleFavorite = useLibrary((s) => s.toggleFavorite);
	const openEdit = useLibrary((s) => s.openEdit);
	const removeGame = useLibrary((s) => s.removeGame);
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (game) touchOpened(game.id);
	}, [game?.id, touchOpened]);
	if (!game) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-1 flex-col items-center justify-center py-24 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-2xl",
			children: "Nie ma tej gry na półce"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				children: "Wróć do biblioteki"
			})
		})]
	}) });
	const videoId = parseYouTubeId(game.youtubeUrl);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "ghost",
				size: "icon",
				"aria-label": "Wróć",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Biblioteka"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-8 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-xl shadow-[var(--shadow-border)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoverArt, { game })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto w-full max-w-[220px]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiscArt, { game })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-3xl leading-tight tracking-tight sm:text-4xl",
								children: game.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "secondary",
										size: "icon",
										onClick: () => toggleFavorite(game.id),
										"aria-label": "Ulubiona",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("size-4", game.favorite && "fill-primary text-primary") })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "secondary",
										size: "icon",
										onClick: () => openEdit(game.id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "ghost",
										size: "icon",
										onClick: () => setConfirmDelete(true),
										"aria-label": "Usuń",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								game.year ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: game.year }) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: game.platform }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: STATUS_LABEL[game.status] }),
								game.rating != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									className: "tabular-nums",
									children: ["Ocena ", game.rating.toFixed(1)]
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: formatHours(game.hoursPlayed) })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AchievementControl, { game }),
					game.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-2 font-display text-lg",
						children: "Opis"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-prose text-sm leading-relaxed text-muted",
						children: game.description
					})] }) : null,
					videoId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-3 font-display text-lg",
						children: "YouTube"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
							title: `Trailer: ${game.title}`,
							src: youtubeEmbedUrl(videoId),
							className: "aspect-video w-full",
							allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
							allowFullScreen: true
						})
					})] }) : game.youtubeUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: game.youtubeUrl,
						target: "_blank",
						rel: "noreferrer",
						className: "text-sm text-primary underline-offset-4 hover:underline",
						children: "Otwórz link"
					}) : null
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
			open: confirmDelete,
			onOpenChange: setConfirmDelete,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, { children: [
				"Usunąć ",
				game.title,
				"?"
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "Zniknie z półki. Możesz później wczytać kopię, jeśli zrobiłeś eksport." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Anuluj" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
				className: "bg-destructive",
				onClick: () => {
					removeGame(game.id);
					toast.success("Usunięto z półki.");
					navigate({ to: "/" });
				},
				children: "Usuń"
			})] })] })
		})
	] });
}
function GameRoute() {
	const { id } = Route.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameDetail, { id });
}
//#endregion
export { GameRoute as component };
