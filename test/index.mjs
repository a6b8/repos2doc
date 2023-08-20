import { Repo2File } from '../src/Repo2File.mjs'


const repo2file = new Repo2File()

/*
    await repo2file.single( {
        'userName': 'EasyMina',
        'repository': 'easyMina',
        'branch': 'main',
    } )
*/


await repo2file.batch( [
        {
            'userName': 'a6b8',
            'repository': 'mina-ns',
            'branch': 'main'
        },
        {
            'userName': 'EasyMina',
            'repository': 'easyMina',
            'branch': 'main'
        }
    ]
)


await repo2file.merge( {
    'name': 'abcdef'
} )