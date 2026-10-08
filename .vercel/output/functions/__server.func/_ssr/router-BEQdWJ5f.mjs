import { i as __toESM } from "../_runtime.mjs";
import { E as require_react, T as require_jsx_runtime, b as Slot, d as DialogContent$1, f as DialogDescription$1, h as DialogTitle$1, l as Dialog$1, m as DialogPortal$1, p as DialogOverlay$1, u as DialogClose } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as createFileRoute, b as useNavigate, d as Scripts, f as HeadContent, g as lazyRouteComponent, h as Outlet, m as createRouter, v as createRootRoute, x as useRouter, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Search, f as Dices, i as Settings2, l as LayoutGrid, n as TriangleAlert, o as Plus, p as Crown, t as X, u as ImagePlus } from "../_libs/lucide-react.mjs";
import { a as number, c as union, i as literal, n as array, o as object, r as boolean, s as string, t as _enum } from "../_libs/zod.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
import { t as create } from "../_libs/zustand.mjs";
import { t as Provider } from "../_libs/radix-ui__react-tooltip.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BEQdWJ5f.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function hashString(value) {
	let hash = 2166136261;
	for (let i = 0; i < value.length; i += 1) {
		hash ^= value.charCodeAt(i);
		hash = Math.imul(hash, 16777619);
	}
	return hash >>> 0;
}
function contrastFg(hex) {
	const raw = hex.replace("#", "").trim();
	const full = raw.length === 3 ? raw.split("").map((ch) => ch + ch).join("") : raw.padEnd(6, "0").slice(0, 6);
	const r = parseInt(full.slice(0, 2), 16) / 255;
	const g = parseInt(full.slice(2, 4), 16) / 255;
	const b = parseInt(full.slice(4, 6), 16) / 255;
	const lin = (c) => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4;
	return .2126 * lin(r) + .7152 * lin(g) + .0722 * lin(b) > .55 ? "#0c0c0e" : "#ece8e1";
}
function formatHours(hours) {
	if (!hours) return "0 h";
	if (hours < 10 && !Number.isInteger(hours)) return `${hours.toFixed(1)} h`;
	return `${Math.round(hours)} h`;
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[opacity,transform,background-color,box-shadow,color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:opacity-90",
			secondary: "bg-card text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			outline: "border border-border bg-transparent text-fg hover:bg-card",
			ghost: "text-fg hover:bg-card",
			destructive: "bg-destructive text-fg hover:opacity-90",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 rounded-md px-3 text-xs",
			lg: "h-12 rounded-lg px-5",
			icon: "size-11",
			"icon-sm": "size-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("text-xs font-medium tracking-wide text-muted", className),
		...props
	});
}
var MAX_EDGE = 720;
var JPEG_QUALITY = .76;
async function fileToCompressedDataUrl(file) {
	if (!file.type.startsWith("image/")) throw new Error("Wybierz plik graficzny.");
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
	const width = Math.max(1, Math.round(bitmap.width * scale));
	const height = Math.max(1, Math.round(bitmap.height * scale));
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	if (!ctx) {
		bitmap.close();
		throw new Error("Nie udało się przetworzyć obrazu.");
	}
	ctx.drawImage(bitmap, 0, 0, width, height);
	bitmap.close();
	return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}
async function fileToBackgroundDataUrl(file) {
	if (!file.type.startsWith("image/")) throw new Error("Wybierz plik graficzny.");
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, 1920 / Math.max(bitmap.width, bitmap.height));
	const width = Math.max(1, Math.round(bitmap.width * scale));
	const height = Math.max(1, Math.round(bitmap.height * scale));
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	if (!ctx) {
		bitmap.close();
		throw new Error("Nie udało się przetworzyć obrazu.");
	}
	ctx.drawImage(bitmap, 0, 0, width, height);
	bitmap.close();
	return canvas.toDataURL("image/jpeg", .72);
}
function ImageField({ label, hint, value, onChange, round }) {
	const inputRef = (0, import_react.useRef)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	async function onFile(file) {
		if (!file) return;
		setBusy(true);
		setError(null);
		try {
			onChange(await fileToCompressedDataUrl(file));
		} catch (err) {
			setError(err instanceof Error ? err.message : "Nie udało się wczytać zdjęcia.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("relative overflow-hidden border border-dashed border-border bg-card", round ? "aspect-square rounded-full" : "aspect-[3/4] rounded-lg"),
				children: [value ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: value,
					alt: "",
					className: cn("size-full object-cover", round && "rounded-full")
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "flex size-full min-h-28 flex-col items-center justify-center gap-2 px-3 text-center text-xs text-muted",
					onClick: () => inputRef.current?.click(),
					disabled: busy,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-5" }), busy ? "Przetwarzanie…" : hint ?? "Dodaj zdjęcie"]
				}), value ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "icon-sm",
					variant: "secondary",
					className: "absolute top-2 right-2",
					onClick: () => onChange(null),
					"aria-label": "Usuń zdjęcie",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: inputRef,
				type: "file",
				accept: "image/*",
				className: "sr-only",
				onChange: (event) => {
					onFile(event.target.files?.[0]);
					event.target.value = "";
				}
			}),
			value ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "text-xs text-muted underline-offset-4 hover:text-fg hover:underline",
				onClick: () => inputRef.current?.click(),
				children: "Zmień zdjęcie"
			}) : null,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-destructive",
				children: error
			}) : null
		]
	});
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
function DialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
		className: cn("fixed inset-0 z-50 bg-bg/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
		...props
	});
}
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed z-50 flex flex-col border border-border bg-surface text-fg shadow-[var(--shadow-border-hover)]", "inset-0 max-h-dvh w-full overflow-hidden rounded-none", "sm:inset-auto sm:top-1/2 sm:left-1/2 sm:max-h-[min(880px,calc(100dvh-2rem))] sm:w-[min(560px,calc(100vw-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl", "duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-3 right-3 inline-flex size-11 items-center justify-center rounded-md text-muted transition-colors hover:bg-card hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Zamknij"
			})]
		})]
	})] });
}
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("space-y-1 px-5 pt-5 pr-14 pb-3", className),
		...props
	});
}
function DialogFooter({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col-reverse gap-2 border-t border-border px-5 py-4 sm:flex-row sm:justify-end", className),
		...props
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("font-display text-xl font-medium tracking-tight text-fg", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("text-sm text-muted", className),
		...props
	});
}
function DialogBody({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("min-h-0 flex-1 overflow-y-auto px-5 py-2", className),
		...props
	});
}
function Input({ className, type, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-fg shadow-[var(--shadow-border)] transition-[box-shadow,border-color] duration-150 placeholder:text-subtle file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-28 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-fg shadow-[var(--shadow-border)] transition-[box-shadow,border-color] duration-150 placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	});
}
function NativeSelect({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		className: cn("flex h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-fg shadow-[var(--shadow-border)] transition-[box-shadow,border-color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	});
}
function Slider({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
		className: cn("relative flex h-11 w-full touch-none items-center select-none", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
			className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-primary" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-4 rounded-full bg-fg shadow-[var(--shadow-border)] transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none" })]
	});
}
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchPrimitive.Root, {
		className: cn("peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-border bg-card transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:border-transparent", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchPrimitive.Thumb, { className: "pointer-events-none block size-5 translate-x-0.5 rounded-full bg-fg transition-transform data-[state=checked]:translate-x-[22px] data-[state=checked]:bg-primary-foreground" })
	});
}
var DB_NAME = "polka-library";
var STORE = "kv";
var KEY = "library-v1";
function openDb() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, 1);
		request.onupgradeneeded = () => {
			const db = request.result;
			if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}
