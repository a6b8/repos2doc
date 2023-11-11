import { Repo4GPT } from '../src/Repo4GPT.mjs'
import { tests } from './data/config.mjs'

const repo4gpt = new Repo4GPT()

/*
    await repo4gpt.single( tests['easymina'][ 0 ] )
*/

await repo4gpt.getFile( {
    'repositories': tests['o1js'],
    'outputs': [ 'pdf', 'txt', 'md' ],
    'destinationFolder': './dataTest/',
    'name': 'o1js'
})