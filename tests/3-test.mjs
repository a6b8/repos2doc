import { Repos2Doc } from './../src/Repos2Doc.mjs'
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
    'name': 'mina',
    'destinationFolder': './result/docs/',
    'formats': [ 'pdf', 'txt', 'md' ],
    'options': [ 
        {
            'description': 'this is a test!',
            'filter': 'test'
        }
    ]
} )