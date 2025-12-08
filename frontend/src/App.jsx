import React from 'react'
import Home from './components/homepage/Home'
import Regestration from './components/Registration/Regestration.jsx'
import {Route, Routes, Navigate} from 'react-router-dom'
import SignUp from './components/Registration/SignUp.jsx'
import ComplaintRegistration from './components/Complaint/ComplaintRegistration.jsx'
import Profile from './components/Profile/Profile.jsx'
import AdminPanel from './components/Admin/AdminPanel.jsx'


const App = () => {
  const ResolveSteps=[
    {
      color:"#FF9013",
      heading:"Report",
      Content:"Snap a photo, add location, describe the issue. Our smart system routes it to the right department automatically",
      pic:"https://www.macobserver.com/wp-content/uploads/2021/01/Woman-using-iMessage-on-iPhone-X.jpeg"
    },
    {
      color:"#0046FF",
      heading:"Track",
      Content:"Get real-time updates as your issue moves through the system. See exactly who's working on it and when.",
      pic:"https://img.freepik.com/premium-photo/gps-tracking-map-location-pins-position-technology-background-ai-generated-image_210643-11319.jpg"
    },
    {
      color:"#08CB00",
      heading:"Resolve",
      Content:"Watch your community improve with before/after photos and join neighbors celebrating successful resolutions.",
      pic:"https://tse3.mm.bing.net/th/id/OIP.hopvQT8wv-UFp-1BQqbizgHaEK?pid=Api&P=0&h=180"
    }
  ]


  const issue=[
    {icon:"ri-building-4-line",
      icontext:"blue",
      heading:"Infrastructure",
      content:"Potholes, broken sidewalks, damaged roads",
      case:"2,847"
    },
    {icon:"ri-shield-check-line",
      icontext:"green",
      heading:"Safety",
      content:"Broken streetlights, unsafe crossings",
      case:"1,923"
    },
    {icon:"ri-heart-3-line",
      icontext:"green",
      heading:"Environment",
      content:"Illegal dumping, park maintenance",
      case:"3,156"
    },
    {icon:"ri-train-line",
      icontext:"orange",
      heading:"Transportation",
      content:"Traffic signals, parking issues",
      case:"2,321"
    }
  ]
  return (
    <div>
      
      <Routes>
        <Route path='/' element={<Navigate to='/home' replace />} />
        <Route path='/home' element={<Home ResolveSteps={ResolveSteps} issue={issue} />} />
        <Route path='/SignIn' element={<Regestration/>} />
        <Route path='/SignUp' element={<SignUp/>}/>
        <Route path='/RegisterProblem' element={<ComplaintRegistration/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/admin' element={<AdminPanel/>}/>
      </Routes>
      
    </div>
  )
}

export default App