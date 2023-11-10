import { config } from './data/config.mjs'
import { Clone } from './steps/Clone.mjs'
import { Convert } from './steps/Convert.mjs'
import { Merge } from './steps/Merge.mjs'

import { printMessages } from './helper/utils.mjs'


export class Repo2GPT {
    #config
    #state
    #silent


    constructor( cfg=null ) {
        if( cfg === null ) {
            this.#config = config
        } else {
            this.#config = cfg
        }

        return true
    }


    async getFile( { repositories, name='default', silent=false, outputs=[ 'txt' ], destinationPath='./' } ) {
        const [ messages, comments ] = this.#validateGetResult( { repositories, name, silent, outputs, destinationPath } )
        printMessages( { messages, comments } )

        this.#silent = silent
        outputs.forEach( key => {
            this.#config['output'][ key ]['use'] = true
        } )

        !this.#silent ? console.log( 'Repo 4 Gpt' ) : ''
        if( typeof repositories === 'string' ) {
            
           // !this.#silent ? console.log( '  Download' ) : ''
            await this.#single( { 
                'githubRepository': repositories, 
                silent
            } )

            await this.#merge( { name, destinationPath } )
        } else if (
            Array.isArray( repositories ) && 
            repositories.every( item => typeof item === 'string' ) 
        ) {
           // !this.#silent ? console.log( '  Download' ) : ''
            await this.#batch( {
                'githubRepositories': repositories
            })
            await this.#merge( { name, destinationPath } )
        } else {
            console.log( `Unknown Error.` )
            process.exit( 1 )
        }

        return true
    }


    async #single( { githubRepository=null } ) {
        const [ messages, comments ] = this.#validateGithubString( { githubRepository, 'index': 0 } )
        printMessages( { messages, comments } )
        
        const { userName, repository, branch } = this.#getGithubVariables( { githubRepository } )
        await this.#generate(  { userName, repository, branch } )

        return true
    }


    async #batch( { githubRepositories } ) {
        const test = githubRepositories
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

        printMessages( { 
            'messages': test['messages'], 
            'comments': test['comments']
        } )

        const cmds = githubRepositories
            .reduce( ( acc, githubRepository, index ) => {
                acc.push( this.#getGithubVariables( { githubRepository } ) )
                return acc
            }, [] )

        for( let cmd of cmds ) {
            await this.#generate( { ...cmd } )
        }

        return true
    }


    async #merge( { name='collection', destinationPath } ) {
        // !this.#silent ? console.log( '  Merge' ) : ''
        const merge = new Merge( this.#config )
        await merge.start( { 
            'silent': this.#silent, 
            'name': name 
        } )


        merge.cleanUpTemp( { destinationPath } )

        return true
    }


    async #generate(  { userName, repository, branch } ) {
        const str = `${userName}/${repository}/${branch}`

        let space = ''
        try {
            space = new Array( this.#config['console']['space'] - str.length )
                .fill( ' ' )
                .join( '' )
        } catch( e ) {}
        
        !this.#silent ? process.stdout.write( `- ${str}${space} | ` ) : ''
        const clone = new Clone( this.#config )
        const convert = new Convert( this.#config )

        const files = await clone.start( { 
            userName, 
            repository, 
            branch, 
            'silent': this.#silent
        } )

        !this.#silent ? process.stdout.write( 'to document > ' ) : ''
        const a = await convert.start( { 
            userName, 
            repository, 
            branch, 
            files, 
            'silent': this.#silent 
        } )

        !this.#silent ? console.log( 'clean up.' ) : ''
        clone.cleanUpTemp()
    }


    #validateGetResult( { repositories, name, silent, outputs, destinationPath } ) {
        const messages = []
        const comments = []

        if( typeof destinationPath === 'string' ) {
            if( destinationPath.startsWith( './' ) === true ) {

            } else {
                messages.push( `Key "destinationPath" need to start with "./".`)
            }
        } else {
            messages.push( `Key "destinationPath" is not type of "string".` )
        }

        if( Array.isArray( outputs ) ) {
            const keys = Object.keys( this.#config['output'] )
            if( outputs.length === 0 ) {
                messages.push( `Key "outputs" is empty, choose from ${keys.map(a => `"${a}"`).join(', ')} `)
            }

            if( outputs.every( item => typeof item === 'string' ) === true ) {
                outputs.forEach( op => {
                    if( !keys.includes( op ) ) {
                        messages.push( `Key "outputs", value "${op}" is not valid. Choose from ${keys.map(a => `"${a}"`).join(', ')} instead.` )
                    }
                } )

            } else {
                messages.push( `Key "outputs" expects "string" as type.`)
            }

        } else {
            messages.push( `Key "outputs" is not type of "array of strings".` )
        }


        if( typeof silent !== 'boolean' ) {
            messages.push( `Key "silent" is not type of boolean.` )
        }

        if( typeof name !== 'string' ) {
            messages.push( `Key "name" is not type of string.` )
        }

        if( typeof repositories === 'string' ) {
        } else if ( Array.isArray( repositories ) ) {
            if( repositories.every( item => typeof item === 'string' ) ) {

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