export function getErrorMessage(error: any) {
  if (error.graphQLErrors) {
    for (const graphQLError of error.graphQLErrors) {
      if (
        graphQLError.extensions
      ) {
        const { code = '' } = graphQLError.extensions;
        if (!code) {
          return 'Something went wrong!';
        }
        if (
          code === 'BAD_USER_INPUT'
        ) {
          return 'User Input Error';
        }
        if (code === 'UNAUTHENTICATED') {
          return 'Authentication Error';
        }
      }
    }
  }
  return 'Something went wrong!'
}