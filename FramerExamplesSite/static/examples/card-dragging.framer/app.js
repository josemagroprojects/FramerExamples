var bg, card, originalX, originalY, springCurve;

bg = new BackgroundLayer({
  backgroundColor: "#C8C9C1"
});

/* Card */

card = new Layer({
  width: 480,
  height: 720,
  y: 640,
  scale: .5,
  z: 100,
  image: "images/BearCardL@2x.png"
});

card.draggable.enabled = true;

card.center();

window.onresize = function() {
  return card.center();
};

/* Shadow */

card.style = {
  borderRadius: "24px"
};

card.shadowColor = "rgba(0,0,0,0.1)";

card.shadowBlur = 20;

card.shadowY = 0;

card.shadowX = 0;

card.shadowSpread = 4;

/* Parameters */

originalX = card.x;

originalY = card.y;

springCurve = "spring(200,20,10)";

/* States */

card.states.add({
  zoom: {
    scale: 1,
    shadowSpread: 16,
    shadowBlur: 50
  },
  drag: {
    scale: .75
  }
});

card.states.animationOptions = {
  curve: springCurve
};

/* Events */

card.on(Events.TouchStart, function() {
  return card.states["switch"]("zoom");
});

card.on(Events.DragStart, function() {
  card.dragStartY = card.y;
  return card.dragStartX = card.x;
});

card.on(Events.DragMove, function(event) {
  var cardRotationX, cardRotationY, velocity;
  velocity = card.draggable.calculateVelocity();
  cardRotationY = Utils.modulate(velocity.x, [-5, 5], [-15, 15], true);
  cardRotationX = Utils.modulate(velocity.y, [-5, 5], [-15, 15], true);
  card.states["switch"]("drag");
  card.shadowX = (card.x - card.dragStartX) * -0.125;
  card.shadowY = (card.y - card.dragStartY) * -0.125;
  return card.animate({
    properties: {
      rotationX: -cardRotationX,
      rotationY: cardRotationY
    },
    curve: "spring(900,80,0)"
  });
});

card.on(Events.DragEnd, function() {
  return card.animate({
    properties: {
      x: originalX,
      y: originalY,
      rotationX: 0,
      rotationY: 0,
      shadowX: 0,
      shadowY: 0
    },
    curve: springCurve
  });
});

card.on(Events.TouchEnd, function() {
  return card.states["switch"]("default");
});
