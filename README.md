# FPOS Shared Components

Add shared components to your Angular project as a git submodule.

```bash 
$ git submodule add https://git@github.com/thepowrhouse/shared-components.git src/app/shared-components
```

Copy the assets to the application assets folder on build by changing the assets array in `.angular-cli`.

```json
{
	...
	"assets": [
		"assets",
		{ "glob": "**/*", "input": "./app/shared-components/assets", "output": "./assets/" }
	]
}
```

## Updating Your Project

Update your submodules by either changing into the shared components directory and running:

```bash
$ git pull
```

Or, from your project root:

```bash
$ git submodule update --recursive --remote
```

Then add the updates in your repository commit and your done.
