import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDir = path.join(process.cwd(), 'content/posts');

const updates = [
  {
    file: "2020-04-30_ryu-dolce.mdx",
    title: "与Ryu×职业玩家DOLCE.互相交流、20年来音乐游戏的发展与『beatmania』独有的乐趣",
    tags: ["音乐游戏", "翻译", "音乐", "Beatmania"],
    categories: ["翻译（同人音乐）"]
  },
  {
    file: "2020-12-19_uske-sound-source.mdx",
    title: "U-ske介绍自己使用最多的音源",
    tags: ["音乐制作", "翻译", "音乐"],
    categories: ["翻译（同人音乐）"]
  },
  {
    file: "2021-03-03_mk-jpn-activity.mdx",
    title: "属于你自己的活动 —— MK (JPN)/Shadw",
    tags: ["音乐制作", "翻译", "同人音乐"],
    categories: ["翻译（同人音乐）"]
  },
  {
    file: "2021-04-26_doujin-music-guide.mdx",
    title: "同人音乐聆听指南 V1.0.0",
    tags: ["音乐制作", "翻译", "同人音乐"],
    categories: ["同人音乐"]
  },
  {
    file: "2021-06-02_flower-bouquet-sakuzyo.mdx",
    title: "关于眠りの花束 - By tarolabo&Sakuzyo",
    tags: ["音乐制作", "翻译", "同人音乐"],
    categories: ["翻译（同人音乐）"]
  },
  {
    file: "2021-12-20_chiyoda-momo-effector.mdx",
    title: "千代田桃的效果器笔记Ver.2021.12.20",
    tags: ["音乐制作", "插件"],
    categories: ["音乐制作"]
  },
  {
    file: "2022-07-26_jcore-revolution.mdx",
    title: "自分語り93 —— J-CORE “文OOO命”",
    tags: ["翻译", "音乐", "J-Core"],
    categories: ["翻译（同人音乐）"]
  },
  {
    file: "2022-07-27_abstract-music-awards.mdx",
    title: "通过抽象音乐大赏所想到的",
    tags: ["同人音乐"],
    categories: ["碎碎念"]
  },
  {
    file: "2022-08-02_what-is-doujin-music.mdx",
    title: "什么是同人音乐？",
    tags: ["同人音乐"],
    categories: ["碎碎念"]
  },
  {
    file: "2023-12-31_annual-summary-2023.mdx",
    title: "Black201的年度总结 Ver.2023",
    tags: ["个人生活"],
    categories: ["碎碎念"]
  },
  {
    file: "2023-12-31_dark-side-music.mdx",
    title: "音乐创作的黑暗面",
    tags: ["音乐制作", "同人音乐"],
    categories: ["碎碎念"]
  },
  {
    file: "2023-12-19_jcore-is-dead.mdx",
    title: "J-core已死...?——写在J-core综合版结束之后",
    tags: ["J-Core", "同人音乐"],
    categories: ["碎碎念"]
  },
  {
    file: "2023-08-03_ddr-mat-mod.mdx",
    title: "让你30块钱的的DDR软垫好跳10倍！DDR软垫魔改！",
    tags: ["音乐游戏", "DIY"],
    categories: ["DIY项目"]
  },
  {
    file: "2023-07-26_moe-not-kawaii.mdx",
    title: "萌え ≠ かわいい",
    tags: ["萌文化", "电波"],
    categories: ["碎碎念"]
  },
  {
    file: "2023-07-17_resource-management-anime.mdx",
    title: "如何管理自己的数字与生活资源？(Anime篇)",
    tags: ["动画", "资源管理"],
    categories: ["个人管理"]
  },
  {
    file: "2023-04-09_nothing-but-requiem.mdx",
    title: "Nothing But Requiem 第一部-忘却的葬列-序曲",
    tags: ["同人音乐", "翻译", "音乐"],
    categories: ["翻译（同人音乐）"]
  },
  {
    file: "2023-02-12_resource-management-dj.mdx",
    title: "如何管理自己的数字与生活资源？(Music For DJ篇)",
    tags: ["音乐", "资源管理", "DJ"],
    categories: ["个人管理"]
  },
  {
    file: "2023-02-09_criticism-doujin-music.mdx",
    title: "评价与批评与“同人音乐是什么·续”",
    tags: ["同人音乐"],
    categories: ["碎碎念"]
  },
  {
    file: "2023-01-24_dizzylab-purchases-2022.mdx",
    title: "今年，Dizzylab买了啥 Ver.2022",
    tags: ["同人音乐"],
    categories: ["音乐推荐"]
  },
  {
    file: "2022-11-02_bocchi-instruments.mdx",
    title: "孤独摇滚四个人用的是什么乐器 Pt.1",
    tags: ["音乐", "动画", "考据"],
    categories: ["考据"]
  },
  {
    file: "2022-10-16_love-games.mdx",
    title: "恋爱，游戏，还有恋爱游戏",
    tags: ["音乐", "制作感想"],
    categories: ["制作感想"]
  },
  {
    file: "2022-09-18_touhou-hardstyle.mdx",
    title: "东方同人音乐、老派Hardstyle与My Adventure",
    tags: ["音乐", "制作感想"],
    categories: ["制作感想"]
  },
  {
    file: "2022-08-10_back-to-barbecue.mdx",
    title: "为啥我回去烤肉了",
    tags: ["同人音乐"],
    categories: ["碎碎念"]
  },
  {
    file: "2022-08-06_abstract-music-2.mdx",
    title: "抽象音乐大赏2评论",
    tags: ["同人音乐"],
    categories: ["碎碎念"]
  },
  {
    file: "2024-01-27_cn-doujin-purchases-2024.mdx",
    title: "今年，CN同人音乐买了什么 Ver.2024",
    tags: ["同人音乐"],
    categories: ["音乐推荐"]
  },
  {
    file: "2024-02-08_doujin-top-50-2023.mdx",
    title: "Black201的2023同人音乐专辑50选",
    tags: ["同人音乐"],
    categories: ["音乐推荐"]
  },
  {
    file: "2024-02-20_elk-cloner.mdx",
    title: "oперація 27 - Elk Cloner",
    tags: ["音乐", "制作感想", "Hi-Tech"],
    categories: ["制作感想"]
  },
  {
    file: "2024-02-29_silent-xosmos.mdx",
    title: "The Silent Xosmos 三首",
    tags: ["音乐", "制作感想"],
    categories: ["制作感想"]
  },
  {
    file: "2024-04-01_hardcore-police.mdx",
    title: "暴走硬舞警察 ~RAMPAGE HARDCORE POLICE~",
    tags: ["音乐", "制作感想", "Hardcore Pop"],
    categories: ["制作感想"]
  },
  {
    file: "2024-05-12_escape-the-time-afterstory.mdx",
    title: "「Escape the Time」后日谈",
    tags: ["音乐", "制作感想", "Hi-Tech"],
    categories: ["制作感想"]
  },
  {
    file: "2024-06-04_natori-sana-ramen.mdx",
    title: "名取纱那美味享用的犒赏饭 第一餐 「正解的拉面」",
    tags: ["翻译", "Vtuber", "名取纱那", "漫画"],
    categories: ["翻译（Vtuber）"]
  },
  {
    file: "2024-08-16_pepoyo.mdx",
    title: "Pepoyo做错了什么",
    tags: ["同人音乐", "音乐", "Vocaloid"],
    categories: ["翻译（同人音乐）"]
  },
  {
    file: "2024-11-09_lightspeed-chinese-food.mdx",
    title: "仕事終了後超光速前進？？目標☆中華料理店！",
    tags: ["音乐", "制作感想", "电波"],
    categories: ["制作感想"]
  },
  {
    file: "2024-12-24_resource-management-galgame.mdx",
    title: "如何管理自己的数字与生活资源？(Galgame篇)",
    tags: ["Galgame", "个人管理"],
    categories: ["个人管理"]
  },
  {
    file: "2025-02-19_harem-kingdom-review.mdx",
    title: "ハーレムキングダム（后宫王国）——这就是为什么市面上几乎没有全价纯后宫",
    tags: ["Galgame", "游戏评测"],
    categories: ["Galgame评测"]
  },
  {
    file: "2025-03-01_lip-lipples-review.mdx",
    title: "Lip lipples——未能完整镶嵌的残缺拼板",
    tags: ["Galgame", "游戏评测"],
    categories: ["Galgame评测"]
  },
  {
    file: "2025-12-21_cancer-music-2025.mdx",
    title: "通过致癌物音乐大赏所想到的 Ver.2025",
    tags: ["同人音乐"],
    categories: ["碎碎念"]
  },
  {
    file: "2025-12-29_skill-learning-method.mdx",
    title: "Black201流的技能学习法——以绘画（也会穿插一些音乐制作的内容）为例",
    tags: ["绘画", "个人心得"],
    categories: ["个人心得"]
  },
  {
    file: "2026-01-10_resource-management-naming.mdx",
    title: "如何管理自己的数字与生活资源？(文件命名与结构篇)",
    tags: ["文件", "个人管理"],
    categories: ["个人管理"]
  }
];

