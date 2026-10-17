import { Card, Container, SimpleGrid, Text, Title } from "@mantine/core";
import Link from "next/link";
import classes from "./Main.module.css";

// The other games live in their own apps. In development they can be pointed
// at local checkouts via .env.development; production uses the deployed URLs.
const HIGH_SOCIETY_URL =
  process.env.NEXT_PUBLIC_HIGH_SOCIETY_URL ?? "https://high-society-c4ff4.web.app";

const games = [
  {
    href: "/tzaar",
    title: "TZAAR",
    description:
      "A 2 player abstract strategy game. Part of the GIPF series designed by Kris Burm.",
  },
  {
    href: `${HIGH_SOCIETY_URL}/family-inc`,
    title: "Family Inc.",
    description:
      "A push your luck game for 2-7 players designed by Reiner Knizia.",
  },
  {
    href: `${HIGH_SOCIETY_URL}/high-society`,
    title: "High Society",
    description: "A bidding game for 3-5 players designed by Reiner Knizia.",
  },
  {
    href: `${HIGH_SOCIETY_URL}/no-thanks`,
    title: "No Thanks!",
    description:
      "No Thanks! is a card game designed to be as simple as it is engaging. For 3-7 players. Designed by Thorsten Gimmler.",
  },
  {
    href: `${HIGH_SOCIETY_URL}/razzia`,
    title: "Razzia!",
    description:
      "Gangsters bid for loot and dodge police raids over three rounds. A card game version of Ra for 3-5 players, designed by Reiner Knizia.",
  },
];

export function FeaturesCards() {
  return (
    <Container size="lg" py="xl">
      <Title order={2} className={classes.title} ta="center" mt="sm">
        A collection of board games with AI opponents.
      </Title>

      <Text c="dimmed" className={classes.description} ta="center" mt="md">
        Practice against the computer.
      </Text>
      <Text c="dimmed" className={classes.description} ta="center" mt="md">
        {`Some games may allow for human opponents, but I'm not paying for a server to support real time communication. (Therefore it may be slow!)`}
      </Text>
      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
        {games.map((game) => (
          <Link
            key={game.title}
            href={game.href}
            style={{ textDecoration: "none" }}
          >
            <Card shadow="md" radius="md" className={classes.card} p="xl">
              <Text size="lg" fw={500} className={classes.cardTitle} mt="md">
                {game.title}
              </Text>
              <Text size="sm" c="dimmed" mt="sm">
                {game.description}
              </Text>
            </Card>
          </Link>
        ))}
      </SimpleGrid>
    </Container>
  );
}
