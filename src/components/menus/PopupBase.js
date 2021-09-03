import React from 'react'

function PopupBase(props) {
    return (
        <div className="PopupBackground">
            <div className="Popup">
                <div className="PopupHeader" onClick={props.onclose}>{props.name}</div>
                <div className="PopupBody">
                    {props.body}
                </div>
            </div>
        </div>
    )
}

export default PopupBase
