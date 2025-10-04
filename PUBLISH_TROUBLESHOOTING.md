# Publish Functionality Troubleshooting Guide

This guide will help you troubleshoot issues with publishing blog posts and projects in your admin panel.

## Common Issues and Solutions

### 1. Publish Checkbox Not Working
If checking the "Published" checkbox doesn't save the status:

1. Make sure you're clicking "Save Changes" after checking the checkbox
2. Check the browser console for any JavaScript errors
3. Verify that the API calls are being made correctly

### 2. Published Content Not Appearing Publicly
If content is marked as published but doesn't appear on the public site:

1. Check that the frontend is correctly filtering for published content
2. Verify the API endpoints are returning the correct data
3. Confirm the database has the correct published status

## How to Test Publish Functionality

### Using the Test Script

1. First, make sure your backend server is running on `http://localhost:5000`
2. Log into your admin panel to ensure you have a valid auth token
3. Open your browser's developer tools (F12)
4. Go to the Console tab
5. Copy and paste the contents of `test-publish-functionality.ts` into the console and press Enter
6. Run the test by typing `runPublishTests()` and pressing Enter

### Manual Testing Steps

1. **Create a new blog post or project**
   - Go to Blog Management or Project Management
   - Click "Create New Post" or "Create New Project"
   - Fill in the required fields
   - Ensure the "Published" checkbox is unchecked (default)
   - Click "Save Changes"

2. **Verify draft status**
   - Check that the item appears in the list with a "Draft" badge
   - Refresh the page to confirm it's saved correctly

3. **Publish the item**
   - Select the item from the list
   - Click "Edit"
   - Check the "Published" checkbox
   - Click "Save Changes"

4. **Verify published status**
   - Check that the item now shows a "Published" badge
   - Refresh the page to confirm it's saved correctly

5. **Check public visibility**
   - Open your public blog or projects page in an incognito/private window
   - Verify that the published item appears
   - Check that draft items do NOT appear

## Backend Verification

### Check Database Directly

You can verify the published status directly in your PostgreSQL database:

```sql
-- Check blog posts published status
SELECT id, title, published, published_at FROM blog_posts;

-- Check projects published status
SELECT id, title, published FROM projects;
```

### API Endpoint Testing

You can test the API endpoints directly using curl or a tool like Postman:

```bash
# Get all published blog posts (public endpoint)
curl http://localhost:5000/api/blog

# Get all blog posts (admin endpoint)
curl -H "Authorization: Bearer YOUR_AUTH_TOKEN" http://localhost:5000/api/blog/admin/posts

# Update a blog post to published
curl -X PUT -H "Authorization: Bearer YOUR_AUTH_TOKEN" -H "Content-Type: application/json" -d '{"published": true}' http://localhost:5000/api/blog/admin/BLOG_POST_ID

# Get all published projects
curl http://localhost:5000/api/projects?published=true

# Update a project to published
curl -X PUT -H "Authorization: Bearer YOUR_AUTH_TOKEN" -H "Content-Type: application/json" -d '{"published": true}' http://localhost:5000/api/projects/admin/PROJECT_ID
```

## Code Verification

### Frontend Components

In both `BlogManagement.tsx` and `ProjectManagement.tsx`, verify:

1. The published checkbox is correctly bound:
   ```jsx
   <input
     type="checkbox"
     id="published"
     checked={selectedItem.published}
     onChange={(e) => handleInputChange('published', e.target.checked)}
     className="h-4 w-4"
   />
   ```

2. The handleInputChange function properly updates the published field:
   ```typescript
   const handleInputChange = (field: keyof Item, value: any) => {
     if (selectedItem) {
       setSelectedItem({
         ...selectedItem,
         [field]: value
       });
     }
   };
   ```

3. The handleUpdate function sends the correct data:
   ```typescript
   const handleUpdateItem = async () => {
     if (!selectedItem) return;
     
     try {
       const token = getToken();
       const response = await adminApi.updateItem(token, selectedItem.id, selectedItem);
       // Handle success
     } catch (error) {
       // Handle error
     }
   };
   ```

### Backend Controllers

In both `blogController.ts` and `projectController.ts`, verify:

1. The update function properly handles the published field:
   ```typescript
   if (updateData.published !== undefined) {
     paramCount++;
     updateFields.push(`published = $${paramCount}`);
     updateValues.push(updateData.published);
     
     // Update published_at timestamp
     paramCount++;
     updateFields.push(`published_at = $${paramCount}`);
     updateValues.push(updateData.published ? new Date() : null);
   }
   ```

2. The database queries correctly filter for published content:
   ```typescript
   // For public endpoints
   const query = `SELECT * FROM table_name WHERE published = true`;
   
   // For admin endpoints
   const query = `SELECT * FROM table_name`; // No filter, shows all
   ```

## Troubleshooting Checklist

- [ ] Auth token is valid and properly sent with requests
- [ ] Backend server is running and accessible
- [ ] Database connection is working
- [ ] Published checkbox state is correctly bound to component state
- [ ] Save button triggers the update API call
- [ ] Update API call includes the published field in the request body
- [ ] Backend properly updates the published field in the database
- [ ] Public endpoints correctly filter for published content only
- [ ] No JavaScript errors in the browser console
- [ ] No server errors in the backend logs

## Need Help?

If you're still experiencing issues after following this guide:

1. Check the browser console for any error messages
2. Check the backend server logs for any error messages
3. Run the test script provided to automatically verify functionality
4. Verify your database has the correct published status for your items
5. Make sure you're using the latest version of the code

If you continue to have problems, please provide:
- Screenshots of the issue
- Browser console error messages
- Backend server logs
- Results from running the test script