async function updatePosts() {
  const allFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.mdx'));
  
  for (const filename of allFiles) {
    const filePath = path.join(postsDir, filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    let newContent = content;
    let modified = false;

    // Check if this file is in our explicit update list
    const update = updates.find(u => u.file === filename);
    
    if (update) {
      data.title = update.title;
      data.tags = update.tags;
      data.categories = update.categories;
      modified = true;
    }

    // Common tasks for ALL posts
    // 1. Remove cover from frontmatter
    if (data.cover) {
      delete data.cover;
      modified = true;
    }

    // 2. Clean title (remove prefixes/suffixes) if not already set by update
    // User asked to remove [魔法少女的碎碎念] and [Gal评测] and 【制作杂谈】
    // If we already set the title from the list, it should be clean. 
    // If not in list, we should clean it.
    if (!update && data.title) {
        let title = data.title;
        title = title.replace(/\[魔法少女的碎碎念(?:-EP[0-9.]*)?\]/g, '')
                     .replace(/\[Gal评测\]/g, '')
                     .replace(/【制作杂谈】/g, '')
                     .trim();
        if (title !== data.title) {
            data.title = title;
            modified = true;
        }
    }

    // 3. Remove cover image links from content?
    // User said "delete all article cover image links".
    // If this means specific markdown images, it's hard to guess.
    // But for the specific requested file:
    
    if (filename === "2022-07-27_abstract-music-awards.mdx") {
        // Replace image URL with ---
        // Need to be careful with regex escaping
        const targetUrl = "http://localhost:3000/_next/image?url=%2Fimages%2Fposts%2F4adb9255ada5b97061e610b682b8636764fe50ed.png&w=3840&q=75";
        if (newContent.includes(targetUrl)) {
             // Replace the whole image tag if possible
             const regex = /!\[.*?\]\(http:\/\/localhost:3000\/_next\/image\?url=%2Fimages%2Fposts%2F4adb9255ada5b97061e610b682b8636764fe50ed\.png&w=3840&q=75\)/g;
             if (regex.test(newContent)) {
                 newContent = newContent.replace(regex, '---');
             } else {
                 // Try replacing just the URL
                 newContent = newContent.replace(targetUrl, '---');
             }
             modified = true;
        }
    }

    if (filename === "2023-08-03_ddr-mat-mod.mdx") {
        if (newContent.includes("图：www.pixiv.net/artworks/93659275")) {
            newContent = newContent.replace("图：www.pixiv.net/artworks/93659275", "");
            if (!newContent.includes("https://freshp0325.xyz/posts/2023080301")) {
                newContent += "\n\n建议你看这里：https://freshp0325.xyz/posts/2023080301";
            }
            modified = true;
        }
    }

    if (modified) {
      const updatedFileContent = matter.stringify(newContent, data);
      fs.writeFileSync(filePath, updatedFileContent);
      console.log(`Updated ${filename}`);
    }
  }
}

updatePosts();
