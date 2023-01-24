import React from 'react';
import {OpenAPIV3} from "openapi-types";
import {Text, TextContent, TextList, TextListItem, TextVariants} from "@patternfly/react-core";

export interface ServerListProps {
    servers: Array<OpenAPIV3.ServerObject>;
}

export const ServerList: React.FunctionComponent<ServerListProps> = ({servers}) =>
    <TextContent>
        <Text component={TextVariants.p}>Base URLs:</Text>
        <TextList>
            {servers.map((s, index) => <TextListItem key={index}>
                {s.url}
            </TextListItem>)}
        </TextList>
    </TextContent>;
