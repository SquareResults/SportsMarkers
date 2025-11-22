# Quick Reference: Working with Portfolio Data

## 🚀 Common Operations

### 1. Fetching a User's Portfolio

```typescript
import { createClient } from '@/lib/supabase';

async function getUserPortfolio(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching portfolio:', error);
    return null;
  }
  
  return data;
}
```

### 2. Updating Specific Portfolio Fields

```typescript
async function updatePortfolioGoals(userId: string, goals: string, opportunities: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('portfolios')
    .update({
      goals,
      opportunities,
    })
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating portfolio:', error);
    return null;
  }
  
  return data;
}
```

### 3. Adding Educational Background

```typescript
async function addEducation(userId: string, school: string, graduationYear: string) {
  const supabase = createClient();
  
  // First, fetch current educational background
  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('educational_background')
    .eq('user_id', userId)
    .single();
  
  // Add new entry
  const currentEducation = portfolio?.educational_background || [];
  const updatedEducation = [
    ...currentEducation,
    { school, graduationYear }
  ];
  
  // Update database
  const { data, error } = await supabase
    .from('portfolios')
    .update({ educational_background: updatedEducation })
    .eq('user_id', userId)
    .select()
    .single();
  
  return data;
}
```

### 4. Working with Skills (JSONB Array)

```typescript
async function updateSkills(userId: string, skills: string[]) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('portfolios')
    .update({
      skills: skills // Will be stored as JSONB array
    })
    .eq('user_id', userId)
    .select()
    .single();
  
  return data;
}

// Usage
await updateSkills('user-id', [
  '3-Point Shooting',
  'Ball Handling',
  'Defense',
  'Leadership'
]);
```

### 5. Adding Press Articles

```typescript
async function addPressArticle(
  userId: string,
  title: string,
  url: string
) {
  const supabase = createClient();
  
  // Fetch current press
  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('press')
    .eq('user_id', userId)
    .single();
  
  // Add new article
  const currentPress = portfolio?.press || [];
  const updatedPress = [
    ...currentPress,
    { title, url }
  ];
  
  // Update database
  const { data, error } = await supabase
    .from('portfolios')
    .update({ press: updatedPress })
    .eq('user_id', userId)
    .select()
    .single();
  
  return data;
}
```

### 6. Updating Social Media Links

```typescript
async function updateSocials(userId: string, socials: {
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  youtube?: string;
  linkedin?: string;
  other?: string;
}) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('portfolios')
    .update({
      socials // Will be stored as JSONB object
    })
    .eq('user_id', userId)
    .select()
    .single();
  
  return data;
}

// Usage
await updateSocials('user-id', {
  instagram: 'https://instagram.com/athlete',
  twitter: 'https://twitter.com/athlete',
  tiktok: 'https://tiktok.com/@athlete'
});
```

### 7. Querying Portfolios by Sport

```typescript
async function getPortfoliosBySport(sport: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('sport', sport)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching portfolios:', error);
    return [];
  }
  
  return data;
}
```

### 8. Searching Portfolios (Full-Text Search on JSONB)

```typescript
async function searchPortfoliosBySkill(skill: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .contains('skills', [skill]); // JSONB array contains
  
  return data;
}

// Example: Find all basketball players with "Leadership" skill
const leaders = await searchPortfoliosBySkill('Leadership');
```

### 9. Working with Experience Dictionary

```typescript
async function addExperience(
  userId: string,
  team: string,
  position: string,
  explanation: string
) {
  const supabase = createClient();
  
  // Fetch current experience
  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('experience')
    .eq('user_id', userId)
    .single();
  
  // Add new experience
  const currentExperience = portfolio?.experience || {};
  const key = position ? `${team} (${position})` : team;
  
  const updatedExperience = {
    ...currentExperience,
    [key]: explanation
  };
  
  // Update database
  const { data, error } = await supabase
    .from('portfolios')
    .update({ experience: updatedExperience })
    .eq('user_id', userId)
    .select()
    .single();
  
  return data;
}
```

### 10. Uploading Files and Updating Portfolio

```typescript
async function uploadAndSaveResume(userId: string, file: File) {
  // Upload to S3
  const formData = new FormData();
  formData.append('file', file);
  
  const uploadRes = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  
  const { data: uploadData } = await uploadRes.json();
  const resumeUrl = uploadData[0].file_url;
  
  // Update portfolio
  const supabase = createClient();
  const { data, error } = await supabase
    .from('portfolios')
    .update({ resume_url: resumeUrl })
    .eq('user_id', userId)
    .select()
    .single();
  
  return data;
}
```

