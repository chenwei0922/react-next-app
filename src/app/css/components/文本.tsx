
import "../index.css";

export const TextTheme = () => {
  return (
    <div className="p-4">
      <span className="eraser-text-stroke">描边文案</span>
    </div>
  )
}

//效果同上,手机端会显示字体笔画之间的交叉线。电脑端不会显示
export const SvgTextStroke = () => {
  return (
    <svg width="100%" height="100">
      <text 
        x="50%" 
        y="50%" 
        textAnchor="middle" 
        dominantBaseline="middle"
        fill="white" 
        stroke="red" 
        strokeWidth="2"
        fontSize={55}
        fontFamily="bold"
      >
        描边文案
      </text>
    </svg>
  )
}