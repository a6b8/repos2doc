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
            'outputName': null
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

        !this.#silent ? process.stdout.write( `- ${status}${space} | ` ) : ''
        const files = this.#getFilesRecursively( this.#config['path']['root'] )
        const filesBySuffix = this.#getFilesBySuffix( files )

        
        this.#mergeFiles( filesBySuffix )
        await this.#mergePdfs( filesBySuffix )

        return true
    }


    #mergeFiles( files ) {
        Object
            .entries( files )
            .filter( a => a[ 0 ] === 'md' || a[ 0 ] === 'txt' )
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
            } )
        return 
    }


    async #mergePdfs( files ) {
        if( files['pdf'].length === 0 ) {
            return
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


    #getFilesBySuffix( files ) {
        return files
            .reduce( ( acc, file ) => {
                const suffix = file.split( '.' ).at( -1 )
                !Object.hasOwn( acc, suffix ) ? acc[ suffix ] = [] : ''
                acc[ suffix ].push( file )
                return acc
            }, {} )
    }
}