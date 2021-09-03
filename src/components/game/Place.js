import React, { useState } from 'react'

function Place(props) {
    const [ crossed, setCrossed ] = useState(false)
    return (
        <div className="placeImage" style={{ backgroundColor: crossed ? "red" : "#B9E937"}}  onClick={() => setCrossed(old => !old)}>
            {props.place.name}
        </div>
    )
}

export default Place
