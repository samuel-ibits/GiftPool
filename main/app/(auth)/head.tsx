export default function Head() {
  const title =
    "GiftPool — Send Money as a Link | Giveaways, Rewards & Digital Gifting";
  const description =
    "Create or send instant gifts, giveaways and crowdfunding campaigns through a single link. Simple, secure, and perfect for individuals, influencers, brands & events.";

  return (
    <>
      {/* Essentials */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Canonical URL */}
      <link rel="canonical" href="https://giftpool.app" />

      {/* Favicons */}
      <link rel="icon" href="/images/favicon.ico" />
      <meta name="theme-color" content="#0066FF" />

      {/* Search engine metadata */}
      <meta
        name="keywords"
        content="gift link, giveaway, crowdfunding, send money, digital gift, influencer gifts, brand giveaways, rewards"
      />
      <meta name="rating" content="General" />

      {/* Open Graph (Facebook, Instagram, LinkedIn) */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content="https://giftpool.app" />
      <meta property="og:site_name" content="GiftPool" />
      <meta
        property="og:image"
        content="https://giftpool.app/images/og-preview.png"
      />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta
        name="twitter:image"
        content="https://giftpool.app/images/og-preview.png"
      />
      <meta name="twitter:creator" content="@giftpoolapp" />
    </>
  );
}
