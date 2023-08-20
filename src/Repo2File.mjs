import moment from 'moment'


import { config } from './data/config.mjs'
import { Clone } from './steps/Clone.mjs'
import { Convert } from './steps/Convert.mjs'
import { Merge } from './steps/Merge.mjs'

import { printMessages } from './helper/utils.mjs'


export class Repo2File {
    #config
    #state
    #silent


    constructor( cfg=null ) {
        if( config !== null ) {
            this.#config = config
        } else {
            console.log( 'b' )
            this.#config = cfg
        }

        return true
    }


    async single( { userName=null, repository=null, branch=null, silent=false } ) {
        this.#silent = silent
        !this.#silent ? console.log( 'R2File (Single)' ) : ''
        this.#validateUserInput( { userName, repository, branch } ) 

        await this.#generate(  { userName, repository, branch } )

        return true
    }


    async batch( cmds, silent=false ) {
        this.#silent = silent

        !this.#silent ? console.log( 'R2File (Batch)' ) : ''

        cmds
            .forEach( ( cmd, index ) => {
                const { userName, repository, branch } = cmd
                this.#validateUserInput( { userName, repository, branch, index } ) 
            } )

        for( let cmd of cmds ) {
            await this.#generate( { ...cmd } )
        }

        return true
    }


    async merge( name='collection', silent=false ) {
        this.#silent = silent

        !this.#silent ? console.log( 'R2File (Merge)' ) : ''
        const merge = new Merge( this.#config )
        await merge.start( { 'silent': this.#silent } )
        return
    }


    async #generate(  { userName, repository, branch, silent=false } ) {
        const str = `${userName}/${repository}/${branch}`

        let space = ''
        try {
            space = new Array( this.#config['console']['space'] - str.length )
                .fill( ' ' )
                .join( '' )
        } catch( e ) {}
        
        !silent ? process.stdout.write( `- ${str}${space} | ` ) : ''
        const clone = new Clone( this.#config )
        const convert = new Convert( this.#config )

        !silent ? process.stdout.write( 'clone > ' ) : ''
        const files = await clone.start( { userName, repository, branch } )

        !silent ? process.stdout.write( 'markdown to pdf > ' ) : ''
        const a = await convert.start( { userName, repository, branch, files } )

        !silent ? console.log( 'clean up.' ) : ''
        clone.cleanUpTemp()
    }


    #validateUserInput( { userName, repository, branch, index=0 } ) {
        const messages = []
        const tests = [
            [ 'userName', userName ],
            [ 'repository', repository ],
            [ 'branch', branch ]
        ]
            .forEach( a => {
                const [ name, value ] = a
                if( value === null || value === undefined ) {
                    messages.push( `[${index}] Key: "${name}" is not defined.` )
                    return 
                }

                if( typeof( value ) !== 'string' ) {
                    messages.push( `[${index}] Key: "${name}" is not type "string"` )
                } else {
                    if( value.length === 0 || value === '' ) {
                        messages.push( `[${index}] Key: "${name}" is ""` )
                    }
                }
            } )

        printMessages( { messages } )

        return true
    }
}