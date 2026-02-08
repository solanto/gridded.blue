import type {
	Did,
	OAuthHttpsRedirectURI,
	OAuthSession
} from "@atproto/oauth-client-node"

interface ImportMetaEnv {
	readonly DEV: "true" | "false"
	readonly SITE: OAuthHttpsRedirectURI
	readonly JWKS: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}

declare global {
	namespace App {
		interface Locals {
			isProfilePublic: boolean
			identity: Did | undefined
		}
	}
}
