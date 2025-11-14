import Link from "next/link";

const Data = [
  {
    name: '美区身份大全',
    url: 'https://shenfendaquan.com'
  },
  {
    name: '免费域名获取',
    url: 'https://dash.domain.digitalplat.org/auth/login'
  },
  {
    name: "SVG滤镜效果",
    url: 'https://yoksel.github.io/svg-filters/'
  },
  {
    name: '弹性盒小游戏',
    url: 'https://flexboxfroggy.com/'
  },
  {
    name: 'CSS3动画',
    url: 'https://css-animations.io/'
  },
  {
    name: '网格布局小游戏',
    url: 'https://cssgridgarden.com/'
  },
  {
    name: 'CSS选择器',
    url: 'https://flukeout.github.io/'
  },
  {
    name: '逻辑思维锻炼',
    url: 'https://lab.reaal.me/jsrobot/#'
  },
  {
    name: 'learn git',
    url: 'https://learngitbranching.js.org/?locale=zh_CN'
  }
]

export default function Url(){
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">有趣地址分享</h1>
      <div className="flex flex-col gap-4 mt-4">
      {Data.map((item) => {
        return (
          <Link target="_blank" key={item.name} href={item.url}>{item.name}</Link>
        )
      })}
      </div>
    </main>
  )
}