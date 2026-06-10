import Container from "@/components/Container";
import Title from "@/components/Title";

interface VideoItem {
  id: string;
  title: string;
  publishedAt: string;
}

const YOUTUBE_USERNAME = process.env.YOUTUBE_CHANNEL_USERNAME ?? "YOUR_CHANNEL_USERNAME";
const API_KEY = process.env.YOUTUBE_API_KEY;

const formatPublishedDate = (publishedAt: string) =>
  new Date(publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const parseRssFeed = (xml: string): VideoItem[] => {
  const entries = Array.from(xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g));
  return entries
    .map((match) => {
      const entry = match[1];
      const idMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
      const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);

      if (!idMatch || !titleMatch || !publishedMatch) {
        return null;
      }

      return {
        id: idMatch[1],
        title: titleMatch[1],
        publishedAt: publishedMatch[1],
      } as VideoItem;
    })
    .filter((item): item is VideoItem => item !== null)
    .slice(0, 8);
};

const resolveChannelIdByUsername = async (username: string, apiKey: string): Promise<string | null> => {
  const cleanUsername = username.replace("@", "");
  const url = new URL("https://www.googleapis.com/youtube/v3/channels");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("part", "id");
  
  if (username.startsWith("@") || username.length > 0) {
    url.searchParams.set("forHandle", cleanUsername);
  } else {
    url.searchParams.set("forUsername", cleanUsername);
  }

  const response = await fetch(url.toString(), { next: { revalidate: 86400 } });
  if (!response.ok) return null;

  const data = await response.json();
  return data?.items?.[0]?.id || null;
};

const fetchYoutubeApiVideos = async (channelId: string, apiKey: string) => {
  const apiUrl = new URL("https://www.googleapis.com/youtube/v3/search");
  apiUrl.searchParams.set("key", apiKey);
  apiUrl.searchParams.set("channelId", channelId);
  apiUrl.searchParams.set("part", "snippet");
  apiUrl.searchParams.set("order", "date");
  apiUrl.searchParams.set("maxResults", "8");
  apiUrl.searchParams.set("type", "video");

  const response = await fetch(apiUrl.toString(), {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error("YouTube API fetch failed");
  }

  const data = await response.json();

  return Array.isArray(data.items)
    ? data.items
        .map((item: any) => {
          const videoId = item?.id?.videoId;
          const snippet = item?.snippet;
          if (!videoId || !snippet?.title || !snippet?.publishedAt) {
            return null;
          }
          return {
            id: videoId,
            title: snippet.title,
            publishedAt: snippet.publishedAt,
          } as VideoItem;
        })
        .filter((item): item is VideoItem => item !== null)
    : [];
};

const fetchYoutubeRssVideos = async (channelId: string) => {
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const response = await fetch(rssUrl, {
    next: { revalidate: 60 },
  });
  const xml = await response.text();
  return parseRssFeed(xml);
};

const getYoutubeVideos = async (): Promise<VideoItem[]> => {
  if (YOUTUBE_USERNAME === "YOUR_CHANNEL_USERNAME") {
    return [];
  }

  if (API_KEY) {
    try {
      const resolvedId = await resolveChannelIdByUsername(YOUTUBE_USERNAME, API_KEY);
      
      if (resolvedId) {
        try {
          const apiVideos = await fetchYoutubeApiVideos(resolvedId, API_KEY);
          if (apiVideos.length > 0) {
            return apiVideos;
          }
        } catch {
          return await fetchYoutubeRssVideos(resolvedId);
        }
      }
    } catch (e) {
      console.error("YouTube configuration route failure:", e);
    }
  }

  return [];
};

const VideosPage = async () => {
  const videos = await getYoutubeVideos();

  return (
    <Container className="py-10">
      <div className="space-y-4 text-slate-900">
        <Title className="text-3xl font-bold">Latest Showroom Shorts</Title>
        <p className="max-w-3xl text-base text-slate-600">
          Scroll through our quick showroom updates and lightning product demonstrations live. Synced seamlessly.
        </p>
      </div>

      {/* MODIFIED GRID: 1 column mobile, 2 columns tablet, 3-4 columns desktop for portrait layouts */}
      <main className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {videos.length > 0 ? (
          videos.map((video) => (
            <article
              key={video.id}
              className="group space-y-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-xs transition hover:shadow-md"
            >
              {/* VERTICAL PREVIEW WRAPPER (9:16 Aspect Ratio) */}
              <div className="overflow-hidden rounded-xl bg-slate-950 shadow-inner">
                <div className="aspect-[9/16] w-full">
                  <iframe
                    // Using standard query flags to minimize player controls on tight layouts
                    src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1&iv_load_policy=3`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    className="h-full w-full border-0"
                  />
                </div>
              </div>
              <div className="px-1 py-0.5 space-y-1">
                <h3 className="text-sm font-bold tracking-tight text-slate-800 line-clamp-2 group-hover:text-slate-950">
                  {video.title}
                </h3>
                <p className="text-xs font-medium text-slate-400">
                  {formatPublishedDate(video.publishedAt)}
                </p>
              </div>
            </article>
          ))
        ) : (
          <div className="col-span-full rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            No short updates are available right now. Check your account connection strings or refresh.
          </div>
        )}
      </main>
    </Container>
  );
};

export default VideosPage;