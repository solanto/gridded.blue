import type { MiddlewareHandler } from "astro"
import publicClient from "./utilities/public-client"
import "@atcute/bluesky/lexicons"
import { sequence } from "astro:middleware"
import { isValidHandle } from "@atproto/syntax"

const removeEmptyQuery = (async (
	{ url: { href, pathname }, redirect },
	next
) => {
	console.log("checking for empty query on", href)

	if (href.endsWith("?")) {
		console.log("redirecting to", pathname)
		return redirect(pathname)
	}

	return await next()
}) satisfies MiddlewareHandler

const profileHandler = sequence(
	async (
		{ params: { profile }, locals, rewrite, redirect },
		next
	) => {
		console.log("handling profile")

		if (profile === undefined) {
			console.log(
				"profile is undefined; redirecting to /profile"
			)
			return redirect("/profile")
		} else if (!isValidHandle(profile as string)) {
			console.log(
				"profile is not valid; redirecting to /404"
			)
			return rewrite("/404")
		}

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
			if ((error as any).status == 400) {
				console.log(
					"profile is not found; redirecting to /error/profile-not-found"
				)
				return rewrite("/error/profile-not-found")
			}
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
	/^\/logout$/,
	/^\/404$/,
	/^\/500$/,
	/^\/error\/.*$/
]

export const onRequest = (async (context, next) => {
	const isNonProfilePathname =
		nonProfilePathnameMatchers.some(matcher =>
			matcher.test(context.url.pathname)
		)

	console.log(
		context.url.pathname,
		isNonProfilePathname ?
			"is non-profile pathname"
		:	"is profile pathname"
	)

	if (context.url.pathname == "/")
		return await removeEmptyQuery(context, next)
	else if (!isNonProfilePathname)
		return await profileHandler(context, next)
	else return await next()
}) as MiddlewareHandler
