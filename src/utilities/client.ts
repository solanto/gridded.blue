import clientMetadata from "./client-metadata"
import { JoseKey, type Importable } from "@atproto/jwk-jose"
import { NodeOAuthClient } from "@atproto/oauth-client-node"
import type { SimpleStore } from "@atproto-labs/simple-store"

class Store implements SimpleStore {
	map: Map<string, any>
	set: (key: string, value: any) => void
	get: (key: string) => any
	del: (key: string) => void

	constructor() {
		this.map = new Map()

		this.set = this.map.set.bind(this.map)
		this.get = this.map.get.bind(this.map)
		this.del = this.map.delete.bind(this.map)
	}
}

// let keyset = await Promise.all(
// 	new Array(5)
// 		.fill(null)
// 		.map(() =>
// 			JoseKey.generate(["ES256"], crypto.randomUUID())
// 		)
// )

// // use local keys in dev because auth server caches keys
// // & considers new keys invalid until cache is refreshed
// if (import.meta.env.DEV) {
// 	const { readFileSync, writeFileSync } = await import(
// 		"node:fs"
// 	)

// 	const jwkCache = ".jwks.json"

// 	try {
// 		keyset = await Promise.all(
// 			JSON.parse(
// 				readFileSync(jwkCache).toString()
// 			).map(({ jwk }: { jwk: Importable }) =>
// 				JoseKey.fromImportable(jwk)
// 			)
// 		)
// 	} catch (error: unknown) {
// 		if (
// 			error instanceof Error &&
// 			(error as any)?.code == "ENOENT"
// 		)
// 			writeFileSync(jwkCache, JSON.stringify(keyset))
// 		else throw error
// 	}
// }

const client = new NodeOAuthClient({
	// This object will be used to build the payload of the /client-metadata.json
	// endpoint metadata, exposing the client metadata to the OAuth server.
	clientMetadata,

	// Used to authenticate the client to the token endpoint. Will be used to
	// build the jwks object to be exposed on the "jwks_uri" endpoint.
	keyset: JSON.parse(import.meta.env.JWKS),

	// Interface to store authorization state data (during authorization flows)
	stateStore: new Store(),

	// Interface to store authenticated session data
	sessionStore: new Store()

	// A lock to prevent concurrent access to the session store. Optional if only one instance is running.
	// requestLock
})

// client.addEventListener("updated", event =>
// 	console.log("Refreshed tokens were saved in the store:", event.detail)
// )

// client.addEventListener("deleted", event =>
// 	console.log("Session was deleted from the session store:", event.detail)
// )

export default client
