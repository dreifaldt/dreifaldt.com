import { MIXPANEL_TOKEN } from '@/utils/env'
import mixpanel from 'mixpanel-browser'
import { useEffect } from 'react'

export const useMixpanel = () => {
  useEffect(() => {
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: false,
      ignore_dnt: true,
      persistence: 'localStorage',
      track_pageview: false,
    })
  }, [])
}