---

## 🔍 Querying JSONB Fields

### Check if a skill exists
```typescript
const { data } = await supabase
  .from('portfolios')
  .select('*')
  .contains('skills', ['3-Point Shooting']);
```

### Check if social media exists
```typescript
const { data } = await supabase
  .from('portfolios')
  .select('*')
  .not('socials->instagram', 'is', null);
```

### Filter by educational background school
```typescript
const { data } = await supabase
  .from('portfolios')
  .select('*')
  .contains('educational_background', [{ school: 'UCLA' }]);
```

---

## 📊 Aggregation Queries

### Count portfolios by sport
```typescript
const { count } = await supabase
  .from('portfolios')
  .select('*', { count: 'exact', head: true })
  .eq('sport', 'Basketball');
```

### Get all unique sports
```typescript
const { data } = await supabase
  .from('portfolios')
  .select('sport')
  .order('sport');

const uniqueSports = [...new Set(data?.map(p => p.sport))];
```

---

## 🛡️ Security Best Practices

### 1. Always Verify User Before Updates
```typescript
async function updatePortfolio(userId: string, updates: Partial<Portfolio>) {
  const supabase = createClient();
  
  // Verify the user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || user.id !== userId) {
    throw new Error('Unauthorized');
  }
  
  // RLS will also enforce this, but good to check client-side
  const { data, error } = await supabase
    .from('portfolios')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();
  
  return data;
}
```

### 2. Sanitize File Uploads
```typescript
const ALLOWED_FILE_TYPES = {
  images: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  documents: ['application/pdf', 'application/msword'],
};

function validateFile(file: File, type: 'images' | 'documents'): boolean {
  return ALLOWED_FILE_TYPES[type].includes(file.type);
}
```

---

## 🧪 Testing Examples

### Test Portfolio Creation
```typescript
describe('Portfolio Creation', () => {
  it('should create a complete portfolio', async () => {
    const portfolio = {
      user_id: 'test-user-id',
      first_name: 'John',
      last_name: 'Doe',
      sport: 'Basketball',
      contact_email: 'john@example.com',
      educational_background: [
        { school: 'UCLA', graduationYear: '2024' }
      ],
      skills: ['Leadership', 'Defense'],
      socials: {
        instagram: 'https://instagram.com/johndoe'
      }
    };
    
    const { data, error } = await supabase
      .from('portfolios')
      .insert([portfolio])
      .select()
      .single();
    
    expect(error).toBeNull();
    expect(data.first_name).toBe('John');
    expect(data.skills).toEqual(['Leadership', 'Defense']);
  });
});
```

---

## 📖 Type-Safe Queries with TypeScript

```typescript
import { Database } from '@/types/database.types';

type Portfolio = Database['public']['Tables']['portfolios']['Row'];
type PortfolioInsert = Database['public']['Tables']['portfolios']['Insert'];
type PortfolioUpdate = Database['public']['Tables']['portfolios']['Update'];

// Type-safe insert
const newPortfolio: PortfolioInsert = {
  first_name: 'Jane',
  last_name: 'Smith',
  sport: 'Soccer',
  contact_email: 'jane@example.com',
  // TypeScript will enforce all required fields
};

// Type-safe update
const updates: PortfolioUpdate = {
  goals: 'Play professionally in Europe',
  opportunities: 'Yes'
};
```

---

## 🎯 Tips & Tricks

1. **Batch Updates**: Update multiple fields at once to reduce database calls
2. **Use Transactions**: For complex operations involving multiple tables
3. **Index Usage**: The `contact_email` and `user_id` indexes speed up queries
4. **JSONB Queries**: Use `contains`, `@>`, `->`, `->>` operators for efficient JSONB querying
5. **File Management**: Store file metadata in `files` table for easy tracking
6. **Validation**: Always validate form data before saving to database
7. **Error Handling**: Implement proper error handling for all database operations

---

## 🐛 Common Issues & Solutions

### Issue: JSONB field returns null
**Solution**: Initialize with empty array/object
```typescript
const skills = portfolio?.skills || [];
```

### Issue: File upload fails
**Solution**: Check AWS credentials and S3 bucket permissions
```bash
# Verify env variables
echo $S3_BUCKET_NAME
echo $AWS_REGION
```

### Issue: RLS policy denies access
**Solution**: Ensure user is authenticated and owns the resource
```typescript
const { data: { user } } = await supabase.auth.getUser();
console.log('Current user:', user?.id);
```

---

Need more examples or have questions? Check the main documentation in `DATABASE_MIGRATION_SUMMARY.md`
