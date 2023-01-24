/**
 * Set of OpenAPI tools to work with the OpenAPI
 */
import { OpenAPIV3 } from "openapi-types";

type Referenceable = OpenAPIV3.SchemaObject | OpenAPIV3.ResponseObject | OpenAPIV3.ParameterObject
    | OpenAPIV3.ExampleObject | OpenAPIV3.RequestBodyObject | OpenAPIV3.HeaderObject
    | OpenAPIV3.SecuritySchemeObject | OpenAPIV3.LinkObject | OpenAPIV3.CallbackObject;

type StringMap = {
    [key: string]: object;
}

type DeRefResponse<T> = {
    deRefData?: {
        name: string;
        path: string;
    }
} & T;

const isAReference = <T extends Referenceable>(refOrObject: OpenAPIV3.ReferenceObject | T): refOrObject is OpenAPIV3.ReferenceObject => {
    // Editor might complain because of:
    // Redundant 'typeof' check: '$ref' always has type 'string'
    // This is wrong, as CallbackObject might also have $ref as a PathItemObject
    return '$ref' in refOrObject && typeof refOrObject.$ref === 'string';
}

export const deRef = <T extends Referenceable>(refOrObject: OpenAPIV3.ReferenceObject | T, base: OpenAPIV3.Document): DeRefResponse<T> => {
    if (isAReference(refOrObject)) {
        return deRefTransverse(refOrObject.$ref, base);
    }

    return refOrObject;
};

const deRefTransverse = <T extends Referenceable>(reference: string, base: OpenAPIV3.Document): DeRefResponse<T> => {
    let current: object = {};

    const path = reference.split('/');

    const startAt = path.shift();
    if (startAt === '#') {
        // Assume we don't refer documents outside - i.e. it starts with '#'
        current = base;
    } else {
        throw new Error(`External reference found: ${reference}`);
    }

    for (const step of path) {
        if (step in current) {
            current = (current as StringMap)[step];
        } else {
            throw new Error(`Path not found for ref ${reference}`);
        }
    }

    return {
        deRefData: {
            name: path.at(-1)!,
            path: reference
        },
        ...current as T
    };
}
