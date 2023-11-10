import fs from 'fs'

import { Repo2File } from './../src/Repo2File.mjs'
const repo2file = new Repo2File()

console.log( 'Success!' )
process.exit( 0 )

/*
->>> PHANTOM JS PROBLEM with circleci


const cmd = {
    'userName': 'a6b8',
    'repository': 'mina-ns',
    'branch': 'main',
}


await repo2file.single( cmd )


const search = ''
const folderPath = Object
    .entries( cmd )
    .reduce( ( acc, a, index ) => {
        index === 0 ? acc += 'repo2file-temp/' : ''
        const [ key, value ] = a
        acc += `${value}/`
        return acc
    }, './' )

const fileName = [
    cmd['userName'],
    cmd['repository'],
    cmd['branch']
]
    .join( '--' )

console.log( '' )
console.log( 'TEST' )
console.log( '- Folder path', folderPath )

if( fs.existsSync( folderPath ) ) {
    try {
        const filePath = `${folderPath}${fileName}.txt`
        console.log( '- FilePath', filePath)
        const raw = fs.readFileSync( filePath, 'utf-8' )
        const found = raw.indexOf( 'mina-ns' ) !== -1

        if( found ) {
            console.log( '> Success!' )
            process.exit( 1 )
        } else {
            console.log( '')
        }

    } catch( e ) {
        console.log( '> File not found', e )
        process.exit( 0 )
    }
} else {
    console.log( '> Folder not found!' )
    process.exit( 0 )
}
*/