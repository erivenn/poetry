import { useContext } from "react"
import { Link, useParams, Navigate } from "react-router-dom"
import { PackageContext } from "./App"


const Package = () => {

  const { packageName } = useParams()
  const { packages } = useContext(PackageContext)
  const pkg = packages.find(x => x.name === packageName)

  if (!pkg) {
    return <Navigate to="/"/>
  }

  return <>

    <p>
      <Link to="/">&lt;&lt; Back to package listing</Link>
    </p>

    <fieldset>

      <legend>
        <b>Package Info</b>
      </legend>

      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <td>{pkg.name}</td>
          </tr>
          <tr>
            <th>Description</th>
            <td>{pkg.description}</td>
          </tr>
          <tr>
            <th>Dependencies</th>
            <td>
              {pkg.dependencies.length > 0
                ? <ul>{pkg.dependencies.map((dep, i) =>
                <li key={i}>
                  <Link to={"/" + dep.name}>{dep.name}</Link>
                </li>
                )}</ul>
                : "-"
              }
            </td>
          </tr>
          <tr>
            <th>Optional dependencies</th>
            <td>
              {pkg.optionalDependencies.length > 0
                ? <ul>{pkg.optionalDependencies.map((dep, i) =>
                <li key={i}>
                  {dep.installed ? <Link to={"/" + dep.name}>{dep.name}</Link> : dep.name}
                </li>
                )}</ul>
                : "-"
              }
            </td>
          </tr>
          <tr>
            <th>Reverse dependencies</th>
            <td>
              {pkg.reverseDependencies.length > 0
                ? <ul>{pkg.reverseDependencies.map((dep, i) =>
                <li key={i}>
                  <Link to={"/" + dep.name}>{dep.name}</Link>
                </li>
                )}</ul>
                : "-"
              }
            </td>
          </tr>
        </tbody>
      </table>

    </fieldset>

  </>
}

export default Package