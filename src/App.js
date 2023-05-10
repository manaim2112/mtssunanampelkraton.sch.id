// import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet
} from "react-router-dom";
import { IndexHome } from './pages';
import { IndexBerita } from './pages/berita';
import { IdBerita } from './pages/berita/_id';
import { IndexHomes } from './pages/home';
import { CBTIndex } from './pages/cbt';
import { IndexDashboard } from './pages/dashboard';
import { HomeDashboard } from './pages/dashboard/home';
import { IndexMateriDashboard } from './pages/dashboard/materi';
import { IndexPenugasanDashboard } from './pages/dashboard/penugasan';
import { IndexCBTDashboard } from './pages/dashboard/cbt';
import { IdMateriDashboard } from './pages/dashboard/materi/_id';
import { IdCBTDashboard } from './pages/dashboard/cbt/_id';
import { UploadWordCBTDashboard } from './pages/dashboard/cbt/uploadviaword';
import { IndexUsersDashboard } from './pages/dashboard/users';
import { IndexGuruDashboard } from './pages/dashboard/guru';
import { IndexLoginUser } from './pages/authorize/login_user';
import { IndexLoginAdmin } from './pages/authorize/login_guru';
import { HomeCBT } from './pages/cbt/home';
import { IndexUser } from './pages/user';
import { IndexUserWithNisn } from './pages/user/_nisn';
import { Install } from './pages/instalation';
import { StartCBT } from './pages/cbt/start';
import { FinishCBT } from './pages/cbt/finish';
import { ResultCBT } from './pages/dashboard/cbt/result';
import { ViewResultCBT } from './pages/dashboard/cbt/view';


function App() {

  
  return (
    <div className="font-sans">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}

      <Outlet/>
      <Router>
        <div>        
          <Routes>
            <Route path='/install' element={<Install/>}>
              </Route>
          <Route path="/" element={<IndexHome />}>
            <Route path="" element={<IndexHomes/>}/>
            <Route path="berita" element={<IndexBerita/>}/>
            <Route path="berita/:id" element={<IdBerita/>}/>
          </Route>
          <Route path='/cbt' element={<CBTIndex/>}>
            <Route path='' element={<HomeCBT/>}/>
            <Route path='start/:start' element={<StartCBT/>}/>
            <Route path='finish/:start' element={<FinishCBT/>}/>
          </Route>

          <Route path='/user' element={<IndexUser/>}>
            <Route path=':nisn' element={<IndexUserWithNisn/>}/>
          </Route>

          <Route path="/auth/login_user" element={<IndexLoginUser/>}/>
          <Route path='/auth/login_admin' element={<IndexLoginAdmin/>}/>

          <Route path='/dashboard' element={<IndexDashboard/>}>
            <Route path='' element={<HomeDashboard/>}/>
            <Route path='materi' element={<IndexMateriDashboard/>}></Route>
            <Route path='materi/id/:id' element={<IdMateriDashboard/>}/>
            <Route path='penugasan' element={<IndexPenugasanDashboard/>}/>
            <Route path='cbt' element={<IndexCBTDashboard/>}/>

            <Route path='cbt/id/:id' element={<IdCBTDashboard/>}/>
            <Route path='cbt/id/:id/result' element={<ResultCBT/>}/>
            <Route path='cbt/id/:id/result/:userid/view' element={<ViewResultCBT/>}/>

            <Route path='cbt/id/:id/upload' element={<UploadWordCBTDashboard/>}/>

            <Route path='users' element={<IndexUsersDashboard/>}/>
            <Route path='guru' element={<IndexGuruDashboard/>}/>
          </Route>
          </Routes>
        </div>
      </Router>
    </div>
  );

}

export default App;
