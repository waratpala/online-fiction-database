import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Registpage from './components/Regist';
import Headernavbar from './components/Header';
import CollapsibleExample from './components/Header';
import Novel from './components/Novel';
import ManageNovel from './components/ManageNovel';
import Novelcontent from './components/NovelContent';
import Noveldetail from './components/NovelDetail';
import Editnovel from './components/Edit';
import Homepage from './components/Home';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/Register" element={<Registpage />} />
          <Route path="/createnovel" element={<ManageNovel />} />
          <Route path="/naveldetail/:fictionid" element={<Noveldetail />} />
          <Route path="/novelcontent/:fictionid" element={<Novelcontent />} />
          <Route path="/naveledit" element={<Editnovel />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
