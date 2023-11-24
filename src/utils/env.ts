const getEnvVariables = () => {
  const envVariables = {
    MIXPANEL_TOKEN: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
    NETWORK_LOGGER: !!process.env.NEXT_PUBLIC_NETWORK_LOGGER,
    OPENAI_TOKEN: process.env.NEXT_PUBLIC_OPENAI_TOKEN,
  } as EnvironmentVariables

  Object.entries(envVariables).forEach(([key, value]) => {
    if (value === undefined) console.log(`${key} is undefined`)
  })

  return envVariables
}

export const { MIXPANEL_TOKEN, OPENAI_TOKEN, NETWORK_LOGGER } = getEnvVariables()

type EnvironmentVariables = {
  NETWORK_LOGGER: boolean
  MIXPANEL_TOKEN: string
  OPENAI_TOKEN: string
}
