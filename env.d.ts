import type {
	Did,
	OAuthHttpsRedirectURI,
	OAuthSession
} from "@atproto/oauth-client-node"

interface ImportMetaEnv {
	readonly SITE_URL: OAuthHttpsRedirectURI
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
