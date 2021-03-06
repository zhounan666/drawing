/**
 * 铅笔
 * @param points 点数组
 * @param stroke 颜色
 * @param strokeWidth 线粗细
 */
let draw = [],
  graphNow = null,
  flag = null,
  drawing = false,
  graphColor = "red",
  pointStart = [];
function flagFn(t, v) {
  flag = v;
  let tools = document.getElementById("btnList"),
    aBtn = tools.getElementsByTagName("button");
  for (let i = 0; i < aBtn.length; i++) {
    aBtn[i].className = "";
  }
  t.classList.add("active");
}
function selectColorFn(t) {
  graphColor = t.value;
}

function removeFn() {
  if (graphNow) {
    graphNow.remove();
    stage.find("Transformer").destroy();
    layer.draw();
    graphNow = null;
  } else {
    alert("请选择图形");
  }
}

const stage = new Konva.Stage({
  container: "container",
  width: 1200,
  height: 800,
});
const layer = new Konva.Layer();
stage.add(layer);
stage.on("mousedown", function (e) {
  if (e.target === stage) {
    stageMousedown(flag, e);
    stage.find("Transformer").destroy();
    layer.draw();
    return;
  }
  if (
    !e.target.hasName("line") &&
    !e.target.hasName("ellipse") &&
    !e.target.hasName("rect") &&
    !e.target.hasName("circle")
  ) {
    return;
  }
  stage.find("Transformer").destroy();
  graphNow = e.target;
  const tr = new Konva.Transformer({
    borderStroke: "#000",
    borderStrokeWidth: 1,
    borderDash: [5],
    keepRatio: false,
  });
  layer.add(tr);
  tr.attachTo(e.target);
  layer.draw();
});
stage.on("mousemove", function (e) {
  if (graphNow && flag && drawing) {
    stageMousemove(flag, e);
  }
});
stage.on("mouseup", function () {
  drawing = false;
  if (flag === "text") flag = null;
});
function drawPencil(points, stroke, strokeWidth) {
  const line = new Konva.Line({
    name: "line",
    points: points,
    stroke: stroke,
    strokeWidth: strokeWidth,
    lineCap: "round",
    lineJoin: "round",
    tension: 0.5,
    draggable: true,
  });
  graphNow = line;
  layer.add(line);
  layer.draw();
  line.on("mouseenter", function () {
    stage.container().style.cursor = "move";
  });
  line.on("mouseleave", function () {
    stage.container().style.cursor = "default";
  });
  line.on("dblclick", function () {
    this.remove();
    stage.find("Transformer").destroy();
    layer.draw();
  });
}

/**
 * 椭圆
 * @param x x坐标
 * @param y y坐标
 * @param rx x半径
 * @param ry y半径
 * @param stroke 描边颜色
 * @param strokeWidth 描边大小
 */
function drawEllipse(x, y, rx, ry, stroke, strokeWidth) {
  const ellipse = new Konva.Ellipse({
    name: "ellipse",
    x: x,
    y: y,
    radiusX: rx,
    radiusY: ry,
    stroke: stroke,
    strokeWidth: strokeWidth,
    draggable: true,
  });
  graphNow = ellipse;
  layer.add(ellipse);
  layer.draw();

  ellipse.on("mouseenter", function () {
    stage.container().style.cursor = "move";
  });

  ellipse.on("mouseleave", function () {
    stage.container().style.cursor = "default";
  });

  ellipse.on("dblclick", function () {
    this.remove();
    stage.find("Transformer").destroy();
    layer.draw();
  });
}

/**
 * 矩形
 * @param x x坐标
 * @param y y坐标
 * @param w 宽
 * @param h 高
 * @param c 颜色
 * @param sw 该值大于0-表示空心矩形（描边宽），等于0-表示实心矩形
 */
