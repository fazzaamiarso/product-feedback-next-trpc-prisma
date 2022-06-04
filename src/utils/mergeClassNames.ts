export default function mergeClassNames(...className: string[]) {
  return className.filter(Boolean).join(" ");
}
