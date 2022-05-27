export const isFileValid = file => {
  if (typeof file === "undefined") return false
  if (file.name !== "poetry.lock") return false
  return true
}


export const readFileContent = file => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = async e => resolve(e.target.result)
  reader.onerror = async e => reject(e)
  reader.readAsText(file)
})


const DEFAULT_SELECTED_FIELDS = ["name", "description"]


const Mode = {
  None: "NONE",
  Package: "PACKAGE",
  Dependencies: "DEPENDENCIES",
  Extras: "EXTRAS",
}


export const parsePoetryFile = (text, selectedFields) => {

  let result = []
  const lines = text.split(/\r?\n/g)

  if (!Array.isArray(selectedFields))
    selectedFields = DEFAULT_SELECTED_FIELDS

  let pkg = null
  let mode = Mode.None

  for (const line of lines) {

    if (line.length > 0) switch (mode) {

      case Mode.Package: {
        const [field, value] = line.split(" = ")
        if (selectedFields.includes(field))
          pkg[field] = unquote(value)
        break
      }

      case Mode.Dependencies: {
        const i = line.indexOf(" = ")
        const [name, info] = [line.slice(0,i), line.slice(i + 3)]
        const dep = parseDependencyInfo(name, info)
        if (dep.optional) pkg.optionalDependencies.push(dep)
        else pkg.dependencies.push(dep)
        break
      }

      case Mode.Extras: {
        const [_, value] = line.split(" = ")
        const list = JSON.parse(value)
        const extras = list.map(dep => ({
          name: dep.split(" ")[0].split("[")[0],
          optional: true
        }))
        // Only add extra dependencies to optional dependencies if they don't exist there yet
        for (const extra of extras) {
          const existing = pkg.optionalDependencies.find(x => x.name === extra.name)
          if (!existing) {
            pkg.optionalDependencies.push(extra)
          }
        }
        break
      }

      default:
        break

    }

    switch (line) {

      case "[[package]]":
        mode = Mode.Package
        if (pkg) result.push(pkg)
        pkg = {dependencies: [], optionalDependencies: [], reverseDependencies: []}
        break

      case "[package.dependencies]":
        mode = Mode.Dependencies
        break

      case "[package.extras]":
        mode = Mode.Extras
        break

      default:
        if (line.length === 0)
          mode = Mode.None
        break

    }

  }

  if (pkg)
    result.push(pkg)

  // Figure out if the optional dependency is installed or not
  for (const pkg of result) {
    for (const dep of pkg.optionalDependencies) {
      const installed = result.find(x => x.name === dep.name)
      if (installed) dep.installed = true
      else dep.installed = false
    }
  }

  // Reverse dependencies
  for (const pkg of result) {
    for (const dependency of pkg.dependencies) {
      const name = dependency.name
      const depPkg = result.find(x => x.name === name)
      if (depPkg) depPkg.reverseDependencies.push(pkg)
    }
  }

  // Sort the packages, dependencies and optional dependencies
  result = result.sort(sortByName)
  for (const pkg of result) {
    pkg.dependencies = pkg.dependencies.sort(sortByName)
    pkg.optionalDependencies = pkg.optionalDependencies.sort(sortByName)
  }

  return result
}


const parseDependencyInfo = (name, info) => {
  const result = { name, optional: false }
  if (info.includes(" = ")) {
    const version = info.replace(/(\w+)\s=\s/g, '"$1": ')
    result.optional = JSON.parse(version).optional ?? false
  }
  return result
}


const unquote = text => text.replaceAll("\"", "")
const sortByName = (x, y) => x.name < y.name ? -1 : x.name > y.name ? 1 : 0
