// import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet
} from "react-router-dom";
import { lazy } from 'react';
import { Suspense } from 'react';

const IndexHome = lazy(() => import("./pages"))
const IndexBerita = lazy(() => import("./pages/berita"))
const IdBerita = lazy(() => import("./pages/berita/_id"))
const IndexHomes = lazy(() => import("./pages/home"))
const CBTIndex = lazy(() => import("./pages/cbt"))
const IndexDashboard = lazy(() => import("./pages/dashboard"))
const HomeDashboard = lazy(() => import("./pages/dashboard/home"))
const IndexMateriDashboard = lazy(() => import("./pages/dashboard/materi"))
const IndexPenugasanDashboard = lazy(() => import("./pages/dashboard/penugasan"))
const IndexCBTDashboard = lazy(() => import("./pages/dashboard/cbt"))
const IdMateriDashboard = lazy(() => import("./pages/dashboard/materi/_id"))
const IdCBTDashboard = lazy(() => import("./pages/dashboard/cbt/_id"))
const UploadWordCBTDashboard = lazy(() => import("./pages/dashboard/cbt/uploadviaword"))
const IndexUsersDashboard = lazy(() => import("./pages/dashboard/users"))
const IndexGuruDashboard = lazy(() => import("./pages/dashboard/guru"))
const IndexLoginUser = lazy(() => import("./pages/authorize/login_user"))
const IndexLoginAdmin = lazy(() => import("./pages/authorize/login_guru"))
const HomeCBT = lazy(() => import("./pages/cbt/home"))
const IndexUser = lazy(() => import("./pages/user"))
const IndexUserWithNisn = lazy(() => import("./pages/user/_nisn"))
const Install = lazy(() => import("./pages/instalation"))
const StartCBT = lazy(() => import("./pages/cbt/start"))
const FinishCBT = lazy(() => import("./pages/cbt/finish"))
const ResultCBT = lazy(() => import("./pages/dashboard/cbt/result"))
const ViewResultCBT = lazy(() => import("./pages/dashboard/cbt/view"))
const HomeKegiatanDashboard = lazy(() => import("./pages/dashboard/kegiatan/home"))
const EditKegiatanDashboard = lazy(() => import("./pages/dashboard/kegiatan/_id"))
const CreateNewKegiatanDashboard = lazy(() => import("./pages/dashboard/kegiatan/create"))
const ExportNilai = lazy(() => import("../src/pages/dashboard/cbt/export_nilai"))

function App() {

  
  return (
    <Suspense fallback={"Tunggu Sebentart"}>
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
            <Route path='cbt/export_nilai' element={<ExportNilai/>}/>
            <Route path='cbt/id/:id' element={<IdCBTDashboard/>}/>
            <Route path='cbt/id/:id/result' element={<ResultCBT/>}/>
            <Route path='cbt/id/:id/result/:userid/view' element={<ViewResultCBT/>}/>

            <Route path='cbt/id/:id/upload' element={<UploadWordCBTDashboard/>}/>

            <Route path='users' element={<IndexUsersDashboard/>}/>
            <Route path='guru' element={<IndexGuruDashboard/>}/>

            <Route path='kegiatan' element={<HomeKegiatanDashboard/>}/>
            <Route path='kegiatan/create' element={<CreateNewKegiatanDashboard/>}/>
            <Route path='kegiatan/id/:id' element={<EditKegiatanDashboard/>}/>
          </Route>
          </Routes>
        </div>
      </Router>
    </div>
    </Suspense>
  );

}

export default App;
