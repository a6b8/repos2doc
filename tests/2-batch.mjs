import { Repo2GPT } from '../src/Repo2GPT.mjs'
import { tests } from './data/config.mjs'

const repo2gpt = new Repo2GPT()

/*
    await repo2gpt.single( tests['easymina'][ 0 ] )
*/

await repo2gpt.getFile( {
    'repositories': tests['o1js'],
    'outputs': [ 'pdf', 'txt', 'md' ],
    'destinationPath': './dataTest/',
    'name': 'o1js'
})