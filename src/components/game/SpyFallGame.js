import { Button } from '@material-ui/core'
import { get, getDatabase, onValue, ref, set, runTransaction } from 'firebase/database'
import React, { useState, useEffect } from 'react'
import TimeCountdown from './TimeCountdown'
import placesList from '../../places.json'
import Place from './Place'

function SpyFallGame(props) {
    const [ spy, setSpy ] = useState(false)
    const [ place, setPlace ] = useState({ name:"loading"})
    const [ time, setTime ] = useState(480)
    const db = getDatabase()
    const [ countingDown, setCountingDown ] = useState(null)
    const timeRef = ref(db, `Games/${props.gameId}/Time`)
    useEffect(() => {
        get(ref(db, `Games/${props.gameId}/Players/${props.uid}/Spy`)).then(snap => {
            let spyValue = snap.val()
            if (spyValue) {
                setSpy(true);
            } else {
                get(ref(db, `Games/${props.gameId}/Place`)).then(snap => {
                    setSpy(false);
                    console.log(snap.val())
                    setPlace(snap.val());
                });
            }
        }).catch(err => console.log(err))
        return onValue(timeRef, snap => {
            setTime(snap.val());
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])
    useEffect(() => {
        if (props.host) startCountDown();
        return () => { clearInterval(countingDown); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.host])
    let endGame = () => {
        set(ref(db, `Games/${props.gameId}/InGame`), false)
        clearInterval(countingDown);
    }
    let countDown = () => {
        runTransaction(timeRef, currentTime => currentTime-1)
    }
    let startCountDown = () => {
        setCountingDown(setInterval(countDown, 1000))
    }
    let endCountDown = () => {
        clearInterval(countingDown);
        setCountingDown(null);
    }
    return (
        <div className="rightPanel">
            <TimeCountdown time={time} host={props.host} gameId={props.gameId} countingDown={countingDown} startCountDown={startCountDown} endCountDown={endCountDown} />
            {(!spy) ? (
                place?.name !== "loading" ? <div>
                    The place is {place.name}
                </div> : null
            ) : <div>You are the spy. You need to guess the place</div>}
            {props.host ?
                <div className="lobbyHostControls">
                    <span style={{fontSize: 20}}>You are the host</span>
                    <div>
                    <Button variant="outlined" color="primary" onClick={endGame}>
                        End Game
                    </Button>
                    </div>
                </div> : 
                <div className="lobbyHostControls">
                    Waiting for the game to start    
                </div>}
                <div className="placesList">
                    {placesList.map(placeData => <Place place={placeData} />)}
                </div>
        </div>
    )
}

export default SpyFallGame
