import React, { useState } from "react";
import './style.scss';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, storage } from "./firebase";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable , getDownloadURL } from "firebase/storage";

function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [err , setErr] = useState(false);
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];
try {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  const date = new Date().getTime();
  const storageRef = ref(storage, `${displayName + date}`);

  await uploadBytesResumable(storageRef, file).then(() => {
    getDownloadURL(storageRef).then(async (downloadURL) => {
      try {
        //Update profile
        await updateProfile(res.user, {
          displayName,
          photoURL: downloadURL,
        });
        await setDoc(doc(db, "users", res.user.uid), {
          uid: res.user.uid,
          displayName,
          email,
          photoURL: downloadURL,
        });
        console.log(err)
        await setDoc(doc(db, "userChats", res.user.uid), {});
        navigate("/");
      } catch (err) {
        console.log(err);
        setErr(true);
        setLoading(false);
      }
    });
  });
} catch (err) {
  setErr(true);
  setLoading(false);
}
};
  
    return(
        <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Chat App</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="display name" />
          <input required type="email" placeholder="email" />
          <input required type="password" placeholder="password" />
          <input required style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHsAAAB7CAMAAABjGQ9NAAAAYFBMVEX///8AAADW1tZra2tcXFzc3Nzw8PCysrKYmJgNDQ3z8/NDQ0PGxsbq6uopKSmsrKx6enq7u7v5+fkYGBiCgoI+Pj5ycnI2NjaLi4thYWGfn59XV1dJSUkkJCTk5ORSUlIhXh7cAAAEUUlEQVRogcVb2XajMAz1QNnCvgaSNvn/v5xDk1gCbLCFZ3SfmoJ1sbV6E8IeQRbFlZ8WbfInaYvUr+IoCwhybGnrrm//qND2Xf3vPiDMuj5R8n6Q9F0WuiduvOG6y/vBdfAap8x5nBoRv5DGuTPmYLAgfmFwo3rvbs084+6dZg4mEvOM6VzfLyOZecZ4oVNnhUZoUvTp1I1jPI7dlPaFzvWKjMgcqk0smW5ZsPTiMMhuk5p/IPl7popf9/KhbfAoVVbZErpebcX40WGryN82qyyZw+dGdYYBI483RvK0Gvdg3T4tzU32Uq6DYGHhbdnKborSLkQ35erbE2Ol16vPju2TQxOvZNRm7cplqzstMeQroy8J1IYfrEBtTb5s8a1352M8vu16kS1e786VAU23kHZgcMHCwo10tIuFApNdVwsXvkFXNWChwmIvyOBolpxP/jM8PJJP/Xs4hv+4qrnyHyRVG9uxnSXuyr0c91xjbyFOmm4G/AUPyW3VKselggszA2CDG1Qv4BE/71xLYFdTjPoFuVfnmFoIFGSKbTZGFem320nNjAaF13H9MECjciaG6/BALrQOb2gKYGxneX2rjV0R2Zu/fILc4G4qLZr9NjmuH99A+dzTPTDtyccvTMuhXNM9pO3YUFTzmY5fTS0TlVFY4xBWClNJgVLQ7teCF6MAg4bDWH1gIcbhNwIaiKwwGqmxaxO4G6jbb4r/mQdTAjcKrbKPIEYR71xyo7j9aQSWZmrkRG6k3Le1hbB4ZVEwkLjBqK8va4Pk6R80Pc0tYIr8CkmQ34wdjMwNbvbK0738bSGEyC1kq37+BdMB4yxyglsmjt9MCsnNqlIicoOLz6ka1G1VMxC5oYaYFS7VndjIoHILqeFZ4bIqn/4LtyyQWpwLb8cNHXDfZLsARRa7RTgqN+aT3r4/O3bGDS4dQXjfnRy744Ypfgzz3t5KBKFmekP6VQXRPdW+/YgHfwOobO/bh0OsjxWyUPHhT62LoTLLAtq8JJ0sFXL4dRPATC37EDq3kXG0gNCymaK98UXk/tLIk5POFmKchjtUb0EeQ7PCANwJJFRNreacG2q2w343m1V8Qzw1pT7q96G+aWauN3Sk70M7F7Q9Ml1XsJ0f+7fIqulrA1DFc/twqvSJCfm3QVxTghrPcVyjxnMyN4rnnHmMM39z1i2c9Rpnncpan3POSzjnY5zzUM75N+u6A+d6C+c6E+f6Guu6Iud6Kuc6Mmn9nDAPVa6fU/YNms/27o9xC+W+AWW/RCrP2EQ0+yWUfaK3LONv1e0TkfbHxGPsRvO8q90fI+0LWkG/L8i6H8q5D8y6/82578963oH1nAfn+RbWcz2s55lYz3Fxnl9jPbfHel6R9Zwm6/lU1nO5Ds4jR+TzyKznsFnPnwvOc/eC9b4B6z0LwXm/RLDeqxGc94lm8N2jmsF3f2wG3725GXz3BX/Bdk/yDa77ofABju7F/gWTUT+vsRouwgAAAABJRU5ErkJggg==" alt="" />
            <span>Add an avatar</span>
          </label>
          <button type="submit">Sign up</button>
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          You do have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
    )
}

export default Register