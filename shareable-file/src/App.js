import Writer from "./components/writer";
import { BrowserRouter,Route,Navigate,Routes } from "react-router-dom";
import {v4 as uuid} from "uuid"
function App() {
  return (
    <BrowserRouter>
    <Routes>
    {/* <div className="App"> */}
    <Route path='/' element={<Navigate replace to={`/docs/${uuid()}`}/>} />
    <Route path="/docs/:id" element={<Writer />} />
    {/* <Route path="*" element={<PageNotFound />} /> */}
    {/* </div> */}
    </Routes>
    </BrowserRouter>
  );
}

export default App;
