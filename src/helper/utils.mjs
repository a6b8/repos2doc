function printMessages( { messages=[], comments=[] } ) {
    const n = [
        [ comments, 'Comment', false ],
        [ messages, 'Error', true ]
    ]
        .forEach( ( a, index ) => {
            const [ msgs, headline, stop ] = a
            msgs
                .forEach( ( msg, rindex, all ) => {
                    rindex === 0 ? console.log( `\n${headline}${all.length > 1 ? 's' : ''}:` ) : ''
                    console.log( `  - ${msg}` )
                    if( ( all.length - 1 ) === rindex ) {
                        if( stop === true ) {
                            process.exit( 1 )
                        }
                    }
                } )
        } )

    return true
}


function getTableInAscii( { headlines, items, nr="Nr", splitter=true } ) {
    function getRow( { rowItems, maxLengths } ) {
        const row = rowItems
            .reduce( ( acc, a, index, all ) => {
                index === 0 ? acc += '| ' : ''
                const l = maxLengths[ index ] - a.length
                acc += a
                acc += new Array( l ).fill( ' ' ).join( '' )

                if( all.lenght -1 === index ) {
                    acc += ' |'
                } else {
                    acc += ' | '
                }
                return acc
            }, '' )
        return row
    }


    const nrLength = Math.max( ...[ nr.length, items.length ] ) 
    const maxLengths = headlines
        .reduce( ( abb, headline, columnIndex ) => {
            const columnItems = items
                .reduce( ( acc, rowItems, index ) => {
                    acc.push( rowItems[ columnIndex ] )
                    return acc
                }, [] )

            const maxLength = [ headline, ...columnItems ]
                .flat( 1 )
                .reduce( ( acc, a, index ) => {
                    const l = a.length
                    acc = l > acc ? l : acc
                    return acc
                }, 0 )
            abb.push( maxLength )
            return abb
        }, [ nrLength ] )

    headlines = [ nr, ...headlines ] 

    let table = ''
    table += getRow( { 'rowItems': headlines, maxLengths } )
    table += "\n"

    if( splitter ) {
        table += getRow( { 
            'rowItems': new Array( headlines.length )
                .fill()
                .map( ( a, i ) => new Array( maxLengths[ i ] ).fill( '-' ).join( '' ) ),
            maxLengths
        } )
        table += "\n"
    } 

    items.forEach( ( item, index ) => { 
        item = [ `${index + 1}`, ...item ]
        table += getRow( { 'rowItems': item, maxLengths } ) 
        table += "\n"
    } )

    return table
}



export { printMessages, getTableInAscii }