import React, { useState, useEffect } from 'react'
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { ref, getDatabase, set, get, update } from 'firebase/database';
import { Button } from '@material-ui/core';
import PopupBase from '../menus/PopupBase';
import places from '../../places.json'

const GreenSwitch = withStyles({
    switchBase: {
      color: '#57D131',
      '&$checked': {
        color: '#57D131',
      },
      '&$checked + $track': {
        backgroundColor: '#B9E937',
      },
    },
    checked: {},
    track: {},
})(Switch);


function LobbyPage(props) {
    const [ ready, setReady ] = useState(false);
    const [ startConfirmation, setConfirmation ] = useState(false);
    let db = getDatabase();
    useEffect(() => {
        update(ref(db, `Games/${props.gameId}/Players/${props.uid}`), { Ready: ready, Spy: false })
    }, [ready, props, db])

    const setStart = async () => {
        if (!ready) {
            alert("You can not start the game if you are not ready")
            setConfirmation(false)
            return;
        }
        let playersSnap = await get(ref(db, `Games/${props.gameId}/Players`))
        let place = places[Math.floor(Math.random() * places.length)] 
        let players = await Object.entries(playersSnap.val()).map((value, index) => value[0])
        let spy = players[Math.floor(Math.random() * players.length)] 
        await set(ref(db, `Games/${props.gameId}/Players/${spy}/Spy`), true)
        update(ref(db, `Games/${props.gameId}`), {
            InGame: true,
            Place: place,
            Time: 480
        })
    }

    const startGame = async () => {
        let playersSnap = await get(ref(db, `Games/${props.gameId}/Players`))
        const players = playersSnap.val()
        let notReady = false
        await Object.entries(players).forEach((value, index) => {
            const [ , playerInfo ] = value;
            if (playerInfo.Ready === false && playerInfo.Online === true) {
                notReady = true
            }
        })
        if (notReady) {
            setConfirmation(true)
        } else {
            setStart();
        }

        
    }


    return (
        <div className="rightPanel">
            <FormControlLabel
                control={<GreenSwitch checked={ready} onChange={() => setReady(oldReady => !oldReady)} name="checkedA" />}
                label="Ready"
            />
            {props.host ?
            <div className="lobbyHostControls">
                <span style={{fontSize: 20}}>You are the host</span>
                <div>
                <Button variant="outlined" color="primary" onClick={startGame}>
                    Start Game
                </Button>
                </div>
            </div> : 
            <div className="lobbyHostControls">
                Waiting for the game to start    
            </div>}
            {startConfirmation ? <PopupBase 
                name="Are you sure you want to Start the Game?"
                body={
                <div>
                    There are players who are not currently ready
                    <div style={{display: "grid", gridTemplateColumns: "min-content auto min-content", width:"auto", marginTop: "5px"}}>
                        <div className="button" onClick={() => { setConfirmation(false); }}>Cancel</div>
                        <div style={{width: "auto"}}></div>
                        <div className="button" onClick={()=> {  setStart(); }}>Proceed</div>
                    </div>
                </div>}
                
                /> : null}
        </div>
    )
}

export default LobbyPage
