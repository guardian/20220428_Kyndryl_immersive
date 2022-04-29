import { useEffect, useState } from "preact/hooks";
import {getAuth, onAuthStateChanged, signInAnonymously} from "firebase/auth";

const fireAuth = getAuth();

const useAuth = () => {
    const [userId, setUserId] = useState(null);
    useEffect(()=>{
        signInAnonymously(fireAuth)
            .then(()=>{
                onAuthStateChanged(fireAuth, user=> setUserId(user.uid));
            })
            .catch(e=> {
                console.warn('Authentication error!', e);
            });
    },[]);

    return userId;
}

export default useAuth;