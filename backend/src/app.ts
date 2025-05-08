import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import routes from './routes';
import { errorMiddleware } from './middlewares/error.middleware';
import { loggerMiddleware } from './middlewares/logger.middleware';
import swaggerOptions from './config/swagger';
import { env } from './config/env';

class App {
    public app: Application;
    public port: string | number;

    constructor() {
        this.app = express();
        this.port = env.port;

        this.initializeMiddlewares();
        this.initializeSwagger();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    private initializeMiddlewares() {
        // Configure Helmet with CSP that allows Swagger UI to work
        this.app.use(helmet({
            contentSecurityPolicy: false // Disable CSP for development
        }));

        this.app.use(cors({
            origin: env.corsOrigin,
            credentials: true,
        }));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(loggerMiddleware);

        // Apply rate limiting
        const limiter = rateLimit({
            windowMs: env.rateLimitWindowMs, // Default: 1 minute
            max: env.rateLimitMax, // Default: 100 requests per windowMs
            standardHeaders: true,
            legacyHeaders: false,
        });
        this.app.use(limiter);
    }

    private initializeRoutes() {
        this.app.use('/api', routes);

        // Health check endpoint
        this.app.get('/health', (_req: Request, res: Response) => {
            res.status(200).json({ status: 'UP' });
        });

        // Root endpoint with API info
        this.app.get('/', (_req: Request, res: Response) => {
            res.status(200).json({
                name: 'dfcu Bank Payment Gateway API',
                version: '1.0.0',
                description: 'API for processing secure financial transactions',
            });
        });
    }

    private initializeSwagger() {
        const specs = swaggerJSDoc(swaggerOptions);

        // Serve Swagger JSON
        this.app.get('/api-docs.json', (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(specs);
        });

        // Serve Swagger UI
        this.app.use('/api-docs', swaggerUi.serve);
        this.app.get('/api-docs', swaggerUi.setup(specs, {
            explorer: true,
            customCss: '.swagger-ui .topbar { display: none }',
            swaggerOptions: {
                url: '/api-docs.json',
                docExpansion: 'none',
                persistAuthorization: true,
            }
        }));
    }

    private initializeErrorHandling() {
        // Handle 404 - This must come after all other routes
        this.app.use((_req: Request, res: Response) => {
            res.status(404).json({ message: 'Resource not found' });
        });

        // Handle other errors
        this.app.use(errorMiddleware);
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`🚀 Server running on port ${this.port}`);
            console.log(`📚 API Documentation: http://localhost:${this.port}/api-docs`);
        });
    }
}

export default App; 