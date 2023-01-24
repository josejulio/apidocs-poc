import React from 'react';
import './App.css';
import {ApiDoc} from "./components/APIDoc/ApiDoc";
import RbacOpenApi from './resources/api/rbac/openapi_v1.json';
import {OpenAPIV3} from "openapi-types";
import '@patternfly/patternfly/patternfly.css';
import {Split, SplitItem} from "@patternfly/react-core";

const App = () => {
    return <Split hasGutter>
        <SplitItem>
            { /* A menu could be here */}
        </SplitItem>
        <SplitItem>
            <ApiDoc openapi={RbacOpenApi as OpenAPIV3.Document} />
        </SplitItem>
    </Split>
}

export default App;
