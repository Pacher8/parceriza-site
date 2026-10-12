"use strict";

const recipient = "gustavo.pacher@preddita.com";
const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector("#menu");
menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(open));
  menu.classList.toggle("is-open", open);
});
menu.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menu.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu.classList.contains("is-open")) {
    menu.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.focus();
  }
});

function activateTab(tab, moveFocus = false) {
  const list = tab.closest('[role="tablist"]');
  for (const item of list.querySelectorAll('[role="tab"]')) {
    const selected = item === tab;
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute("aria-controls")).hidden = !selected;
  }
  if (moveFocus) tab.focus();
  if (list.classList.contains("form-tabs")) document.querySelector("#request-result").hidden = true;
}
for (const list of document.querySelectorAll('[role="tablist"]')) {
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  for (const tab of tabs) {
    tab.addEventListener("click", () => activateTab(tab));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (tabs.indexOf(tab) + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (tabs.indexOf(tab) + tabs.length - 1) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        activateTab(tabs[next], true);
      }
    });
  }
}
for (const link of document.querySelectorAll("[data-form]")) {
  link.addEventListener("click", () => {
    activateTab(document.getElementById("form-tab-" + link.dataset.form));
  });
}
function openPrivacy() {
  if (location.hash === "#privacidade") document.querySelector("#privacidade").open = true;
}
for (const link of document.querySelectorAll('a[href="#privacidade"]')) {
  link.addEventListener("click", () => { document.querySelector("#privacidade").open = true; });
}
window.addEventListener("hashchange", openPrivacy);
openPrivacy();

let preparedMessage = "";
for (const form of document.querySelectorAll("form[data-kind]")) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    for (const field of form.querySelectorAll('input[required]:not([type="checkbox"]), textarea[required]')) {
      field.setCustomValidity(field.value.trim() ? "" : "Preencha este campo.");
    }
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const value = (name) => String(data.get(name) || "").trim();
    const isLawyer = form.dataset.kind === "advogado";
    const subject = isLawyer ? "Parceriza — interesse em participar da rede" : "Parceriza — apresentação de solução parceira";
    const lines = isLawyer
      ? ["Olá, equipe Parceriza!", "", "Tenho interesse em participar da rede de profissionais.", "",
         "Nome: " + value("nome"), "E-mail: " + value("email"), "OAB: " + value("oab") + "/" + value("uf")]
      : ["Olá, equipe Parceriza!", "", "Gostaria de apresentar uma solução para avaliação de parceria.", "",
         "Empresa / solução: " + value("empresa"), "E-mail: " + value("email"),
         "Site: " + (value("site") || "Não informado"), "", "Apresentação:", value("descricao")];
    lines.push("", "Estou ciente do uso destas informações para avaliar minha solicitação e retornar o contato.", "",
      "Solicitação preparada em parceriza.com.br.");
    const body = lines.join("\r\n");
    preparedMessage = "Para: " + recipient + "\nAssunto: " + subject + "\n\n" + lines.join("\n");
    document.querySelector("#email-request").href =
      "mailto:" + recipient + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    document.querySelector("#request-text").value = preparedMessage;
    document.querySelector("#copy-status").textContent = "";
    const result = document.querySelector("#request-result");
    result.hidden = false;
    result.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "nearest" });
  });
  form.addEventListener("input", (event) => {
    if (typeof event.target.setCustomValidity === "function") event.target.setCustomValidity("");
    document.querySelector("#request-result").hidden = true;
  });
}
document.querySelector("#copy-request").addEventListener("click", async () => {
  const status = document.querySelector("#copy-status");
  try {
    await navigator.clipboard.writeText(preparedMessage);
    status.textContent = " Mensagem copiada.";
  } catch {
    const field = document.querySelector("#request-text");
    field.focus();
    field.select();
    status.textContent = " Selecione e copie o texto acima.";
  }
});
