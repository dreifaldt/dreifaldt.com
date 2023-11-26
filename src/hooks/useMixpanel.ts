import { MIXPANEL_TOKEN } from '@/utils/env'
import mixpanel from 'mixpanel-browser'
import { Thread } from 'openai/resources/beta/threads/threads'
import { useEffect } from 'react'

export const useMixpanel = (thread?: Thread) => {
  useEffect(() => {
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: false,
      ignore_dnt: true,
      persistence: 'localStorage',
      track_pageview: false,
    })
  }, [])

  useEffect(() => {
    if (!thread) return

    // Set this to a unique identifier for the user performing the event.
    mixpanel.identify(thread.id)
    // Track an event. It can be anything, but in this example, we're tracking a Sign Up event.
    mixpanel.track('THREAD_CREATED', thread)
  }, [thread])
}
