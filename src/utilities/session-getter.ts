import type { APIContext } from "astro"
import publicAgent from "./public-agent"
import type { Did } from "@atproto/api"
import type { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs"

type MaybeSession = APIContext["session"]

// const profileCacheMap: {
// 	[k: string]: (data: ProfileViewDetailed) => any
// } = {
// 	handle: data => data.handle,
// 	displayName: data => data.displayName ?? null
// }

// const fromProfile = <T>(key: string) =>
// 	async function (
// 		session: MaybeSession
// 	): Promise<T | undefined> {
// 		if (session) {
// 			const value = (await session.get(key)) as T

// 			if (value) return value
// 			else {
// 				const did: Did | undefined =
// 					await session.get("did")

// 				if (did) {
// 					try {
// 						const { data } =
// 							await publicAgent.getProfile({
// 								actor: did
// 							})

// 						for (const [
// 							key,
// 							getter
// 						] of Object.entries(
// 							profileCacheMap
// 						))
// 							session.set(key, getter(data))

// 						console.log(await session.entries())
// 						return profileCacheMap[key](data)
// 					} catch {}
// 				}
// 			}
// 		} else return undefined
// 	}

// export const handle = fromProfile<string>("handle")

// export const displayName = fromProfile<string | null>(
// 	"displayName"
// )

export const did = async (session: MaybeSession) =>
	(await session?.get("did")) as Did | undefined

export async function profile(session: MaybeSession) {
	if (!session) return undefined

	const sessionDid = await did(session)

	if (!sessionDid) return undefined

	const sessionProfile = (await session.get(
		"profile"
	)) as ProfileViewDetailed

	if (!sessionProfile) {
		const { data } = await publicAgent.getProfile({
			actor: sessionDid
		})

		session.set("profile", data)

		return data
	} else return sessionProfile
}

export async function identity(session: MaybeSession) {
	const sessionDid = await did(session)

	if (!sessionDid) return undefined

	const sessionProfile = (await profile(
		session
	)) as ProfileViewDetailed

	return {
		did: sessionDid,
		profile: sessionProfile
	}
}

export type Identity = Awaited<ReturnType<typeof identity>>
