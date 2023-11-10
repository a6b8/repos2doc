![CircleCI](https://img.shields.io/circleci/build/github/a6b8/repo2file/main)


# Repo 2 File

This module helps save a repository as a file. There are three available formats: '.txt', '.md', and '.pdf'. Additionally, there's a method to convert all downloaded repositories into a single file.

This module focuses on raw downloading with a minimalist data structure. Various configuration options can be customized by overwriting the config file, see [#config](#config).


> Designed for AI Embedding Generation

## Quickstart

**terminal**
```bash
npm init -y && npm i repo2file
```

**node**
index.mjs

```js
import { Repo2File } from 'repo2file'

const repo2file = new Repo2File()

await repo2file.single( {
    'userName': 'EasyMina',
    'repository': 'easyMina',
    'branch': 'main',
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
    - [single()](#single)
    - [batch()](#batch)
    - [merge()](#merge)
  - [Config](#config)
  - [Limitations](#limitations)
  - [Credits](#credits)
  - [License](#license)

## Methods

### single()
This method allows you to download a repository and save it in the desired format.

**Example**

```js
import { Repo2File } from 'repo2file'

const repo2file = new Repo2File()

await repo2file.single( {
    'userName': 'EasyMina',
    'repository': 'easyMina',
    'branch': 'main',
} )
```

### batch()

This method expects an array of `single()` objects. It can be useful when you want to download repositories on a specific topic and later use `merge()` to combine them.

**Example**

```js
import { Repo2File } from 'repo2file'

const repo2file = new Repo2File()

await repo2file.batch( [
        {
            'userName': 'a6b8',
            'repository': 'mina-ns',
            'branch': 'main'
        },
        {
            'userName': 'EasyMina',
            'repository': 'easyMina',
            'branch': 'main'
        }
    ]
)
```

### merge()
This method copies *all* downloaded repositories into individual files. The default formats are 'pdf', 'markdown', and plain text.

```js
import { Repo2File } from 'repo2file'

const repo2file = new Repo2File()

await repo2file.merge( {
    'name': 'my-collection'
} )

```

## Config

All module settings are stored in a config file, see [./src/data/config.mjs](./src/data/config.mjs). This file can be completely overridden by passing an object during initialization.

```js

import { Repo2File } from 'repo2file'

const myOwnConfig = {
    'meta': {
        'unix': '<<UNIX>>', 
        'format': '<<DATE FORMAT>>'
    },
    'path': {
        'root': './repo2file-temp',
        'route': './repo2file-temp/{{userName}}/{{repository}}/{{branch}}/',
        'raw': 'raw/',
        'pdf': ''
    },
    'merge': {
        'root': './repo2file-temp',
        'outputFormat': '{{name}}--{{timestamp}}.{{suffix}}'
    },
    'output': {
        'pdf': {
            'use': true,
            'outputFormat': '{{userName}}--{{repository}}--{{branch}}.pdf'
        },
        'markdown': {
            'use': true,
            'outputFormat': '{{userName}}--{{repository}}--{{branch}}.md'
        },
        'txt': {
            'use': true,
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

const repo2file = new Repo2File( myOwnConfig )
```


## Limitations

- Currently in Alpha Stage

## Credits

- This project was inspired by [repo2pdf](https://github.com/BankkRoll/repo2pdf).

## License

The module is available as open source under the terms of the [MIT](https://github.com/a6b8/repo2file/blob/main/LICENSE).