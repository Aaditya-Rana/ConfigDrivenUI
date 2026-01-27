export default () => ({
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
});
