import React from 'react';
import './App.css';
import {ApiDoc} from "./components/APIDoc/ApiDoc";
import RbacOpenApi from './resources/api/rbac/openapi_v1.json';
import {OpenAPIV3} from "openapi-types";

function App() {
  return (
    <div className="App">
      <ApiDoc
          openapi={RbacOpenApi as OpenAPIV3.Document}
      />
    </div>
  );
}

export default App;