function drawRect(x, y, w, h, c, sw) {
  const rect = new Konva.Rect({
    name: "rect",
    x: x,
    y: y,
    width: w,
    height: h,
    fill: sw === 0 ? c : null,
    stroke: sw > 0 ? c : null,
    strokeWidth: sw,
    opacity: sw === 0 ? 0.5 : 1,
    draggable: true,
  });
  graphNow = rect;
  layer.add(rect);
  layer.draw();

  rect.on("mouseenter", function () {
    stage.container().style.cursor = "move";
  });

  rect.on("mouseleave", function () {
    stage.container().style.cursor = "default";
  });

  rect.on("dblclick", function () {
    this.remove();
    stage.find("Transformer").destroy();
    layer.draw();
  });
}

/**
 * 输入文字
 * @param x x坐标
 * @param y y坐标
 * @param fill 文字颜色
 * @param fs 文字大小
 */
function drawText(x, y, fill, fs) {
  var text = new Konva.Text({
    text: "双击编辑文字",
    x: x,
    y: y,
    fill: fill,
    fontSize: fs,
    width: 300,
    draggable: true,
  });
  graphNow = text;
  layer.add(text);
  layer.draw();

  text.on("mouseenter", function () {
    stage.container().style.cursor = "move";
  });
  text.on("mouseleave", function () {
    stage.container().style.cursor = "default";
  });
  text.on("dblclick", function () {
    let textPosition = this.getAbsolutePosition();
    let stageBox = stage.container().getBoundingClientRect();
    let areaPosition = {
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y,
    };
    let textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    let T = this.text();
    if (T === "双击编辑文字") {
      textarea.value = "";
      textarea.setAttribute("placeholder", "请输入文字");
    } else {
      textarea.value = T;
    }
    textarea.style.position = "absolute";
    textarea.style.top = areaPosition.y + "px";
    textarea.style.left = areaPosition.x + "px";
    textarea.style.background = "none";
    textarea.style.border = "1px dashed #000";
    textarea.style.outline = "none";
    textarea.style.color = this.fill();
    textarea.style.width = this.width();

    textarea.focus();

    this.setAttr("text", "");
    layer.draw();
    let confirm = (val) => {
      this.text(val ? val : "双击编辑文字");
      layer.draw();
      if (textarea) document.body.removeChild(textarea);
    };
    let keydown = (e) => {
      if (e.keyCode === 13) {
        textarea.removeEventListener("blur", blur);
        confirm(textarea.value);
      }
    };
    let blur = () => {
      textarea.removeEventListener("keydown", keydown);
      confirm(textarea.value);
    };

    textarea.addEventListener("keydown", keydown);
    textarea.addEventListener("blur", blur);
  });
}

/**
 * stage鼠标按下
 * @param flag 是否可绘制
 * @param ev 传入的event对象
 */
function stageMousedown(flag, ev) {
  if (flag) {
    let x = ev.evt.offsetX,
      y = ev.evt.offsetY;
    pointStart = [x, y];

    switch (flag) {
      case "pencil":
        drawPencil(pointStart, graphColor, 2);
        break;
      case "ellipse":
        // 椭圆
        drawEllipse(x, y, 0, 0, graphColor, 2);
        break;
      case "rect":
        drawRect(x, y, 0, 0, graphColor, 0);
        break;
      case "rectH":
        drawRect(x, y, 0, 0, graphColor, 2);
        break;
      case "text":
        drawText(x, y, graphColor, 16);
        break;
      default:
        break;
    }
    drawing = true;
  }
}

/**
 * stage鼠标移动
 * @param flag 是否可绘制
 * @param ev 传入的event对象
 */
function stageMousemove(flag, ev) {
  switch (flag) {
    case "pencil":
      pointStart.push(ev.evt.offsetX, ev.evt.offsetY);
      graphNow.setAttrs({
        points: pointStart,
      });
      break;
    case "ellipse":
      graphNow.setAttrs({
        radiusX: Math.abs(ev.evt.offsetX - pointStart[0]),
        radiusY: Math.abs(ev.evt.offsetY - pointStart[1]),
      });
      break;
    case "rect":
    case "rectH":
      graphNow.setAttrs({
        width: ev.evt.offsetX - pointStart[0],
        height: ev.evt.offsetY - pointStart[1],
      });
      break;
    default:
      break;
  }
  layer.draw();
}
