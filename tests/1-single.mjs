import { Repos2Doc } from '../src/Repos2Doc.mjs'
import { tests } from './data/config.mjs'

const r2d = new Repos2Doc( false )

const a = await r2d.getDocument( { 
    'repositories': tests['easymina'][ 0 ],
    'name': 'merge',
    'formats': [ 'md', 'txt', 'pdf' ],
    'destinationFolder': './dataTest/',
    'options': [
        {
            'description': "this is a test\n\nthis is a test\n\›this is a test"
        }
    ]
} )


console.log( 'paths', a )