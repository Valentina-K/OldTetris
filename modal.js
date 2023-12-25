function openModal() {
  const newGameBtn = document.querySelector("[data-new-button]");
  const modal_window = document.querySelector("[data-madal]");

  newGameBtn.addEventListener("click", toggleModal);

  function toggleModal() {
    modal_window.classList.toggle("is-hidden");
  }
}
