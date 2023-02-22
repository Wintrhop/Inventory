"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerDoc = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerUi = __importStar(require("swagger-ui-express"));
const options = {
    definition: {
        openapi: '1.0.0',
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
    apis: ['./example/routes*.js', './example/parameters.yaml'],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
function swaggerDoc(app) {
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec)),
        console.log(`swagger running on port`);
}
exports.swaggerDoc = swaggerDoc;
