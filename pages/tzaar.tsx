import dynamic from "next/dynamic";
const DynamicHeader = dynamic(() => import("../game/component"), {
  loading: () => null,
  ssr: false,
});

export default function Home() {
  return <DynamicHeader />;
}
