import { config } from './data/config.mjs'
import { Clone } from './steps/Clone.mjs'
import { Convert } from './steps/Convert.mjs'
import { Merge } from './steps/Merge.mjs'

import { printMessages } from './helper/utils.mjs'
import moment from 'moment'


export class Repos2Doc {
    #config
    #state
    #silent


    constructor( silent=false ) {
        this.#silent = silent
        this.setConfig( { config } )

        return true
    }


/**
     * Async function to get a document from a set of repositories.
     *
     * @param {Object[]} repositories - An array of repositories With the structure "userName/repositoryName/branchName".
     * @param {string} [name='default'] - The name of the document to retrieve (default is 'default').
     * @param {string[]} [formats=['txt']] - An array of acceptable document formats (default is ['txt']).
     * @param {string} [destinationFolder='./'] - The folder where the document should be saved (default is './').
     * @returns {Promise} A Promise that resolves to the retrieved document. Return the destinationPath for the generated files.
*/

    async getDocument( { repositories, name='default', formats=[ 'txt' ], destinationFolder='./' } ) {
        ( typeof repositories === 'string' ) ? repositories = [ repositories ] : ''

        const [ messages, comments ] = this.#validateGetDocument( { repositories, name, formats, destinationFolder } )
        printMessages( { messages, comments } )

        formats.forEach( key => { this.#config['output'][ key ]['use'] = true } )
        const cmds = await this.#prepareCmds( { repositories } )

        !this.#silent ? console.log( 'Process' ) : ''
        for( let cmd of cmds ) {
            await this.#generate( { ...cmd } )
        }

        const paths = await this.#merge( { name, destinationFolder } )

        return paths
    }


/**
     * Sets the configuration object for the instance.
     *
     * @param {Object} options - An object containing the configuration to be set.
     * @param {Object} options.config - The configuration object to set.
     * @returns {this} The current instance with the updated configuration.
*/

    setConfig( { config } ) {
        const [ messages, comments ] = this.#validateSetConfig( { config } )
        printMessages( { messages, comments } )

        config['meta'] = [
            [ 'unix', moment().unix() ],
            [ 'format', moment().format() ] 
        ]
            .reduce( ( acc, a, index ) => {
                const [ key, value ] = a 
                acc[ key ] = value
                return acc
            }, {} )

        this.#config = config
        return this
    }

/*
    async #single( { githubRepository=null } ) {
        const [ messages, comments ] = this.#validateGithubString( { githubRepository, 'index': 0 } )
        printMessages( { messages, comments } )

        const { userName, repository, branch } = this.#getGithubVariables( { githubRepository } )
        await this.#generate(  { userName, repository, branch } )

        return true
    }
*/

    async #prepareCmds( { repositories } ) {
        const cmds = repositories
            .reduce( ( acc, githubRepository, index ) => {
                acc.push( this.#getGithubVariables( { githubRepository } ) )
                return acc
            }, [] )

        return cmds
    }


    async #merge( { name='collection', destinationFolder } ) {
        // !this.#silent ? console.log( '  Merge' ) : ''
        const merge = new Merge( this.#config )
        await merge.start( { 
            'silent': this.#silent, 
            'name': name 
        } )

        const paths = merge.cleanUpTemp( { destinationFolder } )
        return paths
    }


    async #generate( { userName, repository, branch } ) {
        const str = `${userName}/${repository}/${branch}`

        let space = ''
        try {
            space = new Array( this.#config['console']['space'] - str.length )
                .fill( ' ' )
                .join( '' )
        } catch( e ) {}

        !this.#silent ? process.stdout.write( `  - ${str}${space} | ` ) : ''
        const clone = new Clone( this.#config )
        const convert = new Convert( this.#config )

        const files = await clone.start( { 
            userName, 
            repository, 
            branch, 
            'silent': this.#silent
        } )

        !this.#silent ? process.stdout.write( 'file > ' ) : ''
        const a = await convert.start( { 
            userName, 
            repository, 
            branch, 
            files, 
            'silent': this.#silent 
        } )

        !this.#silent ? console.log( 'clean |' ) : ''
        clone.cleanUpTemp()
    }


    #validateSetConfig( { config } ) {
        let messages = []
        let comments = []

        if( typeof config === 'object' && config !== null ) {
            if( Object.hasOwn( config, 'meta' ) ) {
            } else {
                messages.push( `Config has not key "meta".` )
            }
        } else {
            messages.push( `Config is not type object.`)
        }

        messages
            .forEach( ( msg, index, all ) => {
                index === 0 ? console.log( `Error:` ) : ''
                console.log( msg )
                all.length - 1 === index ? process.exit( 1 ) : ''
            } )

        return messages
    }


    #validateGetDocument( { repositories, name, formats, destinationFolder } ) {
        const messages = []
        const comments = []

        if( typeof destinationFolder === 'string' ) {
            if( destinationFolder.startsWith( './' ) === true ) {

            } else {
                messages.push( `Key "destinationFolder" need to start with "./".`)
            }
        } else {
            messages.push( `Key "destinationFolder" is not type of "string".` )
        }

        if( Array.isArray( formats ) ) {
            const keys = Object.keys( this.#config['output'] )
            if( formats.length === 0 ) {
                messages.push( `Key "formats" is empty, choose from ${keys.map(a => `"${a}"`).join(', ')} `)
            }

            if( formats.every( item => typeof item === 'string' ) === true ) {
                formats.forEach( op => {
                    if( !keys.includes( op ) ) {
                        messages.push( `Key "formats", value "${op}" is not valid. Choose from ${keys.map(a => `"${a}"`).join(', ')} instead.` )
                    }
                } )

            } else {
                messages.push( `Key "formats" expects "string" as type.`)
            }

        } else {
            messages.push( `Key "formats" is not type of "array of strings".` )
        }


        if( typeof this.#silent !== 'boolean' ) {
            messages.push( `Key "silent" is not type of boolean.` )
        }


        if( typeof name !== 'string' ) {
            messages.push( `Key "name" is not type of string.` )
        }

        if( typeof repositories === 'string' ) {
        } else if ( Array.isArray( repositories ) ) {
            if( repositories.every( item => typeof item === 'string' ) ) {
                const test = repositories
                    .reduce( ( acc, a, index, all ) => {
                        const [ messages, comments ] = this.#validateGithubString( { 
                            'githubRepository': a, 
                            'index': index 
                        } )
        
                        acc['messages'].push( messages )
                        acc['comments'].push( comments )
                        if( all.length -1 === index ) { 
                            acc['messages'] = acc['messages'].flat( 1 )
                            acc['comments'] = acc['comments'].flat( 1 )
                        }
                        return acc
                    }, { 'messages': [], 'comments': [] } )

                messages.push( ...test['messages'] )
                comments.push( ...test['comments'] )
            } else {
                messages.push( `Key "repositories" (array) expects variables in type "string".` )
            }
        } else {
            messages.push( `Key "repositories" is not type of "string" or "array of strings".` )
        }

        return [ messages, comments ]
    }


    #validateGithubString( { githubRepository, index } ) {
        const messages = []
        const comments = []
        const prefix = `[${index}]`

        if( typeof githubRepository !== 'string' ) {
            messages.push( `${prefix} Key "githubRepository" is not type of "string"` )
        } else {
            if( githubRepository.indexOf( '/' ) === null ) {
                messages.push( `${prefix} Key "githubRepository" does not include splitter "/". Use as a structure "userName/repoName/branchName".` )
            }

            const split = githubRepository.split( '/' )

            if( split.length === 4 ) {
                if( split[ 3 ] === '' ) {
                    comments.push( `Key "githubRepository" ends with "/". Use as a structure "userName/repoName/branchName".`)
                } else {
                    messages.push( `${prefix} Key "githubRepository" has wrong string structure. Use as a structure "userName/repoName/branchName".` )
                }
            } else if( split.length === 3 ) {
    
            } else if( split.length === 2 ) {
                comments.push( `${prefix} Key "githubRepository" contains only userName "${split[ 0 ]}" and repository "${split[ 1 ]}", branchName is missing. Use default name "main" instead.` )
            } else if( split.length === 1 ) {
                messages.push( `${prefix} Key "githubRepository" found only userName (${split[ 0 ]})` )
            } else {
                messages.push( `${prefix} Key "githubRepository" has wrong string structure. Use as a structure "userName/repoName/branchName".` )
            }
        }

        return [ messages, comments ]
    }


    #getGithubVariables( { githubRepository } ) {
        const split = githubRepository.split( '/' )
        if( split.length === 2 ) {
            split.push( 'main' )
        } else if( split.length === 4 ) {
        } else {
            if( split[ 3 ] === '' ) {
                split[ 3 ] = 'main'
            }
        }

        const result = [
            [ 'userName', split[ 0 ] ],
            [ 'repository', split[ 1 ] ],
            [ 'branch', split[ 2 ] ]
        ]
            .reduce( ( acc, a, index ) => {
                const [ key, value ] = a
                acc[ key ] = value
                return acc
            }, {} )

        return result
    }
}