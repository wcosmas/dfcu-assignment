# React Query Implementation

This project uses [TanStack Query (React Query)](https://tanstack.com/query/latest) for data fetching, caching, and state management on the frontend.

## Directory Structure

```
src/
├── hooks/
│   ├── api/
│   │   ├── index.ts            # Barrel file exporting all API hooks
│   │   ├── useApiMutations.ts  # Generic mutation hook builder
│   │   ├── useApiQueries.ts    # Generic query hook builder
│   │   ├── useAuth.ts          # Authentication-related hooks
│   │   ├── usePayment.ts       # Payment-related hooks
│   │   └── useUserProfile.ts   # User profile hooks
└── lib/
    ├── query-keys.ts           # Centralized query keys
    └── react-query.tsx         # React Query provider setup
```

## Core Concepts

### Query Keys

All query keys are centralized in `src/lib/query-keys.ts` to ensure consistent key usage across the application.

```typescript
import { QUERY_KEYS } from "@/lib/query-keys";

// Example usage
useQuery({
  queryKey: [QUERY_KEYS.USER.PROFILE],
  // ...
});
```

### Provider Setup

The React Query provider is configured in `src/lib/react-query.tsx` and wrapped around the application in `src/app/layout.tsx`.

### API Hooks

We provide two types of hooks:

1. **Generic Builders**: `useApiQuery` and `useApiMutation` for building custom hooks
2. **Feature-specific Hooks**: Pre-built hooks like `useAuth`, `usePayment`, etc.

## Usage Examples

### Basic Query

```tsx
import { useUserProfile } from "@/hooks/api";

function ProfilePage() {
  const { profile, isLoading, error } = useUserProfile();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile</div>;

  return <div>Hello, {profile?.username}</div>;
}
```

### Basic Mutation

```tsx
import { useUserProfile } from "@/hooks/api";

function ProfileUpdateForm() {
  const { updateProfile, isUpdating } = useUserProfile();

  const handleSubmit = (data) => {
    updateProfile(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button disabled={isUpdating}>
        {isUpdating ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
}
```

### Creating Custom Hooks

If you need to create a new data fetching hook, you can use the generic builders:

```typescript
import { useApiQuery, useApiMutation } from "@/hooks/api";
import { QUERY_KEYS } from "@/lib/query-keys";
import { myApi } from "@/api/myApi";

export function useMyFeature() {
  // Query example
  const { data, isLoading, error } = useApiQuery(
    "myFeatureData",
    myApi.getData
  );

  // Mutation example
  const { mutate: updateData, isPending } = useApiMutation(
    (newData) => myApi.updateData(newData),
    {
      onSuccess: () => {
        // Handle success
      },
    }
  );

  return {
    data,
    isLoading,
    error,
    updateData,
    isUpdating: isPending,
  };
}
```

## Best Practices

1. **Always use query keys from the centralized file**
2. **Use the onSuccess callback to update related queries**
3. **Handle loading and error states in your components**
4. **Configure staleTime and cacheTime appropriately for your data needs**
5. **Use refetch methods for manually triggering queries**
