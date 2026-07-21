import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Netrak Backend API',
      version: '1.0.0',
      description:
        'Frontend-ready OpenAPI contract for Netrak. The gateway standardizes responses, documents auth, and exposes reusable schemas for every resource.',
    },
    servers: [
      {
        url: env.PUBLIC_API_URL ?? '/api',
        description: env.PUBLIC_API_URL ? 'Configured gateway' : 'Local development gateway',
      },
    ],
    tags: [
      { name: 'Health', description: 'Service status and availability endpoints' },
      { name: 'Auth', description: 'Authentication, registration, profile, and reserved recovery integration endpoints' },
      { name: 'Cases', description: 'Case lifecycle and evidence management endpoints' },
      { name: 'Notifications', description: 'Notification delivery and management endpoints' },
      { name: 'Threats', description: 'Deployment-configured advisory record endpoints' },
      { name: 'Storage', description: 'Signed object-storage upload targets' },
      { name: 'AI', description: 'AI capabilities (Speech, Vision, Threat, etc.)' },
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
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
            email: { type: 'string', format: 'email', example: 'citizen@netrak.local' },
            role: { type: 'string', enum: ['CITIZEN', 'OFFICER', 'ADMIN'], example: 'CITIZEN' },
            name: { type: 'string', nullable: true, example: 'Nishchal Kap' },
            phone: { type: 'string', nullable: true, example: '+919999999999' },
            district: { type: 'string', nullable: true, example: 'Mumbai' },
            createdAt: { type: 'string', format: 'date-time', example: '2026-07-10T10:00:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2026-07-10T10:00:00.000Z' },
          },
          required: ['id', 'email', 'role'],
        },
        LoginRequest: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email', example: 'citizen@netrak.local' },
            password: { type: 'string', minLength: 1, maxLength: 128, format: 'password', example: 'correct horse battery staple' },
          },
          required: ['email', 'password'],
        },
        RegisterRequest: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email', example: 'citizen@netrak.local' },
            password: { type: 'string', minLength: 12, maxLength: 128, format: 'password', example: 'correct horse battery staple' },
            role: { type: 'string', enum: ['CITIZEN', 'OFFICER', 'ADMIN'], default: 'CITIZEN', example: 'CITIZEN' },
          },
          required: ['email', 'password'],
        },
        ProfileUpdateRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', nullable: true, example: 'Nishchal Kap' },
            phone: { type: 'string', nullable: true, example: '+919999999999' },
            district: { type: 'string', nullable: true, example: 'Mumbai' },
          },
        },
        RefreshTokenRequest: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          },
          required: ['token'],
        },
        ForgotPasswordRequest: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email', example: 'citizen@netrak.local' },
          },
          required: ['email'],
        },
        Evidence: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: 'evidence-uuid-1234' },
            type: { type: 'string', enum: ['audio', 'image', 'video', 'document', 'chat', 'link', 'note'], example: 'image' },
            label: { type: 'string', example: 'Screenshot of threat call' },
            reference: { type: 'string', example: 'threat-screenshot.png' },
            notes: { type: 'string', nullable: true, example: 'Received at 3:15 PM' },
            caseId: { type: 'string', format: 'uuid', example: 'case-uuid-5678' },
            createdAt: { type: 'string', format: 'date-time', example: '2026-07-10T10:05:00.000Z' },
          },
          required: ['id', 'type', 'label', 'reference', 'caseId', 'createdAt'],
        },
        EvidenceCreateRequest: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['audio', 'image', 'video', 'document', 'chat', 'link', 'note'], example: 'image' },
            label: { type: 'string', minLength: 3, example: 'Screenshot of threat call' },
            reference: { type: 'string', minLength: 3, example: 'threat-screenshot.png' },
            notes: { type: 'string', example: 'Received at 3:15 PM' },
          },
          required: ['type', 'label', 'reference'],
        },
        CaseTimelineEvent: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: 'timeline-uuid-1234' },
            title: { type: 'string', example: 'Report created' },
            detail: { type: 'string', example: 'Citizen filed digital arrest complaint.' },
            caseId: { type: 'string', format: 'uuid', example: 'case-uuid-5678' },
            createdAt: { type: 'string', format: 'date-time', example: '2026-07-10T10:00:00.000Z' },
          },
          required: ['id', 'title', 'detail', 'caseId', 'createdAt'],
        },
        Case: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: 'case-uuid-5678' },
            title: { type: 'string', example: 'Suspected digital arrest call' },
            description: { type: 'string', example: 'Caller claimed to be from cyber police demanding a verification transfer.' },
            status: { type: 'string', enum: ['OPEN', 'IN_PROGRESS', 'ESCALATED', 'CLOSED'], example: 'OPEN' },
            category: { type: 'string', nullable: true, example: 'digital_arrest' },
            riskLevel: { type: 'string', nullable: true, example: 'high' },
            location: { type: 'string', nullable: true, example: 'Mumbai' },
            userId: { type: 'string', format: 'uuid', example: 'user-uuid-1234' },
            createdAt: { type: 'string', format: 'date-time', example: '2026-07-10T10:00:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2026-07-10T10:00:00.000Z' },
            evidence: { type: 'array', items: { $ref: '#/components/schemas/Evidence' } },
            timeline: { type: 'array', items: { $ref: '#/components/schemas/CaseTimelineEvent' } },
          },
          required: ['id', 'title', 'description', 'status', 'userId', 'createdAt', 'updatedAt'],
        },
        CaseCreateRequest: {
          type: 'object',
          properties: {
            title: { type: 'string', minLength: 3, example: 'Suspected digital arrest call' },
            description: { type: 'string', minLength: 10, example: 'Caller claimed to be from cyber police demanding a verification transfer.' },
            category: { type: 'string', enum: ['digital_arrest', 'upi_fraud', 'investment_scam', 'counterfeit_currency', 'loan_app', 'sim_swap', 'other'], example: 'digital_arrest' },
            riskLevel: { type: 'string', enum: ['low', 'medium', 'high', 'critical'], example: 'high' },
            location: { type: 'string', example: 'Mumbai' },
          },
          required: ['title', 'description'],
        },
        CaseUpdateRequest: {
          type: 'object',
          properties: {
            title: { type: 'string', minLength: 3, example: 'Updated report title' },
            description: { type: 'string', minLength: 10, example: 'Updated details for the cyber threat event.' },
            status: { type: 'string', enum: ['OPEN', 'IN_PROGRESS', 'CLOSED', 'ESCALATED'], example: 'IN_PROGRESS' },
          },
        },
        Notification: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: 'notification-uuid-1234' },
            message: { type: 'string', example: 'Your case has been updated.' },
            read: { type: 'boolean', example: false },
            userId: { type: 'string', format: 'uuid', example: 'user-uuid-1234' },
            createdAt: { type: 'string', format: 'date-time', example: '2026-07-10T10:00:00.000Z' },
          },
          required: ['id', 'message', 'read', 'userId', 'createdAt'],
        },
        NotificationCreateRequest: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Your case has been updated.' },
            userId: { type: 'string', format: 'uuid', example: 'user-uuid-1234' },
          },
          required: ['message', 'userId'],
        },
        Threat: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: 'threat-uuid-1234' },
            title: { type: 'string', example: 'Digital arrest video-call scripts' },
            category: { type: 'string', example: 'digital_arrest' },
            level: { type: 'string', example: 'critical' },
            region: { type: 'string', example: 'National' },
            summary: { type: 'string', example: 'Impersonators are using forged warrants and pressure.' },
            indicators: {
              type: 'array',
              items: { type: 'string' },
              example: ['Claims of CBI or customs case', 'Instruction to stay on video call'],
            },
            updatedAt: { type: 'string', format: 'date-time', example: '2026-07-10T10:00:00.000Z' },
            createdAt: { type: 'string', format: 'date-time', example: '2026-07-10T10:00:00.000Z' },
          },
          required: ['id', 'title', 'category', 'level', 'region', 'summary', 'indicators', 'updatedAt', 'createdAt'],
        },
        HealthStatus: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'UP' },
            timestamp: { type: 'string', format: 'date-time', example: '2026-07-10T10:00:00.000Z' },
          },
          required: ['status'],
        },
        ApiResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            message: { type: 'string', example: 'Operation completed successfully' },
            data: { nullable: true },
          },
          required: ['status', 'message', 'data'],
        },
        ApiError: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string', example: 'Unauthorized access' },
            requestId: { type: 'string', example: '01HZX7QY4C8J7H2M3N4P5R6S7T' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'email' },
                  message: { type: 'string', example: 'Invalid email format' },
                },
              },
              example: [],
            },
          },
          required: ['status', 'message', 'requestId'],
        },
        ValidationError: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string', example: 'Validation failed' },
            requestId: { type: 'string', example: '01HZX7QY4C8J7H2M3N4P5R6S7T' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'email' },
                  message: { type: 'string', example: 'Invalid email format' },
                },
              },
            },
          },
          required: ['status', 'message', 'errors', 'requestId'],
        },
        AuthTokenData: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            user: { $ref: '#/components/schemas/User' },
          },
          required: ['token', 'user'],
        },
        RefreshTokenData: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          },
          required: ['token'],
        },
        AuthTokenResponse: {
          allOf: [
            { $ref: '#/components/schemas/ApiResponse' },
            {
              type: 'object',
              properties: {
                data: { $ref: '#/components/schemas/AuthTokenData' },
              },
            },
          ],
        },
        RefreshTokenResponse: {
          allOf: [
            { $ref: '#/components/schemas/ApiResponse' },
            {
              type: 'object',
              properties: {
                data: { $ref: '#/components/schemas/RefreshTokenData' },
              },
            },
          ],
        },
        UserResponse: {
          allOf: [
            { $ref: '#/components/schemas/ApiResponse' },
            {
              type: 'object',
              properties: {
                data: { $ref: '#/components/schemas/User' },
              },
            },
          ],
        },
        CaseResponse: {
          allOf: [
            { $ref: '#/components/schemas/ApiResponse' },
            {
              type: 'object',
              properties: {
                data: { $ref: '#/components/schemas/Case' },
              },
            },
          ],
        },
        CaseListResponse: {
          allOf: [
            { $ref: '#/components/schemas/ApiResponse' },
            {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Case' },
                },
              },
            },
          ],
        },
        EvidenceResponse: {
          allOf: [
            { $ref: '#/components/schemas/ApiResponse' },
            {
              type: 'object',
              properties: {
                data: { $ref: '#/components/schemas/Evidence' },
              },
            },
          ],
        },
        NotificationResponse: {
          allOf: [
            { $ref: '#/components/schemas/ApiResponse' },
            {
              type: 'object',
              properties: {
                data: { $ref: '#/components/schemas/Notification' },
              },
            },
          ],
        },
        NotificationListResponse: {
          allOf: [
            { $ref: '#/components/schemas/ApiResponse' },
            {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Notification' },
                },
              },
            },
          ],
        },
        ThreatResponse: {
          allOf: [
            { $ref: '#/components/schemas/ApiResponse' },
            {
              type: 'object',
              properties: {
                data: { $ref: '#/components/schemas/Threat' },
              },
            },
          ],
        },
        ThreatListResponse: {
          allOf: [
            { $ref: '#/components/schemas/ApiResponse' },
            {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Threat' },
                },
              },
            },
          ],
        },
        HealthResponse: {
          allOf: [
            { $ref: '#/components/schemas/ApiResponse' },
            {
              type: 'object',
              properties: {
                data: { $ref: '#/components/schemas/HealthStatus' },
              },
            },
          ],
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/**/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
