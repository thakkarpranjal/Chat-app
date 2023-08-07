import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import React, { useContext, useState } from 'react'
import { db } from './firebase';
import { AuthContext } from './AuthContext';

function Search() {
  const [username, setUsername] = useState("")
  const [user, setUser] = useState(null)
  const [err, setErr] = useState(false)
  const {currentUser} = useContext(AuthContext)
  const handleSelect = async() => {
    const combinedId =
    currentUser.uid > user.uid 
    ? currentUser.uid + user.uid 
    : user.uid + currentUser.uid
    try{
      const res = await getDoc(doc(db, "chats", combinedId));
      if (!res.exists()){
        await setDoc(doc (db, "chats" , combinedId) , {messages : []})

        await updateDoc(doc(db, "userChats" ,currentUser.uid), {
          [combinedId + ".userInfo"] : {
            uid:user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
          },
          [combinedId+".date"] :serverTimestamp()
        })
        await updateDoc(doc(db, "userChats" ,user.uid), {
          [combinedId + ".userInfo"] : {
            uid:currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
          },
          [combinedId+".date"] :serverTimestamp()
        })
      }
    } catch(err){
      
    }
    setUser(null);
    setUsername("")
  }

  const handleSearch = async() => {
   
    const q = query(
      collection(db, "users"),
      where("displayName", "==" , username)
    ) 

    try{
    const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
 setUser(doc.data())
});
}catch(err) {
  setErr(true)
  console.log(err)
}
  };
 
  return (
    <div className='search'>
        <div className="searchForm">
            <input type='text' placeholder='find a user' 
            //  onKeyDown={handleKey}
             onChange={e => setUsername(e.target.value)}
             value={username}
            />
            <button onClick={handleSearch}>Search</button>
        </div>
       {err && <span>User not found</span>}
       { user && <div className="userChat" onClick={handleSelect}>
            <img src={user.photoURL} />
            <div className="userChatInfo">
                <span>{user.displayName}</span>
                <p>{user.lastMessage}</p>
            </div>
        </div>}
    </div>
  )
}

export default Search