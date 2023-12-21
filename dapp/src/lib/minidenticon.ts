/* eslint-disable */
// file copied from https://github.com/laurentpayot/minidenticons/blob/main/minidenticons.js
// and modified to allow passing of a color

const MAGIC_NUMBER = 5;

/**
 * @type {(str: string) => number}
 */
function simpleHash(str: string) {
  return (
    str
      .split("")
      .reduce(
        (hash, char) => (hash ^ char.charCodeAt(0)) * -MAGIC_NUMBER,
        MAGIC_NUMBER
      ) >>> 2
  ); // 32 bit unsigned integer conversion disregarding last 2 bits for better randomness
}

/**
 * @type {import('.').minidenticon}
 */
export function minidenticon(
  seed = "",
  color = "",
  hashFn = simpleHash
) {
  const hash = hashFn(seed);
  // console.log("%c" + hash.toString(2).padStart(32, "0"), "font-family:monospace") // uncomment to debug
    return `${[...Array(seed ? 25 : 0)].reduce(
    // @ts-ignore
    (acc, e, i) =>
      // testing the 15 lowest weight bits of the hash
      hash & (1 << i % 15)
        ? `${acc}<rect x="${i > 14 ? 7 - ~~(i / 5) : ~~(i / 5)}" y="${
            i % 5
          }" width="1" height="1"/>`
        : acc,
    // xmlns attribute added in case of SVG file generation https://developer.mozilla.org/en-US/docs/Web/SVG/Element/svg#sect1
    `<svg viewBox="-1.5 -1.5 8 8" xmlns="http://www.w3.org/2000/svg" fill="${color}">`
  )}</svg>`;
}

/**
 * @type {void}
 */
export const minidenticonSvg =
  // declared as a pure function to be tree-shaken by the bundler
  /* @__PURE__ */ globalThis.customElements?.define(
    "minidenticon-svg",
    class MinidenticonSvg extends HTMLElement {
      static observedAttributes = ["username", "saturation", "lightness"];

      // private fields to allow Terser mangling
      static #memoized = {};

      #isConnected = false;

      connectedCallback() {
        this.#setContent();
        this.#isConnected = true;
      }

      // attributeChangedCallback() is called for every observed attribute before connectedCallback()
      attributeChangedCallback() {
        if (this.#isConnected) this.#setContent();
      }

      #setContent() {
        const args = MinidenticonSvg.observedAttributes.map(
          (key) => this.getAttribute(key) || undefined
        );
        const memoKey = args.join(",");
        // @ts-ignore
          this.innerHTML = MinidenticonSvg.#memoized[memoKey] ??=
          // @ts-ignore
          minidenticon(...args);
      }
    }
  );
