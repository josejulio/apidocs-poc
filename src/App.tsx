import React from 'react';
import './App.css';
import {ApiDoc} from "./components/APIDoc/ApiDoc";
import RbacOpenApi from './resources/api/rbac/openapi_v1.json';
import SystemBaselineApi from './resources/api/system-baseline/openapi_v1.json';
import {OpenAPIV3} from "openapi-types";
import '@patternfly/patternfly/patternfly.css';
import '@patternfly/patternfly/patternfly-addons.css';
import {Nav, NavItem, NavList, Page, PageSection, PageSidebar} from "@patternfly/react-core";

type NavigationAPI = {
    displayName: string;
    api: OpenAPIV3.Document;
}

const navigation: Array<NavigationAPI> = [
    {
        displayName: 'RBAC',
        api: RbacOpenApi as OpenAPIV3.Document
    },
    {
        displayName: 'System - Baseline',
        api: SystemBaselineApi as OpenAPIV3.Document
    }
];

const App = () => {

    const [selectedApi, setSelectedApi] = React.useState(SystemBaselineApi as OpenAPIV3.Document);
    const Sidebar = <PageSidebar nav={
        <Nav>
            <NavList>
                {navigation.map(n => (
                    <NavItem
                        preventDefault
                        id={n.displayName}
                        key={n.displayName}
                        isActive={ selectedApi === n.api }
                        onClick={() => setSelectedApi(n.api)}
                    >{n.displayName}</NavItem>
                ))}
            </NavList>
        </Nav>
    } isNavOpen/>;

    return <Page sidebar={Sidebar}>
        <PageSection>
            <ApiDoc openapi={selectedApi} />
        </PageSection>
    </Page>;
}

export default App;
