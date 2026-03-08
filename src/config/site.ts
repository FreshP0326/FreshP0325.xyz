export const siteConfig = {
  name: "Black201",
  title: "Black201 – 作曲 / 映像 / イラスト",
  description: "Black201's personal space for music, visuals, and thoughts.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  author: {
    name: "Black201",
    role: "作曲 / 映像 / イラスト",
    avatar: "/avatar.png",
    email: "black251jack@gmail.com",
    links: {
      bandcamp: "https://momokan.bandcamp.com/",
      twitter: "https://x.com/Black201_wav",
      bilibili: "https://space.bilibili.com/6993889",
      dizzylab: "https://www.dizzylab.net/l/%E6%A1%83%E7%BD%90/",
      pixiv: "https://www.pixiv.net/users/42568058",
      github: "https://github.com",
    },
  },
  links: {
    rss: "/rss.xml",
  },
};

export type SiteConfig = typeof siteConfig;
