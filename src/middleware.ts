import type { MiddlewareHandler } from "astro"
import publicClient from "./utilities/public-client"
import "@atcute/bluesky/lexicons"
import { sequence } from "astro:middleware"
import { isValidHandle } from "@atproto/syntax"

const removeEmptyQuery = (async (
	{ url: { href, pathname }, redirect },
	next
) => {
	if (href.endsWith("?")) return redirect(pathname)

	return await next()
}) satisfies MiddlewareHandler

const profileHandler = sequence(
	async (
		{ params: { profile }, locals, rewrite },
		next
	) => {
		if (!isValidHandle(profile as string))
			return rewrite("/404")

		try {
			const {
				data: { labels }
			} = await publicClient.get(
				"app.bsky.actor.getProfile",
				{
					params: {
						actor: profile as string
					}
				}
			)

			locals.isProfilePublic = Boolean(
				labels &&
					!labels.some(
						({ val }) =>
							val == "!no-unauthenticated"
					)
			)
		} catch (error) {
			if ((error as any).status == 400)
				return rewrite("/error/profile-not-found")
		}

		return await next()
	},
	removeEmptyQuery
) as MiddlewareHandler

const nonProfilePathnameMatchers = [
	/^\/$/,
	/^\/favicon\.svg$/,
	/^\/jwks\.json$/,
	/^\/client-metadata\.json$/,
	/^\/profile$/,
	/^\/styles\/.*$/,
	/^\/images\/.*$/,
	/^\/login$/,
	/^\/login\/redirect$/,
	/^\/logout$/
]

export const onRequest = (async (context, next) => {
	console.log(context)

	if (context.url.pathname == "/")
		return await removeEmptyQuery(context, next)
	else if (
		!nonProfilePathnameMatchers.some(matcher =>
			matcher.test(context.url.pathname)
		)
	)
		return await profileHandler(context, next)
	else return await next()
}) as MiddlewareHandler
