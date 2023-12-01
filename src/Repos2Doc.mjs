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


    async getDocument( { repositories, name='default', formats=[ 'txt' ], destinationFolder='./', options=[] } ) {
        ( typeof repositories === 'string' ) ? repositories = [ repositories ] : ''

        const [ messages, comments ] = this.#validateGetDocument( { repositories, name, formats, destinationFolder, options } )
        printMessages( { messages, comments } )

        formats.forEach( key => { this.#config['output'][ key ]['use'] = true } )
        const cmds = await this.#prepareCmds( { repositories, options } )

        !this.#silent ? console.log( 'Process' ) : ''
        for( let cmd of cmds ) {
            await this.#generate( { ...cmd } )
        }

        const paths = await this.#merge( { name, destinationFolder } )

        return paths
    }


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


    getConfig() {
        return this.#config
    }


    async #prepareCmds( { repositories, options } ) {
        const cmds = repositories
            .reduce( ( acc, githubRepository, index ) => {
                const struct = {
                    ...this.#getGithubVariables( { githubRepository } ),
                    'option': {}
                }

                if( options.length !== 0 ) {
                    struct['option'] = options[ index ]
                }

                acc.push( struct )
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


    async #generate( { userName, repository, branch, option } ) {
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
            'silent': this.#silent,
            option
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


    #validateGetDocument( { repositories, name, formats, destinationFolder, options } ) {
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

        if( messages.length === 0 ) {
            if( !Array.isArray( options ) ) {
                messages.push( `Key 'options' is not type of 'array'.` )
            } else if( options.length === 0 ) {

            } else if( options.length !== repositories.length ) {
                messages.push( `Key 'options' can only have the length of '0' or the equal length of key 'repositories'.` )
            }
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