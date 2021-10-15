import React, { useState, useEffect } from 'react'
import { getDatabase, ref, onValue } from "firebase/database";

function PlayerList(props) {
    const [ players, setPlayers ] = useState({});
    useEffect(() => {
        const db = getDatabase()
        return onValue(ref(db, `Games/${props.gameId}/Players`), snap => {
            let playersList = snap.val();
            setPlayers(playersList)
        })
    }, [props])
    let offlineLength = 0
    let offlinePlayers = Object.entries(players).map(player => {
        const [uid, playerInfo] = player;
        if (playerInfo.Online === true) return null
        offlineLength++;
        return (
            <div key={uid} className="playerListPlayer">
                <div className="playerListNameOffline" style={{
                    width: "260px",
                    borderLeft: "none"
                }}>{playerInfo.userName}</div>
            
            </div>
        )
    })
    return (
        <div className="playerList">
            <span className="playerListTitle">Players</span><br />
            <span>Online</span>
            <div className="playerListTable">
                {Object.entries(players).map(player => {
                    const [uid, playerInfo] = player;
                    if ((playerInfo.Ready === false && props.gameStatus !== "lobby") || playerInfo.Online === false) return null
                    return (
                        <div key={uid} className="playerListPlayer">
                            <div className="playerListName" style={{
                                width: props.gameStatus === "lobby" ? "180px" : "260px",
                                borderLeft: props.gameStatus === "lobby" ? "2px solid #406661" : "none"
                            }}>{playerInfo.userName}{playerInfo.Host ? " (*)" : null}</div>
                            
                            { props.gameStatus === "lobby" ?
                                <div className={`playerListStatus ${playerInfo.Ready ? "playerListReady" : "playerListNotReady"} `}>{playerInfo.Ready ? "Ready" : "Not Ready"}</div>
                                : null
                            }
                        </div>
                    )
                })}
            </div>
            
            {props.gameStatus !== "lobby" ? 
                <div>
                    <span>Ghosts</span>
                    <div className="playerListTable">
                        {Object.entries(players).map(player => {
                            const [uid, playerInfo] = player;
                            if (playerInfo.Ready === true && playerInfo.Online === true) return null
                            return (
                                <div key={uid} className="playerListPlayer">
                                    <div className="playerListName" style={{
                                        width: props.gameStatus === "lobby" ? "180px" : "260px",
                                        borderLeft: props.gameStatus === "lobby" ? "2px solid #406661" : "none"
                                    }}>{playerInfo.userName}</div>
                                    
                                    { props.gameStatus === "lobby" ?
                                        <div className={`playerListStatus ${playerInfo.Ready ? "playerListReady" : "playerListNotReady"} `}>{playerInfo.Ready ? "Ready" : "Not Ready"}</div>
                                        : null
                                    }
                                </div>
                            )
                        })}
                    </div>
                </div>
            : null}
            <br/>
            {offlineLength !== 0 ? 
                <div>
                    <span style={{color: "#686868"}}>Offline</span>
                    <div className="playerListTable">
                        {offlinePlayers}
                    </div>
                </div>
            : null}
        </div>
    )
}

export default PlayerList
