# DJcode website

The Next.js website for [cli.darshj.ai](https://cli.darshj.ai), presenting the [DJcode CLI](https://github.com/darshjme/djcode). The graphite-and-gold visual system includes an animated terminal, agent workflows, memory diagrams, model guidance, documentation, and installation instructions.

## Development

Requires a supported Node.js version and npm.

```sh
npm ci
npm run dev
```

```sh
npm run lint
npm run build
npm start
```

Next.js produces a standalone build. Deployment configuration lives in the existing hosting environment. `public/install.sh` is the installer served to visitors and must stay aligned with the CLI installer.

## Content accuracy

The site describes 19 core specialist profiles, 12 content roles, and 17 tools from the CLI registries. Terminal output is illustrative, not a live user session or performance benchmark. Local inference and hosted inference have different data flows. Hardware figures are model footprints, not total runtime memory requirements.

Featherless is an optional hosted provider using its [official OpenAI-compatible API](https://featherless.ai/docs/quickstart-guide). The site uses ordinary official links. No affiliate identifier, referral benefit, partnership, or sponsorship is claimed. A current public referral program could not be verified from official sources; its [sponsorship program](https://featherless.ai/sponsorship) is a separate application process.

Comparison entries link to each tool's official documentation. The website does not claim performance superiority or invented adoption statistics.

MIT licensed. Copyright 2026 DarshJ.AI.
