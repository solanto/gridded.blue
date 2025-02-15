import type { OAuthClientMetadataInput } from "@atproto/oauth-client-node"

export default {
	client_id: `${import.meta.env.SITE}/client-metadata.json`,
	client_name: "My App",
	client_uri: import.meta.env.SITE,
	redirect_uris: [
		`${import.meta.env.SITE}/login/redirect`
	],
	scope: "atproto transition:generic",
	grant_types: ["authorization_code", "refresh_token"],
	response_types: ["code"],
	token_endpoint_auth_method: "private_key_jwt",
	token_endpoint_auth_signing_alg: "ES256",
	application_type: "web",
	dpop_bound_access_tokens: true,
	jwks_uri: `${import.meta.env.SITE}/jwks.json`
} as OAuthClientMetadataInput
