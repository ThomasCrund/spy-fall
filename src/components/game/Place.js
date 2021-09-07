import React, { useState } from 'react'

function Place(props) {
    const [ crossed, setCrossed ] = useState(false)
    return (
        <div className="placeImage" style={{ backgroundColor: crossed ? "red" : "#57D131"}}  onClick={() => setCrossed(old => !old)}>
            {props.place.name}
        </div>
    )
}

export default Place
