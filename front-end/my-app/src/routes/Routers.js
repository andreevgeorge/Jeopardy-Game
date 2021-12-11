import React from "react";
import { Routes, Route } from 'react-router-dom';
import SignIn from "../components/SignIn/SignIn";
import SignUp from "../components/SignUp/SignUp";
import GameTable from '../components/GameTable/GameTable'

const Routers = () => {
  //Check if user isAuth
  const isAuth = false;

  //Component
  return (
    <Routes>
      <Route path="/" element={isAuth ? null : <SignUp />} />
      <Route path="/auth/signup" element={ <SignUp /> } />
      <Route path="/auth/signin" element={ <SignIn /> }/>
      <Route path="/auth/out" /* element={ Fetch-запрос на сервер } */ />
      <Route path="/profile" /* element={ <Profile /> } */ />
      <Route path="/game/:id"  element={ <GameTable /> }  />
      {/* <Route path="/game/new"  element={ <GameTable /> } /> */}
    </Routes>
  );
};

export default Routers;
