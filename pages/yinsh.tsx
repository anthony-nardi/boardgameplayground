import dynamic from "next/dynamic";
const DynamicHeader = dynamic(() => import("@/game/yinsh/rendering/index"), {
  loading: () => null,
  ssr: false,
});

export default function Home() {
  return <DynamicHeader />;
}
