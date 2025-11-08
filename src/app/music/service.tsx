import { getFetcher } from "@/common/fetchers";

const DEFAULT_SONG = `[00:00.000] 作词 : 福禄寿FloruitShow
[00:01.000] 作曲 : 福禄寿FloruitShow
[00:02.000] 编曲 : 福禄寿FloruitShow
[00:03.729]
[00:05.094]你忘了 划过伤口的冷风
[00:13.549]你信了 不痛不痒就算过了一生
[00:20.531]你 为什么 看见雪飘落就会想唱歌
[00:29.118]为什么 在放手时刻眼泪会掉落
[00:36.525]一个一个走过
[00:38.489]一个一个错过
[00:40.454]一遍一遍来过
[00:42.407]一次一次放过
[00:44.327]一声一声笑着
[00:46.292]一声一声吼着
[00:48.153]一幕一幕闪着
[00:49.589]刺痛我
[00:52.429]因为享受着它的灿烂
[01:00.110]因为忍受着它的腐烂
[01:07.822]你说别爱啊 又依依不舍
[01:15.748]所以生命啊 它苦涩如歌
[01:23.519]因为享受着它的灿烂
[01:31.322]因为忍受着它的腐烂
[01:39.072]你说别追啊 又依依不舍
[01:46.852]所以生命啊 它苦涩如歌
[01:54.649]
[01:57.283]你睡了 可时间它依然走着
[02:05.659]你怕了 恍然抬头梦却醒了
[02:12.853]你会静默 手握着星火等在至暗时刻
[02:21.489]你被击破 当熟悉呢喃又穿透耳朵
[02:28.802]一个一个走过
[02:30.683]一个一个错过
[02:32.649]一遍一遍来过
[02:34.637]一次一次放过
[02:36.544]一声一声笑着
[02:38.542]一声一声吼着
[02:40.417]一幕一幕闪着
[02:41.797]刺痛我
[02:42.691]因为享受着它的灿烂
[02:50.492]因为忍受着它的腐烂
[02:58.310]你说别爱啊 又依依不舍
[03:06.085]所以生命啊 它苦涩如歌
[03:13.961]想不想看花海盛开
[03:17.919]想不想看燕子归来
[03:22.028]如果都回不来
[03:24.937]那么我该为了谁而存在
[03:29.518]想不想看花海盛开
[03:33.447]想不想看燕子归来
[03:37.471]如果都回不来
[03:40.387]那么我该为了谁而存在
[03:44.685]因为享受着它的灿烂
[03:52.583]因为忍受着它的腐烂
[04:00.225]你说别追啊 又依依不舍
[04:07.905]所以生命啊 它苦涩如歌
[04:15.406]在这浩瀚星河你是什么
[04:23.860]在她温柔眼眸的你是什么
[04:32.485]闪着光坠落 又依依不舍
[04:40.774]所以生命啊 它璀璨如歌
[04:59.536]
[05:02.459]混音：Barry师锐
[05:05.060]录音：2203STUDIO
[05:07.673]母带制作：飞来音`;

export const searchSong = (keyword: string) => {
  return getFetcher(`https://music.cyrilstudio.com/search?key=${keyword}`);
};

export const getSongUrl = async (songId: string) => {
  const url = 'http://m801.music.126.net/20251108115536/463b0844775e5f20df56260eb6cbdd27/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/14096425705/c1f0/020b/187d/1a10ffbc65ca573cfd0973404f3a2ebc.mp3'
  if(!songId) return url
  const res = await getFetcher<{data:{url: string}[]}>(`/music/api/song/enhance/player/url`, {
    id: songId,
    ids: `[${songId}]`,
    br: 320000,
  }).catch(() => ({data: [{url}]}))
  return res?.data?.[0]?.url || url
};

export const getSongLyrics = async (songId: string) => {
  // 1306923998
  if(!songId) return transformLrcStringToData(DEFAULT_SONG);
  const res = await getFetcher<{ lrc: { lyric: string } }>(
    `/music/api/song/lyric?id=${songId}&lv=1&kv=1&tv=-1`
  ).catch(() => ({lrc:{lyric: DEFAULT_SONG}}));
  const lrc = res?.lrc?.lyric || DEFAULT_SONG;
  // console.log(lrc)
  return transformLrcStringToData(lrc);
};

const transformLrcStringToData = (lrc:string) => {
  const result = lrc
    ?.split("\n")
    .filter(Boolean)
    .map((it) => {
      const parts = it.split("]");
      const timeParts = parts[0].substring(1).split(":");
      return {
        time: +timeParts[0] * 60 + +timeParts[1],
        text: parts[1],
      };
    });
  return result
}
