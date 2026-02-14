export default function bskyJpegToAvif(source: string): string;
export default function bskyJpegToAvif(source: string | undefined): string | undefined;


export default function bskyJpegToAvif(source: string | undefined) {
    return source?.replace(/@jpeg$/, "@avif")
}