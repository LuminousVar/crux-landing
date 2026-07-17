/**
 * API Reference model — built from a snapshot of the backend's OpenAPI spec.
 *
 * The spec (`openapi.json`, ~360 KB) is imported here and transformed into a flat,
 * serialisable shape the docs pages render. This module is imported ONLY from
 * `+page.server.ts` / `+layout.server.ts` (build-time, prerendered), so neither the
 * raw spec nor this transform ever reaches the client bundle — the pages ship as
 * static HTML.
 *
 * To refresh after the API changes, regenerate the snapshot from the backend:
 *   uv run python -c "import json; from crux_backend.api.http_app.main import \
 *     create_app; json.dump(create_app().openapi(), open('.../src/lib/openapi.json','w'), indent=2)"
 */
import rawSpec from './openapi.json';

// ── Placeholder base URL used in the copy-paste examples ────────────────────────
// Crux is self-hosted, so there is no canonical public host — this is the address
// of *your* deployment. Kept obvious on purpose.
export const API_BASE = 'https://crux.example.com';

// ── Minimal OpenAPI type surface (only the parts we read) ───────────────────────
interface RawSchema {
	$ref?: string;
	type?: string;
	title?: string;
	description?: string;
	default?: unknown;
	enum?: unknown[];
	anyOf?: RawSchema[];
	items?: RawSchema;
	properties?: Record<string, RawSchema>;
	required?: string[];
	maxLength?: number;
	minLength?: number;
	pattern?: string;
	format?: string;
	additionalProperties?: boolean | RawSchema;
}
interface RawParam {
	name: string;
	in: string;
	required?: boolean;
	schema?: RawSchema;
	description?: string;
}
interface RawBodyOrResponse {
	required?: boolean;
	description?: string;
	content?: Record<string, { schema?: RawSchema }>;
}
interface RawOperation {
	tags?: string[];
	summary?: string;
	description?: string;
	security?: Array<Record<string, string[]>>;
	parameters?: RawParam[];
	requestBody?: RawBodyOrResponse;
	responses?: Record<string, RawBodyOrResponse>;
}
interface RawSpec {
	info: { title: string; version: string; description?: string };
	paths: Record<string, Record<string, RawOperation>>;
	components?: { schemas?: Record<string, RawSchema> };
	tags?: Array<{ name: string; description?: string }>;
}

const spec = rawSpec as unknown as RawSpec;
const schemas = spec.components?.schemas ?? {};
const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete'] as const;

// ── Public shapes rendered by the pages ─────────────────────────────────────────
export interface ApiField {
	name: string;
	type: string;
	required: boolean;
	description?: string;
	constraints?: string;
}
export interface ApiParam extends ApiField {
	location: 'path' | 'query' | 'header' | 'cookie';
}
export interface ApiResponse {
	status: string;
	description: string;
	schemaName?: string;
}
export interface ApiEndpoint {
	id: string;
	method: string;
	path: string;
	summary: string;
	description?: string;
	auth: boolean;
	params: ApiParam[];
	body?: { schemaName?: string; required: boolean; fields: ApiField[] };
	responses: ApiResponse[];
	curl: string;
	fetchJs: string;
}
export interface ApiCollection {
	slug: string;
	label: string;
	description?: string;
	endpoints: ApiEndpoint[];
}

// ── Helpers ─────────────────────────────────────────────────────────────────────
function refName(ref: string): string {
	return ref.split('/').pop() ?? ref;
}

function resolve(schema: RawSchema | undefined): RawSchema | undefined {
	if (schema?.$ref) return schemas[refName(schema.$ref)] ?? schema;
	return schema;
}

/** A human-friendly type label, e.g. "string", "string | null", "array<Device>". */
function typeLabel(schema: RawSchema | undefined): string {
	if (!schema) return 'any';
	if (schema.$ref) return refName(schema.$ref);
	if (schema.anyOf) {
		const parts = schema.anyOf.map(typeLabel);
		// Collapse the common Optional[X] = anyOf[X, null] into "X | null".
		return [...new Set(parts)].join(' | ');
	}
	if (schema.type === 'array') return `array<${typeLabel(schema.items)}>`;
	if (schema.type === 'null') return 'null';
	if (schema.enum) return schema.type ?? 'enum';
	return schema.type ?? 'object';
}

