import {useLocation,useNavigate} from "react-router-dom";
import Rank from './Rank.jsx';
import {useState,useEffect,useRef} from "react";
import {useSocket} from "./SocketProvider.jsx"
import BuzzerBtn from "./BuzzerBtn.jsx";
function JoinGameScreen(){
    const location = useLocation();
    const [players,setPlayers] = useState([]);
    const [isGameActive,setIsGameActive] = useState(false);
    const [buzzes,setBuzzes] = useState([]);
    const socket = useSocket();
    const buzzerRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        if (!socket) {
            navigate("/");
            return;
        }

        const handleRoomStateUpdate = ({ room }) => {
            setPlayers([...room.players]); // Ensure state changes
            setBuzzes([...room.buzzes]);   // Ensure state changes
            setIsGameActive(room.isGameActive);
        };

        const handleNewBuzz = (newBuzz) => {
            setBuzzes(prev => [...prev, newBuzz]);
        };

        const handleGameStart = () => {
            setIsGameActive(true);
            setBuzzes([]); // Reset buzzes when game starts
        };

        const handleGameReset = () => {
            setIsGameActive(false);
            setTimeout(() => {
                buzzerRef.current?.reset();
            }, 100);
        };
        socket.on("roomStateUpdate", handleRoomStateUpdate);
        socket.on("newBuzz", handleNewBuzz);
        socket.on("startGame", handleGameStart);
        socket.on("resetGame", handleGameReset);
        socket.on('disconnect',()=>{
            navigate("/");
        })

        return () => {
            socket.off("roomStateUpdate", handleRoomStateUpdate);
            socket.off("newBuzz", handleNewBuzz);
            socket.off("startGame", handleGameStart);
            socket.off("resetGame", handleGameReset);
        };
    }, [socket, navigate]);


    function handleButton(){
        if (isGameActive){
            socket.emit("buzz",{roomCode:location.state.roomCode,playerName:location.state.playerName})
        }
    }
    const leaveRoom = ()=>{
        socket.emit("leaveRoom",{roomCode:location.state.roomCode,playerName:location.state.playerName});
        navigate("/");
    }
    return (
        <main className={`h-full p-6`}>
            <header className="mb-6">
                <main className={`p-4 md:px-16 flex justify-between items-center`}>
                    <section>
                        <span className={`font-montserrat font-extrabold text-4xl`}>
                            <span className={`text-blue-600`}>Buzz</span>Up
                        </span>
                    </section>
                    <button onClick={leaveRoom}
                            className={`text-md border-1 rounded-lg border-gray-300 bg-gray-50 font-semibold text-gray-800 font-nunito p-2 px-4`}>
                        Leave
                    </button>
                </main>
            </header>
            <section>
                <article className={`flex flex-col gap-3 justify-start items-center`}>
                    <header className={`flex flex-col sm:flex-row justify-center items-center gap-3 md:gap-6`}>
                    <div className={`flex flex-col sm:flex-row justify-center items-center sm:gap-2`}>
                            <div className={`text-lg font-work font-medium`}>Room Code</div>
                            <div
                                className={`p-2 px-3 text-xl text-blue-800 font-work font-bold rounded-lg bg-blue-50 border-1 border-blue-300 tracking-widest`}>
                                {location.state.roomCode}
                            </div>
                        </div>
                        <div className={`flex flex-col sm:flex-row justify-center items-center sm:gap-2`}>
                            <div className={`text-lg font-work font-medium`}>Your Name</div>
                            <div
                                className={`p-2 px-4 flex justify-center items-center gap-4 bg-amber-50 border-1 border-amber-300 rounded-lg`}>

                                <div className={`text-xl font-poppins font-semibold`}>
                                    {location.state.playerName}
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className={`flex flex-col gap-3 justify-center items-center mt-4`}>
                        <h5 className={`text-center text-2xl font-semibold font-nunito`}>
                            {
                                (isGameActive) ? "Game is Running!" : "Waiting for Game to Start!"
                            }
                        </h5>
                        <BuzzerBtn whomFor={"player"} handler={handleButton} ref={buzzerRef}/>
                    </main>
                </article>
                <hr className={`mx-[20%] mt-10 mb-6`}/>
                <article className={``}>
                    <h3 className={`text-center text-2xl font-poppins font-semibold mb-2`}>Leaderboard</h3>
                    <figure className={`w-full lg:w-[60%] mt-4 mx-auto flex flex-col justify-center gap-3 overflow-y-auto`}>
                        {
                            buzzes.map((buzz,index)=>{
                                return(
                                    <Rank rank = {index+1} name = {buzz.playerName} key={index}/>
                                )
                            })
                        }
                    </figure>
                </article>
            </section>
        </main>
    )
}

export default JoinGameScreen;