import { PiYinYangFill } from "react-icons/pi";
import './App.css'

function App() {

  return (
    <>
      <div className="body">
        <a href="https://www.keytomarvel.com" target="_blank">
          <PiYinYangFill size={81} color="orange" className="mr-2" />
        </a>
      </div>
      <h1>WhereQ --- Key To Marvel</h1>
      <div className="text-orange-400 bg-gray-900 p-4 font-[Open_Sans]">
        <p>
          <span className="font-bold text-orange-400">WhereQ - Keycloak</span> aims to stay up-to-date with the latest Keycloak releases,
          while offering integration with additional <span className="font-bold text-orange-400">Social Identity Providers</span> not included in the default Keycloak distribution, such as
          <span className="font-bold text-orange-400"> Apple</span> and <span className="font-bold text-orange-400">WeChat</span>. Additionally, WhereQ is developing support for
          <span className="font-bold text-orange-400"> multi-tenancy</span> and providing <span className="font-bold text-orange-400">customizable themes</span> tailored to specific client needs,
          ensuring flexibility and scalability for a wide range of identity management requirements.
        </p>
      </div>
    </>
  )
}

export default App
