# Database Schema Updates

This document describes the recent updates made to the database schema and related code to fix the publish functionality issues.

## Recent Changes

### 1. Fixed Project Publish Timestamp Handling

**Issue**: When projects were published, the `published_at` timestamp was not being set, which could cause issues with sorting or filtering published projects.

**Solution**: Updated the `updateProject` function in `projectController.ts` to properly set the `published_at` timestamp when the published status changes:

```typescript
if (published !== undefined) {
  updates.push(`published = $${valueIndex++}`);
  values.push(published);
  
  // Add published_at timestamp update
  updates.push(`published_at = $${valueIndex++}`);
  values.push(published ? new Date() : null);
}
```

### 2. Fixed Update Validation Logic

**Issue**: The validation logic that checks if at least one field is being updated was incorrectly counting the `updated_at` timestamp, which could prevent valid updates that only changed the published status.

**Solution**: Updated the validation logic in `projectController.ts` to properly account for the `updated_at` timestamp:

```typescript
// Always update the updated_at timestamp
updates.push(`updated_at = NOW()`);

// Check if any actual fields (not including updated_at) are being updated
if (updates.length <= 1) { // Only updated_at was added or no fields
  res.status(400).json({
    success: false,
    message: 'At least one field must be provided for update'
  });
  return;
}
```

## Database Schema

The database schema for both blog posts and projects includes the following fields related to publishing:

### Blog Posts Table
```sql
CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author VARCHAR(100) NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  featured_image VARCHAR(255),
  read_time VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP
);
```

### Projects Table
```sql
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  technologies TEXT[],
  featured_image VARCHAR(255),
  project_url VARCHAR(255),
  github_url VARCHAR(255),
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP
);
```

## Testing the Changes

After applying these changes, you should test:

1. Creating new blog posts and projects (they should default to unpublished/draft)
2. Publishing existing blog posts and projects
3. Verifying that published items appear in public listings
4. Checking that the published_at timestamp is properly set

## Rollback Procedure

If you need to rollback these changes:

1. Restore the previous version of `projectController.ts`
2. No database changes are required as these are code-only fixes

## Additional Notes

These fixes ensure that:
1. Both blog posts and projects handle the published status consistently
2. The published_at timestamp is properly maintained for both content types
3. Updates that only change the published status are properly validated