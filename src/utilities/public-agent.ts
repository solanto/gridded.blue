import { Agent, CredentialSession } from "@atproto/api"

export default new Agent(
	new CredentialSession(
		new URL("https://public.api.bsky.app")
	)
)
