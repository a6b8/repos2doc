![CircleCI](https://img.shields.io/circleci/build/github/a6b8/repo2gpt/main)


# Repo 2 File

Repo2GPT helps prepare one or multiple GitHub repositories to consolidate their content into a single file. This file, in either `text (.txt)`, `markdown (.md)`, or `pdf (.pdf)` format, can then be uploaded to the OpenAI GPT editor as a searchable document. This enables the AI to answer questions based on the document's content and even generate code. This can be especially valuable for very new software with rapid update cycles.


> Designed for AI Embedding Generation

## Quickstart

**terminal**
```bash
npm init -y && npm i repo2gpt
```

**node**
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

**terminal**
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

| Property        | Type                  | Description                                       | Required   |
| --------------- | --------------------- | ------------------------------------------------- | ---------- |
| repositories    | Array of Strings      | GitHub repositories in the format "userName/repositoryName/branchName" | true       |
| name            | String                | Custom name                                       | false      |
| outputs         | Array of Strings      | At least one value from: "txt", "md", "pdf"       | false      |
| destinationPath | String                | Path starting with "./"                           | false      |


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
    'meta': {
        'unix': '<<UNIX>>', 
        'format': '<<DATE FORMAT>>'
    },
    'path': {
        'root': './repo2gpt-temp',
        'route': './repo2gpt-temp/{{userName}}/{{repository}}/{{branch}}/',
        'raw': 'raw/',
        'pdf': ''
    },
    'merge': {
        'root': './repo2gpt-temp',
        'outputFormat': '{{name}}--{{timestamp}}.{{suffix}}'
    },
    'output': {
        'pdf': {
            'use': false,
            'outputFormat': '{{userName}}--{{repository}}--{{branch}}.pdf'
        },
        'markdown': {
            'use': false,
            'outputFormat': '{{userName}}--{{repository}}--{{branch}}.md'
        },
        'txt': {
            'use': false,
            'outputFormat': '{{userName}}--{{repository}}--{{branch}}.txt'
        }
    },
    'github': {
        'download': 'https://github.com/{{userName}}/{{repository}}/archive/refs/heads/{{branch}}.zip',
        'root': 'https://github.com'
    },
    'markdown': {
        'code': '~~~',
        'file': {
            'open': '<file>',
            'close': '</file>'
        },
        'repo': {
            'open': '<repository>',
            'close': '</repository>'
        },
        'replaces': [
            [ "`", "&nbsp;" ]
        ],
        'splitSection': false,
        'markdownEscape': false,
        'fileName': 'https://github.com/{{userName}}/{{repository}}/blob/{{branch}}'
    },
    'excludes': {
        'fileNames': [
            'licence',
            'license',
            'code_of_conduct.md',
            '.gitignore',
            '.gitmodules',
            'package-lock.json',
            'yarn.lock',
            '.git',
            '.vscode',
            '.idea',
            '.vs',
            'node_modules',
            '.ds_store'
        ],
        'suffix': [
            //'.md',
            '.png',
            '.yml',
            '.jpg',
            '.jpeg',
            '.gif',
            '.svg',
            '.bmp',
            '.webp',
            '.ico',
            '.mp4',
            '.mov',
            '.avi',
            '.wmv',
            '.pdf',
            '.zip'
        ]
    },
    'console': {
        'space': 50
    }
}

const repo2gpt = new Repo2GPT()
repo2gpt
    .setConfig( myOwnConfig )
    .getFile( { ... } )
```


## Limitations

- Currently in Alpha Stage


## License

The module is available as open source under the terms of the [MIT](https://github.com/a6b8/repo2gpt/blob/main/LICENSE).