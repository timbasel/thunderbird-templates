const originalBody: Record<number, any> = {};

const getKey = (name?: string) => `templates_${name ?? "default"}`;

async function setTemplate(tab: browser.tabs.Tab) {
  if (tab.id === undefined) return;
  const compose = await browser.compose.getComposeDetails(tab.id);

  if (
    compose.identityId === undefined ||
    compose.type === "draft" ||
    compose.type === "redirect" ||
    (compose.type === "new" && compose.relatedMessageId !== null)
  ) {
    return;
  }

  const identity = await browser.identities.get(compose.identityId);

  const key = getKey(identity?.accountId);
  let template: string = (await browser.storage.local.get(key))[key] ?? "";
  if (template === "") {
    const defaultKey = getKey("default");
    template = (await browser.storage.local.get(defaultKey))[defaultKey] ?? "";
  }

  if (compose.body === undefined) return;
  let body = originalBody[tab.id] ?? compose.body.split("<body>").pop()?.split("</body>")[0] ?? "";
  if (originalBody[tab.id] === undefined) originalBody[tab.id] = body;

  if (template.length > 0) {
    if (body.indexOf(`<br><pre class="moz-`) === 0) {
      body = "<br>" + body;
    }
    let index = template.lastIndexOf("</body>");
    body = template.substring(0, index) + body + template.substring(index);
  }

  browser.compose.setComposeDetails(tab.id, { body });
}

browser.tabs.onCreated.addListener(async (tab) => {
  if (tab.type === "messageCompose") setTemplate(tab);
});
browser.compose.onIdentityChanged.addListener(async (tab) => {
  setTemplate(tab);
});
