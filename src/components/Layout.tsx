import Motion from "./Motion";

export default function LayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Motion>{children}</Motion>;
}
