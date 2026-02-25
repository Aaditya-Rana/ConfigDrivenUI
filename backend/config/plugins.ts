export default ({ env }) => ({
    upload: {
        config: {
            provider: 'aws-s3',
            providerOptions: {
                baseUrl: env('R2_PUBLIC_URL'),
                rootPath: env('R2_ROOT_PATH'),
                s3Options: {
                    credentials: {
                        accessKeyId: env('R2_ACCESS_KEY_ID'),
                        secretAccessKey: env('R2_ACCESS_SECRET'),
                    },
                    endpoint: env('R2_ENDPOINT'),
                    region: env('R2_REGION', 'auto'),
                    params: {
                        Bucket: env('R2_BUCKET'),
                    },
                },
            },
            actionOptions: {
                upload: {},
                uploadStream: {},
                delete: {},
            },
        },
    },
    documentation: {
        enabled: true,
        config: {
            openapi: '3.0.0',
            info: {
                version: '1.0.0',
                title: 'Backend API Documentation',
                description: 'Auto-generated API documentation for the project.',
                termsOfService: 'https://localhost:1337/terms',
                contact: {
                    name: 'Development Team',
                    email: 'admin@xyz.com',
                    url: 'https://localhost:1337'
                },
                license: {
                    name: 'Apache 2.0',
                    url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
                },
            },
            'x-strapi-config': {
                // Plugin specific config
                mutateDocumentation: (generatedDocumentationDraft: any) => {
                    console.log('Generating API documentation...');
                },
            },
            servers: [{ url: 'http://localhost:1337/api', description: 'Development server' }],
            security: [{ bearerAuth: [] }],
        },
    },
    'journey-visualizer': {
        enabled: true,
        resolve: './src/plugins/journey-visualizer'
    },
});
