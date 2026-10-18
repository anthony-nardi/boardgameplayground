import Head from "next/head";
import Stats from "../components/Stats";

export default function StatsPage() {
  return (
    <>
      <Head>
        <title>Statistics | Board Game Playground</title>
        <meta
          name="description"
          content="Who has been playing which games, how often, and where they finished."
          key="desc"
        />
      </Head>
      <Stats />
    </>
  );
}
