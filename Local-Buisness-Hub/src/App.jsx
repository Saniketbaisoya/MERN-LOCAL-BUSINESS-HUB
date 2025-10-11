import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/signIn'
import SignUp from './pages/signUp'
import Profile from './pages/Profile'
import About from './pages/About'
import Header from './components/header'
import PrivateRoute from './components/PrivateRoute'
import Create_Listing from './pages/Create_Listing'
import UpdateList from './pages/UpdateList'
export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signIn' element={<SignIn />}/>
        <Route path='signUp' element={<SignUp />}/>
        {/* 
        * Now PrivateRoute mai hmne do route define kiye hue hai i.e -> Profile and createList 
        * mtlb yeah dono route Private route ke childrean hogye
        */}
        <Route  element={<PrivateRoute />}>
        <Route path='profile' element={<Profile />}/>
        <Route path='/createlist' element={<Create_Listing />}/>
        <Route path='/update-list/:listingId' element={<UpdateList />}/>
        </Route>
        <Route path='about' element={<About />}/>
      </Routes>
    </BrowserRouter>
  )
}

