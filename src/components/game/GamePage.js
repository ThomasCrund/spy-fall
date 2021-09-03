import React, { useState, useEffect } from 'react'
import { getDatabase, ref, onDisconnect, update, onValue, get, set } from "firebase/database";
import PlayerList from './PlayerList';
import LobbyPage from './LobbyPage';
import SpyFallGame from './SpyFallGame';

function GamePage(props) {
    const db = getDatabase();
    const [ gameState, setGameState ] = useState("joining")
    const [ host, setHost ] = useState(false)
    /**
     * States
     * - joining
     * - lobby
     * - inGame
     * - ghost
     */
    useEffect(() => {
        const joinPlayer = async () => {
            update(ref(db, `Games/${props.gameId}/Players/${props.uid}`), {
                Ready: false,
                Spy: false,
                Online: true,
            })
            const presenceRef = ref(db, `Games/${props.gameId}/Players/${props.uid}/Online`);
            return onDisconnect(presenceRef).set(false);
        }
        return joinPlayer()
    }, [props, db])
    useEffect(() => {
        return onValue(ref(db, `Users/${props.uid}`), snap => {
            set(ref(db, `Games/${props.gameId}/Players/${props.uid}/userName`), snap.val());
        })
    }, [props, db])
    useEffect(() => {
        return onValue(ref(db, `Games/${props.gameId}/InGame`), snapshot => {
            const inGame = snapshot.val()
            if (inGame) {
                get(ref(db, `Games/${props.gameId}/Players/${props.uid}/Ready`)).then(snap => {
                    const playerPlaying = snap.val();
                    if (playerPlaying) {
                        setGameState("inGame")
                    } else {
                        setGameState("ghost")
                    }
                })
            } else {
                setGameState("lobby")
            }
        })
    })
    useEffect(() => {
        return onValue(ref(db, `Games/${props.gameId}/Players/${props.uid}/Host`), snapshot => {
            const host = snapshot.val()
            setHost(host)
        })
    })
    return gameState !== "joining" ?
        <div className="gamePage">
            <PlayerList uid={props.uid} gameId={props.gameId} gameStatus={gameState} />
            { gameState === "lobby" ?
                <LobbyPage uid={props.uid} gameId={props.gameId} host={host} /> :
                gameState === "inGame" ?
                <SpyFallGame uid={props.uid} gameId={props.gameId} host={host} /> :
                <div className="rightPanel">Please Wait as the current round finishes</div>
            }
        </div> : null
    
}

export default GamePage
