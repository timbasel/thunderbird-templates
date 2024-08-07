const tabTemplateHistory: Record<number, any> = {};

async function setTemplate(tab: browser.tabs.Tab) {
  if (tab.id === undefined) return;
  const details = await browser.compose.getComposeDetails(tab.id);

  if (
    details.identityId === undefined ||
    details.type === "draft" ||
    details.type === "redirect" ||
    (details.type === "new" && details.relatedMessageId !== null)
  ) {
    return;
  }

  const identity = await browser.identities.get(details.identityId);

  const key = `templates_${identity?.accountId ?? "default"}`;
  let body: string = (await browser.storage.local.get(key))[key];

  if (details.body) {
    const oldMessages = details.body.split("<body>").pop()?.split("</body>")[0] ?? "";

    var index = body.lastIndexOf("</body>");
    body = body.substring(0, index) + oldMessages + body.substring(index);
  }

  body = body.replace("<br><br></body></html>", "<br></body></html");

  browser.compose.setComposeDetails(tab.id, { body });
}

browser.tabs.onCreated.addListener(async (tab) => {
  if (tab.type === "messageCompose") setTemplate(tab);
});
browser.compose.onIdentityChanged.addListener(async (tab) => {
  setTemplate(tab);
});
