export default function RequireAuth({ children }) {
  const { user } = useCurrentUser();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}