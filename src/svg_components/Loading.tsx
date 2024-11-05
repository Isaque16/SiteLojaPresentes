const LoadingSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <rect
      fill="#373F3D"
      stroke="#373F3D"
      strokeWidth="10"
      width="10"
      height="10"
      x="50"
      y="20"
    >
      <animate
        attributeName="opacity"
        calcMode="spline"
        dur="2"
        values="1;0;1;"
        keySplines=".5 0 .5 1;.5 0 .5 1"
        repeatCount="indefinite"
        begin="-.4"
      ></animate>
    </rect>
    <rect
      fill="#373F3D"
      stroke="#373F3D"
      strokeWidth="10"
      width="10"
      height="10"
      x="90"
      y="20"
    >
      <animate
        attributeName="opacity"
        calcMode="spline"
        dur="2"
        values="1;0;1;"
        keySplines=".5 0 .5 1;.5 0 .5 1"
        repeatCount="indefinite"
        begin="-.2"
      ></animate>
    </rect>
    <rect
      fill="#373F3D"
      stroke="#373F3D"
      strokeWidth="10"
      width="10"
      height="10"
      x="127"
      y="20"
    >
      <animate
        attributeName="opacity"
        calcMode="spline"
        dur="2"
        values="1;0;1;"
        keySplines=".5 0 .5 1;.5 0 .5 1"
        repeatCount="indefinite"
        begin="0"
      ></animate>
    </rect>
  </svg>
);

export default LoadingSvg;
