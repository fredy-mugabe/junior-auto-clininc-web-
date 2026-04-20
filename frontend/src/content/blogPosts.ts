export type BlogPost = {
  slug: string
  title: string
  date: string
  tag: string
  excerpt: string
  /** Full article body shown on `/blog/:slug` */
  paragraphs: string[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'diagnostics-signs',
    title: '5 signs your car needs diagnostics',
    date: '2026-04-08',
    tag: 'Maintenance',
    excerpt:
      'Warning lights, rough idle, stalling, unexplained fuel use, and new noises under load are all reasons to book a diagnostic session rather than hoping the problem disappears.',
    paragraphs: [
      'Modern vehicles rely on dozens of sensors and control modules. When something drifts out of range, the first clue is often a warning lamp, a change in how the engine idles, or fuel consumption that no longer matches your usual routes. Booking a diagnostic session early usually costs less than replacing parts based on guesswork.',
      'Rough idle or occasional stalling can point to air/fuel mixture problems, ignition weakness, or a sensor that is slow to report. A scan tool captures historical codes and live data so the technician can see whether the issue is electrical, mechanical, or both — before recommending repairs.',
      'Unexplained fuel use often tracks back to oxygen sensors, fuel trim running rich, dragging brakes, or even tire pressure. Diagnostics connects those symptoms to data instead of swapping the most expensive component first.',
      'New noises under load — especially knocking, grinding, or whining that changes with engine speed or road speed — should be checked quickly. Some noises warn of belt or bearing failure; others relate to transmission or differential wear. A structured inspection plus targeted tests keeps you safer on the road.',
      'If you notice any combination of these signs, note when they happen (cold start, highway, uphill) and share that with the workshop. The more context you provide, the faster we can narrow the list of likely causes and give you a clear estimate.',
    ],
  },
  {
    slug: 'brake-noises',
    title: 'Brake noises: what they mean',
    date: '2026-04-08',
    tag: 'Safety',
    excerpt:
      'Squealing, grinding, or clicking can point to very different issues. Learn what to listen for and when to stop driving.',
    paragraphs: [
      'Brakes are your first line of defense in an emergency stop. Noise is often the earliest warning that pads are worn, hardware is loose, or a caliper is not releasing evenly. Ignoring changes in sound can turn a simple pad replacement into rotor damage or longer stopping distances.',
      'A high-pitched squeal during light braking often comes from wear indicators contacting the rotor, or from pads that have glazed. It is usually safe to drive to the workshop soon, but not something to postpone indefinitely.',
      'A deep grinding sound usually means metal-on-metal contact: pad material is gone and the backing plate or caliper is contacting the rotor. That condition reduces braking performance and damages rotors quickly. We recommend minimizing driving until the brakes are inspected.',
      'Clicking or clunking can be loose hardware, a worn caliper slide, or a foreign object caught near the shield. Because the cause is less obvious, a lift inspection and road test help confirm whether the fix is a adjustment, a hardware kit, or a full pad and rotor service.',
      'Whenever brake feel changes — longer pedal travel, vibration, or pulling to one side — mention it when you book. Noise plus feel changes often point to hydraulic or caliper issues that should be addressed before daily driving.',
    ],
  },
  {
    slug: 'oil-change-intervals',
    title: 'How often should you change oil?',
    date: '2026-04-08',
    tag: 'Maintenance',
    excerpt:
      'Intervals depend on your engine, oil type, and driving conditions. Here is a practical way to avoid premature wear.',
    paragraphs: [
      'Manufacturer intervals assume “normal” driving: mostly highway miles, moderate temperatures, and trips long enough for the engine to reach full operating temperature. Short trips, dust, towing, and stop-and-go traffic all shorten oil life because fuel dilution and moisture build up in the sump.',
      'Synthetic oils generally tolerate heat and shear better than conventional grades, but they still pick up soot and acids over time. The right interval matches your oil specification, filter quality, and how hard the engine works day to day.',
      'If you mostly drive short distances, consider more frequent changes even when the calendar interval has not elapsed. Oil that rarely reaches operating temperature for long periods does not shed moisture as effectively, which can affect bearings and seals over years.',
      'We can recommend an interval after a quick conversation about your commute, climate, and vehicle age. We also document what we installed so warranty and resale records stay clear.',
      'When in doubt, check the dipstick monthly: level, color, and smell. A sharp fuel smell, milky appearance, or rapid level drop are reasons to book immediately rather than waiting for the next scheduled service.',
    ],
  },
]

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug)
}
