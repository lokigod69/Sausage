import Link from "next/link";
import type { Branch } from "@/lib/types";
import { branchLinks } from "@/lib/contact";
import { categoryPath } from "@/lib/routes";
import { Brand } from "./Brand";
import {
  MessengerIcon,
  WhatsAppIcon,
  PhoneIcon,
  FacebookIcon,
  MapPinIcon,
  ClockIcon,
  StarIcon,
} from "./icons";

/**
 * Footer: brand, every aisle, where the shop is, and every way to reach it.
 *
 * Three jobs, in order of who benefits.
 *
 * A visitor who has read to the bottom of a category article is the most
 * likely of anyone on the site to want the address or the Messenger link, so
 * both are here in full rather than as a link back to a contact section.
 *
 * A crawler needs name, address and phone in the markup of every page — the
 * basic local-SEO trio — and the fourteen aisle links give a small site the
 * internal linking it otherwise has to earn.
 *
 * And it used to be three anchors (#products, #location, #top) that worked on
 * the branch page and did nothing on the fourteen category pages. Everything
 * here is an absolute path.
 */
export function Footer({
  branch,
  basePath = "/panglao",
}: {
  branch: Branch;
  basePath?: string;
}) {
  const year = new Date().getFullYear();
  const links = branchLinks(branch);

  const channels = [
    { href: links.messenger, label: "Messenger", Icon: MessengerIcon, external: true },
    { href: links.whatsapp, label: "WhatsApp", Icon: WhatsAppIcon, external: true },
    { href: links.phone, label: branch.phone, Icon: PhoneIcon, external: false },
    { href: links.facebook, label: "Facebook page", Icon: FacebookIcon, external: true },
    { href: links.directions, label: "Get directions", Icon: MapPinIcon, external: true },
  ];

  return (
    <footer className="site-footer">
      <div className="wrap site-footer__grid">
        <div className="site-footer__brand">
          <Brand size="md" />
          <p className="site-footer__tagline">{branch.tagline}</p>

          {branch.rating && branch.reviewCount ? (
            <a
              href={links.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer__rating"
            >
              <StarIcon width={14} height={14} />
              {branch.rating.toFixed(1)} from {branch.reviewCount} Google
              reviews
            </a>
          ) : null}

          <a
            href={links.messenger}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mt-6"
          >
            <MessengerIcon width={18} height={18} />
            Message the shop
          </a>
        </div>

        <nav aria-label="All categories">
          <h3 className="site-footer__heading">Shop by aisle</h3>
          <ul className="site-footer__aisles">
            {branch.featuredCategories.map((card) => (
              <li key={card.slug}>
                <Link href={categoryPath(basePath, card.label)}>
                  {card.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="site-footer__heading">Visit</h3>
          {/*
            Real address and hours rather than a link to them: this is the
            name-address-phone block every local listing is checked against,
            and it should read the same on every page.
          */}
          <address className="site-footer__address">
            <span className="site-footer__shop-name">{branch.name}</span>
            {branch.address}
            {branch.wayfinding ? (
              <span className="site-footer__wayfinding">
                {branch.wayfinding}
              </span>
            ) : null}
          </address>
          <p className="site-footer__hours">
            <ClockIcon width={15} height={15} />
            <span>
              {branch.hours.label}
              <span className="site-footer__dim"> · {branch.hours.display}</span>
            </span>
          </p>
          <Link href={`${basePath}#location`} className="site-footer__more">
            Map &amp; opening hours
          </Link>
        </div>

        <nav aria-label="Contact">
          <h3 className="site-footer__heading">Get in touch</h3>
          <ul className="site-footer__channels">
            {channels.map(({ href, label, Icon, external }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <Icon width={16} height={16} />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="divider" />
      <div className="wrap site-footer__legal">
        <p>
          © {year} The Sausage Guy · {branch.locality}
        </p>
        <p>Prices come from the shop counter. Stock can change during the day.</p>
      </div>
    </footer>
  );
}
