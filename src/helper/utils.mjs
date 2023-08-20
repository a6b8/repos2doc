function printMessages( { messages, escape=false } ) {
    let error = false
    if( messages.length !== 0 ) {
        error = true
        messages
            .forEach( ( msg, index ) => {
                index === 0 ? console.log( 'Error:' ) : ''
                console.log( `- ${msg}`)
            } )

        escape !== true ? process.exit( 1 ) : ''
    }

    return error
}


export { printMessages }