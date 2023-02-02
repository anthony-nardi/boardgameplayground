import dynamic from "next/dynamic";
const DynamicHeader = dynamic(() => import("../game/gameIndex"), {
  loading: () => null,
  ssr: false,
});

export default function Home() {
  return <DynamicHeader />;
}
