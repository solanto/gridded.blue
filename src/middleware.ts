import type { MiddlewareHandler } from "astro"
import publicAgent from "./utilities/public-agent"
import { ResponseType, XRPCError } from "@atproto/xrpc"
import { sequence } from "astro:middleware"
import { isValidHandle } from "@atproto/syntax"

const removeEmptyQuery: MiddlewareHandler = async (
	{ url: { href, pathname }, redirect },
	next
) => {
	if (href.endsWith("?")) return redirect(pathname)

	return await next()
}

const map: Record<string, MiddlewareHandler> = {
	"/": removeEmptyQuery,
	"/[profile]": sequence(
		async (
			{ params: { profile }, locals, rewrite },
			next
		) => {
			if (!isValidHandle(profile as string))
				return rewrite("/404")

			try {
				const {
					data: { labels }
				} = await publicAgent.getProfile({
					actor: profile as string
				})

				locals.isProfilePublic = Boolean(
					labels &&
						!labels.some(
							({ val }) =>
								val == "!no-unauthenticated"
						)
				)
			} catch (error) {
				if (
					error instanceof XRPCError &&
					error.status ==
						ResponseType.InvalidRequest
				)
					return rewrite(
						"/error/profile-not-found"
					)
			}

			return await next()
		},
		removeEmptyQuery
	)
}

export const onRequest: MiddlewareHandler = async (
	context,
	next
) => {
	const handler = map[context.routePattern]

	return await (handler ?
		(handler(context, next) as
			| Response
			| Promise<Response>)
	:	next())
}
