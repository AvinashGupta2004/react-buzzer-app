import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './views/HomeScreen.jsx'
import JoinGameScreen from './views/JoinGameScreen.jsx'
import {SocketProvider} from "./views/SocketProvider.jsx";
import HostScreen from "./views/HostScreen.jsx";
function App(){
    return (
        <SocketProvider>
            <Router>
                <Routes>
                    <Route path = "/" element = {<HomeScreen />} key={`homeScreen`}/>
                    <Route path = "/join/:roomCode" element = {<JoinGameScreen />} key={`joinGameScreen`}/>
                    <Route path = "/host/:roomCode" element = {<HostScreen />} key={`hostScreen`} />
                </Routes>
            </Router>
        </SocketProvider>
    )
}

export default App;