/* ネット予約の設定：食べログの予約ページURLを "" の中に貼ると、全ボタンがそのページを別タブで開きます */
const RESERVE_URL = "";

const reserveDialog = document.getElementById("reserveDialog");
const navDialog = document.getElementById("navDialog");

document.querySelectorAll("[data-reserve]").forEach((link) => {
  if (RESERVE_URL) {
    link.href = RESERVE_URL;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  } else {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      reserveDialog.showModal();
    });
  }
});

document.querySelectorAll("[data-open-nav]").forEach((button) => {
  button.addEventListener("click", () => navDialog.showModal());
});
document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => button.closest("dialog").close());
});
navDialog.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navDialog.close());
});
[reserveDialog, navDialog, document.getElementById("lightbox")].filter(Boolean).forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

/* 暖簾が下りたらアニメーションを外し、ホバーの動きを効かせる */
document.querySelectorAll(".noren__panel").forEach((panel) => {
  panel.addEventListener("animationend", () => {
    panel.style.animation = "none";
  });
});

/* ファーストビューを過ぎたら上部バーを出す */
const bar = document.getElementById("bar");
new IntersectionObserver(([entry]) => {
  bar.classList.toggle("is-on", !entry.isIntersecting);
}).observe(document.querySelector(".hero__stage"));

/* お品書きの短冊タブ */
const tabs = [...document.querySelectorAll(".tanzaku")];
const selectTab = (tab, focus) => {
  tabs.forEach((item) => {
    const selected = item === tab;
    item.setAttribute("aria-selected", selected);
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute("aria-controls")).hidden = !selected;
  });
  if (focus) tab.focus();
};
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (event) => {
    const step = { ArrowLeft: 1, ArrowRight: -1, ArrowDown: 1, ArrowUp: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    selectTab(tabs[(index + step + tabs.length) % tabs.length], true);
  });
});
if (tabs.length) selectTab(tabs[0]);

/* ギャラリーの拡大表示 */
const lightbox = document.getElementById("lightbox");
if (lightbox) {
  const items = [...document.querySelectorAll(".album__item")];
  const photo = lightbox.querySelector(".lb__photo");
  const caption = lightbox.querySelector(".lb__cap");
  let current = 0;
  const show = (index) => {
    current = (index + items.length) % items.length;
    const img = items[current].querySelector("img");
    photo.src = img.src;
    photo.alt = img.alt;
    caption.textContent = img.alt;
  };
  items.forEach((item, index) => {
    item.addEventListener("click", () => {
      show(index);
      lightbox.showModal();
    });
  });
  lightbox.querySelector("[data-prev]").addEventListener("click", () => show(current - 1));
  lightbox.querySelector("[data-next]").addEventListener("click", () => show(current + 1));
  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") show(current - 1);
    if (event.key === "ArrowRight") show(current + 1);
  });
}
