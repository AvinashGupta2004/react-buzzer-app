import Rank from "./Rank.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "./SocketProvider.jsx";
import { useState, useEffect, useRef } from "react";
import BuzzerBtn from "./BuzzerBtn.jsx";

function HostScreen() {
    const location = useLocation();
    const socket = useSocket();
    const navigate = useNavigate();

    const [players, setPlayers] = useState([]);
    const [isGameActive, setIsGameActive] = useState(false);
    const [buzzes, setBuzzes] = useState([]);
    const buzzerRef = useRef();

    const roomCode = location.state?.roomCode;
    const hostName = location.state?.hostName;

    useEffect(() => {
        if (!socket || !roomCode) {
            navigate("/");
            return;
        }

        const handleRoomStateUpdate = ({ room }) => {
            console.log("Room State Updated:", room);
            setPlayers([...room.players]);
            setBuzzes([...room.buzzes]);
            setIsGameActive(room.isGameActive);
        };

        const handleNewBuzz = (newBuzz) => {
            setBuzzes(prev => [...prev, newBuzz]);
        };

        const handleDisconnect = () => {
            navigate("/");
        };

        socket.on("roomStateUpdate", handleRoomStateUpdate);
        socket.on("newBuzz", handleNewBuzz);
        socket.on("disconnect", handleDisconnect);

        return () => {
            socket.off("roomStateUpdate", handleRoomStateUpdate);
            socket.off("newBuzz", handleNewBuzz);
            socket.off("disconnect", handleDisconnect);
        };
    }, [socket, roomCode, navigate]);

    const startGame = () => {
        if (socket && roomCode) {
            socket.emit("startGame", { roomCode });
        }
    };

    const resetGame = () => {
        socket.emit("resetGame", { roomCode });

        // Reset states
        setIsGameActive(false);
        setBuzzes([]);

        // Delay to ensure component re-renders before calling reset
        setTimeout(() => {
            buzzerRef.current?.reset();
        }, 100);
    };

    return (
        <main className="h-full p-6">
            <header className="mb-6">
                <div className="p-4 px-16 flex justify-center items-center">
                    <h1 className="font-montserrat font-extrabold text-4xl">
                        <span className="text-blue-600">Buzz</span>Up
                    </h1>
                </div>
            </header>

            <section className="flex flex-col gap-3 justify-start items-center">
                <header className="flex justify-center items-center gap-6">
                    <InfoBox label="Room Code" value={roomCode}  textColor={`text-blue-700`}/>
                    <InfoBox label="Players" value={players.length}  textColor={`text-blue-700`}/>
                    <InfoBox label="Your Name" value={hostName} highlight textColor={`text-yellow-700`}/>
                </header>

                <div className="flex flex-col gap-3 justify-center items-center mt-4">
                    <h5 className="text-center text-2xl font-semibold font-nunito">
                        {isGameActive ? "Game is Running!" : "Waiting for Game to Start!"}
                    </h5>
                    <BuzzerBtn whomFor="host" handler={startGame} ref={buzzerRef} />
                </div>

                <button onClick={resetGame} className="text-md cursor-pointer rounded-lg bg-gray-100 border-1 border-gray-300 p-2 px-4 font-work text-gray-700 font-semibold">
                    Reset Game
                </button>
            </section>

            <hr className="mx-[20%] mt-10 mb-6" />

            <section>
                <h3 className="text-center text-2xl font-poppins font-semibold mb-2">Leaderboard</h3>
                <div className="w-[60%] mt-4 mx-auto flex flex-col justify-center gap-3 overflow-y-auto">
                    {buzzes.map((buzz, index) => (
                        <Rank key={index} rank={index + 1} name={buzz.playerName} />
                    ))}
                </div>
            </section>
        </main>
    );
}

const InfoBox = ({ label, value, highlight ,textColor}) => (
    <div className="flex justify-center items-center gap-2">
        <div className="text-lg font-work font-medium">{label}</div>
        <div className={`p-2 px-3 text-xl font-work font-bold rounded-lg border-1 tracking-wide ${highlight ? "bg-amber-50 border-amber-300" : "bg-blue-50 border-blue-300"} ${textColor}`}>
            {value}
        </div>
    </div>
);

export default HostScreen;
