import moment from 'moment'


let config = {
    'meta': {
        'unix': moment().unix(), 
        'format': moment().format()
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
        'space': 30
    }
}


export { config }