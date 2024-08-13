import { render } from "solid-js/web";
import "./style.css";

import {
  Component,
  ComponentProps,
  createEffect,
  createResource,
  createSignal,
  For,
  onMount,
  Show,
} from "solid-js";
import { twMerge } from "tailwind-merge";

export const Spacer: Component = () => {
  return <div class="w-full h-[1px] bg-gray-300 my-4" />;
};

export const Section: Component<ComponentProps<"section">> = (props) => {
  return <section {...props} class={twMerge("px-2", props.class)} />;
};

const Options: Component = () => {
  const [saved, setSaved] = createSignal(false);
  createEffect(() => {
    if (saved()) setTimeout(() => setSaved(false), 2500);
  });

  const [accounts] = createResource(async () => await browser.accounts.list(), {
    initialValue: [],
  });

  const [selectedAccount, setSelectedAccount] = createSignal("default");
  const key = () => `templates_${selectedAccount()}`;

  let templateRef: HTMLTextAreaElement;
  onMount(() => {
    createEffect(async () => {
      templateRef.value = (await browser.storage.local.get(key()))[key()] ?? "";
      setSaved(false);
    });
  });

  const onSave = async () => {
    await browser.storage.local.set({
      [key()]: templateRef.value,
    });
    setSaved(true);
  };

  return (
    <div class="max-w-screen-lg mx-auto border p-2">
      <h2 class="mb-4 text-4xl font-thin">Options</h2>
      <div>
        <Section class="grid grid-cols-2 gap-2 items-center">
          <div class="text-lg">
            Account
            <span class="block text-gray-700 text-base">
              Select Account for which the following template will be used
            </span>
          </div>
          <select
            class="w-full p-2 border bg-gray-100"
            value={selectedAccount()}
            onChange={(e) => setSelectedAccount(e.currentTarget.value)}
          >
            <option value="default">Default</option>
            <For each={accounts()}>
              {(account) => <option value={account.id}>{account.name}</option>}
            </For>
          </select>
        </Section>
        <Spacer />
        <Section>
          <div class="text-lg mb-2">Template</div>
          <textarea ref={templateRef!} class="w-full min-h-[500px] bg-gray-100 border" />
          <Spacer />
          <button
            class="w-full flex justify-center bg-blue-500 hover:bg-blue-600 active:bg-blue-500 p-2 text-white"
            onClick={onSave}
          >
            Save
          </button>
          <Show when={saved()}>
            <div class="text-center">Saved</div>
          </Show>
        </Section>
      </div>
    </div>
  );
};

render(() => <Options />, document.getElementById("options") as HTMLElement);
