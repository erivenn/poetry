import { useContext } from "react"
import { PackageContext } from "./App"
import { isFileValid, readFileContent, parsePoetryFile } from "../util"
import PackageList from "./PackageList"


const Home = () => {

  const { packages, setPackages } = useContext(PackageContext)

  const onFileChange = async file => {

    if (isFileValid(file)) {
      const text = await readFileContent(file)
      const packages = parsePoetryFile(text)
      setPackages(packages)
      return
    }

    alert("Bad file!")
  }

  if (packages.length > 0) {
    return <PackageList packages={packages} setPackages={setPackages}/>
  }

  return <>
    <h2>Upload a Poetry file</h2>
    <input type="file" onChange={e => onFileChange(e.target.files[0])}/>
  </>
}


export default Home