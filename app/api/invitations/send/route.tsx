import { Resend } from "resend"
import { createClient } from "@/app/lib/supabase/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const { token } = await request.json()

  if (!token) {
    return Response.json(
      { error: "Invitation token is required." },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  const { data: invitation, error: invitationError } = await supabase
    .from("invitations")
    .select("email, role, organization_id, expires_at")
    .eq("token", token)
    .eq("status", "pending")
    .single()

  if (invitationError || !invitation) {
    return Response.json(
      { error: "Invitation not found or is no longer pending." },
      { status: 404 }
    )
  }

  if (new Date(invitation.expires_at) <= new Date()) {
    return Response.json(
      { error: "This invitation has expired." },
      { status: 410 }
    )
  }

  const { data: organization, error: organizationError } = await supabase
    .from("organizations")
    .select("name")
    .eq("id", invitation.organization_id)
    .single()

  if (organizationError || !organization) {
    return Response.json(
      { error: "Organization could not be found." },
      { status: 404 }
    )
  }

  const invitationUrl = `http://localhost:3000/invitations/${token}`

  const { data, error } = await resend.emails.send({
    from: "KYYP <onboarding@resend.dev>",
    to: [invitation.email],
    subject: `You've been invited to join ${organization.name}`,
    html: `
      <h2>You've been invited to join ${organization.name}</h2>
      <p>You have been invited to join ${organization.name} as a ${invitation.role}.</p>
      <p>
        <a href="${invitationUrl}">Accept invitation</a>
      </p>
      <p>This invitation expires in 7 days.</p>
    `,
  })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ data })
}