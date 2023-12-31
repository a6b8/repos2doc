![CircleCI](https://img.shields.io/circleci/build/github/a6b8/repos2doc/main)

# Repos 2 Doc

Repos2Doc assists in preparing one or multiple GitHub repositories to consolidate their content into a single file. This file can be in one of the following formats: `text (.txt)`, `markdown (.md)`, or `pdf (.pdf)`. You can then upload this file to the OpenAI GPT editor as a searchable document. This enables the AI to answer questions based on the document's content and even generate code. This can be especially valuable for very new software with rapid update cycles.

> Designed for AI Embedding Generation

## Quickstart

### Command Line Interface

1. Open your Terminal and install repos2doc
```
npm install -g repos2doc
```

2. Run repos2doc
```
repos2doc
```

3. Types: `a6b8/repos2doc/main, a6b8/satNames/main` which create a document from two repositories.

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
? > a6b8/repos2doc/main, a6b8/satNames/main
```


### Node.js

**Terminal**
```bash
npm init -y && npm i repos2doc
```

**Node**
index.mjs

```js
import { Repos2Doc } from 'repos2doc'

const r4g = new Repos2Doc()
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
    - [constructor()](#constructor)
  - [Options](#options)
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
| options  | `Array of Objects`              | Insert additional content, currently only supported key 'description'. Will insert between overview and file cvontent. content                               | `false`    |

Options can have following keys `description` and `filter`. Find more Information about filters here: [./src/data/config.mjs]([./src/data/config.mjs](https://github.com/a6b8/repos2doc/blob/592b9418565126889c37760547a426bf54c3d039/src/data/config.mjs#L51))


**Example**

```js
import { Repos2Doc } from 'repos2doc'

const r4g = new Repos2Doc()

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
import { Repos2Doc } from 'repos2doc'

const myOwnConfig = {
    // Your custom configuration here
}

const r4g = new Repos2Doc()
r4g
    .setConfig( { myOwnConfig } )
    .getDocument( { ... } )
```

### constructor()

The constructor can be provided with a variable used to suppress the displayed terminal messages. By default, `silent` is set to `false`.

```js
const silent = true
const r2d = new Repos2Doc( silent )
```

## Options

**Example:**

```js
import { Repos2Doc } from 'repos2doc'
const repos2doc = new Repos2Doc()

const config = repos2doc.getConfig()
config['files']['test'] = [
    {
        'type': 'allow',
        'search': 'includes',
        'strings': [
            '404.html',
        ]
    }
]

repos2doc.getDocument( {
    'repositories': [ 'ordinals/ord/gh-pages' ],
    'name': 'ord',
    'destinationFolder': './result/docs/',
    'formats': [ 'pdf', 'txt', 'md' ],
    'options': [ 
        {
            'description': 'this is a test!',
            'filter': 'test'
        }
    ]
} )

```


## License

The module is available as open source under the terms of the [MIT License](https://github.com/a6b8/repos2doc/blob/main/LICENSE).
