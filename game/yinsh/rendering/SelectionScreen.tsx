import { useState, useCallback } from "react";
import { Button, Container, Group } from "@mantine/core";
import { createStyles, Title, Flex, Radio } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: 34,
    fontWeight: 900,
    [theme.fn.smallerThan("sm")]: {
      fontSize: 24,
    },
  },
}));
export default function SelectionScreen({ onPlay }: { onPlay: Function }) {
  const { classes } = useStyles();
  const [value, setValue] = useState<string>("first");

  const handleClick = useCallback(() => {
    onPlay(value);
  }, [value]);

  return (
    <Container size="lg" py="xl">
      <Title order={2} className={classes.title} align="center" mt="sm">
        Game options
      </Title>
      <Flex
        direction={{ base: "column", sm: "row" }}
        gap={{ base: "sm", sm: "lg" }}
        justify={{ sm: "center" }}
      >
        <Radio.Group
          value={value}
          onChange={setValue}
          pt={"lg"}
          mt={"lg"}
          mb="lg"
          name="firstPlayerOrSecondPlayer"
          label="Choose if you want to go first or second."
        >
          <Group>
            <Radio value="first" label="Go first" size="lg" />
            <Radio value="second" label="Go second" size="lg" />
          </Group>
        </Radio.Group>
      </Flex>
      <Flex
        direction={{ base: "column", sm: "row" }}
        gap={{ base: "sm", sm: "lg" }}
        justify={{ sm: "center" }}
      >
        <Button onClick={handleClick} mt={"lg"} size="xl" uppercase>
          Play
        </Button>
      </Flex>
    </Container>
  );
}
