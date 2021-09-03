import React, { useState, useEffect } from 'react'
import { ref, onValue, getDatabase, set } from "firebase/database"
import PopupBase from './menus/PopupBase'
import { useRouteMatch } from 'react-router-dom'

function Header(props) {
    const database = getDatabase()
    const [ userNameChange, setUserNameChange ] = useState(false)
    const [ userNameTemporary, setUserNameTemporary ] = useState("")
    const [ userName, setUserName ] = useState("Anonymous")
    let code = useRouteMatch("/:code")
    const userNameRef = ref(database, "Users/" + props.user.uid)
    useEffect(() => {
        if (props.user ) {
            return onValue(userNameRef, snapshot => {
                const data = snapshot.val()
                if (data === null) {
                    setUserNameChange(true)
                } else {
                    setUserName(data)
                    // setUserNameChange(false)
                }
            })
        }
        
    }, [props, database, userNameRef])
    const openNameChange = () => {
        setUserNameTemporary(userName)
        setUserNameChange(true)
    }
    return (
        <div>
            <div className="header">
                <div className="headerTitle">Spyfall {code ? "| " + code.params.code : null}</div>
                <div></div>
                <div className="headerName" onClick={openNameChange}>{userName}</div>
            </div>
            {userNameChange === true ? 
                <PopupBase 
                    name="Name" 
                    body={(
                        <div>
                            <div>
                                <input type="text" value={userNameTemporary} onChange={e => setUserNameTemporary(e.target.value)}/>
                            </div>
                            <div style={{display: "grid", gridTemplateColumns: "min-content auto min-content", width:"auto", marginTop: "5px"}}>
                                <div className="button" onClick={() => { setUserNameChange(false); }}>Cancel</div>
                                <div style={{width: "auto"}}></div>
                                <div className="button" onClick={()=> { set(userNameRef, userNameTemporary); setUserNameChange(false); }}>Save</div>
                            </div>
                        </div>
                    )}
                /> : null}
        </div>
    )
}

export default Header
