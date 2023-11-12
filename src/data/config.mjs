const config = {
    'meta': {
        'unix': null,
        'format': null
    },
    'path': {
        'root': './repos2doc-temp',
        'route': './repos2doc-temp/{{userName}}/{{repository}}/{{branch}}/',
        'raw': 'raw/',
        'pdf': ''
    },
    'merge': {
        'root': './repos2doc-temp',
        'outputFormat': '{{name}}--{{timestamp}}.{{suffix}}'
    },
    'output': {
        'pdf': {
            'use': false,
            'outputFormat': '{{userName}}--{{repository}}--{{branch}}.pdf'
        },
        'md': {
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
        'space': 30
    }
}


export { config }