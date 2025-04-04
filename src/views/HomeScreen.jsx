import { RiLoginBoxFill } from "react-icons/ri";
import { PiPlusCircleFill } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ToastNotify from "./ToastNotify.jsx";
import { useSocket } from "./SocketProvider.jsx";

function HomeScreen() {
    const [joinRoomCode, setJoinRoomCode] = useState("");
    const [joinNickName, setJoinNickName] = useState("");
    const [createNickName, setCreateNickName] = useState("");
    const socket = useSocket();
    const [toasts, setToasts] = useState([]);
    const navigate = useNavigate();

    function handleJoinCodeInput(e) {
        setJoinRoomCode(e.target.value.toUpperCase());
    }

    function handleJoinNickNameInput(e) {
        setJoinNickName(e.target.value);
    }

    function handleCreateNickNameInput(e) {
        setCreateNickName(e.target.value);
    }

    function addToast(type, message) {
        setToasts([...toasts, { type, message }]);
        setTimeout(() => {
            setToasts([]);
        }, 4000);
    }

    function handleJoinRoom(e) {
        e.preventDefault();
        if (joinNickName.trim() && joinRoomCode.trim()) {
            socket.emit("joinRoom", {
                roomID: joinRoomCode,
                playerName: joinNickName
            });

            socket.once("roomJoined", ({ roomID, name ,roomState}) => {
                navigate(`/join/${roomID}`, {
                    state: {
                        roomCode: roomID,
                        playerName: name,
                        roomState:roomState
                    }
                });
            });

            socket.once("error", (error) => {
                addToast("error", error.message || "Sorry! We can't join you in room!");
            });
        } else {
            addToast("warning", "Fields are required!");
        }
    }

    function handleCreateRoom(e) {
        e.preventDefault();

        if (createNickName.trim()) {
            addToast("info","Joining you in!")
            socket.emit("createRoom", {
                hostName: createNickName
            });

            socket.once("roomCreated", ({ roomID, hostName, hostID, isGameActive }) => {
                navigate(`/host/${roomID}`, {
                    state: {
                        roomCode: roomID,
                        hostName: hostName,
                        hostID: hostID,
                        isGameActive: isGameActive // Pass isGameActive
                    }
                });
            });
        } else {
            addToast("warning", "Nickname is required!");
        }
    }

    return (
        <div className="h-screen bg-gray-50">
            <header>
                <main className="p-8 px-16 flex justify-center items-center">
                    <section>
                        <span className="font-montserrat font-extrabold text-4xl">
                            <span className="text-blue-600">Buzz</span>Up
                        </span>
                    </section>
                </main>
            </header>

            <main className="p-4 flex flex-col gap-8 justify-center">
                <section>
                    <h4 className="text-[2rem] font-semibold text-black text-center font-poppins">
                        The modern way to host thrilling quiz competitions!
                    </h4>
                </section>

                <section className="flex flex-col justify-start items-stretch w-[90%] gap-14 mx-auto md:flex-row">
                    {/* Join Room Card */}
                    <article className="p-6 border-4 border-blue-100 w-full rounded-xl flex flex-col justify-start items-center bg-white">
                        <div className="flex mb-1 gap-3 justify-center items-center">
                            <RiLoginBoxFill size="1.6rem"/>
                            <h3 className="text-center text-2xl text-gray-800 font-poppins font-semibold uppercase">
                                Join Room
                            </h3>
                        </div>
                        <p className="text-center text-lg text-gray-700 font-work font-medium">
                            Already having a room code? Join right from here!
                        </p>

                        <div className="my-2 mt-4 w-full">
                            <div className="w-full lg:w-[70%] mx-auto flex flex-col justify-start items-start mt-2 gap-0">
                                <label className="text-sm text-gray-700 font-work font-semibold">Room Code</label>
                                <input
                                    type="text"
                                    value={joinRoomCode}
                                    onChange={handleJoinCodeInput}
                                    className="w-full my-1 p-2 text-md font-semibold tracking-wide text-center bg-gray-100 rounded-lg outline-0 border-1 border-gray-300 font-poppins ring-2 ring-transparent hover:ring-blue-200"
                                    required
                                />
                            </div>
                            <div className="w-full lg:w-[70%] mx-auto flex flex-col justify-start items-start mt-2 gap-0">
                                <label className="text-sm text-gray-700 font-work font-semibold">Nickname</label>
                                <input
                                    type="text"
                                    value={joinNickName}
                                    onChange={handleJoinNickNameInput}
                                    className="w-full my-1 p-2 text-md font-semibold tracking-wide text-center bg-gray-100 rounded-lg outline-0 border-1 border-gray-300 font-poppins ring-2 ring-transparent hover:ring-blue-200"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleJoinRoom}
                            className="p-2 px-3 my-3 text-white shadow-md cursor-pointer bg-blue-500 text-md font-rubik rounded-lg font-semibold hover:bg-blue-600"
                        >
                            Join Room
                        </button>
                    </article>

                    {/* Create Room Card */}
                    <article className="p-6 border-4 border-blue-100 w-full rounded-xl flex flex-col justify-start items-center bg-white">
                        <div className="flex mb-1 gap-3 justify-center items-center">
                            <PiPlusCircleFill size="1.6rem"/>
                            <h3 className="text-center text-2xl text-gray-800 font-poppins font-semibold uppercase">
                                Create Room
                            </h3>
                        </div>
                        <p className="text-center text-lg text-gray-700 font-work font-medium">
                            Host a new game! Generate a unique room code to share with players.
                        </p>

                        <div className="my-2 w-full">
                            <div className="w-full lg:w-[70%] mx-auto flex flex-col justify-start items-start mt-2 gap-0">
                                <label className="text-sm text-gray-700 font-work font-semibold">Nickname</label>
                                <input
                                    type="text"
                                    value={createNickName}
                                    onChange={handleCreateNickNameInput}
                                    className="w-full my-1 p-2 text-md font-semibold tracking-wide text-center bg-gray-100 rounded-lg outline-0 border-1 border-gray-300 font-poppins ring-2 ring-transparent hover:ring-blue-200"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleCreateRoom}
                            className="mt-2 p-2 px-3 rounded-lg bg-black text-white text-md font-rubik font-semibold tracking-wide shadow-md cursor-pointer hover:bg-gray-700 border-2 border-transparent hover:border-black hover:text-yellow-400 transition-all duration-100 ease-in-out"
                        >
                            Create New Room
                        </button>
                    </article>
                </section>
            </main>

            {/* Toast Notifications */}
            <div className="fixed bottom-4 right-4 flex flex-col gap-2">
                {toasts.map((toast, index) => (
                    <ToastNotify key={index} type={toast.type} message={toast.message} />
                ))}
            </div>
        </div>
    );
}

export default HomeScreen;