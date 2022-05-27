import { Link } from "react-router-dom"


const PackageList = ({ packages, setPackages }) => {
  return <>
      <button onClick={() => setPackages([])}>Upload a new Poetry file</button>
      <h2>Package listing</h2>
      <ul>
        {packages.map((pkg, i) =>
          <li key={i}>
            <Link to={"/" + pkg.name}>{pkg.name}</Link>
          </li>
        )}
      </ul>
    </>
}


export default PackageList