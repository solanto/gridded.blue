import type { Agent } from "@atproto/api"
import {
	AppBskyEmbedImages as Images,
	AppBskyEmbedVideo as Video,
	AppBskyEmbedRecordWithMedia as RecordWithMedia
} from "@atproto/api"
import type { AspectRatio } from "@atproto/api/dist/client/types/app/bsky/embed/defs"
import type { FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs"
import inputBoolean from "./input-boolean"

type PostTest = (post: FeedViewPost) => boolean

const labelTest: (target: string) => PostTest =
	target =>
	({ post: { labels } }) =>
		labels?.some(({ val }) => val == target) ?? false

const suggestiveTest = labelTest("sexual"),
	nudityTest = labelTest("nudity"),
	adultTest = labelTest("porn")

const whitelistTests = {
	suggestive: suggestiveTest,
	nudity: nudityTest,
	adult: adultTest,
	unlabeled: post =>
		!(
			suggestiveTest(post) ||
			nudityTest(post) ||
			adultTest(post)
		),
	reply: ({ reply }) => reply !== undefined
} satisfies { [k: string]: PostTest; reply: PostTest }

const { reply: replyTest, ...labelTests } = whitelistTests

export type Whitelist = {
	[k in keyof typeof whitelistTests]: boolean
}

const whitelistOptions = Object.keys(whitelistTests)

export const whitelistFromSearchParams: (
	searchParams: URLSearchParams
) => Whitelist = searchParams =>
	Object.fromEntries(
		whitelistOptions.map(key => [
			key,
			inputBoolean(searchParams.get(key))
		])
	) as Whitelist

interface MediaItem {
	thumbnail: string
	alt: string
	aspectRatio: AspectRatio
	uri: string
	flag?: "multiple" | "video"
}

const square: AspectRatio = {
	width: 1,
	height: 1
}

const feedItemReducer = (whitelist: Whitelist) =>
	function (
		items: MediaItem[],
		post: FeedViewPost,
		depth: number = 0
	): MediaItem[] {
		const {
			post: { embed, uri }
		} = post

		if (
			(!whitelist.reply && replyTest(post)) ||
			!Object.entries(labelTests).some(
				([key, test]) =>
					whitelist[key as keyof Whitelist] &&
					test(post)
			)
		)
			return items

		if (Images.isView(embed)) {
			const image = embed.images[0]

			return [
				...items,
				{
					thumbnail: image.thumb,
					alt: image.alt,
					aspectRatio:
						image.aspectRatio ?? square,
					uri,
					flag:
						embed.images.length > 1 ?
							"multiple"
						:	undefined
				}
			]
		} else if (Video.isView(embed))
			return [
				...items,
				{
					thumbnail:
						embed.thumbnail ??
						"/images/blank.png",
					alt: embed.alt ?? "",
					aspectRatio:
						embed.aspectRatio ?? square,
					uri,
					flag: "video"
				}
			]
		else if (
			depth == 0 &&
			RecordWithMedia.isView(embed)
		)
			return feedItemReducer(whitelist)(
				items,
				post,
				1
			)
		else return items
	}

export default async function accumulateAuthorMedia(
	agent: Agent,
	author: string,
	quota: number,
	whitelist: Whitelist,
	limit: number | undefined = undefined,
	cursor: string | undefined = undefined,
	accumulator: MediaItem[] = []
) {
	if (quota <= 0) return { media: accumulator, cursor }

	const assuredLimit = limit ?? 30

	const { data } = await agent.getAuthorFeed({
		actor: author,
		cursor,
		filter: "posts_with_media",
		limit: assuredLimit
	})

	const increment: MediaItem[] = data.feed.reduce(
		feedItemReducer(whitelist),
		[]
	)

	const incremented = [...accumulator, ...increment]

	if (data.cursor === undefined)
		return {
			media: incremented,
			cursor: null
		}

	return accumulateAuthorMedia(
		agent,
		author,
		quota - increment.length,
		whitelist,
		limit,
		data.cursor,
		incremented
	)
}
