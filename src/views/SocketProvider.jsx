import {useContext,createContext} from "react";
import {io} from "socket.io-client";
import {useEffect,useState} from 'react';

const SocketContext = createContext(null);
export function SocketProvider({children}){
    const [socket,setSocket] = useState(null);

    useEffect(()=>{
        const newSocket = io("https://react-buzzer-app-server.onrender.com");
        setSocket(newSocket);

        return(()=>{
            newSocket.disconnect();
        })
    },[]);

    return(
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export function useSocket(){
    return useContext(SocketContext);
}