import { CredentialManager, XRPC } from "@atcute/client"

const client = new XRPC({
	handler: new CredentialManager({
		service: "https://public.api.bsky.app"
	})
})

export default client