/** Unwrap Optional[X] to its non-null member so constraints/defaults come from X. */
function primary(schema: RawSchema): RawSchema {
	if (schema.anyOf) {
		const nonNull = schema.anyOf.find((s) => s.type !== 'null');
		if (nonNull) return nonNull;
	}
	return schema;
}

function constraintText(schema: RawSchema): string | undefined {
	const s = primary(schema);
	const bits: string[] = [];
	if (s.enum) bits.push(`one of: ${s.enum.map((e) => JSON.stringify(e)).join(', ')}`);
	if (s.pattern) bits.push(`pattern ${s.pattern}`);
	if (s.format) bits.push(s.format);
	if (typeof s.minLength === 'number' && typeof s.maxLength === 'number')
		bits.push(`${s.minLength}–${s.maxLength} chars`);
	else if (typeof s.maxLength === 'number') bits.push(`≤ ${s.maxLength} chars`);
	else if (typeof s.minLength === 'number') bits.push(`≥ ${s.minLength} chars`);
	const dflt = schema.default ?? s.default;
	if (dflt !== undefined) bits.push(`default ${JSON.stringify(dflt)}`);
	return bits.length ? bits.join(' · ') : undefined;
}

function fieldsFromSchema(schema: RawSchema | undefined): ApiField[] {
	const resolved = resolve(schema);
	if (!resolved?.properties) return [];
	const req = new Set(resolved.required ?? []);
	return Object.entries(resolved.properties).map(([name, prop]) => ({
		name,
		type: typeLabel(prop),
		required: req.has(name),
		description: prop.description,
		constraints: constraintText(prop)
	}));
}

/** A representative placeholder value for a field, used in the request examples. */
function sampleValue(field: ApiField): unknown {
	const t = field.type;
	if (t.startsWith('array')) return [];
	if (t.includes('integer') || t.includes('number')) return 0;
	if (t.includes('boolean')) return true;
	if (t.includes('object')) return {};
	// Prefer the first enum value when the constraint hints at one.
	const enumMatch = field.constraints?.match(/one of: (.+?)(?: ·|$)/);
	if (enumMatch) {
		const first = enumMatch[1].split(', ')[0];
		try {
			return JSON.parse(first);
		} catch {
			return first.replace(/^"|"$/g, '');
		}
	}
	return 'string';
}

/** Replace {path_params} with a concrete sample so the examples are runnable. */
function fillPath(path: string, params: ApiParam[]): string {
	return path.replace(/\{([^}]+)\}/g, (_m, name: string) => {
		const p = params.find((x) => x.name === name);
		return p && (p.type.includes('integer') || p.type.includes('number')) ? '123' : `${name}`;
	});
}

function buildBodyExample(fields: ApiField[]): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const f of fields) out[f.name] = sampleValue(f);
	return out;
}

function buildCurl(ep: ApiEndpoint): string {
	const url = API_BASE + fillPath(ep.path, ep.params);
	const query = ep.params
		.filter((p) => p.location === 'query' && p.required)
		.map((p) => `${p.name}=${encodeURIComponent(String(sampleValue(p)))}`)
		.join('&');
	const full = query ? `${url}?${query}` : url;

	const lines = [`curl -X ${ep.method} '${full}'`];
	if (ep.auth) lines.push(`  -H 'Authorization: Bearer <token>'`);
	if (ep.body) {
		lines.push(`  -H 'Content-Type: application/json'`);
		lines.push(`  -d '${JSON.stringify(buildBodyExample(ep.body.fields))}'`);
	}
	return lines.join(' \\\n');
}

function buildFetch(ep: ApiEndpoint): string {
	const url = API_BASE + fillPath(ep.path, ep.params);
	const query = ep.params
		.filter((p) => p.location === 'query' && p.required)
		.map((p) => `${p.name}=${encodeURIComponent(String(sampleValue(p)))}`)
		.join('&');
	const full = query ? `${url}?${query}` : url;

	const headers: string[] = [];
	if (ep.auth) headers.push(`    Authorization: \`Bearer \${token}\``);
	if (ep.body) headers.push(`    'Content-Type': 'application/json'`);

	const opts = [`  method: '${ep.method}'`];
	if (headers.length) opts.push(`  headers: {\n${headers.join(',\n')}\n  }`);
	if (ep.body)
		opts.push(
			`  body: JSON.stringify(${JSON.stringify(buildBodyExample(ep.body.fields), null, 2)})`
		);

	return `const res = await fetch('${full}', {\n${opts.join(',\n')}\n});\nconst data = await res.json();`;
}

