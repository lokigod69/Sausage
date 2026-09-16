import type { Branch } from "@/lib/types";
import { branchLinks } from "@/lib/contact";
import { SectionHeading } from "./SectionHeading";
import { MessengerIcon, PhoneIcon, MapPinIcon } from "./icons";

/**
 * Delivery by Maxim.
 *
 * Plenty of customers are an hour away in Tagbilaran or out along the coast
 * road, and a shop with 440 items that only serves people who can drive to
 * Bolod is leaving most of Bohol out. This section exists to say, plainly,
 * that they do not have to come.
 *
 * Deliberately specific about the towns and deliberately vague about the
 * fare. The towns are what someone searches for and what settles "do they
 * come to me"; the fare is Maxim's, it changes with distance and time of
 * day, and a number printed here would be wrong within a week. So the page
 * promises a quote in the chat instead of a price it cannot keep.
 */
const AREAS = [
  "Panglao",
  "Dauis",
  "Tagbilaran",
  "Baclayon",
  "Alburquerque",
  "Cortes",
];

const STEPS = [
  {
    title: "Tell us what you need",
    body: "Message us on Messenger with your list. If you are not sure what is in today, ask — we are at the counter and we will check.",
  },
  {
    title: "We pack it and quote the ride",
    body: "We total your order and book a Maxim rider. You hear the price of the goods and the fare before anything moves.",
  },
  {
    title: "Pay on delivery",
    body: "Pay for the order when it reaches you, and the rider for the ride. Cold and frozen items go in an insulated bag.",
  },
];

export function DeliverySection({ branch }: { branch: Branch }) {
  const links = branchLinks(
    branch,
    "Hi! I'd like to order for delivery from The Sausage Guy Panglao.",
  );

  return (
    <section id="delivery" className="section scroll-mt-20">
      <div className="wrap">
        <SectionHeading
          eyebrow="We deliver"
          title="Can't come to Bolod? We'll send it."
          intro="We deliver by Maxim across Panglao and over the causeway into Tagbilaran and the towns along the coast road. Order on Messenger and it comes to your door."
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-[1.35fr_1fr]">
          <ol className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {STEPS.map((step, i) => (
              <li key={step.title} className="card flex gap-4 p-5">
                <span
                  aria-hidden
                  className="mono flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                  style={{
                    background: "var(--accent)",
                    color: "var(--on-accent)",
                  }}
                >
                  {i + 1}
                </span>
                <span>
                  <span
                    className="block font-semibold"
                    style={{ color: "var(--text-strong)" }}
                  >
                    {step.title}
                  </span>
                  <span
                    className="mt-1.5 block text-sm leading-relaxed"
                    style={{ color: "var(--muted)" }}
                  >
                    {step.body}
                  </span>
                </span>
              </li>
            ))}
          </ol>

          <div className="card flex flex-col p-6">
            <h3
              className="font-display text-xl font-semibold"
              style={{ color: "var(--text-strong)" }}
            >
              Where we deliver
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
              {AREAS.map((area) => (
                <li
                  key={area}
                  className="flex items-center gap-2"
                  style={{ color: "var(--text)" }}
                >
                  <MapPinIcon
                    width={14}
                    height={14}
                    aria-hidden
                    style={{ color: "var(--accent)", flex: "0 0 auto" }}
                  />
                  {area}
                </li>
              ))}
            </ul>

            <p
              className="mt-5 text-sm leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              Somewhere else on Bohol? Ask anyway. If a rider will go, we will
              send it.
            </p>

            <div className="mt-auto flex flex-wrap gap-2.5 pt-6">
              <a
                href={links.messenger}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <MessengerIcon width={18} height={18} />
                Order on Messenger
              </a>
              <a href={links.phone} className="btn btn-ghost">
                <PhoneIcon width={18} height={18} />
                Call
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
