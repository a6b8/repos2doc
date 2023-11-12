import inquirer from 'inquirer'
import figlet from 'figlet'
import { Repos2Doc } from './Repos2Doc.mjs'
import { getTableInAscii } from './helper/utils.mjs'


export class CLI {
    #config

    constructor() {
        this.#config = {
            'tables': {
                'repositories': {
                    'headlines': [ 'User Name', 'Repository Name', 'Branch Name' ]
                }
            },
            'validation': {
                'repositories': {
                    'type': 'arrayOfStrings',
                },
                'formats': {
                    'type': 'arrayOfStrings',
                    'alias': {
                        'txt': 'Text',
                        'md': 'Markdown',
                        'pdf': 'Pdf'
                        
                    }
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


    async start() {
        this.#addHealine()
        const repositories = await this.#questionRepositories( {} )
        const formats = await this.#questionFormats() 
        await this.#questionLicense( { repositories } )
        console.log()

        const r2d = new Repos2Doc()
        await r2d.getDocument( { 
            repositories,
            formats 
        } )

        return true
    }


    async #areYouSure( { msg } ) {
        const response = await inquirer.prompt( [
            {
              'type': 'confirm',
              'name': 'sure',
              'message': msg,
              'default': true
            }
        ] )

        return response
    }


    async #questionFormats() {
        console.log()
        console.log( 'Choose Format' )
        const questions = [
            {
                'type': 'checkbox',
                'name': 'answer',
                'message': 'Select one or more options:',
                'choices': Object.values( this.#config['validation']['formats']['alias'] ),
                'validate': (answer) => {
                    if( answer.length === 0 ) {
                        return 'You must select at least one option.'
                    }
                    return true
                }
            }
        ]

        const response = await inquirer.prompt( questions )
        const convert = Object
            .entries( this.#config['validation']['formats']['alias'] )
            .reduce( ( acc, a, index ) => { 
                const [ key, value ] = a 
                acc[ value ] = key 

                return acc
            }, {} )

        const cmds = response['answer']
            .map( key => convert[ key ] )

        return cmds
    }


    async #questionRepositories( { str='' } ) {
        console.log( `Insert Repositories`)
        console.log( `  - Use following structure: "name/repo/branch"`)
        console.log( `  - For multiple repositories, separate them with a comma "name/repo/branch, name/repo/branch"`)

        const questions = [
            {
                'type': 'input',
                'name': 'answer',
                'message': ">",
                'validate': ( input ) => {
                    const messages = this.#validateInputRepositories( { input } )
                    if( messages.length !== 0 ) {
                        return messages.join( "\n" )
                    } else {
                        return true
                    }
                }
            }
        ]

        const response = await inquirer.prompt( questions )

        const cmds = response['answer']
            .trim()
            .split( ',' )
            .map( a => a.trim() )

        const table = getTableInAscii( { 
            'headlines': this.#config['tables']['repositories']['headlines'] , 
            'items': cmds.map( a => a.split( '/' ) )
        } )

        console.log()
        console.log( table )

        const ok = await this.#areYouSure( { 'msg': 'Ok?' } )
        if( ok['sure'] ) {
            return cmds
        } else {
            await this.#questionRepositories( { 'str': '' } )
        }
    }


    async #questionLicense( { repositories } ) {
        console.log()
        console.log( 'Check Licenses')
        console.log( '  - Please verify the repository licenses to ensure they are suitable for A.I. usage.' )
        repositories
            .forEach( ( a, index ) => {
                const [ userName, repoName, brachName ] = a.split( '/' )
                let str = ''
                str += 'https://github.com/'
                str += userName + '/'
                str += repoName + '/'
                str += 'blob/'
                str += brachName + '/'
                str += 'LICENSE'
                console.log( `  - [${index + 1}] ${str}` ) 
            } )

        console.log()
        const ok = await this.#areYouSure( { 'msg': 'Are all the licenses suitable?' } )
        if( !ok['sure'] ) {
            process.exit( 1 )
        }

        return true
    }   


    #validateInputRepositories( { input } ) {
        let messages = [] 
        if( typeof input !== 'string' ) {
            messages.push( 'Is not string' )
        } else if( input === '' ) {
            messages.push( 'input is empty' )
        } else {
            input
                .trim()
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
        }

        return messages
    }


    #addHealine() {
        console.log(
            figlet.textSync(
                "Repos2Doc", 
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
        return params
    }
}