import React, { useState } from 'react'

function PlaceSpyLabel(props) {
    const [hidden, setHidden] = useState(false)
    return !hidden ? (
        <div onClick={() => setHidden(true)}>
            {(!props.spy) ? (
                props.place?.name !== "loading" ? 
                    <div className="placeSpyLabel" style={{ backgroundColor: "#57D131"}}>
                        <span>The place is:</span>
                        <span style={{ fontSize: "40px", fontWeight: "bold"}}>{props.place.name}</span>
                    </div> 
                : null
            ) : <div className="placeSpyLabel" style={{ backgroundColor: "#d8341e"}}>
                    <span>You are the:</span>
                    <span style={{ fontSize: "50px", fontWeight: "bold"}}>Spy</span>
                </div>}
        </div>
    ) : (
        <div className="placeSpyLabel" style={{ backgroundColor: "#686868"}} onClick={() => setHidden(false)}>
            <span>The place or role is:</span>
            <span style={{ fontSize: "50px", fontWeight: "bold"}}>Hidden</span>
        </div>
    )
}

export default PlaceSpyLabel
