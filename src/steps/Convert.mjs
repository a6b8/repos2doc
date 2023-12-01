
import fs from 'fs'
import { Readable } from 'stream'
import markdownpdf from 'markdown-pdf'
import markdownEscape from 'markdown-escape'
import { promisify } from 'util'
import path from 'path'


export class Convert {
    #config
    #state


    constructor( config ) {
        this.#config = config
    }


    async start( { userName, repository, branch, files, option } ) {
        this.#state = {
            'filesFiltered': null,
            'folderRaw': null,
            'folderResults': null,
            'userName': userName,
            'repository': repository,
            'branch': branch,
            'option': option
        }

        const _path = Object
            .entries( this.#state )
            .reduce( ( acc, a ) => {
                const [ key, value ] = a
                acc = acc
                    .replaceAll( `{{${key}}}`, value )
                return acc
            }, this.#config['path']['route'] )


        this.#state['folderRaw'] = `${_path}${this.#config['path']['raw']}`
        this.#state['folderResults'] =  `${_path}${this.#config['path']['pdf']}`

        const filtered = this.#addFilteredFiles( { files, option } )
        const { contents, txts } = this.#prepareFiles( { 'files': filtered } )

        await this.#save( { contents, txts } )

        return true
    }


    #prepareFiles( { files } ) {
        let txts = ''

        let contents = ``
        contents += `${this.#config['markdown']['repo']['open']}  \n`
        contents += `# ${this.#state['repository']}  \n`
        contents += `## overview  \n`
        const _path = [
            'userName',
            'repository'
        ]
            .reduce( ( acc, key, index, all ) => {
                acc += `${this.#state[ key ]}/`
                all.length - 1 === index ? acc += "  \n" : ''
                return acc 
            }, `repository: ${this.#config['github']['root']}/` )

        txts += _path
        txts += `  \n`

        contents += _path
        contents += [
            'userName',
            'repository',
            'branch'
        ]
            .map( ( key ) => `${key}: ${this.#state[ key ]}` )
            .join( "  \n" )

        contents += "  \n"
        contents += `date: ${this.#config['meta']['format']} (${this.#config['meta']['unix']})` 
        contents += "  \n"  

        if( Object.hasOwn( this.#state['option'], 'description' ) ) {
            contents += "description:\n"
            contents += this.#state['option']['description']
            contents += "\n\n"
        }

        contents += "  \n"
        files
            .forEach( ( file, index ) => {
                const { content, txt } = this.#prepareFileContent( { file } )
                contents += content
                contents += "  \n"

                txts += txt
                txts += "  \n"
                return true
            }, '' )

        txts += "  \n"
        contents += `${this.#config['markdown']['repo']['close']}  \n`

        return { contents, txts }
    }


    #prepareFileContent( { file } )  {

        let content = ''
        let txt = ''

        const raw = fs.readFileSync( file, 'utf-8' )
        let search = ''
        search += `/${this.#state['repository']}/${this.#state['branch']}/raw/`
        search += `${this.#state['repository']}-${this.#state['branch']}`
        const mod = file.substring( file.indexOf( search ) + search.length, file.length )

        const fileName = Object
            .entries( this.#state )
            .reduce( ( acc, a, index, all ) => {
                const [ key, value ] = a
                acc = acc
                    .replace( `{{${key}}}`, value )

                all.length-1 === index ? acc += mod : ''
                
                return acc
            }, this.#config['markdown']['fileName'] )

        content += "\n"
        txt += "\n"

        this.#config['markdown']['splitSection'] ? content += "---  \n" : ''
        content += `${this.#config['markdown']['file']['open']}  \n`
        content += '## path: ' + mod + "  \n"
        content += `url: ${fileName}  \n`

        txt += `${fileName}  \n`

        content += "\n"

        if( !file.endsWith( '.md' ) ) {
            content += `${this.#config['markdown']['code']}  \n`
            const wLines = raw
                .split( "\n" )
                // .map( ( line, index ) => `${index+1}\t${line}` )
                .map( a => {
                    const r = this.#config['markdown']['replaces']
                        .reduce( ( acc, b, index ) => {
                            const [ from, to ] = b
                            acc = acc
                                .replaceAll( from, to )
                            return acc
                        }, a )
                    return r
                } )
                .map( a => {
                    if( this.#config['markdown']['markdownEscape'] ) {
                        return markdownEscape( a )
                    } else {
                        return a
                    }
                } )
                .join( "\n" )

            content += `${wLines}  \n`
            txt += `${wLines}  \n`

            content += `${this.#config['markdown']['code']}  \n`
        } else {
           content += raw 
           txt += raw
        }
        content += `${this.#config['markdown']['file']['close']}  \n`

        return { content, txt }
    }

/*
    #addFilteredFiles( { files } ) {
        const result = files
            .filter( file => {
                const str = file.toLowerCase()
                return !this.#config['excludes']['fileNames']
                    .filter( b => str.endsWith( b.toLowerCase() ) )
                    .some( a => a )
            } )
            .filter( file => {
                const str = file.toLowerCase()
                return !this.#config['excludes']['suffix']
                    .filter( b => str.endsWith( b.toLowerCase() ) )
                    .some( a => a )
            } )
        
        return result
    }
*/

    #addFilteredFiles( { files, option } ) {
        let use
        if( Object.hasOwn( option, 'filter' ) ) {
            use = option['filter']
        } else {
            use = this.#config['files']['use']
        }

        const result = this.#config['files'][ use ]
            .reduce( ( acc, a, index ) => {
                const { type, search, strings } = a
                acc = acc
                    .filter( file => {
                        const s = file.toLowerCase()
                        const test = strings
                            .map( string => {
                                let result
                                switch( search ) {
                                    case 'startsWith':
                                        result = s.startsWith( string )
                                        break
                                    case 'endsWith': 
                                        result = s.endsWith( string )
                                        break
                                    case 'includes':
                                        result = ( s.indexOf( string ) != -1 )
                                        break
                                    default:
                                        console.log( `Search ${search} not found.` )
                                        process.exit( 1 )
                                        break
                                }
                                return result
                            } )
                            .some( a => a )

                        switch( type ) {
                            case 'allow':
                                return test
                                break
                            case 'block':
                                return !test
                                break
                            default:
                                console.log( `Type ${type} not found.` )
                                process.exit( 1 )
                                break
                        }
                    } )

                return acc
            }, files )
        
        return result
    }


    async #save( { contents, txts } ) {
        const pipelinePromise = async ( ...streams ) => {
            for( let i = 0; i < streams.length - 1; i++ ) {
                streams[ i ].pipe( streams[ i + 1 ] )
            }
            await new Promise((resolve, reject) => {
                streams[ streams.length - 1 ].on( 'finish', resolve )
                streams[ streams.length - 1 ].on( 'error', reject )
            } )
        }

        const buffer = Buffer.from( contents, 'utf8' )
        const bufferStream = new Readable( {
            read() {
                this.push( buffer )
                this.push( null )
            }
        } )

        try {
            await Promise.all(
                Object
                    .entries( this.#config['output'] )
                    .filter( a => a[ 1 ]['use'] )
                    .map( async( a ) => {
                        const [ key, value ] = a

                        const fileName = Object
                            .entries( this.#state )
                            .reduce( ( acc, a, index ) => {
                                const [ key, value ] = a
                                acc = acc
                                    .replaceAll( `{{${key}}}`, value )
                                return acc
                            }, value['outputFormat'] )


                        switch( key ) {
                            case 'pdf':
                                await pipelinePromise(
                                    bufferStream,
                                    markdownpdf(),
                                    fs.createWriteStream( path.join( this.#state['folderResults'], fileName ) )
                                )
                                break
                            case 'md':
                                fs.writeFileSync( 
                                    path.join( this.#state['folderResults'], fileName ),
                                    contents,
                                    'utf-8'
                                )
                                break
                            case 'txt':
                                fs.writeFileSync( 
                                    path.join( this.#state['folderResults'], fileName ),
                                    txts,
                                    'utf-8'
                                )
                        }

                    } )
            )

            return true
        } catch( error ) {
            console.error( 'Error creating Markdown PDF:', error )
            return false
        }
    }
}