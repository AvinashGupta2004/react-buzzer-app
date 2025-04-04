import {useState,useEffect,useImperativeHandle,forwardRef} from "react";

const BuzzerBtn = forwardRef(({whomFor,handler},ref)=>{
    const [isPressedHost, setIsPressedHost] = useState(false);
    const [isPressedUser, setIsPressedUser] = useState(false);

    useImperativeHandle(ref,()=>({
        reset:()=>{
            setIsPressedHost(false);
            setIsPressedUser(false);
        }
    }))

    if (whomFor === 'host'){
        return (
            <button disabled={isPressedHost} onClick={()=> {
                setIsPressedHost(!isPressedHost);
                handler();
            }}
                className={`h-[15rem] w-[15rem] rounded-full bg-blue-500 text-xl font-bold text-white cursor-pointer focus:ring-3 focus:ring-blue-600 focus:ring-offset-4 disabled:ring-3 disabled:ring-gray-600 disabled:ring-offset-4 disabled:bg-gray-600`}>
                {
                    (isPressedHost)?"Pressed!":"Start"
                }
            </button>
        )
    }
    else{
        return (
            <button disabled={isPressedUser} onClick={()=> {
                setIsPressedUser(!isPressedUser);
                handler();
            }}
                className={`h-[15rem] w-[15rem] rounded-full bg-blue-500 text-xl font-bold text-white cursor-pointer focus:ring-3 focus:ring-blue-600 focus:ring-offset-4 disabled:ring-3 disabled:ring-gray-600 disabled:ring-offset-4 disabled:bg-gray-600`}>
                {
                    (isPressedUser)?"Pressed!":"Press"
                }
            </button>
        )
    }
})

export default BuzzerBtn;