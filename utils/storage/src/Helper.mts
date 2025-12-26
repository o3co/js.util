import path from "path";

export const createUri = (pathStr: string): URL => {
  if (!/^[a-zA-Z][\w+.-]*:/.test(pathStr)) {
    const resolvedPath = path.resolve(pathStr);
    return new URL(`file://${resolvedPath}`);
  }

  return new URL(pathStr);
};
