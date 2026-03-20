import { Providers } from "./providers";
import { AppRouter } from "./routes";
import "../index.css";

function App() {
    return (
        <Providers>
            <AppRouter />
        </Providers>
    );
}

export default App;
