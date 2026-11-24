"use client"

import type { User } from "@supabase/supabase-js"
import {
  AvatarCard,
  CoverBanner,
  SettingsCard,
} from "./_shared/ui"

type SettingsHeroProps = {
  user: User
  workspaceName: string
}

export default function SettingsHero({
  user,
  workspaceName,
}: SettingsHeroProps) {
  return (
    <SettingsCard className="overflow-hidden">
      <CoverBanner />

      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
        <div className="-mt-14 sm:-mt-14">
          <AvatarCard
            user={user}
            workspaceName={workspaceName}
            editable={false}
            size="lg"
            className="ring-4 ring-foreground"
          />
        </div>

        <h2 className="mt-4 text-xl font-semibold tracking-tight text-text">
          {workspaceName}
        </h2>
      </div>
    </SettingsCard>
  )
}