async function loadPersistedLibrary() {
	if (typeof indexedDB === "undefined") return null;
	const db = await openDb();
	try {
		return await new Promise((resolve, reject) => {
			const req = db.transaction(STORE, "readonly").objectStore(STORE).get(KEY);
			req.onsuccess = () => resolve(req.result ?? null);
			req.onerror = () => reject(req.error);
		});
	} finally {
		db.close();
	}
}
async function savePersistedLibrary(data) {
	if (typeof indexedDB === "undefined") return;
	const db = await openDb();
	try {
		await new Promise((resolve, reject) => {
			const tx = db.transaction(STORE, "readwrite");
			tx.objectStore(STORE).put(data, KEY);
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error);
		});
	} finally {
		db.close();
	}
}
function isPlatinum(game) {
	return game.achievementsTotal > 0 && game.achievementsUnlocked >= game.achievementsTotal;
}
function achievementRatio(game) {
	if (game.achievementsTotal <= 0) return 0;
	return Math.min(1, game.achievementsUnlocked / game.achievementsTotal);
}
function clampAchievements(unlocked, total) {
	const safeTotal = Math.max(0, Math.floor(total));
	const safeUnlocked = Math.max(0, Math.floor(unlocked));
	if (safeTotal === 0) return {
		unlocked: safeUnlocked,
		total: 0
	};
	return {
		unlocked: Math.min(safeUnlocked, safeTotal),
		total: safeTotal
	};
}
function matchesQuery(game, query) {
	const q = query.trim().toLowerCase();
	if (!q) return true;
	return [
		game.title,
		game.description,
		game.platform,
		game.year ? String(game.year) : ""
	].join(" ").toLowerCase().includes(q);
}
function applyLibraryFilters(games, filters) {
	return games.filter((game) => {
		if (!matchesQuery(game, filters.query)) return false;
		if (filters.favoritesOnly && !game.favorite) return false;
		if (filters.completeOnly && !isPlatinum(game)) return false;
		if (filters.incompleteOnly && isPlatinum(game)) return false;
		if (filters.status !== "all" && game.status !== filters.status) return false;
		return true;
	});
}
function sortGames(games, sort) {
	const list = [...games];
	switch (sort) {
		case "title":
			list.sort((a, b) => a.title.localeCompare(b.title, "pl"));
			break;
		case "year":
			list.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
			break;
		case "rating":
			list.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
			break;
		case "played":
			list.sort((a, b) => (b.lastOpenedAt ?? 0) - (a.lastOpenedAt ?? 0));
			break;
		default: list.sort((a, b) => b.createdAt - a.createdAt);
	}
	return list;
}
function applyRandomFilters(games, filters) {
	return games.filter((game) => {
		if (filters.favoritesOnly && !game.favorite) return false;
		if (filters.hideComplete && isPlatinum(game)) return false;
		if (filters.completeOnly && !isPlatinum(game)) return false;
		if (filters.status !== "all" && game.status !== filters.status) return false;
		if (filters.minRating != null && (game.rating ?? 0) < filters.minRating) return false;
		if (filters.yearFrom != null && (game.year ?? 0) < filters.yearFrom) return false;
		if (filters.yearTo != null && (game.year ?? 9999) > filters.yearTo) return false;
		if (filters.platform && game.platform !== filters.platform) return false;
		return true;
	});
}
function pickRandom(items, exclude) {
	if (items.length === 0) return null;
	if (items.length === 1) return items[0] ?? null;
	const pool = exclude ? items.filter((item) => item !== exclude) : items;
	const source = pool.length > 0 ? pool : items;
	return source[Math.floor(Math.random() * source.length)] ?? null;
}
function libraryStats(games) {
	const favorites = games.filter((g) => g.favorite).length;
	const crowns = games.filter(isPlatinum).length;
	const rated = games.filter((g) => g.rating != null);
	const avgRating = rated.length > 0 ? rated.reduce((sum, g) => sum + (g.rating ?? 0), 0) / rated.length : null;
	const hours = games.reduce((sum, g) => sum + g.hoursPlayed, 0);
	const playing = games.filter((g) => g.status === "playing").length;
	return {
		total: games.length,
		favorites,
		crowns,
		avgRating,
		hours,
		playing
	};
}
function sample(partial) {
	const createdAt = partial.createdAt ?? Date.now();
	return {
		...partial,
		createdAt,
		updatedAt: createdAt,
		lastOpenedAt: null
	};
}
var t0 = Date.UTC(2026, 2, 12);
var SAMPLE_GAMES = [
	sample({
		id: "sample-witcher-3",
		title: "Wiedźmin 3: Dziki Gon",
		year: 2015,
		rating: 9.6,
		description: "Otwarty świat Kontynentu, kontrakty na potwory i wybory, które zostają na długo. Polska klasyka, od której trudno odejść.",
		youtubeUrl: "https://www.youtube.com/watch?v=c0i88t0Kacs",
		coverImage: null,
		discImage: null,
		achievementsUnlocked: 52,
		achievementsTotal: 78,
		favorite: true,
		status: "playing",
		platform: "PC",
		hoursPlayed: 186,
		createdAt: t0
	}),
	sample({
		id: "sample-cyberpunk",
		title: "Cyberpunk 2077",
		year: 2020,
		rating: 8.7,
		description: "Night City po poprawkach: gęste ulice, rigi i historia V. Najlepiej smakuje wieczorem, z własną ścieżką przez miasto.",
		youtubeUrl: "https://www.youtube.com/watch?v=qIcTM8WXFjk",
		coverImage: null,
		discImage: null,
		achievementsUnlocked: 44,
		achievementsTotal: 44,
		favorite: true,
		status: "done",
		platform: "PC",
		hoursPlayed: 92,
		createdAt: t0 - 864e5
	}),
	sample({
		id: "sample-frostpunk",
		title: "Frostpunk",
		year: 2018,
		rating: 9.1,
		description: "Miasto przy generatorze, mróz i ustawy, których nie da się odkręcić. 11 bit studios w najsurowszej formie.",
		youtubeUrl: "https://www.youtube.com/watch?v=KsgGhqOTdps",
		coverImage: null,
		discImage: null,
		achievementsUnlocked: 18,
		achievementsTotal: 47,
		favorite: false,
		status: "playing",
		platform: "PC",
		hoursPlayed: 34,
		createdAt: t0 - 1728e5
	}),
	sample({
		id: "sample-twom",
		title: "This War of Mine",
		year: 2014,
		rating: 8.9,
		description: "Wojna z perspektywy cywilów. Cisza, niedobór i decyzje, po których trudno wrócić do lżejszych gier.",
		youtubeUrl: "https://www.youtube.com/watch?v=x_Me5z7vFKg",
		coverImage: null,
		discImage: null,
		achievementsUnlocked: 12,
		achievementsTotal: 12,
		favorite: true,
		status: "done",
		platform: "PC",
		hoursPlayed: 21,
		createdAt: t0 - 2592e5
	}),
	sample({
		id: "sample-dying-light",
		title: "Dying Light",
		year: 2015,
		rating: 8.4,
		description: "Parkour po Harran, dzień i noc jak dwa różne światy. Wciąż jedna z najlepszych grywalnych „zombie-miast”.",
		youtubeUrl: "https://www.youtube.com/watch?v=z2Y5Rse3jJ0",
		coverImage: null,
		discImage: null,
		achievementsUnlocked: 30,
		achievementsTotal: 68,
		favorite: false,
		status: "backlog",
		platform: "PlayStation",
		hoursPlayed: 16,
		createdAt: t0 - 3456e5
	}),
	sample({
		id: "sample-hades",
		title: "Hades",
		year: 2020,
		rating: 9.4,
		description: "Kolejny bieg z piekła, zawsze trochę inny. Tempo, muzyka i dialogi, do których wraca się bez wymówki.",
		youtubeUrl: "https://www.youtube.com/watch?v=Bz8lTXCxk3w",
		coverImage: null,
		discImage: null,
		achievementsUnlocked: 41,
		achievementsTotal: 49,
		favorite: true,
		status: "playing",
		platform: "Switch",
		hoursPlayed: 58,
		createdAt: t0 - 432e6
	}),
	sample({
		id: "sample-hollow-knight",
		title: "Hollow Knight",
		year: 2017,
		rating: 9.3,
		description: "Hallownest pod powierzchnią: ciasne tunele, bossy i mapa, którą rysuje się w głowie. Cierpliwość popłaca.",
		youtubeUrl: "https://www.youtube.com/watch?v=UAOwqP8J0vY",
		coverImage: null,
		discImage: null,
		achievementsUnlocked: 0,
		achievementsTotal: 63,
		favorite: false,
		status: "backlog",
		platform: "PC",
		hoursPlayed: 0,
		createdAt: t0 - 5184e5
	}),
	sample({
		id: "sample-disco",
		title: "Disco Elysium",
		year: 2019,
		rating: 9.5,
		description: "RPG, w którym walka to spór z własnymi umiejętnościami. Revachol, palto i myśli, które mówią za głośno.",
		youtubeUrl: "https://www.youtube.com/watch?v=QzSMwYJ6uKw",
		coverImage: null,
		discImage: null,
		achievementsUnlocked: 17,
		achievementsTotal: 17,
		favorite: true,
		status: "done",
		platform: "PC",
		hoursPlayed: 47,
		createdAt: t0 - 6048e5
	})
];
var PLATFORMS = [
	"PC",
	"PlayStation",
	"Xbox",
	"Switch",
	"Mobilne",
	"Inne"
];
var STATUSES = [
	"backlog",
	"playing",
	"done"
];
var STATUS_LABEL = {
	backlog: "Do zagrania",
	playing: "W trakcie",
	done: "Ukończona"
};
var DEFAULT_APPEARANCE = {
	accent: "#7d9a9a",
	backgroundImage: null,
	backgroundDim: .78
};
var DEFAULT_PREFS = {
	sort: "added",
	view: "covers"
};
var DEFAULT_FILTERS = {
	query: "",
	favoritesOnly: false,
	completeOnly: false,
	incompleteOnly: false,
	status: "all"
};
var DEFAULT_RANDOM_FILTERS = {
	favoritesOnly: false,
	hideComplete: false,
	completeOnly: false,
	status: "all",
	minRating: null,
	yearFrom: null,
	yearTo: null,
	platform: null
};
var ACCENT_PRESETS = [
	"#7d9a9a",
	"#8aa0b4",
	"#b07864",
	"#a8b8b0",
	"#c4b49a",
	"#a86860",
	"#6e7f8a",
	"#8a7a6a"
];
var saveTimer = null;
function snapshot(state) {
	return {
		version: 1,
		games: state.games,
		appearance: state.appearance,
		prefs: state.prefs,
		seeded: state.seeded
	};
}
var useLibrary = create((set, get) => ({
	hydrated: false,
	games: [],
	appearance: DEFAULT_APPEARANCE,
	prefs: DEFAULT_PREFS,
	seeded: false,
	filters: DEFAULT_FILTERS,
	formOpen: false,
	editingId: null,
	randomOpen: false,
	settingsOpen: false,
	hydrate: async () => {
		if (get().hydrated) return;
		try {
			const saved = await loadPersistedLibrary();
			if (saved && Array.isArray(saved.games)) {
				set({
					games: saved.games,
					appearance: {
						...DEFAULT_APPEARANCE,
						...saved.appearance
					},
					prefs: {
						...DEFAULT_PREFS,
						...saved.prefs
					},
					seeded: saved.seeded ?? true,
					hydrated: true
				});
				return;
			}
			set({
				games: SAMPLE_GAMES,
				appearance: DEFAULT_APPEARANCE,
				prefs: DEFAULT_PREFS,
				seeded: true,
				hydrated: true
			});
			get().persist();
		} catch {
			set({
				games: SAMPLE_GAMES,
				appearance: DEFAULT_APPEARANCE,
				prefs: DEFAULT_PREFS,
				seeded: true,
				hydrated: true
			});
		}
	},
	persist: () => {
		if (saveTimer) clearTimeout(saveTimer);
		saveTimer = setTimeout(() => {
			savePersistedLibrary(snapshot(get()));
		}, 180);
	},
	addGame: (draft) => {
		const now = Date.now();
		const id = draft.id ?? crypto.randomUUID();
		const game = {
			...draft,
			id,
			createdAt: now,
			updatedAt: now,
			lastOpenedAt: null
		};
		set((state) => ({
			games: [game, ...state.games],
			formOpen: false,
			editingId: null
		}));
		get().persist();
		return id;
	},
	updateGame: (id, patch) => {
		set((state) => ({ games: state.games.map((game) => game.id === id ? {
			...game,
			...patch,
			id,
			updatedAt: Date.now()
		} : game) }));
		get().persist();
	},
	removeGame: (id) => {
		set((state) => ({ games: state.games.filter((game) => game.id !== id) }));
		get().persist();
	},
	toggleFavorite: (id) => {
		set((state) => ({ games: state.games.map((game) => game.id === id ? {
			...game,
			favorite: !game.favorite,
			updatedAt: Date.now()
		} : game) }));
		get().persist();
	},
	setAchievements: (id, unlocked, total) => {
		const next = clampAchievements(unlocked, total);
		set((state) => ({ games: state.games.map((game) => game.id === id ? {
			...game,
			achievementsUnlocked: next.unlocked,
			achievementsTotal: next.total,
			updatedAt: Date.now()
		} : game) }));
		get().persist();
	},
	bumpAchievement: (id, delta) => {
		const game = get().games.find((item) => item.id === id);
		if (!game) return;
		const total = game.achievementsTotal;
		const unlocked = total > 0 ? Math.min(total, Math.max(0, game.achievementsUnlocked + delta)) : Math.max(0, game.achievementsUnlocked + delta);
		get().setAchievements(id, unlocked, total);
	},
	markPlatinum: (id) => {
		const game = get().games.find((item) => item.id === id);
		if (!game) return;
		const total = game.achievementsTotal > 0 ? game.achievementsTotal : 1;
		get().setAchievements(id, total, total);
	},
	touchOpened: (id) => {
		set((state) => ({ games: state.games.map((game) => game.id === id ? {
			...game,
			lastOpenedAt: Date.now()
		} : game) }));
		get().persist();
	},
	setAppearance: (patch) => {
		set((state) => ({ appearance: {
			...state.appearance,
			...patch
		} }));
		get().persist();
	},
	setPrefs: (patch) => {
		set((state) => ({ prefs: {
			...state.prefs,
			...patch
		} }));
		get().persist();
	},
	setFilters: (patch) => {
		set((state) => ({ filters: {
			...state.filters,
			...patch
		} }));
	},
	replaceLibrary: ({ games, appearance, prefs }) => {
		set((state) => ({
			games,
			appearance: appearance ?? state.appearance,
			prefs: prefs ?? state.prefs,
			seeded: true
		}));
		get().persist();
	},
	mergeLibrary: (incoming) => {
		set((state) => {
			const ids = new Set(state.games.map((game) => game.id));
			return {
				games: [...incoming.map((game) => ids.has(game.id) ? {
					...game,
					id: crypto.randomUUID()
				} : game), ...state.games],
				seeded: true
			};
		});
		get().persist();
	},
	restoreSamples: () => {
		set((state) => {
			const existing = new Set(state.games.map((game) => game.id));
			return {
				games: [...SAMPLE_GAMES.filter((game) => !existing.has(game.id)), ...state.games],
				seeded: true
			};
		});
		get().persist();
	},
	clearGames: () => {
		set({
			games: [],
			seeded: true
		});
		get().persist();
	},
	openCreate: () => set({
		formOpen: true,
		editingId: null
	}),
	openEdit: (id) => set({
		formOpen: true,
		editingId: id
	}),
	closeForm: () => set({
		formOpen: false,
		editingId: null
	}),
	setRandomOpen: (open) => set({ randomOpen: open }),
	setSettingsOpen: (open) => set({ settingsOpen: open })
}));
function emptyDraft() {
	return {
		title: "",
		year: (/* @__PURE__ */ new Date()).getFullYear(),
		rating: null,
		description: "",
		youtubeUrl: "",
		coverImage: null,
		discImage: null,
		achievementsUnlocked: 0,
		achievementsTotal: 0,
		favorite: false,
		status: "backlog",
		platform: "PC",
		hoursPlayed: 0
	};
}
function gameToDraft(game) {
	return {
		title: game.title,
		year: game.year,
		rating: game.rating,
		description: game.description,
		youtubeUrl: game.youtubeUrl,
		coverImage: game.coverImage,
		discImage: game.discImage,
		achievementsUnlocked: game.achievementsUnlocked,
		achievementsTotal: game.achievementsTotal,
		favorite: game.favorite,
		status: game.status,
		platform: game.platform,
		hoursPlayed: game.hoursPlayed
	};
}
function GameFormDialog() {
	const formOpen = useLibrary((s) => s.formOpen);
	const editingId = useLibrary((s) => s.editingId);
	const games = useLibrary((s) => s.games);
	const closeForm = useLibrary((s) => s.closeForm);
	const addGame = useLibrary((s) => s.addGame);
	const updateGame = useLibrary((s) => s.updateGame);
	const editing = (0, import_react.useMemo)(() => games.find((game) => game.id === editingId) ?? null, [games, editingId]);
	const [draft, setDraft] = (0, import_react.useState)(emptyDraft());
	(0, import_react.useEffect)(() => {
		if (!formOpen) return;
		setDraft(editing ? gameToDraft(editing) : emptyDraft());
	}, [formOpen, editing]);
	function patch(key, value) {
		setDraft((current) => ({
			...current,
			[key]: value
		}));
	}
	function submit() {
		const title = draft.title.trim();
		if (!title) {
			toast.error("Podaj nazwę gry.");
			return;
		}
		const payload = {
			...draft,
			title
		};
		if (editing) {
			updateGame(editing.id, payload);
			toast.success("Zapisano zmiany.");
		} else {
			addGame(payload);
			toast.success("Dodano grę do półki.");
		}
		closeForm();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: formOpen,
		onOpenChange: (open) => !open ? closeForm() : null,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Edytuj grę" : "Dodaj grę" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Okładka, płyta, osiągnięcia i trailer — wszystko zostaje na Twojej półce." })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogBody, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5 pb-4 sm:grid-cols-[minmax(0,140px)_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3 sm:grid-cols-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageField, {
						label: "Okładka",
						hint: "Zdjęcie okładki",
						value: draft.coverImage,
						onChange: (coverImage) => patch("coverImage", coverImage)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageField, {
						label: "Płyta",
						hint: "Zdjęcie płyty",
						value: draft.discImage,
						onChange: (discImage) => patch("discImage", discImage),
						round: true
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Nazwa gry",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.title,
								onChange: (e) => patch("title", e.target.value),
								placeholder: "np. Wiedźmin 3: Dziki Gon",
								autoFocus: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Rok",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 1970,
									max: 2100,
									value: draft.year ?? "",
									onChange: (e) => patch("year", e.target.value === "" ? null : Number(e.target.value))
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Platforma",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
									value: draft.platform,
									onChange: (e) => patch("platform", e.target.value),
									children: PLATFORMS.map((platform) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: platform,
										children: platform
									}, platform))
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Status",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
								value: draft.status,
								onChange: (e) => patch("status", e.target.value),
								children: STATUSES.map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: status,
									children: STATUS_LABEL[status]
								}, status))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-1 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Ocena" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs tabular-nums text-muted",
									children: draft.rating == null ? "brak" : draft.rating.toFixed(1)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
								min: 0,
								max: 10,
								step: .1,
								value: [draft.rating ?? 0],
								onValueChange: (value) => patch("rating", value[0] ?? 0)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "mt-1 text-xs text-muted underline-offset-4 hover:underline",
								onClick: () => patch("rating", null),
								children: "Wyczyść ocenę"
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Odblokowane osiągnięcia",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 0,
									value: draft.achievementsUnlocked,
									onChange: (e) => patch("achievementsUnlocked", Math.max(0, Number(e.target.value) || 0))
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Łączna liczba",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 0,
									value: draft.achievementsTotal,
									onChange: (e) => patch("achievementsTotal", Math.max(0, Number(e.target.value) || 0))
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Godziny gry",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 0,
								step: .5,
								value: draft.hoursPlayed,
								onChange: (e) => patch("hoursPlayed", Math.max(0, Number(e.target.value) || 0))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Link do YouTube",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.youtubeUrl,
								onChange: (e) => patch("youtubeUrl", e.target.value),
								placeholder: "https://youtu.be/…"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Opis",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: draft.description,
								onChange: (e) => patch("description", e.target.value),
								placeholder: "Kilka zdań o tym, dlaczego ta pozycja stoi na półce."
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center justify-between gap-3 rounded-lg bg-card px-3 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm",
								children: "Ulubiona"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: draft.favorite,
								onCheckedChange: (favorite) => patch("favorite", favorite)
							})]
						})
					]
				})]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				type: "button",
				onClick: closeForm,
				children: "Anuluj"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				onClick: submit,
				children: editing ? "Zapisz" : "Dodaj na półkę"
			})] })
		] })
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
var PALETTES = [
	{
		bg: "#1b1713",
		fg: "#efe6d8",
		accent: "#8fa38a",
		band: "#3a332b"
	},
	{
		bg: "#12161b",
		fg: "#e4e8ee",
		accent: "#7d93a6",
		band: "#242c34"
	},
	{
		bg: "#1a1210",
		fg: "#eadfd4",
		accent: "#b07a64",
		band: "#32241f"
	},
	{
		bg: "#101412",
		fg: "#dce6df",
		accent: "#7d9a8c",
		band: "#1d2622"
	},
	{
		bg: "#161318",
		fg: "#e8e2ea",
		accent: "#8a7e90",
		band: "#2a2430"
	},
	{
		bg: "#141210",
		fg: "#e6ddd0",
		accent: "#a39480",
		band: "#2b2620"
	},
	{
		bg: "#101318",
		fg: "#d7e0e8",
		accent: "#6e8496",
		band: "#1c242c"
	},
	{
		bg: "#181411",
		fg: "#efe4d4",
		accent: "#c4a48a",
		band: "#2f2720"
	}
];
function posterPalette(seed) {
	return PALETTES[hashString(seed) % PALETTES.length] ?? PALETTES[0];
}
function wrapTitle(title, max = 14) {
	const words = title.trim().split(/\s+/);
	const lines = [];
	let current = "";
	for (const word of words) {
		const next = current ? `${current} ${word}` : word;
		if (next.length > max && current) {
			lines.push(current);
			current = word;
		} else current = next;
	}
	if (current) lines.push(current);
	return lines.slice(0, 4);
}
function posterMotif(seed) {
	const motifs = [
		"circle",
		"slash",
		"bars",
		"plus",
		"arc"
	];
	return motifs[hashString(`${seed}-motif`) % motifs.length] ?? "circle";
}
function MotifShapes({ seed }) {
	const palette = posterPalette(seed);
	switch (posterMotif(seed)) {
		case "slash": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: "420",
			y: "-80",
			width: "70",
			height: "980",
			transform: "rotate(18 455 400)",
			fill: palette.band
		});
		case "bars": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			fill: palette.band,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "430",
					y: "48",
					width: "18",
					height: "220"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "462",
					y: "88",
					width: "18",
					height: "180"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "494",
					y: "128",
					width: "18",
					height: "140"
				})
			]
		});
		case "plus": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			fill: "none",
			stroke: palette.accent,
			strokeWidth: "2",
			opacity: "0.55",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "430",
				y1: "90",
				x2: "560",
				y2: "90"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "495",
				y1: "25",
				x2: "495",
				y2: "155"
			})]
		});
		case "arc": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M 80 80 Q 300 40 520 160",
			fill: "none",
			stroke: palette.accent,
			strokeWidth: "2",
			opacity: "0.45"
		});
		default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "500",
			cy: "120",
			r: "88",
			fill: "none",
			stroke: palette.fg,
			strokeWidth: "1.5",
			opacity: "0.28"
		});
	}
}
function TypographicPoster({ title, year, seed, className }) {
	const palette = posterPalette(seed);
	const lines = wrapTitle(title);
	const fontSize = lines.some((line) => line.length > 12) ? 46 : 56;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 600 800",
		className: cn("size-full", className),
		role: "img",
		"aria-label": title,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "600",
				height: "800",
				fill: palette.bg
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "600",
				height: "10",
				fill: palette.accent
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotifShapes, { seed }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "40",
				y: "40",
				width: "520",
				height: "720",
				fill: "none",
				stroke: palette.fg,
				strokeOpacity: "0.12"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "48",
				y: "720",
				fill: palette.accent,
				fontSize: "18",
				fontFamily: "Figtree, ui-sans-serif, sans-serif",
				letterSpacing: "0.18em",
				children: year ?? "PÓŁKA"
			}),
			lines.map((line, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "48",
				y: 620 - (lines.length - 1 - index) * (fontSize + 6),
				fill: palette.fg,
				fontSize,
				fontFamily: "Fraunces, Georgia, serif",
				fontWeight: "500",
				children: line
			}, line + index))
		]
	});
}
function CoverArt({ game, className, showCrown = true }) {
	const platinum = isPlatinum(game);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative aspect-[3/4] overflow-hidden bg-card", className),
		children: [game.coverImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: game.coverImage,
			alt: "",
			className: "size-full object-cover outline outline-1 -outline-offset-1 outline-fg/10"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypographicPoster, {
			title: game.title,
			year: game.year,
			seed: game.id
		}), showCrown && platinum ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute top-2 right-2 z-10 inline-flex size-8 items-center justify-center rounded-full bg-bg/80 text-fg shadow-[var(--shadow-border)]",
			title: "100% osiągnięć",
			"aria-label": "100% osiągnięć",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "size-4 fill-fg text-fg" })
		}) : null]
	});
}
function DiscArt({ game, className }) {
	const palette = posterPalette(game.id);
	const platinum = isPlatinum(game);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative aspect-square", className),
		children: [game.discImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: game.discImage,
			alt: `Płyta: ${game.title}`,
			className: "size-full rounded-full object-cover outline outline-1 -outline-offset-1 outline-fg/15"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 400 400",
			className: "size-full",
			role: "img",
			"aria-label": `Płyta ${game.title}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("radialGradient", {
					id: `disc-${game.id}`,
					cx: "38%",
					cy: "32%",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "0%",
							stopColor: "#d8d4cc"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "42%",
							stopColor: "#8a8680"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "100%",
							stopColor: "#2a2927"
						})
					]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "200",
					cy: "200",
					r: "196",
					fill: `url(#disc-${game.id})`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "200",
					cy: "200",
					r: "188",
					fill: "none",
					stroke: palette.fg,
					strokeOpacity: "0.2"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "200",
					cy: "200",
					r: "118",
					fill: palette.bg
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "200",
					cy: "200",
					r: "118",
					fill: "none",
					stroke: palette.accent,
					strokeOpacity: "0.7"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "200",
					cy: "200",
					r: "22",
					fill: "#1a1917"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "200",
					cy: "200",
					r: "10",
					fill: "#0c0c0e"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "200",
					y: "196",
					textAnchor: "middle",
					fill: palette.fg,
					fontSize: "13",
					fontFamily: "Figtree, ui-sans-serif, sans-serif",
					letterSpacing: "0.12em",
					children: game.year ?? ""
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "200",
					y: "218",
					textAnchor: "middle",
					fill: palette.accent,
					fontSize: "11",
					fontFamily: "Fraunces, Georgia, serif",
					children: game.title.length > 22 ? `${game.title.slice(0, 20)}…` : game.title
				})
			]
		}), platinum ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute top-1 right-1 inline-flex size-8 items-center justify-center rounded-full bg-bg/80 text-fg shadow-[var(--shadow-border)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "size-4 fill-fg text-fg" })
		}) : null]
	});
}
function RandomizerDialog() {
	const open = useLibrary((s) => s.randomOpen);
	const setOpen = useLibrary((s) => s.setRandomOpen);
	const games = useLibrary((s) => s.games);
	const navigate = useNavigate();
	const [filters, setFilters] = (0, import_react.useState)(DEFAULT_RANDOM_FILTERS);
	const [picked, setPicked] = (0, import_react.useState)(null);
	const [spinning, setSpinning] = (0, import_react.useState)(false);
	const pool = (0, import_react.useMemo)(() => applyRandomFilters(games, filters), [games, filters]);
	function patch(key, value) {
		setFilters((current) => ({
			...current,
			[key]: value
		}));
	}
	function roll() {
		if (pool.length === 0) {
			setPicked(null);
			return;
		}
		setSpinning(true);
		window.setTimeout(() => {
			setPicked(pickRandom(pool, picked));
			setSpinning(false);
		}, 420);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (next) => {
			setOpen(next);
			if (!next) {
				setPicked(null);
				setSpinning(false);
			}
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Losowanie" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
				"Ustaw filtry, a półka wybierze jedną pozycję z puli ",
				pool.length,
				"."
			] })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogBody, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5 pb-2 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
							label: "Tylko ulubione",
							checked: filters.favoritesOnly,
							onChange: (favoritesOnly) => patch("favoritesOnly", favoritesOnly)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
							label: "Ukryj 100%",
							checked: filters.hideComplete,
							onChange: (hideComplete) => patch("hideComplete", hideComplete)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
							label: "Tylko z koroną",
							checked: filters.completeOnly,
							onChange: (completeOnly) => patch("completeOnly", completeOnly)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
								value: filters.status,
								onChange: (e) => patch("status", e.target.value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: "Dowolny"
								}), STATUSES.map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: status,
									children: STATUS_LABEL[status]
								}, status))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Platforma" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
								value: filters.platform ?? "",
								onChange: (e) => patch("platform", e.target.value || null),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Dowolna"
								}), PLATFORMS.map((platform) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: platform,
									children: platform
								}, platform))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-1 flex justify-between text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Minimalna ocena" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums text-muted",
									children: filters.minRating == null ? "brak" : filters.minRating.toFixed(1)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
								min: 0,
								max: 10,
								step: .5,
								value: [filters.minRating ?? 0],
								onValueChange: (value) => patch("minRating", value[0] ?? 0)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "mt-1 text-xs text-muted underline-offset-4 hover:underline",
								onClick: () => patch("minRating", null),
								children: "Bez progu"
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Rok od" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: filters.yearFrom ?? "",
									onChange: (e) => patch("yearFrom", e.target.value === "" ? null : Number(e.target.value))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Rok do" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: filters.yearTo ?? "",
									onChange: (e) => patch("yearTo", e.target.value === "" ? null : Number(e.target.value))
								})]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex min-h-64 flex-col items-center justify-center rounded-xl bg-card p-4",
					children: spinning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg text-muted",
						children: "Szukam na półce…"
					}) : picked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "w-full max-w-[220px] text-left",
						onClick: () => {
							setOpen(false);
							navigate({
								to: "/gra/$id",
								params: { id: picked.id }
							});
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-hidden rounded-lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoverArt, { game: picked })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-display text-lg leading-snug",
								children: picked.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: [
									picked.year ?? "—",
									" · ",
									picked.platform
								]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dices, { className: "mx-auto size-8 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: pool.length === 0 ? "Żadna gra nie pasuje do filtrów." : "Naciśnij losuj, gdy filtry są gotowe."
						})]
					})
				})]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				type: "button",
				onClick: () => {
					setFilters(DEFAULT_RANDOM_FILTERS);
					setPicked(null);
				},
				children: "Reset filtrów"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				onClick: roll,
				disabled: pool.length === 0 || spinning,
				children: picked ? "Losuj ponownie" : "Losuj"
			})] })
		] })
	});
}
function ToggleRow({ label, checked, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex h-11 items-center justify-between gap-3 rounded-lg bg-card px-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
			checked,
			onCheckedChange: onChange
		})]
	});
}
var StatusSchema = _enum(STATUSES);
var GameSchema = object({
	id: string().min(1),
	title: string().min(1),
	year: number().int().min(1970).max(2100).nullable().optional(),
	rating: number().min(0).max(10).nullable().optional(),
	description: string().optional(),
	youtubeUrl: string().optional(),
	coverImage: string().nullable().optional(),
	discImage: string().nullable().optional(),
	achievementsUnlocked: number().min(0).optional(),
	achievementsTotal: number().min(0).optional(),
	favorite: boolean().optional(),
	status: StatusSchema.optional(),
	platform: string().optional(),
	hoursPlayed: number().min(0).optional(),
	createdAt: number().optional(),
	updatedAt: number().optional(),
	lastOpenedAt: number().nullable().optional()
});
var AppearanceSchema = object({
	accent: string().optional(),
	backgroundImage: string().nullable().optional(),
	backgroundDim: number().min(0).max(1).optional()
});
var PrefsSchema = object({
	sort: _enum([
		"added",
		"title",
		"year",
		"rating",
		"played"
	]).optional(),
	view: _enum(["covers", "discs"]).optional()
});
var FileSchema = object({
	version: literal(1).optional(),
	games: array(GameSchema),
	appearance: AppearanceSchema.optional(),
	prefs: PrefsSchema.optional(),
	seeded: boolean().optional()
});
function asStatus(value) {
	return value ?? "backlog";
}
function normalizeGame(raw, index) {
	const now = Date.now() + index;
	return {
		id: raw.id,
		title: raw.title.trim(),
		year: raw.year ?? null,
		rating: raw.rating ?? null,
		description: raw.description ?? "",
		youtubeUrl: raw.youtubeUrl ?? "",
		coverImage: raw.coverImage ?? null,
		discImage: raw.discImage ?? null,
		achievementsUnlocked: Math.max(0, Math.floor(raw.achievementsUnlocked ?? 0)),
		achievementsTotal: Math.max(0, Math.floor(raw.achievementsTotal ?? 0)),
		favorite: raw.favorite ?? false,
		status: asStatus(raw.status),
		platform: raw.platform?.trim() || "PC",
		hoursPlayed: Math.max(0, raw.hoursPlayed ?? 0),
		createdAt: raw.createdAt ?? now,
		updatedAt: raw.updatedAt ?? now,
		lastOpenedAt: raw.lastOpenedAt ?? null
	};
}
function parseLibraryFile(json) {
	const parsed = FileSchema.parse(json);
	return {
		games: parsed.games.map((game, index) => normalizeGame(game, index)),
		appearance: {
			accent: parsed.appearance?.accent ?? DEFAULT_APPEARANCE.accent,
			backgroundImage: parsed.appearance?.backgroundImage === void 0 ? DEFAULT_APPEARANCE.backgroundImage : parsed.appearance.backgroundImage,
			backgroundDim: parsed.appearance?.backgroundDim ?? DEFAULT_APPEARANCE.backgroundDim
		},
		prefs: {
			sort: parsed.prefs?.sort ?? DEFAULT_PREFS.sort,
			view: parsed.prefs?.view ?? DEFAULT_PREFS.view
		}
	};
}
function serializeLibrary(data) {
	return JSON.stringify({
		version: 1,
		exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
		games: data.games,
		appearance: data.appearance,
		prefs: data.prefs,
		seeded: data.seeded
	}, null, 2);
}
function SettingsDialog() {
	const open = useLibrary((s) => s.settingsOpen);
	const setOpen = useLibrary((s) => s.setSettingsOpen);
	const appearance = useLibrary((s) => s.appearance);
	const setAppearance = useLibrary((s) => s.setAppearance);
	const games = useLibrary((s) => s.games);
	const prefs = useLibrary((s) => s.prefs);
	const seeded = useLibrary((s) => s.seeded);
	const replaceLibrary = useLibrary((s) => s.replaceLibrary);
	const mergeLibrary = useLibrary((s) => s.mergeLibrary);
	const restoreSamples = useLibrary((s) => s.restoreSamples);
	const clearGames = useLibrary((s) => s.clearGames);
	const fileRef = (0, import_react.useRef)(null);
	const bgRef = (0, import_react.useRef)(null);
	const [importMode, setImportMode] = (0, import_react.useState)("merge");
	async function onBackground(file) {
		if (!file) return;
		try {
			const data = await fileToBackgroundDataUrl(file);
			setAppearance({ backgroundImage: data });
			toast.success("Ustawiono tło.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Nie udało się wczytać tła.");
		}
	}
	function exportLibrary() {
		const json = serializeLibrary({
			version: 1,
			games,
			appearance,
			prefs,
			seeded
		});
		const blob = new Blob([json], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `polka-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
		a.click();
		URL.revokeObjectURL(url);
		toast.success("Zapisano plik biblioteki.");
	}
	async function onImport(file) {
		if (!file) return;
		try {
			const text = await file.text();
			const parsed = parseLibraryFile(JSON.parse(text));
			if (importMode === "replace") replaceLibrary(parsed);
			else mergeLibrary(parsed.games);
			toast.success(importMode === "replace" ? `Wczytano ${parsed.games.length} gier.` : `Dodano ${parsed.games.length} gier.`);
		} catch {
			toast.error("Ten plik nie wygląda na eksport Półki.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Wygląd i kopia" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Kolor, tło oraz import i eksport całej półki." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogBody, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3 pb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-base",
					children: "Kolor akcentu"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [ACCENT_PRESETS.map((color) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": `Kolor ${color}`,
						onClick: () => setAppearance({ accent: color }),
						className: cn("size-11 rounded-full border border-border", appearance.accent === color && "ring-2 ring-fg ring-offset-2 ring-offset-bg"),
						style: { background: color }
					}, color)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "relative size-11 overflow-hidden rounded-full border border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sr-only",
							children: "Własny kolor"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "color",
							value: appearance.accent,
							onChange: (e) => setAppearance({ accent: e.target.value }),
							className: "absolute inset-0 size-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3 pb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-base",
						children: "Tło"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Własne zdjęcie za siatką okładek. Przyciemnienie zostawia tekst czytelnym."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "secondary",
							onClick: () => bgRef.current?.click(),
							children: "Wybierz zdjęcie"
						}), appearance.backgroundImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setAppearance({ backgroundImage: null }),
							children: "Usuń tło"
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: bgRef,
						type: "file",
						accept: "image/*",
						className: "sr-only",
						onChange: (e) => {
							onBackground(e.target.files?.[0]);
							e.target.value = "";
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1 flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Przyciemnienie" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs tabular-nums text-muted",
							children: [Math.round(appearance.backgroundDim * 100), "%"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						min: .35,
						max: .92,
						step: .01,
						value: [appearance.backgroundDim],
						onValueChange: (value) => setAppearance({ backgroundDim: value[0] ?? DEFAULT_APPEARANCE.backgroundDim })
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						onClick: () => setAppearance(DEFAULT_APPEARANCE),
						children: "Przywróć domyślny wygląd"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3 pb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-base",
						children: "Import i eksport"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Zapiszesz półkę do pliku JSON — okładki i płyty jadą razem z danymi."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							onClick: exportLibrary,
							children: "Eksportuj bibliotekę"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "secondary",
							onClick: () => fileRef.current?.click(),
							children: "Importuj plik"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "radio",
								name: "import-mode",
								checked: importMode === "merge",
								onChange: () => setImportMode("merge")
							}), "Dodaj do istniejących"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "radio",
								name: "import-mode",
								checked: importMode === "replace",
								onChange: () => setImportMode("replace")
							}), "Zastąp całą półkę"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileRef,
						type: "file",
						accept: "application/json,.json",
						className: "sr-only",
						onChange: (e) => {
							onImport(e.target.files?.[0]);
							e.target.value = "";
						}
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3 pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-base",
					children: "Kolekcja"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "secondary",
						onClick: () => {
							restoreSamples();
							toast.success("Dodano przykładowe gry.");
						},
						children: "Wczytaj przykłady"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "destructive",
						onClick: () => {
							if (window.confirm("Usunąć wszystkie gry z półki?")) {
								clearGames();
								toast.success("Półka jest pusta.");
							}
						},
						children: "Wyczyść półkę"
					})]
				})]
			})
		] })] })
	});
}
function ThemeSync() {
	const appearance = useLibrary((s) => s.appearance);
	(0, import_react.useEffect)(() => {
		const root = document.documentElement;
		root.style.setProperty("--accent", appearance.accent);
		root.style.setProperty("--accent-fg", contrastFg(appearance.accent));
		root.style.setProperty("--bg-dim", String(appearance.backgroundDim));
		if (appearance.backgroundImage) root.style.setProperty("--user-bg", `url("${appearance.backgroundImage}")`);
		else root.style.setProperty("--user-bg", "none");
	}, [appearance]);
	return null;
}
function AppShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "app-bg min-h-dvh",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "grain" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "app-content mx-auto flex min-h-dvh max-w-6xl flex-col px-4 pb-16 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), children]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameFormDialog, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RandomizerDialog, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsDialog, {})
		]
	});
}
function Header() {
	const query = useLibrary((s) => s.filters.query);
	const setFilters = useLibrary((s) => s.setFilters);
	const openCreate = useLibrary((s) => s.openCreate);
	const setRandomOpen = useLibrary((s) => s.setRandomOpen);
	const setSettingsOpen = useLibrary((s) => s.setSettingsOpen);
	const stats = libraryStats(useLibrary((s) => s.games));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-30 -mx-4 mb-6 border-b border-border bg-bg/80 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-md sm:-mx-6 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 py-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl tracking-tight",
						children: "Półka"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "hidden text-[11px] tracking-[0.18em] text-muted uppercase sm:block",
						children: "biblioteka gier"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: query,
						onChange: (e) => setFilters({ query: e.target.value }),
						placeholder: "Szukaj tytułu, roku, platformy…",
						className: "pl-9",
						"aria-label": "Szukaj"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "secondary",
					size: "icon",
					className: "sm:hidden",
					onClick: () => setRandomOpen(true),
					"aria-label": "Losuj",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dices, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "icon",
					className: "sm:hidden",
					onClick: openCreate,
					"aria-label": "Dodaj grę",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "secondary",
					className: "hidden sm:inline-flex",
					onClick: () => setRandomOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dices, {}), "Losuj"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					className: "hidden sm:inline-flex",
					onClick: openCreate,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Dodaj"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					size: "icon",
					onClick: () => setSettingsOpen(true),
					"aria-label": "Ustawienia",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, {})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "pb-3 text-xs text-muted tabular-nums",
			children: [
				stats.total,
				" gier · ",
				stats.favorites,
				" ulubionych · ",
				stats.crowns,
				" z koroną",
				stats.avgRating != null ? ` · średnia ${stats.avgRating.toFixed(1)}` : ""
			]
		})]
	});
}
function FilterBar() {
	const filters = useLibrary((s) => s.filters);
	const setFilters = useLibrary((s) => s.setFilters);
	const prefs = useLibrary((s) => s.prefs);
	const setPrefs = useLibrary((s) => s.setPrefs);
	const chips = [
		{
			key: "all",
			label: "Wszystkie",
			active: !filters.favoritesOnly && !filters.completeOnly && !filters.incompleteOnly && filters.status === "all",
			onClick: () => setFilters({
				favoritesOnly: false,
				completeOnly: false,
				incompleteOnly: false,
				status: "all"
			})
		},
		{
			key: "fav",
			label: "Ulubione",
			active: filters.favoritesOnly,
			onClick: () => setFilters({ favoritesOnly: !filters.favoritesOnly })
		},
		{
			key: "crown",
			label: "100%",
			active: filters.completeOnly,
			onClick: () => setFilters({
				completeOnly: !filters.completeOnly,
				incompleteOnly: false
			})
		},
		...STATUSES.map((status) => ({
			key: status,
			label: STATUS_LABEL[status],
			active: filters.status === status,
			onClick: () => setFilters({ status: filters.status === status ? "all" : status })
		}))
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
			children: chips.map((chip) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: chip.onClick,
				className: cn("h-11 shrink-0 rounded-full px-4 text-sm transition-colors", chip.active ? "bg-primary text-primary-foreground" : "bg-card text-muted hover:text-fg"),
				children: chip.label
			}, chip.key))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
					value: prefs.sort,
					onChange: (e) => setPrefs({ sort: e.target.value }),
					"aria-label": "Sortowanie",
					className: "h-11 w-auto min-w-40",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "added",
							children: "Najnowsze"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "title",
							children: "Tytuł"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "year",
							children: "Rok"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "rating",
							children: "Ocena"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "played",
							children: "Ostatnio otwarte"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: prefs.view === "covers" ? "secondary" : "ghost",
					size: "icon",
					"aria-label": "Widok okładek",
					onClick: () => setPrefs({ view: "covers" }),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: prefs.view === "discs" ? "secondary" : "ghost",
					size: "icon",
					"aria-label": "Widok płyt",
					onClick: () => setPrefs({ view: "discs" }),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block size-3.5 rounded-full border-2 border-current" })
				})
			]
		})]
	});
}
function Toaster$1() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		theme: "dark",
		position: "bottom-center",
		toastOptions: { classNames: {
			toast: "bg-surface text-fg border-border shadow-[var(--shadow-border-hover)] font-sans",
			description: "text-muted"
		} }
	});
}
var TooltipProvider = Provider;
var styles_default = "/assets/styles-DdzJfgwI.css";
var APP_NAME = "Półka";
var Route$2 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Osobista biblioteka gier — okładki, płyty, osiągnięcia i losowanie."
			},
			{
				name: "theme-color",
				content: "#0c0c0e"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400;0,500;0,600;0,700&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap"
			}
		]
	}),
	component: RootDocument
});
function RootDocument() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "pl",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipProvider, {
				delayDuration: 200,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeSync, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HydrationGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})
				]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
function HydrationGate({ children }) {
	const hydrated = useLibrary((s) => s.hydrated);
	const hydrate = useLibrary((s) => s.hydrate);
	(0, import_react.useEffect)(() => {
		hydrate();
	}, [hydrate]);
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col items-center justify-center bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-4xl tracking-tight",
			children: "Półka"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "Otwieram bibliotekę…"
		})]
	});
	return children;
}
var $$splitComponentImporter$1 = () => import("./routes-CSkjLJN_.mjs");
var Route$1 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./gra._id-DCIabYst.mjs");
var Route = createFileRoute("/gra/$id")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$1.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$2
	}),
	GraIdRoute: Route.update({
		id: "/gra/$id",
		path: "/gra/$id",
		getParentRoute: () => Route$2
	})
};
var routeTree = Route$2._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { cn as _, CoverArt as a, STATUS_LABEL as c, isPlatinum as d, sortGames as f, buttonVariants as g, Button as h, FilterBar as i, achievementRatio as l, Label as m, Route as n, DiscArt as o, Input as p, AppShell as r, useLibrary as s, router_exports as t, applyLibraryFilters as u, formatHours as v };
