// Public assets must also work when the app is hosted beneath a repository path.
export function publicAsset(path: string) {
  return path.startsWith('/assets/') ? `${import.meta.env.BASE_URL}${path.slice(1)}` : path;
}
