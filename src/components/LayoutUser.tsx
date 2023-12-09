import Motion from "./Motion";
import Username from "./Username";

export default function LayoutUser({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Motion>
      <Username />
      {children}
    </Motion>
  );
}
