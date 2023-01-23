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
        path: Array<string>;
    }
} & T;

export const deRef = <T extends Referenceable>(refOrObject: OpenAPIV3.ReferenceObject | T, base: OpenAPIV3.Document): DeRefResponse<T> => {
    if ('$ref' in refOrObject) {
        // Theorically a callable object could also have '$ref', but it's expecting urls.
        return deRefTransverse(refOrObject.$ref as string, base);
    }

    return refOrObject;
};

const deRefTransverse = <T extends Referenceable>(reference: string, base: OpenAPIV3.Document): DeRefResponse<T> => {
    let current: object = {};

    const path = reference.split('/');
    for (const step of path) {
        // Assume we don't refer documents outside - i.e. it starts with '#'
        if (step === '#') {
            current = base;
            continue;
        }

        if (step in current) {
            current = (current as StringMap)[step];
        } else {
            throw new Error(`Path not found for ref ${reference}`);
        }
    }

    return {
        deRefData: {
            name: path.at(-1)!,
            path: path
        },
        ...current as T
    };
}
