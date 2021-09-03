import React, { useState } from 'react'
import PopupBase from './PopupBase'
import { getDatabase, ref, set, get } from "firebase/database";
import { useHistory } from 'react-router-dom';

function generateId(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function HomePage(props) {
    let db = getDatabase()
    const [ dialog, setDialog ] = useState(null)
    let history = useHistory();
    const join = async () => {
        let gameId = dialog.code.toUpperCase()
        const snap = await get(ref(db, `Games/${gameId}`))
        if(!snap.exists()) {
            alert("Game does not exist")
            return
        }
        history.push(`/${gameId}`)

    }

    const create = async () => {
        let saveIdFound = false
        let GameId = generateId(6)
        while (saveIdFound === false) {
            const snap = await get(ref(db, `Games/${GameId}`))
            if(snap.exists()) {
                GameId = generateId(6)
            } else {
                saveIdFound = true;
            }

        }
        set(ref(db, 'Games/' + GameId), {
            InGame: false,
            Time: 480,
            Players: {
                [props.uid]: {
                    Host: true
                }
            }
        });
        history.push(`/${GameId}`)
        
    }

    return (
        <div className="homePage">
            <span>Online SpyFall to play with friends over video call</span>
            <div className="button" 
                 style={{fontSize: "25px", padding:"10px"}}
                 onClick={() => {
                    setDialog({
                        type: "join",
                        code: ""
                    })
                 }}>
                    Join a game
            </div>
            or
            <div className="button" 
                 style={{fontSize: "25px", padding:"10px"}}
                 onClick={() => {
                    setDialog({
                        type: "create"
                    })
                 }}>
                    Create a game
            </div>

            {dialog?.type === "join" ? 
                <PopupBase 
                    name="Join a game"
                    body={(
                        <div>
                            <div>
                                <input type="text" value={dialog.code} onChange={e => setDialog(dialog => ({ ...dialog, code: e.target.value}))}/>
                            </div>
                            <div style={{display: "grid", gridTemplateColumns: "min-content auto min-content", width:"auto", marginTop: "5px"}}>
                                <div className="button" onClick={() => { setDialog(null); }}>Cancel</div>
                                <div style={{width: "auto"}}></div>
                                <div className="button" onClick={()=> { join() }}>Join</div>
                            </div>
                        </div>
                    )}
                    onclose={() => setDialog(null)}
                /> : null}
            {dialog?.type === "create" ? 
                <PopupBase 
                    name="Create a game"
                    onclose={() => setDialog(null)}
                    body={(
                        <div>
                            <div>Are you sure you want to create a game?</div>
                            <div style={{display: "grid", gridTemplateColumns: "min-content auto min-content", width:"auto", marginTop: "5px"}}>
                                <div className="button" onClick={() => { setDialog(null); }}>Cancel</div>
                                <div style={{width: "auto"}}></div>
                                <div className="button" onClick={()=> { create() }}>Create</div>
                            </div>
                        </div>
                    )}
                /> : null}
        </div>
    )
}

export default HomePage
