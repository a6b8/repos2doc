import fs from 'fs'
import path from 'path'


const sourceFilePath = './repo2gpt-temp/merge--1699610939.pdf'
const destinationPath = './'



if( !fs.existsSync( destinationPath ) ) {
    console.error( `Destination "${destinationPath}" directory does not exist.` )
} else {
    const targetFilePath = path.join(destinationPath, sourceFilePath.split( '/' ).pop())
    console.log( targetFilePath )

    if( fs.existsSync( targetFilePath ) ) {
        console.error( 'File already exists at the destination path.' )
    } else {
    try {
        fs.renameSync( sourceFilePath, targetFilePath )

        /*
        const sourceFolder = './'; // Replace with your source folder path
        if( fs.existsSync( sourceFolder ) ) {
            fs.rmdirSync( sourceFolder, { 'recursive': true } )
        }

        console.log('File moved successfully.');
        } catch (err) {
        console.error('Error moving the file:', err);
        */
        }
    catch( e ) {}
  }
}




