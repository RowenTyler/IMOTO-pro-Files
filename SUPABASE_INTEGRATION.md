# Supabase Integration Guide

This document provides a comprehensive guide for the Supabase integration in the car marketplace application.

## Overview

The application uses Supabase as the backend-as-a-service (BaaS) solution, providing:
- Authentication and user management
- PostgreSQL database with real-time capabilities
- Row Level Security (RLS) for data protection
- Real-time subscriptions for live updates

## Configuration

### Environment Variables

The following environment variables are configured:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://gdhnyulduswsqfydkdev.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=fgya6Usww5RM4TJ6Hmi/MRGNOY5BFFk95TFKW65JVK3K3MwxpypiyDSCcrCSNNUKRGUVzijyYHuv8tq4ZlUNqA==
\`\`\`

### Client Configuration

The Supabase client is configured in `lib/supabase.ts` with:
- Persistent sessions
- Auto token refresh
- Real-time capabilities
- Error handling utilities

## Database Schema

### Tables

1. **users** - User profiles extending Supabase auth
2. **vehicles** - Vehicle listings with full details
3. **saved_vehicles** - User's saved/favorited vehicles

### Key Features

- UUID primary keys for security
- Comprehensive indexing for performance
- Full-text search capabilities
- Automatic timestamp management
- Row Level Security (RLS) policies

## Authentication

### Supported Methods

- Email/password authentication
- OAuth providers (Google, Facebook, Apple)
- Password reset functionality
- Session management

### Implementation

\`\`\`typescript
// Sign up
const { user, session } = await authService.signUp(email, password, userData)

// Sign in
const { user, session } = await authService.signIn(email, password)

// OAuth
await authService.signInWithOAuth('google')

// Sign out
await authService.signOut()
\`\`\`

## Data Operations

### CRUD Operations

The `vehicleService` provides comprehensive CRUD operations:

\`\`\`typescript
// Create vehicle
const vehicle = await vehicleService.createVehicle(vehicleData)

// Get vehicles with filters
const { vehicles, total } = await vehicleService.getVehicles(filters)

// Update vehicle
const updatedVehicle = await vehicleService.updateVehicle(id, updates)

// Delete vehicle
await vehicleService.deleteVehicle(id)
\`\`\`

### Real-time Updates

Real-time subscriptions are available for:
- Vehicle changes
- Saved vehicles updates

\`\`\`typescript
// Subscribe to vehicle changes
const subscription = vehicleService.subscribeToVehicles((payload) => {
  console.log('Vehicle updated:', payload)
  // Handle real-time updates
})

// Subscribe to saved vehicles
const savedSubscription = vehicleService.subscribeToSavedVehicles(userId, (payload) => {
  console.log('Saved vehicles updated:', payload)
  // Handle saved vehicles changes
})

// Cleanup subscriptions
subscription.unsubscribe()
savedSubscription.unsubscribe()
\`\`\`

## Security

### Row Level Security (RLS)

All tables have RLS enabled with policies that ensure:
- Users can only access their own data
- Public vehicle listings are visible to all
- Proper authentication checks

### API Security

- Server-side authentication validation
- Input sanitization and validation
- Error handling with user-friendly messages
- Rate limiting considerations

## Error Handling

### Centralized Error Management

The `errorHandler` utility provides:
- Consistent error formatting
- User-friendly error messages
- Logging for debugging
- Toast notifications for UI feedback

\`\`\`typescript
try {
  await vehicleService.createVehicle(data)
} catch (error) {
  errorHandler.handle(error, 'vehicle creation')
}
\`\`\`

## Performance Optimizations

### Database Optimizations

- Comprehensive indexing strategy
- Full-text search with GIN indexes
- Efficient pagination
- Query optimization

### Client-side Optimizations

- Connection pooling
- Automatic session refresh
- Caching strategies
- Real-time subscription management

## Testing

### Test Coverage

- Authentication flows
- CRUD operations
- Real-time subscriptions
- Error scenarios
- Security policies

### Running Tests

\`\`\`bash
npm run test
npm run test:integration
\`\`\`

## Deployment

### Vercel Configuration

The application is configured for seamless Vercel deployment with:
- Environment variable validation
- Production-ready configurations
- Automatic HTTPS enforcement
- Edge function compatibility

### Database Migrations

Run migrations using the Supabase CLI:

\`\`\`bash
supabase db push
supabase db reset
\`\`\`

## Monitoring and Maintenance

### Health Checks

\`\`\`typescript
const isHealthy = await checkSupabaseConnection()
\`\`\`

### Performance Monitoring

- Query performance tracking
- Real-time connection monitoring
- Error rate monitoring
- User session analytics

## Best Practices

1. **Always use RLS policies** for data security
2. **Implement proper error handling** throughout the application
3. **Use TypeScript types** for database schema
4. **Optimize queries** with proper indexing
5. **Handle real-time subscriptions** lifecycle properly
6. **Validate input data** before database operations
7. **Use transactions** for complex operations
8. **Monitor performance** regularly

## Troubleshooting

### Common Issues

1. **Authentication errors**: Check environment variables and user permissions
2. **RLS policy violations**: Verify user authentication and policy rules
3. **Real-time connection issues**: Check subscription setup and cleanup
4. **Performance issues**: Review query patterns and indexing

### Debug Tools

- Supabase Dashboard for database monitoring
- Browser DevTools for client-side debugging
- Server logs for API route issues
- Real-time inspector for subscription debugging

## Future Enhancements

- Image upload with Supabase Storage
- Advanced search with vector embeddings
- Push notifications
- Analytics and reporting
- Multi-tenant support
- Advanced caching strategies

This integration provides a robust, scalable foundation for the car marketplace application with enterprise-grade security and performance.
