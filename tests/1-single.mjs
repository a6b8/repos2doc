import { Repo2GPT } from '../src/Repo2GPT.mjs'
import { tests } from './data/config.mjs'

const repo2gpt = new Repo2GPT()

await repo2gpt.getFile( { 
    'repositories': tests['easymina'][ 0 ],
    'name': 'merge',
    'outputs': [ 'md', 'txt', 'pdf' ],
    'destinationPath': './dataTest/'
} )