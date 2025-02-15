export default function inputBoolean(
	value: any
): value is "on" {
	return value === "on"
}
