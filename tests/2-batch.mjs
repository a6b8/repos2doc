import { Repos2Doc } from '../src/Repos2Doc.mjs'
import { tests } from './data/config.mjs'

const r2d = new Repos2Doc()

const paths = await r2d.getDocument( {
    'repositories': tests['o1js'],
    'formats': [ 'pdf', 'md' ],
    'destinationFolder': './dataTest/',
    'name': 'o1js'
})

console.log()
console.log( 'paths', paths )