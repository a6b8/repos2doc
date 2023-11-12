![CircleCI](https://img.shields.io/circleci/build/github/a6b8/repos2doc/main)

# Repos 2 Doc

Repo2Docs assists in preparing one or multiple GitHub repositories to consolidate their content into a single file. This file can be in one of the following formats: `text (.txt)`, `markdown (.md)`, or `pdf (.pdf)`. You can then upload this file to the OpenAI GPT editor as a searchable document. This enables the AI to answer questions based on the document's content and even generate code. This can be especially valuable for very new software with rapid update cycles.

> Designed for AI Embedding Generation

## Quickstart

### Command Line Interface

```
npm install -g repos2doc
repos2doc
```

Example: `a6b8/repos2doc, a6b8/satNames`

```
  _____                      ___  _____             
 |  __ \                    |__ \|  __ \            
 | |__) |___ _ __   ___  ___   ) | |  | | ___   ___ 
 |  _  // _ \ '_ \ / _ \/ __| / /| |  | |/ _ \ / __|
 | | \ \  __/ |_) | (_) \__ \/ /_| |__| | (_) | (__ 
 |_|  \_\___| .__/ \___/|___/____|_____/ \___/ \___|
            | |                                     
            |_|                                     

Insert Repositories
  - Use following structure: "name/repo/branch"
  - For multiple repositories, separate them with a comma "name/repo/branch, name/repo/branch"
? >
```


### Node.js

**Terminal**
```bash
npm init -y && npm i repos2doc
```

**Node**
index.mjs

```js
import { Repo2Docs } from 'repos2doc'

const r4g = new Repo2Docs()
await r4g.getDocument( {
    'repositories': [
        'EasyMina/easyMina/main',
        'EasyMina/minaData/main'
    ]
} )
```

**Terminal**
```bash
node index.mjs
```

## Table of Contents

- [Repos 2 Doc](#repos-2-doc)
  - [Quickstart](#quickstart)
    - [Command Line Interface](#command-line-interface)
    - [Node.js](#nodejs)
  - [Table of Contents](#table-of-contents)
  - [Methods](#methods)
    - [getDocument()](#getdocument)
    - [setConfig()](#setconfig)
  - [License](#license)

## Methods

### getDocument()

This method downloads the data, saves it in a temporary folder, then combines all the files, and finally moves them to the actual destinationFolder. Only 'repositories' is required, and one or more repositories can be specified. For multiple repositories, the data is written sequentially into the document.

| Key              | Type                  | Description                                           | Required |
| ---------------- | --------------------- | ----------------------------------------------------- | -------- |
| repositories     | `Array of Strings`    | GitHub repositories in the format "userName/repositoryName/branchName" | `true`     |
| name             | `String`              | Custom name                                           | `false`    |
| formats          | `Array of Strings`    | At least one value from: "txt" (text), "md" (markdown), "pdf" (pdf)           | `false`    |
| destinationFolder  | `String`              | Path starting with "./"                               | `false`    |

**Example**

```js
import { Repo2Docs } from 'repos2doc'

const r4g = new Repo2Docs()

await r4g.getDocument( {
    'repositories': [
        'EasyMina/easyMina/main',
        'EasyMina/minaData/main'
    ],
    'name': 'mina',
    'destinationFolder': './dataTest/',
    'formats': [ 'txt', 'md', 'pdf' ],
} )
```

### setConfig()

All module settings are stored in a config file, see [./src/data/config.mjs](./src/data/config.mjs). This file can be completely overridden by passing an object during initialization.

```js
import { Repo2Docs } from 'repos2doc'

const myOwnConfig = {
    // Your custom configuration here
}

const r4g = new Repo2Docs()
r4g.setConfig( myOwnConfig ).getDocument( { ... } )
```

## License

The module is available as open source under the terms of the [MIT License](https://github.com/a6b8/repos2doc/blob/main/LICENSE).
