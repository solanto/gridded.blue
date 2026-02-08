# <img src="https://raw.githubusercontent.com/solanto/gridded.blue/refs/heads/master/public/favicon.svg" height="32" alt="" style="display:inline"> gridded.blue

gridded.blue is a basic, online client for [Bluesky](https://bsky.social) that shows users' images and videos in a grid—similarly to social media platforms like Pixelfed and Instagram. Since gridded.blue is a web app, it should work on and platform with a web browser and internet access!

In addition to viewing public profiles, you can view profiles that require login by authenticating with a Bluesky account.

A public instance of gridded.blue is available [online](https://gridded.blue).

## installing

This project uses [pnpm](https://pnpm.io/) and is built for hosting on [Netlify](https://www.netlify.com/).

```bash
pnpm install
```

Some setup is necessary before hosting a gridded.blue server. Namely, the following environment variables must be set (manually or using a `.env` file):

```env
DEV="true"                       # true or false depending on whether you're hosting for development
SITE="https://example.site.com"  # the server's public base URL, via which Bluesky will communicate for OAuth
JWKS='[{ "jwk": { ... } }, ...]' # JWK keys for atproto OAuth
```

For development, you can get a public endpoint through free services like [zrok](https://zrok.io/).

```bash
zrok share public 8888
```

 Autogenerating JWKs for atproto's OAuth is still subject to experimentation for gridded.blue; temporarily uncomment the large, commented blocks in [`src/utilities/client.ts`](src/utilities/client.ts) to generate a `.jwks.json` that can be copied into the `JWKS` environment variable.

 Finally, run a development server.

 ```bash
 pnpm dev
```

## contributing

Feel free to ask questions here or at [person@dandelion.computer](mailto:person@dandelion.computer). I'll do my best to collaborate with those who'd like to!

## license

[GNU General Public License v3.0 or later](https://spdx.org/licenses/GPL-3.0-or-later.html). See license in [`LICENSE.md`](LICENSE.md).
