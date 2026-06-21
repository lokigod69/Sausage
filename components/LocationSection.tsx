import type { Branch } from "@/lib/types";
import { branchLinks, DEFAULT_WA_MESSAGE } from "@/lib/contact";
import { OpenStatus } from "./OpenStatus";
import { SectionHeading } from "./SectionHeading";
import {
  MapPinIcon,
  ClockIcon,
  PhoneIcon,
  WhatsAppIcon,
  FacebookIcon,
  ArrowUpRight,
} from "./icons";

export function LocationSection({ branch }: { branch: Branch }) {
  const links = branchLinks(branch, DEFAULT_WA_MESSAGE);

  return (
    <section id="location" className="section scroll-mt-20">
      <div className="wrap">
        <SectionHeading
          eyebrow="Visit & contact"
          title="Find us in Bolod, Panglao"
          intro={branch.wayfinding}
        />

        <div
          id="contact"
          className="mt-10 grid gap-5 lg:grid-cols-[1fr_1fr] scroll-mt-20"
        >
          {/* Details card */}
          <div className="surface-solid p-6 sm:p-8">
            <ul className="space-y-6">
              <InfoRow icon={<MapPinIcon width={20} height={20} />} label="Address">
                {branch.address}
              </InfoRow>
              <InfoRow icon={<ClockIcon width={20} height={20} />} label="Hours">
                <OpenStatus
                  open={branch.hours.open}
                  close={branch.hours.close}
                  display={branch.hours.display}
                />
              </InfoRow>
              <InfoRow icon={<PhoneIcon width={20} height={20} />} label="Phone">
                <a href={links.phone} style={{ color: "var(--text)" }}>
                  {branch.phone}
                </a>
              </InfoRow>
            </ul>

            <div className="divider my-7" />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <a
                href={links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa"
              >
                <WhatsAppIcon width={17} height={17} />
                WhatsApp
              </a>
              <a href={links.phone} className="btn btn-ghost">
                <PhoneIcon width={17} height={17} />
                Call
              </a>
              <a
                href={links.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                <FacebookIcon width={17} height={17} />
                Facebook
              </a>
            </div>
          </div>

          {/* Map card */}
          <a
            href={links.maps}
            target="_blank"
            rel="noopener noreferrer"
            className="card card-hover group relative grid min-h-[280px] place-items-center overflow-hidden"
          >
            <div className="media-placeholder absolute inset-0" aria-hidden />
            <div className="relative flex flex-col items-center text-center">
              <span
                className="grid h-14 w-14 place-items-center rounded-full"
                style={{
                  background: "var(--accent)",
                  color: "var(--on-accent)",
                }}
              >
                <MapPinIcon width={24} height={24} />
              </span>
              <span
                className="font-display mt-4 text-xl font-semibold"
                style={{ color: "var(--text-strong)" }}
              >
                Open in Google Maps
              </span>
              <span
                className="mt-1 inline-flex items-center gap-1 text-sm"
                style={{ color: "var(--muted)" }}
              >
                {branch.mapQuery}
                <ArrowUpRight
                  width={15}
                  height={15}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-4">
      <span
        className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full"
        style={{
          background: "color-mix(in oklab, var(--accent) 14%, transparent)",
          color: "var(--accent)",
        }}
      >
        {icon}
      </span>
      <span>
        <span
          className="block text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--faint)" }}
        >
          {label}
        </span>
        <span className="mt-1 block" style={{ color: "var(--text)" }}>
          {children}
        </span>
      </span>
    </li>
  );
}
