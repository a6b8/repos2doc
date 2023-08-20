import fs from 'fs'

import axios from 'axios'
import path from 'path'
import decompress from 'decompress'

import { printMessages } from '../helper/utils.mjs'


export class Clone {
    #config 
    #state


    constructor( config ) {
        this.#config = config
        return true
    }


    async start( { userName=null, repository=null, branch=null } ) {
        this.#validateUserInput( { userName, repository, branch } ) 

        this.#state = {
            'userName': userName,
            'repository': repository,
            'branch': branch,
            'folder': null
        }

        const path = Object
            .entries( this.#state )
            .reduce( ( acc, a ) => {
                const [ key, value ] = a
                acc = acc
                    .replaceAll( `{{${key}}}`, value )
                return acc
            }, this.#config['path']['route'] )


        this.#state['folderRaw'] = `${path}${this.#config['path']['raw']}`

        const error = this.#addTemp()
        if( !error ) {
            await this.#downloadGithubRepository()
        }

        const files = this.#getFilesRecursively( this.#state['folderRaw']  )

        return files
    }


    #addTemp() {
        const messages = []

        const folder = `${this.#state['folderRaw']}`
        if( !fs.existsSync( folder, { 'recursive': true } ) ) {
            fs.mkdirSync( folder, { 'recursive': true } )
        } else {
            const files = fs.readdirSync( folder )
            if( files.length === 0 ) {
            } else {
                messages.push( `Folder: ${folder} is not empty!` )
            }
        }

        const error = printMessages( { messages, 'escape': false } ) 

        return error
    }


    cleanUpTemp( folderPath=null ) {
        folderPath === null ? folderPath = this.#state['folderRaw'] : ''
        if( fs.existsSync( folderPath ) ) {
            fs.readdirSync( folderPath )
                .forEach( ( file ) => {
                    const filePath = path.join( folderPath, file )
                
                    if( fs.lstatSync( filePath ).isDirectory() ) {
                        this.cleanUpTemp( filePath )
                    } else {
                        fs.unlinkSync( filePath )
                    }
                }
            )
            fs.rmdirSync( folderPath )
        }

        return true
    }


    async #downloadGithubRepository() {
        const url = Object
            .entries( this.#state )
            .reduce( ( acc, a, index ) => {
                const [ key, value ] = a
                acc = acc
                    .replace( `{{${key}}}`, value )

                return acc
            }, this.#config['github']['download'] )

        const zip = await this.#download( { url } )
        const path = this.#state['folderRaw'] + 'tmp.zip'
        fs.writeFileSync( path, zip )
        await decompress( path, this.#state['folderRaw'] )

        return true
    }


    async #download( { url } ) {
        const { data } = await axios.get( url, { responseType: 'arraybuffer' } )
        return data
    }


    #getFilesRecursively( directory ) {
        let results = []
        const entries = fs.readdirSync( 
            directory, 
            { 'withFileTypes': true }
        )

        for( const entry of entries ) {
            const fullPath = path.resolve( directory, entry['name'] )
            if( entry.isDirectory() ) {
                results = results.concat( this.#getFilesRecursively( fullPath ) )
            } else {
                results.push( fullPath )
            }
        }
    
        return results
    }


    #validateUserInput( { userName, repository, branch } ) {
        const messages = []
        const tests = [
            [ 'userName', userName ],
            [ 'repository', repository ],
            [ 'branch', branch ]
        ]
            .forEach( a => {
                const [ name, value ] = a
                if( value === null || value === undefined ) {
                    messages.push( `Key: "${name}" is not defined.` )
                    return 
                }

                if( typeof( value ) !== 'string' ) {
                    messages.push( `Key: "${name}" is not type "string"` )
                } else {
                    if( value.length === 0 || value === '' ) {
                        messages.push( `Key: "${name}" is ""` )
                    }
                }
            } )

        printMessages( { messages } ) 

        return true
    }
}