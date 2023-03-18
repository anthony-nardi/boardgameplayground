import { FeaturesCards } from "../components/Main";
import { Analytics } from '@vercel/analytics/react';

export default function Home() {
  return (
    <>
      <FeaturesCards />
      <Analytics />
    </>
  );
}
