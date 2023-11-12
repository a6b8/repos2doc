import { Repos2Doc } from '../src/Repos2Doc.mjs'
import { tests } from './data/config.mjs'

const r2d = new Repos2Doc( true)

const a = await r2d.getDocument( { 
    'repositories': tests['easymina'][ 0 ],
    'name': 'merge',
    'formats': [ 'md', 'txt', 'pdf' ],
    'destinationFolder': './dataTest/'
} )


console.log( 'paths', a )