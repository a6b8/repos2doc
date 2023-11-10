import fs from 'fs'
import path from 'path'

import { PDFDocument } from 'pdf-lib'


export class Merge {
    #config
    #state
    #silent


    constructor( config ) {
        this.#config = config
    }


    async start( { name, silent } ) {
        this.#silent = silent
        this.#state = {
            'outputName': null,
            'files': []
        }

        this.#state['outputName'] = [
            [ '{{name}}', name ],
            [ '{{timestamp}}', this.#config['meta']['unix'] ],
        ]
            .reduce( ( acc, a, index ) => {
                const [ from, to ] = a
                acc = acc.replaceAll( from, to )
                return acc
            }, this.#config['merge']['outputFormat'] )

        const status = 'Process'
        let space = ''
        try {
            space = new Array( this.#config['console']['space'] - status.length )
                .fill( ' ' )
                .join( '' )
        } catch( e ) {}

        !this.#silent ? process.stdout.write( `  ${status}${space} | ` ) : ''
        const files = this.#getFilesRecursively( this.#config['path']['root'] )

        const filesBySuffix = this.#getFilesBySuffix( { 
            'files': files, 
            'directory': this.#config['path']['root'] 
        } )

        this.#mergeFiles( filesBySuffix )
        await this.#mergePdfs( filesBySuffix )

        return true
    }


    #mergeFiles( files ) {
        // console.log( '>>>', files )
        this.#state['files'] = Object
            .entries( files )
          //   .filter( a => a[ 0 ] === 'md' || a[ 0 ] === 'txt' )
            .map( ( a ) => {
                !this.#silent ? process.stdout.write( `${a[ 0 ]} ` ) : ''
                const [ key, values ] = a
                const content = values
                    .map( b => fs.readFileSync( b, 'utf-8' ) )
                    .join( "\n\n" )

                const fileName = this.#state['outputName'].replace( 
                    '{{suffix}}', key
                )

                let _path = ''
                _path += `${this.#config['merge']['root']}/`
                _path += `${fileName}`

                fs.writeFileSync( _path, content, 'utf-8' )
                return _path
            } )
// console.log( this.#state['files'] )
        return true
    }


    async #mergePdfs( files ) {
        if( !Object.hasOwn( files, 'pdf' ) ) { 
            return true
        } else {
            if( files['pdf'].length === 0 ) {
                return true 
            }
        }

        !this.#silent ? process.stdout.write( `pdf  ` ) : ''

        const pdfDoc = await PDFDocument.create()
      
        for( const file of files['pdf'] ) {
            const pdfBytes = fs.readFileSync( file )
            const pdf = await PDFDocument.load( pdfBytes )
        
            const copiedPages = await pdfDoc.copyPages( pdf, pdf.getPageIndices() )
            copiedPages.forEach( ( page ) => pdfDoc.addPage( page ) )
        }
      
        const mergedPdfBytes = await pdfDoc.save()

        const fileName = this.#state['outputName'].replace( 
            '{{suffix}}', 'pdf'
        )

        let _path = ''
        _path += `${this.#config['merge']['root']}/`
        _path += `${fileName}`


        fs.writeFileSync( _path, mergedPdfBytes )

        return true
      }
 

    #getFilesRecursively( directory, iteration=0 ) {
        let results = []
        const entries = fs.readdirSync( 
            directory, 
            { 'withFileTypes': true }
        )

        for( const entry of entries ) {
            const fullPath = path.resolve( directory, entry['name'] )
            if( entry.isDirectory() ) {
                iteration++
                results = results.concat( this.#getFilesRecursively( fullPath, iteration ) )
            } else {
                results.push( fullPath )
            }
        }
        return results
    }


    #getFilesBySuffix( { files, directory } ) {
        const search = directory
            .replaceAll( './', '' )
            .replaceAll( '/', '' )
        files = files
            .filter( ( filePath ) => {
                const pathSegments = filePath.split( '/' )
                const repo2gptTempIndex = pathSegments.indexOf( search )
                const result = repo2gptTempIndex !== -1 && repo2gptTempIndex === pathSegments.length - 2
                return !result
            } )

        const keys = Object.keys( this.#config['output'] )
        const result = files
            .reduce( ( acc, file ) => {
                const suffix = file.split( '.' ).at( -1 )
                if( keys.includes( suffix ) ) {
                    !Object.hasOwn( acc, suffix ) ? acc[ suffix ] = [] : ''
                    acc[ suffix ].push( file )
                }
                return acc
            }, {} )

        return result
    }


    cleanUpTemp( { destinationPath } ) {
        if( typeof destinationPath !== 'string' ) {
            console.log( `Key "destinationPath" is not type of "string".` )
            process.exit( 1 )
        } else if( !destinationPath.startsWith( './' ) ) {
            console.log( `Key "destinationPath" does not start with "./"` )
            process.exit( 1 )
        }

 
        this.#state['files']
            .forEach( sourceFilePath => {
                this.#cleanUpTempFile( { sourceFilePath, destinationPath } )
            } )  


        const sourceFolder = this.#config['path']['root']
        if( fs.existsSync( sourceFolder ) ) {
            fs.rmSync( sourceFolder, { 'recursive': true } )
        } else {
            console.log( `SourceFolder "${sourceFolder}" does not exist.` )
        }


        // console.log( 'File moved successfully.' )

        return true
    }


    #cleanUpTempFile( { sourceFilePath, destinationPath } ) {
       // const sourceFilePath = './repo2gpt-temp/merge--1699610939.pdf'

        if( !fs.existsSync( destinationPath ) ) {
            console.error( `Create Destination "${destinationPath}".` )
            fs.mkdirSync( 
                destinationPath, 
                { 'recursive': true }, 
                ( err ) => {
                    if( err ) {
                        console.error( 'Error creating folder:', err )
                    } else {
                        console.log( 'Folder created successfully.' )
                    }
                }
            )
            
        }

        const targetFilePath = path.join(
            destinationPath, 
            sourceFilePath.split( '/' ).pop() 
        )

        console.log( targetFilePath )

        if( fs.existsSync( targetFilePath ) ) {
            console.error( 'File already exists at the target path.' )
        }

        console.log( `From ${sourceFilePath}, To: ${targetFilePath}`)
        fs.renameSync( sourceFilePath, targetFilePath )
        
        return true
    }
}