import React from 'react';
import {OpenAPIV3} from "openapi-types";
import {deRef} from "../../utils/Openapi";

export interface OperationProps {
    verb: string;
    path: string;
    operation: OpenAPIV3.OperationObject;
    document: OpenAPIV3.Document;
}
export const Operation: React.FunctionComponent<OperationProps> = ({verb, path, operation, document}) => {
    const parameters = (operation.parameters || []).map(p => deRef(p, document));
    const responseMap = Object.entries(operation.responses);
    return <>
        <h1>{ operation.summary }</h1>
        <div>{verb} {path}</div>
        <div>{ operation.description }</div>
        { parameters.length > 0 && <>
            <h2>Parameters</h2>
            <table>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>In</td>
                        <td>Type</td>
                        <td>Required</td>
                        <td>Description</td>
                    </tr>
                </thead>
                <tbody>
                { parameters.map(p => (
                    <tr>
                        <td>{p.name}</td>
                        <td>{p.in}</td>
                        <td>{getType(p.schema, document)}</td>
                        <td>{p.required ? 'Yes' : 'No'}</td>
                        <td>{p.description}</td>
                    </tr>
                )) }
                </tbody>
            </table>
        </>}
        { responseMap.length > 0 && <>
            <h2>Responses</h2>
            <table>
                <thead>
                    <tr>
                        <td>Status</td>
                        <td>Description</td>
                        <td>Schema</td>
                    </tr>
                </thead>
                <tbody>
                    {responseMap.map(([code, response]) => {
                        const dResponse = deRef(response, document);
                        return <tr>
                            <td>{code}</td>
                            <td>{dResponse.description}</td>
                            <td>{dResponse.deRefData?.name ?? 'None'}</td>
                        </tr>;
                    })}
                </tbody>
            </table>
        </>}

    </>;
}

const getType = (schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined, document: OpenAPIV3.Document) => {
    if (schema === undefined) {
        return 'Unknown';
    }

    const dSchema = deRef(schema, document);

    if (dSchema.enum) {
        return dSchema.enum.join(' | ');
    }

    return dSchema.type;
}
