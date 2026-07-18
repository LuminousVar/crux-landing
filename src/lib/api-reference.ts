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
	operationId?: string;
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
/** One runnable request example, in a given language. */
export interface ApiSample {
	/** Stable id, e.g. 'curl' | 'python' | 'go'. */
	id: string;
	/** Tab label, e.g. 'cURL' | 'Python'. */
	label: string;
	/** Shiki grammar id used to highlight `code` at build time. */
	lang: string;
	code: string;
}

export interface ApiEndpoint {
	id: string;
	method: string;
	path: string;
	summary: string;
	description?: string;
	auth: boolean;
	/** snake_case function name, e.g. list_devices — like an SDK method. */
	operationId: string;
	/** Required token scope, e.g. "Devices: READ" (READ for GET, WRITE otherwise). */
	scope: string;
	/** Request media type, present only when the endpoint takes a body. */
	consumes?: string;
	/** Response media type. */
	produces: string;
	params: ApiParam[];
	body?: { schemaName?: string; required: boolean; fields: ApiField[] };
	responses: ApiResponse[];
	/** Runnable request examples across languages (cURL, Python, Go, …). */
	samples: ApiSample[];
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

/** Shared request facts every language generator needs. */
interface SampleCtx {
	method: string;
	url: string;
	auth: boolean;
	bodyObj?: Record<string, unknown>;
	bodyJson?: string;
}

function sampleCtx(ep: ApiEndpoint): SampleCtx {
	const base = API_BASE + fillPath(ep.path, ep.params);
	const query = ep.params
		.filter((p) => p.location === 'query' && p.required)
		.map((p) => `${p.name}=${encodeURIComponent(String(sampleValue(p)))}`)
		.join('&');
	const bodyObj = ep.body ? buildBodyExample(ep.body.fields) : undefined;
	return {
		method: ep.method,
		url: query ? `${base}?${query}` : base,
		auth: ep.auth,
		bodyObj,
		bodyJson: bodyObj ? JSON.stringify(bodyObj, null, 2) : undefined
	};
}

/** Indent a multi-line JSON blob so it nests cleanly inside generated code. */
function indent(text: string, pad: string): string {
	return text
		.split('\n')
		.map((l, i) => (i === 0 ? l : pad + l))
		.join('\n');
}

function genCurl(c: SampleCtx): string {
	const lines = [`curl -X ${c.method} '${c.url}'`];
	if (c.auth) lines.push(`  -H 'Authorization: Bearer <token>'`);
	if (c.bodyObj) {
		lines.push(`  -H 'Content-Type: application/json'`);
		lines.push(`  -d '${JSON.stringify(c.bodyObj)}'`);
	}
	return lines.join(' \\\n');
}

function genTypeScript(c: SampleCtx): string {
	const headers: string[] = [];
	if (c.auth) headers.push('    Authorization: `Bearer ${token}`');
	if (c.bodyObj) headers.push(`    'Content-Type': 'application/json'`);
	const opts = [`  method: '${c.method}'`];
	if (headers.length) opts.push(`  headers: {\n${headers.join(',\n')}\n  }`);
	if (c.bodyJson) opts.push(`  body: JSON.stringify(${indent(c.bodyJson, '  ')})`);
	return `const res = await fetch('${c.url}', {\n${opts.join(',\n')}\n});\nconst data = await res.json();`;
}

function genPython(c: SampleCtx): string {
	const lines = ['import requests', '', `res = requests.${c.method.toLowerCase()}(`, `    "${c.url}",`];
	if (c.auth) lines.push(`    headers={"Authorization": "Bearer <token>"},`);
	if (c.bodyObj) lines.push(`    json=${indent(pyLiteral(c.bodyObj), '    ')},`);
	lines.push(')', 'data = res.json()');
	return lines.join('\n');
}

/** Render a JSON value as a Python literal (True/False/None, dict/list). */
function pyLiteral(value: unknown, pad = ''): string {
	if (value === null) return 'None';
	if (value === true) return 'True';
	if (value === false) return 'False';
	if (typeof value === 'number') return String(value);
	if (typeof value === 'string') return JSON.stringify(value);
	if (Array.isArray(value)) {
		if (value.length === 0) return '[]';
		const inner = value.map((v) => `${pad}    ${pyLiteral(v, pad + '    ')}`).join(',\n');
		return `[\n${inner}\n${pad}]`;
	}
	const entries = Object.entries(value as Record<string, unknown>);
	if (entries.length === 0) return '{}';
	const inner = entries
		.map(([k, v]) => `${pad}    ${JSON.stringify(k)}: ${pyLiteral(v, pad + '    ')}`)
		.join(',\n');
	return `{\n${inner}\n${pad}}`;
}

function genGo(c: SampleCtx): string {
	const lines = ['package main', '', 'import (', '\t"fmt"', '\t"io"', '\t"net/http"'];
	if (c.bodyJson) lines.push('\t"strings"');
	lines.push(')', '', 'func main() {');
	if (c.bodyJson) {
		lines.push('\tbody := strings.NewReader(`' + c.bodyJson + '`)');
		lines.push(`\treq, _ := http.NewRequest("${c.method}", "${c.url}", body)`);
		lines.push('\treq.Header.Set("Content-Type", "application/json")');
	} else {
		lines.push(`\treq, _ := http.NewRequest("${c.method}", "${c.url}", nil)`);
	}
	if (c.auth) lines.push('\treq.Header.Set("Authorization", "Bearer <token>")');
	lines.push(
		'\tres, _ := http.DefaultClient.Do(req)',
		'\tdefer res.Body.Close()',
		'\tout, _ := io.ReadAll(res.Body)',
		'\tfmt.Println(string(out))',
		'}'
	);
	return lines.join('\n');
}

function genRust(c: SampleCtx): string {
	const lines = [
		'use reqwest::Client;',
		'',
		'#[tokio::main]',
		'async fn main() -> Result<(), reqwest::Error> {',
		'    let client = Client::new();',
		`    let res = client.${c.method.toLowerCase()}("${c.url}")`
	];
	if (c.auth) lines.push('        .bearer_auth("<token>")');
	if (c.bodyJson) lines.push(`        .json(&serde_json::json!(${indent(c.bodyJson, '        ')}))`);
	lines.push(
		'        .send()',
		'        .await?;',
		'    let data = res.text().await?;',
		'    println!("{}", data);',
		'    Ok(())',
		'}'
	);
	return lines.join('\n');
}

function genRuby(c: SampleCtx): string {
	const verb = c.method.charAt(0) + c.method.slice(1).toLowerCase(); // GET -> Get
	const lines = [
		'require "net/http"',
		'require "json"',
		'',
		`uri = URI("${c.url}")`,
		`req = Net::HTTP::${verb}.new(uri)`
	];
	if (c.auth) lines.push('req["Authorization"] = "Bearer <token>"');
	if (c.bodyJson) {
		lines.push('req["Content-Type"] = "application/json"');
		lines.push(`req.body = ${indent(c.bodyJson, '')}.to_json`);
	}
	lines.push(
		'',
		'res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|',
		'  http.request(req)',
		'end',
		'data = JSON.parse(res.body)'
	);
	return lines.join('\n');
}

function genPowerShell(c: SampleCtx): string {
	const lines: string[] = [];
	if (c.auth) lines.push('$headers = @{ Authorization = "Bearer <token>" }');
	if (c.bodyJson) lines.push(`$body = '${JSON.stringify(c.bodyObj)}'`);
	const args = [`-Method ${c.method}`, `-Uri "${c.url}"`];
	if (c.auth) args.push('-Headers $headers');
	if (c.bodyJson) args.push('-Body $body', '-ContentType "application/json"');
	lines.push(`$res = Invoke-RestMethod ${args.join(' ')}`);
	return lines.join('\n');
}

function buildSamples(ep: ApiEndpoint): ApiSample[] {
	const c = sampleCtx(ep);
	return [
		{ id: 'curl', label: 'cURL', lang: 'bash', code: genCurl(c) },
		{ id: 'python', label: 'Python', lang: 'python', code: genPython(c) },
		{ id: 'typescript', label: 'TypeScript', lang: 'typescript', code: genTypeScript(c) },
		{ id: 'go', label: 'Go', lang: 'go', code: genGo(c) },
		{ id: 'rust', label: 'Rust', lang: 'rust', code: genRust(c) },
		{ id: 'ruby', label: 'Ruby', lang: 'ruby', code: genRuby(c) },
		{ id: 'powershell', label: 'PowerShell', lang: 'powershell', code: genPowerShell(c) }
	];
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

/**
 * A clean snake_case operation name, in the spirit of an SDK method (CrowdStrike shows
 * these as the "PEP 8" name). Prefer the human summary ("List devices" → list_devices);
 * fall back to method + the last non-param path segment.
 */
function deriveOperationId(method: string, path: string, op: RawOperation): string {
	const fromSummary = op.summary
		?.toLowerCase()
		.replace(/[^a-z0-9]+/g, '_')
		.replace(/^_|_$/g, '');
	if (fromSummary) return fromSummary;
	const seg = path
		.split('/')
		.filter((s) => s && !s.startsWith('{'))
		.pop();
	return `${method.toLowerCase()}_${(seg ?? 'root').replace(/[^a-z0-9]+/gi, '_')}`;
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

	const resource = collectionLabel(op.tags?.[0] ?? 'general');
	const ep: ApiEndpoint = {
		id: endpointId(method, path),
		method: method.toUpperCase(),
		path,
		summary: op.summary ?? `${method.toUpperCase()} ${path}`,
		description: op.description,
		auth: Boolean(op.security?.length),
		operationId: deriveOperationId(method, path, op),
		scope: `${resource}: ${method.toLowerCase() === 'get' ? 'READ' : 'WRITE'}`,
		consumes: body ? 'application/json' : undefined,
		produces: 'application/json',
		params,
		body,
		responses,
		samples: []
	};
	ep.samples = buildSamples(ep);
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

/**
 * Client libraries. Crux ships a standard OpenAPI 3 spec rather than hand-written SDKs,
 * so a fully typed client for any of these languages is generated from that spec with the
 * listed tool — always in lock-step with the current API version. (No invented package
 * version numbers: the client tracks apiMeta.version.)
 */
export const clientLibraries: { language: string; generator: string }[] = [
	{ language: 'Python', generator: 'openapi-python-client' },
	{ language: 'TypeScript', generator: 'openapi-typescript' },
	{ language: 'Go', generator: 'oapi-codegen' },
	{ language: 'Rust', generator: 'openapi-generator (rust)' },
	{ language: 'Ruby', generator: 'openapi-generator (ruby)' },
	{ language: 'PowerShell', generator: 'openapi-generator (powershell)' }
];

export function getCollection(slug: string): ApiCollection | undefined {
	return apiCollections.find((c) => c.slug === slug);
}

/** Lightweight nav used by the docs sidebar (no endpoint bodies). */
export function apiNav(): Array<{ slug: string; label: string; count: number }> {
	return apiCollections.map((c) => ({ slug: c.slug, label: c.label, count: c.endpoints.length }));
}
