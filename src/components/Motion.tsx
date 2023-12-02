import { motion } from "framer-motion";

export default function Motion({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div>
        <motion.main
          initial={{ opacity: 0, transform: "translateX(100)" }} //初期状態
          animate={{ opacity: 1, transform: "translateX(0)" }} //マウント
          exit={{ opacity: 0, transform: "translateX(100)" }} //アンマウント
          style={{
            height: "100vh",
            width: "100vw",
            backgroundColor: "#fff",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {children}
        </motion.main>
      </motion.div>
    </>
  );
}