// Known acronyms so tag slugs render as real product names, not "Ai Agent".
const ACRONYMS: Record<string, string> = {
	ai: 'AI',
	api: 'API',
	ipam: 'IPAM',
	iam: 'IAM',
	mop: 'MoP',
	snmp: 'SNMP',
	smtp: 'SMTP',
	llm: 'LLM',
	v2: 'v2'
};

export function collectionLabel(slug: string): string {
	return slug
		.split('-')
		.map((part) => ACRONYMS[part] ?? part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

function endpointId(method: string, path: string): string {
	return `${method}-${path}`
		.toLowerCase()
		.replace(/[{}]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

function buildEndpoint(method: string, path: string, op: RawOperation): ApiEndpoint {
	const params: ApiParam[] = (op.parameters ?? []).map((p) => ({
		name: p.name,
		location: (p.in as ApiParam['location']) ?? 'query',
		required: p.required ?? false,
		type: typeLabel(p.schema),
		description: p.description,
		constraints: p.schema ? constraintText(p.schema) : undefined
	}));

	const bodySchema = op.requestBody?.content?.['application/json']?.schema;
	const body = bodySchema
		? {
				schemaName: bodySchema.$ref ? refName(bodySchema.$ref) : undefined,
				required: op.requestBody?.required ?? false,
				fields: fieldsFromSchema(bodySchema)
			}
		: undefined;

	const responses: ApiResponse[] = Object.entries(op.responses ?? {}).map(([status, r]) => {
		const schema = r.content?.['application/json']?.schema;
		return {
			status,
			description: r.description ?? '',
			schemaName: schema?.$ref ? refName(schema.$ref) : undefined
		};
	});

	const ep: ApiEndpoint = {
		id: endpointId(method, path),
		method: method.toUpperCase(),
		path,
		summary: op.summary ?? `${method.toUpperCase()} ${path}`,
		description: op.description,
		auth: Boolean(op.security?.length),
		params,
		body,
		responses,
		curl: '',
		fetchJs: ''
	};
	ep.curl = buildCurl(ep);
	ep.fetchJs = buildFetch(ep);
	return ep;
}

// ── Build the collections, ordered by the spec's tag metadata ───────────────────
function buildCollections(): ApiCollection[] {
	const byTag = new Map<string, ApiEndpoint[]>();
	for (const [path, item] of Object.entries(spec.paths)) {
		for (const method of HTTP_METHODS) {
			const op = item[method];
			if (!op) continue;
			const tag = op.tags?.[0] ?? 'general';
			if (!byTag.has(tag)) byTag.set(tag, []);
			byTag.get(tag)!.push(buildEndpoint(method, path, op));
		}
	}

	// Preserve the tag order declared in the spec (openapi_tags), then any extras.
	const ordered = (spec.tags ?? []).map((t) => t.name);
	const tagNames = [...byTag.keys()].sort((a, b) => {
		const ia = ordered.indexOf(a);
		const ib = ordered.indexOf(b);
		if (ia === -1 && ib === -1) return a.localeCompare(b);
		if (ia === -1) return 1;
		if (ib === -1) return -1;
		return ia - ib;
	});

	return tagNames.map((name) => ({
		slug: name,
		label: collectionLabel(name),
		description: spec.tags?.find((t) => t.name === name)?.description,
		endpoints: byTag.get(name)!
	}));
}

export const apiCollections: ApiCollection[] = buildCollections();

export const apiMeta = {
	title: spec.info.title,
	version: spec.info.version,
	description: spec.info.description,
	baseUrl: API_BASE,
	totalEndpoints: apiCollections.reduce((n, c) => n + c.endpoints.length, 0)
};

export function getCollection(slug: string): ApiCollection | undefined {
	return apiCollections.find((c) => c.slug === slug);
}

/** Lightweight nav used by the docs sidebar (no endpoint bodies). */
export function apiNav(): Array<{ slug: string; label: string; count: number }> {
	return apiCollections.map((c) => ({ slug: c.slug, label: c.label, count: c.endpoints.length }));
}
