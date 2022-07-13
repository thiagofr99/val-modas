import React from 'react';
import {ToastContainer} from 'react-toastify'

import './global.css';

import Routes from './routes'

export default function App() {
  return (
    <div>
      <Routes/>
      <ToastContainer
      theme="colored"
      />
    </div>
  );
}