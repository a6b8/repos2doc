![CircleCI](https://img.shields.io/circleci/build/github/a6b8/repo2GPT/main)

# Repo 2 File

Repo2GPT assists in preparing one or multiple GitHub repositories to consolidate their content into a single file. This file can be in one of the following formats: `text (.txt)`, `markdown (.md)`, or `pdf (.pdf)`. You can then upload this file to the OpenAI GPT editor as a searchable document. This enables the AI to answer questions based on the document's content and even generate code. This can be especially valuable for very new software with rapid update cycles.

> Designed for AI Embedding Generation

## Quickstart

**Terminal**
```bash
npm init -y && npm i repo2gpt
```

**Node**
index.mjs

```js
import { Repo2GPT } from 'repo2gpt'

const repo2gpt = new Repo2GPT()

await repo2gpt.getFile( {
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

- [Repo 2 File](#repo-2-file)
  - [Quickstart](#quickstart)
  - [Table of Contents](#table-of-contents)
  - [Methods](#methods)
    - [getFile()](#getfile)
    - [setConfig()](#setconfig)
  - [Limitations](#limitations)
  - [License](#license)

## Methods

### getFile()

This method downloads the data, saves it in a temporary folder, then combines all the files, and finally moves them to the actual destinationPath. Only 'repositories' is required, and one or more repositories can be specified. For multiple repositories, the data is written sequentially into the document.

| Key              | Type                  | Description                                           | Required |
| ---------------- | --------------------- | ----------------------------------------------------- | -------- |
| repositories     | `Array of Strings`    | GitHub repositories in the format "userName/repositoryName/branchName" | true     |
| name             | `String`              | Custom name                                           | false    |
| outputs          | `Array of Strings`    | At least one value from: "txt", "md", "pdf"           | false    |
| destinationPath  | `String`              | Path starting with "./"                               | false    |

**Example**

```js
import { Repo2GPT } from 'repo2gpt'

const repo2gpt = new Repo2GPT()

await repo2gpt.getFile( {
    'repositories': [
        'EasyMina/easyMina/main',
        'EasyMina/minaData/main'
    ],
    'name': 'mina',
    'destinationPath': './dataTest/',
    'outputs': [ 'txt', 'md', 'pdf' ],
} )
```

### setConfig()

All module settings are stored in a config file, see [./src/data/config.mjs](./src/data/config.mjs). This file can be completely overridden by passing an object during initialization.

```js
import { Repo2GPT } from 'repo2gpt'

const myOwnConfig = {
    // Your custom configuration here
}

const repo2gpt = new Repo2GPT()
repo2gpt.setConfig( myOwnConfig ).getFile( { ... } )
```

## Limitations

- Currently in Alpha Stage

## License

The module is available as open source under the terms of the [MIT License](https://github.com/a6b8/repo2gpt/blob/main/LICENSE).
