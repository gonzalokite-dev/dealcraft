import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { CANONICAL_ORDER, SECTION_LABELS } from "@/lib/proposals/constants";
import ApproveSection from "./ApproveSection";

export default async function PublicProposalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const admin = createAdminClient();

  const { data: proposal } = await admin
    .from("proposals")
    .select("*, profiles(business_name, primary_color, secondary_color, footer_text, logo_url)")
    .eq("public_token", token)
    .single();

  if (!proposal) notFound();

  const profile = proposal.profiles as {
    business_name: string;
    primary_color: string;
    secondary_color: string;
    footer_text: string | null;
    logo_url: string | null;
  } | null;

  const content = proposal.generated_content as Record<string, string>;
  const primaryColor = profile?.primary_color ?? "#2563EB";
  const secondaryColor = profile?.secondary_color ?? "#1E293B";
  const businessName = profile?.business_name ?? "Propuesta";
  const activeSections = CANONICAL_ORDER.filter((k) => Boolean(content[k]));

  const createdAt = new Date(proposal.created_at).toLocaleDateString("es-ES", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {profile?.logo_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.logo_url} alt={businessName} className="h-8 w-8 object-contain rounded" />
            )}
            <span className="font-semibold text-sm" style={{ color: secondaryColor }}>
              {businessName}
            </span>
          </div>
          <span className="text-xs text-gray-400">{createdAt}</span>
        </div>
      </header>

      {/* Color accent */}
      <div className="h-1" style={{ backgroundColor: primaryColor }} />

      <main className="max-w-3xl mx-auto px-6 py-14">
        {/* Title block */}
        <div className="mb-12">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: primaryColor }}
          >
            Propuesta para
          </p>
          <h1 className="text-4xl font-bold mb-2 leading-tight" style={{ color: secondaryColor }}>
            {proposal.client_name}
          </h1>
          {proposal.client_company && (
            <p className="text-lg text-gray-400 mb-4">{proposal.client_company}</p>
          )}
          <span
            className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
          >
            {proposal.service_type}
          </span>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {activeSections.map((key) => (
            <div key={key}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-gray-100" />
                <p
                  className="text-xs font-bold uppercase tracking-widest flex-shrink-0"
                  style={{ color: primaryColor }}
                >
                  {SECTION_LABELS[key] ?? key}
                </p>
                <div className="h-px flex-1 bg-gray-100" />
              </div>
              <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-wrap">
                {content[key]}
              </p>
            </div>
          ))}
        </div>

        {/* Approve section */}
        <ApproveSection
          token={token}
          initialStatus={proposal.status ?? "sent"}
          primaryColor={primaryColor}
          businessName={businessName}
          footerText={profile?.footer_text ?? null}
        />
      </main>
    </div>
  );
}
