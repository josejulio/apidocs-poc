import React from 'react';
import {OpenAPIV3} from "openapi-types";
import {SecurityScheme} from "./SecuritySchemes";
import {deRef} from "../../utils/Openapi";
import {Operation} from "./Operation";

interface ApiDocProps {
    openapi: OpenAPIV3.Document;
}

export const ApiDoc: React.FunctionComponent<ApiDocProps> = props => {
    const { openapi } = props;

    return <>
        <h1>{ openapi.info.title } v{ openapi.info.version}</h1>
        <div>{ openapi.info.description }</div>
        { openapi.servers && (
            <div>
                <span>Base URLs:</span>
                <ul>
                    { openapi.servers.map((s, index) => <React.Fragment key={index}>{s.url}</React.Fragment>)}
                </ul>
            </div>
        )}
        { openapi.components?.securitySchemes && (
            <div>
                <h1>Authentication</h1>
                <ul>
                    {Object.values(openapi.components.securitySchemes).map((scheme, index) => (
                        <SecurityScheme key={index} securityScheme={deRef(scheme, openapi)}/>
                    ))}
                </ul>
            </div>
        )}
        { Object.entries(openapi.paths).map(([path, pathObject]) => {
            return Object.entries(
                // Looks like openapi v3.1 supports components here as well
                pathObject as Record<OpenAPIV3.HttpMethods, OpenAPIV3.OperationObject>
            ).map(([verb, operation]) =>
                <Operation key={`${verb} ${path}`} verb={ verb } path={ path } operation={ operation } document={ openapi }/>
            );
        })}
    </>;
}
