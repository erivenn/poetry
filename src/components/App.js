import { createContext, useState } from "react"
import { Routes, Route } from "react-router-dom"
import Home from "./Home"
import Package from "./Package"


export const PackageContext = createContext({
  packages: [],
  setPackages: () => {}
})


const App = () => {

  const [packages, setPackages] = useState([])
  const value = {packages, setPackages}

  return <>
    <PackageContext.Provider value={value}>
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route path="/:packageName" element={<Package/>}/>
      </Routes>
    </PackageContext.Provider>
  </>
}


export default App
