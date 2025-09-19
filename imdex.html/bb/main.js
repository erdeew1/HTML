const $container = document.getElementById("container");

$container.addEventListener("click", (e) => {
  const clicked = e.target;
  if (clicked.className.includes("img-container")) {
    for (const child of $container.children) {
      child.classList.remove("active");
      clicked.classList.add("active");
    }
  }
});
