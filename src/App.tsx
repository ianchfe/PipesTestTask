import PipesScene from "./components/PipesScene.tsx";
import MenuPanel from "./components/MenuPanel.tsx";

const App = () => {

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
            <MenuPanel/>
            <div style={{ width: '100%', height: '100%'}}>
                <PipesScene/>
            </div>

        </div>
    );
}

export default App
