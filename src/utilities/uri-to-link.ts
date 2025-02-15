export default function (handle: string, uri: string) {
	const rkeyMatch = uri.match(/[^/]*$/g)

	return rkeyMatch ?
			`https://bsky.app/profile/${handle}/post/${rkeyMatch[0]}`
		:	""
}
