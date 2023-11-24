import { DateTime, DateTimeFormatOptions } from "luxon"
import { useRouter } from "next/router"
import { useTranslation } from "next-i18next"
import { FaDiscord } from "react-icons/fa"
import {
  Box,
  Center,
  Divider,
  Flex,
  Grid,
  GridItem,
  Icon,
} from "@chakra-ui/react"

import { trackCustomEvent } from "@/lib/utils/matomo"

import { ButtonLink } from "../Buttons"
import InlineLink from "../Link"
import OldHeading from "../OldHeading"
import Text from "../OldText"
import Translation from "../Translation"

import {
  type Event as EventType,
  useCommunityEvents,
} from "./useCommunityEvents"

const matomoEvent = (buttonType: string) => {
  trackCustomEvent({
    eventCategory: "CommunityEventsWidget",
    eventAction: "clicked",
    eventName: buttonType,
  })
}

const renderEventDateTime = (
  date: string,
  language: string,
  params: DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour12: false,
    hour: "numeric",
    minute: "numeric",
  }
) => {
  return DateTime.fromISO(date).setLocale(language).toLocaleString(params)
}

interface EventProps {
  event: EventType
  language: string
  type: "upcoming" | "past"
}

const Event = ({ event, language, type }: EventProps) => {
  const { date, title, calendarLink } = event
  const params: DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }

  return (
    <Grid gap={6} templateColumns="auto 1fr" mb={4}>
      <GridItem>
        <Text color="body.medium" m={0}>
          {renderEventDateTime(date, language, params)}
        </Text>
      </GridItem>
      <GridItem>
        <InlineLink to={calendarLink} onClick={() => matomoEvent(type)}>
          {title}
        </InlineLink>
      </GridItem>
    </Grid>
  )
}

const CommunityEvents = () => {
  const { locale } = useRouter()
  const { t } = useTranslation("page-index")
  const { pastEventData, upcomingEventData, loading, hasError } =
    useCommunityEvents()

  return (
    <Flex
      w="full"
      flexDirection={{ base: "column", lg: "row" }}
      p={{
        base: "0",
        sm: "2rem 0 0",
        lg: "2rem 2rem 0",
      }}
    >
      <Center w={{ base: "100%", lg: "40%" }}>
        <Box pr={8} pl={{ base: 8, lg: 0 }}>
          <OldHeading>
            <Translation id="page-index:community-events-content-heading" />
          </OldHeading>
          <Text>
            <Translation id="page-index:community-events-content-1" />
          </Text>
          <Text>
            <Translation id="page-index:community-events-content-2" />
          </Text>
        </Box>
      </Center>
      <Flex
        w={{ base: "100%", lg: "60%" }}
        flexDirection={{ base: "column", lg: "row" }}
      >
        <Flex
          w={{ base: "100%", lg: "50%" }}
          bg="layer2Gradient"
          px={8}
          py={16}
          textAlign="center"
          flexDir="column"
        >
          {loading ? (
            <Text>
              <Translation id="loading" />
            </Text>
          ) : (
            <Flex direction="column" h="full" gap={8}>
              {hasError ? (
                <Text color="error.base">
                  <Translation id="loading-error-try-again-later" />
                </Text>
              ) : upcomingEventData.length ? (
                <Box flex={1}>
                  <Text fontSize="3xl" fontWeight="bold" lineHeight={1.4}>
                    {upcomingEventData[0].title}
                  </Text>
                  <Text m={0} fontSize="xl">
                    {renderEventDateTime(upcomingEventData[0].date, locale!)}
                  </Text>
                  <Text color="body.medium" fontSize="md">
                    ({Intl.DateTimeFormat().resolvedOptions().timeZone})
                  </Text>
                </Box>
              ) : (
                <Text fontSize="3xl" fontWeight="bold" mb={8}>
                  <Translation id="page-index:community-events-no-events-planned" />
                </Text>
              )}
              <Flex flexDirection="column" gap={2}>
                <ButtonLink
                  to="/discord/"
                  gap={2}
                  onClick={() => matomoEvent("discord")}
                >
                  <Icon as={FaDiscord} fontSize={25} />
                  Join Discord
                </ButtonLink>
                {upcomingEventData[0] && (
                  <InlineLink
                    to={upcomingEventData[0].calendarLink}
                    onClick={() => matomoEvent("Add to calendar")}
                    fontWeight={700}
                  >
                    {t("community-events-add-to-calendar")}
                  </InlineLink>
                )}
              </Flex>
            </Flex>
          )}
        </Flex>
        <Flex
          w={{ base: "100%", lg: "50%" }}
          bg="background.highlight"
          p={8}
          flexDir="column"
        >
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            <Translation id="page-index:community-events-upcoming-calls" />
          </Text>
          <Divider mb={4} />
          {loading ? (
            <Text>
              <Translation id="loading" />
            </Text>
          ) : hasError ? (
            <Text color="error.base">
              <Translation id="loading-error-try-again-later" />
            </Text>
          ) : upcomingEventData.slice(1).length ? (
            upcomingEventData.slice(1).map((item) => {
              return (
                <Event
                  key={item.date}
                  event={item}
                  language={locale!}
                  type="upcoming"
                />
              )
            })
          ) : (
            <Text mx="auto">
              <Translation id="page-index:community-events-no-upcoming-calls" />
            </Text>
          )}
          <Text fontSize="lg" fontWeight="bold" mb={2} mt={4}>
            <Translation id="page-index:community-events-previous-calls" />
          </Text>
          <Divider mb={4} />
          {loading ? (
            <Text>
              <Translation id="loading" />
            </Text>
          ) : hasError ? (
            <Text color="error.base">
              <Translation id="loading-error-try-again-later" />
            </Text>
          ) : pastEventData.length ? (
            pastEventData.map((item) => {
              return (
                <Event
                  key={item.date}
                  event={item}
                  language={locale!}
                  type="past"
                />
              )
            })
          ) : (
            <Text mx="auto">
              <Translation id="page-index:community-events-there-are-no-past-calls" />
            </Text>
          )}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default CommunityEvents
