export type WorkspaceNameLike = {
  gigTitle?: string | null
  title?: string | null
  clientName?: string | null
  talentName?: string | null
}

export function buildWorkspaceDisplayTitle(workspace: WorkspaceNameLike) {
  const gigTitle = workspace.gigTitle || workspace.title || "Untitled gig"
  const client = workspace.clientName || ""
  const talent = workspace.talentName || ""

  if (client && talent) {
    return `Workspace for "${gigTitle}" between ${client} and ${talent}`
  }

  if (client) {
    return `Workspace for "${gigTitle}" with ${client}`
  }

  return `Workspace for "${gigTitle}"`
}
