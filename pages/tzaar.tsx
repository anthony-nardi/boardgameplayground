import dynamic from "next/dynamic";
const DynamicHeader = dynamic(() => import("../game/component"), {
  loading: () => "Loading...",
  ssr: false,
});

export default function Home() {
  return <DynamicHeader />;
}
