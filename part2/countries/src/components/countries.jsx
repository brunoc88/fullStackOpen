
const Filter = ({handler}) =>{
    return(
    <div>
        find countries <input onChange={handler} />
    </div>)
}

const Countries= ({list}) =>{
    if(list.length >10){
        return(
            <div>
                Too many matches
            </div>
        )
    }else{
        return(
            <div>
                {list.map(country => <p key={country.name.common}>{country.name.common}</p>)}
            </div>
        )
    }
    
}
export {Filter, Countries};