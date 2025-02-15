import stateParams from "./state-params"

export default function (
	searchParams: URLSearchParams,
	profile: string | undefined = undefined
): [string, 307] {
	return [
		`/login?${stateParams(searchParams, profile)}`,
		307
	]
}
