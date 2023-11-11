
import arg from 'arg'
import inquirer from 'inquirer'
import figlet from 'figlet'


export class CLI {
    #config

    constructor() {
        this.#config = {
            'validation': {
                'repositories': {
                    'type': 'arrayOfStrings',
                },
                'outputs': {
                    'type': 'arrayOfStrings'
                },
                'name': {
                    'type': 'string'
                },
                'targetFolder': {
                    'type': 'string'
                }
            }
            

        }
    }


    init( { rawArgs } ) {
        // this.#addArgs( { rawArgs } )

        return true
    }


    async start() {
        this.#addHealine()

        const questions = [
            {
                'type': 'input',
                'name': 'string1',
                'message': 'Enter your Repositories:',
                'validate': ( input ) => {
                    const messages = this.#validateInput( { input } )
                    if( messages.length !== 0 ) {
                        return messages.join( "\n" )
                    } else {
                        return true
                    }
                }
            }
        ]

        const answers = await inquirer.prompt( questions )
        const strings = [ answers.string1, answers.string2 ] // Add more strings as needed
      
        console.log('Entered strings:', strings);

    }


    #validateInput( { input } ) {
        let messages = [] 
        if( typeof input !== 'string' ) {
            messages.push( 'Is not string' )
        }

        if( input === '' ) {
            messages.push( 'input is empty' )
        }

        const cmds = input.trim()
        cmds
            .split( ',' )
            .map( a => a.trim() )
            .forEach( ( cmd, rindex ) => {
                const matches = cmd.match( /\//g )
                const count = matches ? matches.length : 0
                if( count !== 2 ) {
                    messages.push( `[${rindex}] ${cmd} expect 2 slashes "/".`)
                } else {
                    const keys = cmd
                        .split( '/' )
                        .forEach( ( key, index ) => {
                            const names = [ 'userName', 'repositoryName', 'branchName' ]
                            if( key === '' || key === undefined ) {
                                messages.push( `[${rindex}] ${names[index]} is not set`)
                            } else {

                            }
                        } )
                }
            } )

        return messages
    }


    #addHealine() {
        console.log(
            figlet.textSync(
                "Repo4GPT", 
                {
                    font: "big",
                    horizontalLayout: "default",
                    verticalLayout: "default",
                    width: 100,
                    whitespaceBreak: true,
                } 
            )
        )
        return true
    }


    #addArgs( { rawArgs } ) {
        const fromCli = arg(
            {
                '--repositories': String,
                '-r': '--repositories',
                '--verbose': ''
            },
            {
              'argv': rawArgs.slice( 2 ),
              'permissive': true
            }
        )

        const params = this.#getModuleParams( { fromCli } )
        
        return params
    }


    #getModuleParams( { fromCli } ) {
        const params = Object
            .keys( this.#config['validation'] )
            .reduce( ( acc, key, index ) => {
                const option = `--${key}`
                if( Object.hasOwn( fromCli, option ) ) {
                    switch( this.#config['validation'][ key ]['type'] ) {
                        case 'arrayOfString':
                            acc[ key ] = fromCli[ option ]
                                .split( ',' )
                                .map( str => str.trim() )
                            
                            break;
                        case 'string':
                            acc[ key ] = fromCli[ option ]
                            break;
                        default: 
                            break
                    }
                }

                return acc
            }, {} )
console.log( 'params', params  )
        return params
    }
}