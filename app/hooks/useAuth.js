import { AuthContext } from "../contexts";
import { useContext } from "react";

export const useAuth = () => {
    const {auth, setAuth, googleAuth, setGoogleAuth, wantToRegWithGoogle, setWantToRegWithGoogle} = useContext(AuthContext);
    return {auth, setAuth, googleAuth, setGoogleAuth, wantToRegWithGoogle, setWantToRegWithGoogle};
}