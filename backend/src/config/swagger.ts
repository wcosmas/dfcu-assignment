import { Options } from 'swagger-jsdoc';
import { env } from './env';
import path from 'path';

const swaggerOptions: Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'dfcu Bank Payment Gateway API',
            version: '1.0.0',
            description: 'API documentation for dfcu Bank Payment Gateway',
            contact: {
                name: 'API Support',
            },
        },
        servers: [
            {
                url: `http://localhost:${env.port}`,
                description: 'Development Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                LoginRequest: {
                    type: 'object',
                    required: ['username', 'password'],
                    properties: {
                        username: {
                            type: 'string',
                            example: 'john_doe'
                        },
                        password: {
                            type: 'string',
                            example: 'secure_password'
                        }
                    }
                },
                LoginResponse: {
                    type: 'object',
                    properties: {
                        userId: {
                            type: 'string',
                            example: '123e4567-e89b-12d3-a456-426614174000'
                        },
                        username: {
                            type: 'string',
                            example: 'john_doe'
                        },
                        accessToken: {
                            type: 'string',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                        },
                        refreshToken: {
                            type: 'string',
                            example: '123e4567-e89b-12d3-a456-426614174000'
                        },
                        accessTokenExpiresIn: {
                            type: 'number',
                            example: 900
                        }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        paths: {
            '/api/auth/login': {
                post: {
                    tags: ['Authentication'],
                    summary: 'User login',
                    description: 'Authenticates a user and returns access & refresh tokens',
                    operationId: 'login',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/LoginRequest'
                                }
                            }
                        }
                    },
                    responses: {
                        '200': {
                            description: 'Successful login',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/LoginResponse'
                                    }
                                }
                            }
                        },
                        '401': {
                            description: 'Unauthorized - Invalid credentials'
                        },
                        '500': {
                            description: 'Server error'
                        }
                    }
                }
            }
        }
    },
    apis: [
        path.join(__dirname, '../docs/**/*.ts'),
        path.join(__dirname, '../routes/**/*.ts'),
        path.join(__dirname, '../controllers/**/*.ts')
    ],
};

export default swaggerOptions; 