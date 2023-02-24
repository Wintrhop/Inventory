import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';

const routesApi = path.join(__dirname,"./api/**/*.routes")
const options:swaggerJSDoc.OAS3Options={
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Inventory Rcm',
            description: 'Iventory management',
            version: '1.0.0',
        },
        servers: [
            { url: '/api/v1', description: 'API version 1 URL' },
            { url: '/api/v2', description: 'API version 2 URL' },
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            format: 'int64',
                        },
                        username: {
                            type: 'string',
                        },
                    },
                },
            },
        },
        tags: [
            {
                name: 'my tag',
                description: 'tag description',
            },
        ],
        externalDocs: {
            url: 'https://example.com',
            description: 'API external documentation',
        },
    },
    apis: [routesApi],
};

const swaggerSpec = swaggerJSDoc(options);

export function swaggerDoc(app:any) {
app.use("/docs",swaggerUi.serve, swaggerUi.setup(swaggerSpec)),
console.log(`swagger running on port` )
    
}

