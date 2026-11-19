import React from 'react';
import { CommunityMixedFeed } from '@/hubs/community-hub/CommunityMixedFeed';

type CommunityHubProps = React.ComponentProps<typeof CommunityMixedFeed>;

/**
 * Canonical Community Hub shell.
 * Hosts the community mixed feed and child portal rail (`social-feed`, `demand-board`, `creator-studio`, `messages`).
 */
export const CommunityHub: React.FC<CommunityHubProps> = (props) => (
  <div data-hub-id="community" data-feed-mode="mixed">
    <CommunityMixedFeed {...props} />
  </div>
);
