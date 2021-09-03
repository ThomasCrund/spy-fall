import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
import { getDatabase, ref, runTransaction } from 'firebase/database'
import React, { useState, useEffect } from 'react'

function TimeCountdown(props) {
    const secondsString = String(props.time % 60)
    return (
        <div className="timeDisplay">
            {Math.floor(props.time / 60)}:{secondsString.length === 1 ? "0" : null}{secondsString} {
                props.host ? (props.countingDown === null ? <FontAwesomeIcon icon={faPlay} onClick={props.startCountDown} /> : <FontAwesomeIcon icon={faPause} onClick={props.endCountDown} />) : null
            }
        </div>
    )
}

export default TimeCountdown
