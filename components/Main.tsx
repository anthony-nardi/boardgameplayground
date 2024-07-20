import {
  createStyles,
  Title,
  Text,
  Card,
  SimpleGrid,
  Container,
} from "@mantine/core";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: 34,
    fontWeight: 900,
    [theme.fn.smallerThan("sm")]: {
      fontSize: 24,
    },
  },

  description: {
    maxWidth: 600,
    margin: "auto",

    "&::after": {
      content: '""',
      display: "block",
      backgroundColor: theme.fn.primaryColor(),
      width: 45,
      height: 2,
      marginTop: theme.spacing.sm,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },

  card: {
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },

  cardTitle: {
    "&::after": {
      content: '""',
      display: "block",
      backgroundColor: theme.fn.primaryColor(),
      width: 45,
      height: 2,
      marginTop: theme.spacing.sm,
    },
  },
}));

export function FeaturesCards() {
  const { classes } = useStyles();

  return (
    <Container size="lg" py="xl">
      <Title order={2} className={classes.title} align="center" mt="sm">
        A collection of board games with AI opponents.
      </Title>

      <Text
        color="dimmed"
        className={classes.description}
        align="center"
        mt="md"
      >
        Practice against the computer.
      </Text>
      <Text
        color="dimmed"
        className={classes.description}
        align="center"
        mt="md"
      >
        {`Some games may allow for human opponents, but I'm not paying for a server to support real time communication. (Therefore it may be slow!)`}
      </Text>
      <SimpleGrid
        cols={3}
        spacing="xl"
        mt={50}
        breakpoints={[{ maxWidth: "md", cols: 1 }]}
      >
        <Link href="/tzaar" style={{ textDecoration: "none" }}>
          <Card shadow="md" radius="md" className={classes.card} p="xl">
            <Text size="lg" weight={500} className={classes.cardTitle} mt="md">
              TZAAR
            </Text>
            <Text size="sm" color="dimmed" mt="sm">
              A 2 player abstract strategy game. Part of the GIPF series
              designed by Kris Burm.
            </Text>
          </Card>
        </Link>
        <Link
          href="https://familyinc-client.vercel.app/"
          style={{ textDecoration: "none" }}
        >
          <Card shadow="md" radius="md" className={classes.card} p="xl">
            <Text size="lg" weight={500} className={classes.cardTitle} mt="md">
              Family Inc.
            </Text>
            <Text size="sm" color="dimmed" mt="sm">
              A push your luck game for 2-7 players designed by Reiner Knizia.
            </Text>
          </Card>
        </Link>
        <Link
          href="https://high-society-c4ff4.web.app/"
          style={{ textDecoration: "none" }}
        >
          <Card shadow="md" radius="md" className={classes.card} p="xl">
            <Text size="lg" weight={500} className={classes.cardTitle} mt="md">
              High Society
            </Text>
            <Text size="sm" color="dimmed" mt="sm">
              A bidding game for 3-5 players designed by Reiner Knizia.
            </Text>
          </Card>
        </Link>
      </SimpleGrid>
    </Container>
  );
}
