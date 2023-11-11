import { Repo4GPT } from '../src/Repo4GPT.mjs'
import { tests } from './data/config.mjs'

const r4g = new Repo4GPT()

await r4g.getFile( { 
    'repositories': tests['easymina'][ 0 ],
    'name': 'merge',
    'outputs': [ 'md', 'txt', 'pdf' ],
    'destinationFolder': './dataTest/'
} )